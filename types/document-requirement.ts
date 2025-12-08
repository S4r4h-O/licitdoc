import { z } from "zod";

import { DocumentRequirementSchema } from "@/lib/validators";

export type DocumentRequirement = z.infer<typeof DocumentRequirementSchema> & {
  id: string;
  companyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
