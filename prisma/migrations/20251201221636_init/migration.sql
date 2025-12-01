-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ATIVA', 'INATIVA');

-- CreateEnum
CREATE TYPE "Plans" AS ENUM ('GRATUITO', 'PRO');

-- CreateEnum
CREATE TYPE "JurisdictionLevel" AS ENUM ('FEDERAL', 'ESTADUAL', 'MUNICIPAL', 'OUTRO');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('VALIDO', 'INVALIDO');

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "clerkOrgId" TEXT,
    "razaoSocial" VARCHAR(150) NOT NULL,
    "nomeFantasia" VARCHAR(100) NOT NULL,
    "logo" TEXT,
    "cnpj" VARCHAR(14) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "addressStreet" TEXT NOT NULL,
    "addressNumber" TEXT NOT NULL,
    "addressComplement" TEXT,
    "addressCountry" TEXT NOT NULL,
    "addressCity" TEXT NOT NULL,
    "addressState" VARCHAR(2) NOT NULL,
    "addressZip" VARCHAR(8) NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ATIVA',
    "plan" "Plans" NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Licitacao" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "number" VARCHAR(50) NOT NULL,
    "buyer" VARCHAR(100) NOT NULL,
    "openingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Licitacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRequirement" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFile" (
    "id" UUID NOT NULL,
    "documentRequirementId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "issuingAuthority" TEXT,
    "jurisdictionLevel" "JurisdictionLevel",
    "issueDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "documentNumber" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'VALIDO',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicitacaoRequirement" (
    "id" UUID NOT NULL,
    "licitacaoId" UUID NOT NULL,
    "requirementId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LicitacaoRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicitacaoSubmission" (
    "id" UUID NOT NULL,
    "licitacaoId" UUID NOT NULL,
    "documentFileId" UUID NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LicitacaoSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_razaoSocial_key" ON "Company"("razaoSocial");

-- CreateIndex
CREATE UNIQUE INDEX "Company_cnpj_key" ON "Company"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE INDEX "Company_status_idx" ON "Company"("status");

-- CreateIndex
CREATE INDEX "Company_plan_idx" ON "Company"("plan");

-- CreateIndex
CREATE INDEX "Company_addressState_idx" ON "Company"("addressState");

-- CreateIndex
CREATE INDEX "Company_addressCity_idx" ON "Company"("addressCity");

-- CreateIndex
CREATE INDEX "Company_addressCity_addressState_idx" ON "Company"("addressCity", "addressState");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_companyId_idx" ON "User"("companyId");

-- CreateIndex
CREATE INDEX "Licitacao_companyId_idx" ON "Licitacao"("companyId");

-- CreateIndex
CREATE INDEX "Licitacao_openingDate_idx" ON "Licitacao"("openingDate");

-- CreateIndex
CREATE INDEX "DocumentRequirement_companyId_idx" ON "DocumentRequirement"("companyId");

-- CreateIndex
CREATE INDEX "DocumentRequirement_userId_idx" ON "DocumentRequirement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentRequirement_companyId_name_key" ON "DocumentRequirement"("companyId", "name");

-- CreateIndex
CREATE INDEX "DocumentFile_documentRequirementId_idx" ON "DocumentFile"("documentRequirementId");

-- CreateIndex
CREATE INDEX "DocumentFile_status_idx" ON "DocumentFile"("status");

-- CreateIndex
CREATE INDEX "DocumentFile_expirationDate_idx" ON "DocumentFile"("expirationDate");

-- CreateIndex
CREATE INDEX "DocumentFile_deletedAt_idx" ON "DocumentFile"("deletedAt");

-- CreateIndex
CREATE INDEX "LicitacaoRequirement_licitacaoId_idx" ON "LicitacaoRequirement"("licitacaoId");

-- CreateIndex
CREATE INDEX "LicitacaoRequirement_requirementId_idx" ON "LicitacaoRequirement"("requirementId");

-- CreateIndex
CREATE UNIQUE INDEX "LicitacaoRequirement_licitacaoId_requirementId_key" ON "LicitacaoRequirement"("licitacaoId", "requirementId");

-- CreateIndex
CREATE INDEX "LicitacaoSubmission_licitacaoId_idx" ON "LicitacaoSubmission"("licitacaoId");

-- CreateIndex
CREATE INDEX "LicitacaoSubmission_documentFileId_idx" ON "LicitacaoSubmission"("documentFileId");

-- CreateIndex
CREATE UNIQUE INDEX "LicitacaoSubmission_licitacaoId_documentFileId_key" ON "LicitacaoSubmission"("licitacaoId", "documentFileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Licitacao" ADD CONSTRAINT "Licitacao_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRequirement" ADD CONSTRAINT "DocumentRequirement_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentRequirement" ADD CONSTRAINT "DocumentRequirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_documentRequirementId_fkey" FOREIGN KEY ("documentRequirementId") REFERENCES "DocumentRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicitacaoRequirement" ADD CONSTRAINT "LicitacaoRequirement_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicitacaoRequirement" ADD CONSTRAINT "LicitacaoRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "DocumentRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicitacaoSubmission" ADD CONSTRAINT "LicitacaoSubmission_licitacaoId_fkey" FOREIGN KEY ("licitacaoId") REFERENCES "Licitacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LicitacaoSubmission" ADD CONSTRAINT "LicitacaoSubmission_documentFileId_fkey" FOREIGN KEY ("documentFileId") REFERENCES "DocumentFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
