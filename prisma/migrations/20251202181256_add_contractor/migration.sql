/*
  Warnings:

  - You are about to drop the column `number` on the `Licitacao` table. All the data in the column will be lost.
  - Added the required column `contactorId` to the `Licitacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Licitacao" DROP COLUMN "number",
ADD COLUMN     "contactorId" UUID NOT NULL,
ADD COLUMN     "licitacaoNumber" VARCHAR(50),
ADD COLUMN     "processNumber" TEXT;

-- CreateTable
CREATE TABLE "ContractingAuthority" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "addressState" TEXT,
    "addressCity" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractingAuthority_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Licitacao" ADD CONSTRAINT "Licitacao_contactorId_fkey" FOREIGN KEY ("contactorId") REFERENCES "ContractingAuthority"("id") ON DELETE CASCADE ON UPDATE CASCADE;
