/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `DocumentRequirement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DocumentRequirement_name_key" ON "DocumentRequirement"("name");
