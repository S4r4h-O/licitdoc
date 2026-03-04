"use server";

import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ContractingAuthority } from "@prisma/client";

import { formatError } from "../utils";
import {
  ContractingAuthorityFormSchema,
  ContractingAuthorityInsertSchema,
  ContractingAuthorityUpdateSchema,
} from "../validators";

export async function createContractingAuthority(
  data: z.infer<typeof ContractingAuthorityFormSchema>,
): Promise<{ success: boolean; message: string }> {
  const { orgId: clerkOrgId, userId } = await auth();

  if (!userId) {
    return { success: false, message: "Não autenticado" };
  }

  if (!clerkOrgId) {
    return { success: false, message: "Organização não encontrada" };
  }

  const validated = ContractingAuthorityInsertSchema.parse(data);

  const existingAuthority = await prisma.contractingAuthority.findFirst({
    where: { name: validated.name, company: { clerkOrgId } },
  });

  if (existingAuthority) {
    return { success: false, message: "Órgão já cadastrado" };
  }

  try {
    await prisma.contractingAuthority.create({
      data: {
        ...validated,
        company: {
          connect: { clerkOrgId },
        },
      },
    });
    revalidatePath("/empresa/orgaos");
    return { success: true, message: "Órgão criado com sucesso" };
  } catch (error) {
    console.error("Failed to create authority: ", error);
    return { success: false, message: formatError(error) };
  }
}

export async function updateAuthority(
  id: string,
  data: z.infer<typeof ContractingAuthorityUpdateSchema>,
): Promise<{ success: boolean; message: string }> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return { success: false, message: "Não autenticado" };
  }

  if (!orgId) {
    return { success: false, message: "Organização não encontrada" };
  }

  const authority = await prisma.contractingAuthority.findUnique({
    where: { id },
  });

  if (!authority) {
    return { success: false, message: "Órgão não encontrado" };
  }

  const validated = ContractingAuthorityUpdateSchema.parse(data);

  try {
    await prisma.contractingAuthority.update({
      where: { id },
      data: validated,
    });

    return { success: true, message: "Órgão atualizado com successo" };
  } catch (error) {
    console.error("Failed to update authority:", error);
    return { success: false, message: formatError(error) };
  }
}

export async function getAllAuthorities(): Promise<
  | { success: true; data: ContractingAuthority[] }
  | { success: false; message: string }
> {
  const { orgId: clerkOrgId, userId } = await auth();

  if (!userId) {
    return { success: false, message: "Não autenticado ou não encontrado" };
  }

  if (!clerkOrgId) {
    return { success: false, message: "Organização não encontrada" };
  }

  try {
    const data = await prisma.contractingAuthority.findMany({
      where: { company: { clerkOrgId } },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteAuthority(
  id: string,
): Promise<{ success: boolean; message: string }> {
  const authority = await prisma.contractingAuthority.findUnique({
    where: { id },
  });

  if (!authority) {
    return { success: false, message: "Órgão não encontrado" };
  }

  try {
    await prisma.contractingAuthority.delete({
      where: { id },
    });
    revalidatePath("/empresa/orgaos");

    return { success: true, message: "Órgão apagado com sucesso" };
  } catch (error) {
    console.error("Error deleting authority:", error);
    return { success: false, message: formatError(error) };
  }
}
