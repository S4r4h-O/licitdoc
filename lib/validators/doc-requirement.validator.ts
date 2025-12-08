import { z } from "zod";
import { JurisdictionLevel } from "@prisma/client";

const { ESTADUAL, FEDERAL, MUNICIPAL, OUTRO } = JurisdictionLevel;

export const DocumentRequirementSchema = z.object({
  name: z
    .string()
    .min(3, "Requisito deve ter no mínimo 3 caracteres")
    .max(100, "Requisito deve ter no máximo 100 caracteres"),
  jurisdictionLevel: z.enum([ESTADUAL, FEDERAL, MUNICIPAL, OUTRO]).nullable(),
});

export const DocumentRequirementInsertSchema = DocumentRequirementSchema.extend(
  {},
);

export const DocumentRequirementUpdateSchema =
  DocumentRequirementSchema.partial();

export const DocumentRequirementFormSchema =
  DocumentRequirementSchema.partial();
