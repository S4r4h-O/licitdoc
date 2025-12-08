import { z } from "zod";

import { LicitacaoSchema } from "@/lib/validators";

export type Licitacao = z.infer<typeof LicitacaoSchema> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
