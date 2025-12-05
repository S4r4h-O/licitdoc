import { z } from "zod";

export const ContractingAuthoritySchema = z.object({
  name: z
    .string()
    .min(3, "Órgão deve ter no mínimo 3 caracteres")
    .max(100, "Órgão deve ter no máximo 100 caracteres"),
  addressCity: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres"),
  addressState: z.string().min(2, "Estado deve ter no mínimo 2 caracteres"),
});

export const ContractingAuthorityInsertSchema =
  ContractingAuthoritySchema.extend({});

export const ContractingAuthorityUpdateSchema =
  ContractingAuthoritySchema.partial();
