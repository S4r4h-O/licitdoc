import { z } from "zod";

export const ContactUsSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimoo 3 caracteres").max(30),
  email: z.string().email(),
  message: z
    .string()
    .min(15, "Mensagem deve ter no mínimo 15 caracteres")
    .max(500, "Limite de 500 caracteres"),
});
