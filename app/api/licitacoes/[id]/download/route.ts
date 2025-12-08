import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { auth } from "@clerk/nextjs/server";
import archiver from "archiver";
import { NextRequest } from "next/server";
import { Readable } from "stream";

import { s3Client } from "@/lib/s3";

type RequirementWithDocs = Prisma.LicitacaoRequirementGetPayload<{
  include: {
    requirement: {
      include: {
        documents: true;
      };
    };
  };
}>;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: licitacaoId } = await params;
  const { orgId: clerkOrgId } = await auth();

  if (!clerkOrgId) {
    return new Response("Não autenticado", { status: 401 });
  }

  // verify if licitação belongs to the company
  const licitacao = await prisma.licitacao.findFirst({
    where: { id: licitacaoId, company: { clerkOrgId } },
  });

  if (!licitacao) {
    return new Response("Licitação não encontrada", { status: 404 });
  }

  // search for requirements and latest documents
  const requirements = (await prisma.licitacaoRequirement.findMany({
    where: { licitacaoId },
    include: {
      requirement: {
        include: {
          documents: {
            where: { status: "VALIDO", deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
  })) as RequirementWithDocs[];

  // filter requirements with 0 docs
  const missingRequirements = requirements
    .filter((req) => !req.requirement.documents[0])
    .map((req) => req.requirement.name);

  if (missingRequirements.length > 0) {
    return new Response(
      JSON.stringify({
        error: "Documentos faltando",
        missing: missingRequirements,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // setup the submissions
  const submissionsData = requirements
    .filter(
      // get the latest uploaded document
      (req) => req.requirement.documents[0],
    )
    // return an object with licitacaoId, doc file and requirement
    .map((req) => ({
      licitacaoId,
      documentFileId: req.requirement.documents[0].id,
      requirement: req.requirement,
      document: req.requirement.documents[0],
    }));

  // transaction to register submissions
  await prisma.$transaction(async (tx) => {
    // delete old submissions
    await tx.licitacaoSubmission.deleteMany({
      where: { licitacaoId },
    });

    await tx.licitacaoSubmission.createMany({
      data: submissionsData.map((sub) => ({
        licitacaoId: sub.licitacaoId,
        documentFileId: sub.documentFileId,
      })),
    });
  });

  // initialize zip stream
  const archive = archiver("zip", { zlib: { level: 9 } });

  // stream zip directly to client without buffering in memory
  const stream = new ReadableStream({
    async start(controller) {
      archive.on("data", (chunk) => controller.enqueue(chunk));
      archive.on("end", () => controller.close());
      archive.on("error", (err) => {
        console.error("Archive error:", err);
        controller.error(err);
      });

      // stream each file from s3 into zip
      for (const sub of submissionsData) {
        try {
          const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: sub.document.s3Key!,
          });

          const res = await s3Client.send(command);
          const s3Stream = res.Body as Readable;

          const fileName = `${sub.requirement.name}/${sub.document.fileName}`;
          archive.append(s3Stream, { name: fileName });
        } catch (error) {
          console.error(`Error fetching ${sub.document.fileName}:`, error);
        }
      }
      await archive.finalize();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="licitacao-${licitacao.licitacaoNumber || licitacaoId}.zip"`,
      "Cache-Control": "no-cache",
    },
  });
}
