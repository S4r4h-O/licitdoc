"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { DocumentFile } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatError } from "../utils";
import {
  DocumentFileFormSchema,
  DocumentFileInsertSchema,
} from "../validators";
import { deleteFileFromS3 } from "./s3.actions";

export async function createDocumentFile(
  data: z.infer<typeof DocumentFileFormSchema>,
  requirementId: string,
): Promise<{ success: boolean; message: any }> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    return { success: false, message: "Organization not found" };
  }

  if (!clerkUserId) {
    return { success: false, message: "Organization not found" };
  }

  const validated = DocumentFileInsertSchema.parse(data);

  try {
    await prisma.documentFile.create({
      data: {
        ...validated,
        requirement: { connect: { id: requirementId } },
      },
    });

    revalidatePath(`/empresa/requisitos/${requirementId}`);
    return { success: true, message: "Arquivo criado com succeso" };
  } catch (error) {
    console.error(error);
    return { success: false, message: formatError(error) };
  }
}

export async function getFilesByRequirementId(
  reqId: string,
): Promise<DocumentFile[] | []> {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    throw new Error("Organização não encontrada");
  }

  if (!clerkUserId) {
    throw new Error("Não autenticado");
  }

  const requirement = await prisma.documentRequirement.findUnique({
    where: { id: reqId, company: { clerkOrgId } },
  });

  if (!requirement) {
    throw new Error("Requisito não encontrado");
  }

  const requirementFiles = await prisma.documentFile.findMany({
    where: { requirement },
  });

  return requirementFiles;
}

export async function deleteDocumentFile(objectKey: string, fileId: string) {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkOrgId) {
    throw new Error("Organização não encontrada");
  }

  if (!clerkUserId) {
    throw new Error("Não autenticado");
  }

  const existingFile = await prisma.documentFile.findUnique({
    where: { id: fileId },
  });

  if (!existingFile) {
    throw new Error("Arquivo não encontrado");
  }

  try {
    await prisma.documentFile.delete({
      where: { id: fileId },
    });

    await deleteFileFromS3(objectKey);

    return { success: true, message: "Arquivo deletado com succeso" };
  } catch (error) {
    console.error(error);
    return { success: false, message: formatError(error) };
  }
}
