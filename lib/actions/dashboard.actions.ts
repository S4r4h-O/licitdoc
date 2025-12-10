import { prisma } from "@/prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function getDocumentValiditySummary() {
  const { orgId: clerkOrgId } = await auth();

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [expired, expiring7, expiring30, valid, total] = await Promise.all([
    // expired docs
    prisma.documentFile.count({
      where: {
        requirement: { company: { clerkOrgId } },
        deletedAt: null,
        expirationDate: { lt: now },
      },
    }),

    // expiring in 7 days
    prisma.documentFile.count({
      where: {
        requirement: { company: { clerkOrgId } },
        deletedAt: null,
        expirationDate: {
          gte: now,
          lte: in7Days,
        },
      },
    }),

    // expiring in 30 days
    prisma.documentFile.count({
      where: {
        requirement: { company: { clerkOrgId } },
        deletedAt: null,
        expirationDate: {
          gte: now,
          lte: in30Days,
        },
      },
    }),

    // valid documents
    prisma.documentFile.count({
      where: {
        requirement: { company: { clerkOrgId } },
        deletedAt: null,
        status: "VALIDO",
        OR: [{ expirationDate: null }, { expirationDate: { gt: in30Days } }],
      },
    }),

    // documents count
    prisma.documentFile.count({
      where: {
        requirement: { company: { clerkOrgId } },
        deletedAt: null,
      },
    }),
  ]);

  return {
    expired,
    expiring7,
    expiring30,
    valid,
    total,
    validityRate: total > 0 ? valid / total : 0,
  };
}

export async function getDocumentsByJurisdiction() {
  const { orgId: clerkOrgId } = await auth();

  const distribution = await prisma.documentRequirement.groupBy({
    by: ["jurisdictionLevel"],
    where: { company: { clerkOrgId } },
  });

  return distribution.map((req) => ({
    level: req.jurisdictionLevel || "OUTRO",
  }));
}

export async function getMostUsedDocuments() {
  const { orgId: clerkOrgId } = await auth();

  const requirements = await prisma.licitacaoRequirement.groupBy({
    by: ["requirementId"],
    where: {
      licitacao: { company: { clerkOrgId } },
    },
    _count: {
      requirementId: true,
    },
    orderBy: {
      _count: {
        requirementId: "desc",
      },
    },
    take: 10,
  });

  const details = await prisma.documentRequirement.findMany({
    where: {
      id: { in: requirements.map((r) => r.requirementId) },
    },
    select: {
      id: true,
      name: true,
      documents: {
        where: {
          deletedAt: null,
          status: "VALIDO",
        },
        select: { id: true },
      },
    },
  });

  return requirements.map((req) => {
    const detail = details.find((d) => d.id === req.requirementId);
    return {
      name: detail?.name || "Desconhecido",
      usageCount: req._count.requirementId,
      hasValidDoc: (detail?.documents.length || 0) > 0,
    };
  });
}

export async function getAddedLicitacoesSumary() {
  const { orgId: clerkOrgId } = await auth();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const licitacoes = await prisma.licitacao.groupBy({
    by: ["createdAt"],
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
        lt: tomorrow,
      },
    },
    _count: {
      _all: true,
    },
  });
}
