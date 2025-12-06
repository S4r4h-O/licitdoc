"use server";

import { z } from "zod";
import {
  DocumentFileFormSchema,
  DocumentFileInsertSchema,
} from "../validators";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/prisma/client";
import { DocumentRequirement } from "@prisma/client";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";

export async function createDocumentFile(
  data: z.infer<typeof DocumentFileFormSchema>,
  requirement: DocumentRequirement,
) {
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
        requirement: { connect: { id: requirement.id } },
      },
    });

    revalidatePath(`/empresa/requisitos/${requirement.id}`);
    return { success: true, message: "Arquivo criado com succeso" };
  } catch (error) {
    console.error(error);
    return { success: false, message: formatError(error) };
  }
}
