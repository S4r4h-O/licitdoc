import { z } from "zod";

export const LicitacaoSchema = z.object({
  licitacaoNumber: z.string().optional(),
  processNumber: z.string().optional(),
  openingDate: z.date().optional(),
  contractor: z.string().min(1, "Órgão é obrigatório"),
});

export const LicitacaoFormSchema = LicitacaoSchema.partial();

export const LicitacaoInsertSchema = LicitacaoSchema.extend({});

export const LicitacaoUpdateSchema = LicitacaoSchema.partial();
