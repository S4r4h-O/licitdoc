import { z } from "zod";

export const LicitacaoSchema = z.object({
  licitacaoNumber: z.string().nullable().optional(),
  processNumber: z.string().nullable().optional(),
  openingDate: z.date().nullable().optional(),
  contractorId: z.string().min(1, "Órgão é obrigatório"),
});

export const LicitacaoFormSchema = LicitacaoSchema.partial();

export const LicitacaoInsertSchema = LicitacaoSchema.extend({});

export const LicitacaoUpdateSchema = LicitacaoSchema.partial();
