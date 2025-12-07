-- DropForeignKey
ALTER TABLE "LicitacaoRequirement" DROP CONSTRAINT "LicitacaoRequirement_requirementId_fkey";

-- AddForeignKey
ALTER TABLE "LicitacaoRequirement" ADD CONSTRAINT "LicitacaoRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "DocumentRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
