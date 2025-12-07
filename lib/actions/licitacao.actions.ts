"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatError } from "../utils";
import { LicitacaoFormSchema, LicitacaoInsertSchema } from "../validators";

type LicitacaoWithContractor = Prisma.LicitacaoGetPayload<{
  include: { contractor: true };
}>;

type LicitacaoWithContractorAndReqs = Prisma.LicitacaoGetPayload<{
  include: {
    contractor: true;
    requirements: {
      include: { requirement: true };
    };
  };
}>;

export async function getLicitacoesWithContractor(): Promise<
  LicitacaoWithContractor[]
> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    throw new Error("Organização não encontrada");
  }
  if (!clerkUserId) {
    throw new Error("Usuário não encontrado ou não autenticado");
  }

  return await prisma.licitacao.findMany({
    where: { company: { clerkOrgId } },
    include: { contractor: true },
  });
}

export async function getLicitacaoById(
  licitacaoId: string,
): Promise<LicitacaoWithContractorAndReqs> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    throw new Error("Organização não encontrada");
  }
  if (!clerkUserId) {
    throw new Error("Usuário não encontrado ou não autenticado");
  }

  const licitacao = await prisma.licitacao.findFirst({
    where: { id: licitacaoId, company: { clerkOrgId } },
    include: {
      contractor: true,
      requirements: {
        include: { requirement: true },
      },
    },
  });

  if (!licitacao) {
    throw new Error("Licitação não encontrada");
  }

  return licitacao;
}

export async function createLicitacao(
  data: z.infer<typeof LicitacaoFormSchema>,
): Promise<{ success: boolean; message: string }> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    return { success: false, message: "Organização não encontrada" };
  }
  if (!clerkUserId) {
    return {
      success: false,
      message: "Não autenticado ou usuário não encontrado",
    };
  }

  const validated = LicitacaoInsertSchema.parse(data);

  try {
    await prisma.licitacao.create({
      data: {
        ...validated,
        company: { connect: { clerkOrgId } },
        contractor: { connect: { id: validated.contractor } },
      },
    });

    revalidatePath("/empresa/licitacoes");
    return { success: true, message: "Licitação criada com sucesso" };
  } catch (error) {
    console.error("Failed to create licitação:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function deleteLicitacao(
  licitacaoId: string,
): Promise<{ success: boolean; message: string }> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    return { success: false, message: "Organização não encontrada" };
  }
  if (!clerkUserId) {
    return {
      success: false,
      message: "Não autenticado ou usuário não encontrado",
    };
  }

  const licitacao = await prisma.licitacao.findFirst({
    where: { id: licitacaoId, company: { clerkOrgId } },
  });

  if (!licitacao) {
    return { success: false, message: "Licitação não encontrada" };
  }

  try {
    await prisma.licitacao.delete({
      where: { id: licitacaoId },
    });

    revalidatePath("/empresa/licitacoes", "layout");
    return { success: true, message: "Licitação apagada com sucesso" };
  } catch (error) {
    console.error("Failed to delete licitação:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function addRequirementToLicitacao(
  requirementId: string,
  licitacaoId: string,
): Promise<{ success: boolean; message: any }> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    return { success: false, message: "Organização não encontrada" };
  }
  if (!clerkUserId) {
    return {
      success: false,
      message: "Não autenticado ou usuário não encontrado",
    };
  }

  const licitacao = await prisma.licitacao.findUnique({
    where: { id: licitacaoId },
  });

  if (!licitacao) {
    return { success: false, message: "Licitação não encontrada" };
  }

  const requirement = await prisma.documentRequirement.findUnique({
    where: { id: requirementId },
  });

  if (!requirement) {
    return { success: false, message: "Requisito não encontrado" };
  }

  try {
    await prisma.licitacaoRequirement.create({
      data: {
        licitacao: { connect: { id: licitacaoId } },
        requirement: { connect: { id: requirementId } },
      },
    });

    return {
      success: true,
      message: `Requisito adicionado: ${requirement.name}`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: formatError(error) };
  }
}

// requirementId refers to the id of LicitacaoRequirement object
export async function removeRequirementFromLicitacao(
  requirementId: string,
  licitacaoId: string,
) {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    return { success: false, message: "Organização não encontrada" };
  }
  if (!clerkUserId) {
    return {
      success: false,
      message: "Não autenticado ou usuário não encontrado",
    };
  }

  const licitacao = await prisma.licitacao.findUnique({
    where: { id: licitacaoId },
  });

  if (!licitacao) {
    return { success: false, message: "Licitação não encontrada" };
  }

  const requirement = await prisma.licitacaoRequirement.findUnique({
    where: { id: requirementId },
  });

  if (!requirement) {
    return { success: false, message: "Requisito não encontrado" };
  }

  try {
    await prisma.licitacaoRequirement.delete({
      where: {
        id: requirementId,
      },
    });

    return { success: true, message: "Requisito removido" };
  } catch (error) {
    console.error("An error occurred trying to remove the requirement:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function generateLicitacaoZip(licitacaoId: string) {
  const { orgId: clerkOrgId } = await auth();

  if (!clerkOrgId) {
    throw new Error("Não autenticado ou organização não encontrada");
  }

  // search for requirements and latest documents
  const requirements = await prisma.licitacaoRequirement.findMany({
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
  });

  // setup submission
  const submissionsData = requirements
    // remove reqs with 0 files
    .filter((req) => req.requirement.documents[0])
    // return licitacao id and file id
    .map((req) => ({
      licitacaoId,
      documentFileId: req.requirement.documents[0].id,
    }));

  await prisma.$transaction(async (tx) => {
    // delete old submissions
    await tx.licitacaoSubmission.deleteMany({
      where: { licitacaoId },
    });

    // create new submissions
    // TODO: ALERT THE USER IF REQUIREMENT HAS
    // NO UPLOADED FILE
    await tx.licitacaoSubmission.createMany({
      data: submissionsData,
    });
  });

  // TODO: GENERATE ZIP FOLDER
}
