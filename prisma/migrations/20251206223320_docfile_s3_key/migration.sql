/*
  Warnings:

  - A unique constraint covering the columns `[s3Key]` on the table `DocumentFile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DocumentFile" ADD COLUMN     "s3Key" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DocumentFile_s3Key_key" ON "DocumentFile"("s3Key");
