"use server";

import { prisma } from "@/prisma/client";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

import { CompanySchemaInsert } from "../validators";

export async function createCompany(data: z.infer<typeof CompanySchemaInsert>) {
  const { userId, orgId } = await auth();

  const parsedCompany = CompanySchemaInsert.parse(data);
  const { cnpj, email } = parsedCompany;

  if (!userId) {
    return { success: false, message: "Não autenticado" };
  }

  if (!orgId) {
    return { success: false, message: "Organização não encontrada" };
  }

  const existingCompany = await prisma.company.findFirst({
    where: {
      OR: [{ clerkOrgId: orgId }, { cnpj }, { email }],
    },
  });

  if (existingCompany) {
    return { success: false, message: "Empresa já cadastrada" };
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return { success: false, message: "Usuário não encontrado" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          ...parsedCompany,
          clerkOrgId: orgId,
          plan: "GRATUITO",
        },
      });

      await tx.user.update({
        where: { clerkId: userId },
        data: { companyId: company.id },
      });
    });

    return { success: true, message: "Empresa cadastrada com sucesso" };
  } catch (error) {
    console.log("Error creating company:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao criar empresa",
    };
  }
}
