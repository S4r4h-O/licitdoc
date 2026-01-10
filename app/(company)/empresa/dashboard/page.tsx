import DocumentsCard from "@/components/company/documents-card";
import { getDocumentValiditySummary } from "@/lib/actions/dashboard.actions";

export default async function DashboardPage() {
  const { expired, expiring7, expiring30, valid, total, validityRate } =
    await getDocumentValiditySummary();

  console.log({
    expired: expired,
    expiring7: expiring7,
    expiring30: expiring30,
    valid: valid,
    total: total,
    validityRate: validityRate,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <DocumentsCard docInfo={expired} title="Documentos vencidos" />
      <DocumentsCard
        docInfo={expiring7}
        title="Documentos vencendo em 7 dias"
      />
      <DocumentsCard
        docInfo={expiring30}
        title="Documentos vencendo em 30 dias"
      />
      <DocumentsCard docInfo={valid} title="Documentos válidos" />
      <DocumentsCard docInfo={total} title="Total de documentos" />
      <DocumentsCard
        docInfo={validityRate}
        title="Razão de validade (válidos/total)"
      />
    </div>
  );
}
