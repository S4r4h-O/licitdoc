/*
  Warnings:

  - You are about to drop the column `buyer` on the `Licitacao` table. All the data in the column will be lost.
  - You are about to drop the column `contactorId` on the `Licitacao` table. All the data in the column will be lost.
  - Added the required column `contractorId` to the `Licitacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Licitacao" DROP CONSTRAINT "Licitacao_contactorId_fkey";

-- AlterTable
ALTER TABLE "Licitacao" DROP COLUMN "buyer",
DROP COLUMN "contactorId",
ADD COLUMN     "contractorId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Licitacao" ADD CONSTRAINT "Licitacao_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "ContractingAuthority"("id") ON DELETE CASCADE ON UPDATE CASCADE;
