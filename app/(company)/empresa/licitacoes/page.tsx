import LicitacaoCreateForm from "@/components/company/licitacao-create-form";
import LicitacoesTable from "@/components/company/licitacoes-table";
import { getAllAuthorities } from "@/lib/actions/authority.actions";
import { getLicitacoesWithContractor } from "@/lib/actions/licitacao.actions";

export default async function LicitacoesPage() {
  const authorities = await getAllAuthorities();
  const licitacoes = await getLicitacoesWithContractor();

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-full h-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Licitações</h1>

        <div className="flex items-center gap-2">
          <LicitacaoCreateForm authorities={authorities} />
        </div>
      </div>
      <LicitacoesTable data={licitacoes} />
    </div>
  );
}
