/*
  Warnings:

  - A unique constraint covering the columns `[clerkOrgId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(18);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_clerkOrgId_key" ON "Company"("clerkOrgId");
