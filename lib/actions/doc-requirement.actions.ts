"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { formatError } from "../utils";
import {
  DocumentRequirementFormSchema,
  DocumentRequirementInsertSchema,
  DocumentRequirementUpdateSchema,
} from "../validators";

export async function createDocumentRequirement(
  data: z.infer<typeof DocumentRequirementFormSchema>,
) {
  const { orgId: clerkOrgId, userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return { success: false, message: "Unauthenticated" };
  }
  if (!clerkOrgId) {
    return { success: false, message: "Organization not found" };
  }

  const validated = DocumentRequirementInsertSchema.parse(data);

  const existingRequirement = await prisma.documentRequirement.findUnique({
    where: { name: validated.name },
  });

  if (existingRequirement) {
    return { success: false, message: "Já existe um requisito com esse nome" };
  }

  try {
    await prisma.documentRequirement.create({
      data: {
        ...validated,
        company: {
          connect: { clerkOrgId },
        },
        user: {
          connect: { clerkId: clerkUserId },
        },
      },
    });
    revalidatePath("/empresa/requisitos");
    return { success: true, message: "Requisito criado com sucesso" };
  } catch (error) {
    console.error("Failed to create doc requirement:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function getAllRequirements() {
  return await prisma.documentRequirement.findMany();
}

export async function getDocumentRequirementById(id: string) {
  const { orgId: clerkOrgId } = await auth();

  if (!clerkOrgId) {
    throw new Error("Organization not found");
  }

  const docRequirement = await prisma.documentRequirement.findFirst({
    where: { id, company: { clerkOrgId } },
  });

  if (!docRequirement) {
    throw new Error("Document requirement not found");
  }

  return docRequirement;
}

export async function updateDocumentRequirement(
  id: string,
  data: z.infer<typeof DocumentRequirementFormSchema>,
) {
  const { orgId: clerkOrgId } = await auth();

  if (!clerkOrgId) {
    return { success: false, message: "Organization not found" };
  }

  const docRequirement = await prisma.documentRequirement.findFirst({
    where: { id, company: { clerkOrgId } },
  });

  if (!docRequirement) {
    return {
      success: false,
      message: "Requisito não existe ou não encontrado",
    };
  }

  const validated = DocumentRequirementUpdateSchema.parse(data);

  try {
    await prisma.documentRequirement.update({
      where: { id, company: { clerkOrgId } },
      data: validated,
    });

    revalidatePath(`/empresa/requisitos/${id}`);
    return { success: true, message: "Requisito atualizado com successo" };
  } catch (error) {
    console.error("Failed to update requirement:", error);
    return { success: false, message: formatError(error) };
  }
}
