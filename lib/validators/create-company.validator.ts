import { z } from "zod";

export const CompanySchema = z.object({
  razaoSocial: z
    .string()
    .min(5, "Razão Social deve ter no mínimo 5 caracteres"),
  nomeFantasia: z
    .string()
    .min(5, "Nome Fantasia deve ter no mínimo 5 caracteres"),
  cnpj: z.string().min(14),
  email: z.string().email().max(100, "Email muito longo"),
  phone: z.string().min(11, "Telefone deve rer no mínimo 11 caracteres"),
  addressStreet: z.string().min(5, "Rua deve ter no mínimo 5 caracteres"),
  addressNumber: z.string(),
  addressComplement: z.string().optional(),
  addressCountry: z.string().min(1),
  addressState: z.string().min(2, "Estado deve ter no mínimo 2 caracteres"),
  addressCity: z.string().min(3, "Cidade deve ter no mínimo 3 caracteres"),
  addressZip: z
    .string()
    .min(3, "CEP deve ter no mínimo 3 caracteres")
    .max(9, "CEP deve ter no máximo 10 caracteres"),
});

export const CompanySchemaInsert = CompanySchema.extend({});

export const CompanySchemaUpdate = CompanySchema.partial();
