import { z } from "zod";

import { DocumentStatusValues } from "../contants/contants";

const { VALIDO, INVALIDO } = DocumentStatusValues;

export const DocumentFileSchema = z.object({
  fileName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  fileUrl: z.string().url().min(1, "URL não pode ficar vazia"),
  fileSize: z.number().optional(),
  issuingAuthority: z.string().optional(),
  s3Key: z.string().optional(),
  issueDate: z.date().optional(),
  expirationDate: z.date().optional(),
  documentNumber: z.string().optional(),
  status: z.enum([VALIDO, INVALIDO]),
});

export const DocumentFileInsertSchema = DocumentFileSchema.extend({});

export const DocumentFileUpdateSchema = DocumentFileSchema.partial();

export const DocumentFileFormSchema = DocumentFileSchema.partial();
