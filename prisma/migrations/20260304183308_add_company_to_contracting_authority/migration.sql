/*
  Warnings:

  - A unique constraint covering the columns `[licitacaoRequirementId]` on the table `LicitacaoSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `ContractingAuthority` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractingAuthority" ADD COLUMN     "companyId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "LicitacaoSubmission" ADD COLUMN     "licitacaoRequirementId" UUID;

-- CreateIndex
CREATE INDEX "ContractingAuthority_companyId_idx" ON "ContractingAuthority"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "LicitacaoSubmission_licitacaoRequirementId_key" ON "LicitacaoSubmission"("licitacaoRequirementId");

-- CreateIndex
CREATE INDEX "LicitacaoSubmission_licitacaoRequirementId_idx" ON "LicitacaoSubmission"("licitacaoRequirementId");

-- AddForeignKey
ALTER TABLE "ContractingAuthority" ADD CONSTRAINT "ContractingAuthority_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicitacaoSubmission" ADD CONSTRAINT "LicitacaoSubmission_licitacaoRequirementId_fkey" FOREIGN KEY ("licitacaoRequirementId") REFERENCES "LicitacaoRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
