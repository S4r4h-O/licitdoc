/*
  Warnings:

  - You are about to drop the column `jurisdictionLevel` on the `DocumentFile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentFile" DROP COLUMN "jurisdictionLevel";

-- AlterTable
ALTER TABLE "DocumentRequirement" ADD COLUMN     "jurisdictionLevel" "JurisdictionLevel";
