import { z } from "zod";

import { ContractingAuthoritySchema } from "@/lib/validators";

export type ContractingAuthority = z.infer<
  typeof ContractingAuthoritySchema
> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
