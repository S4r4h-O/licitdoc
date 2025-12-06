import AuthoritiesTable from "@/components/company/authorities-table";
import ContractingAuthorityForm from "@/components/company/contracting-authority-form";
import { getAllAuthorities } from "@/lib/actions/authority.actions";

export default async function AuthoritiesPage() {
  const authorities = await getAllAuthorities();

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-full h-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Órgãos Cadastrados
        </h1>

        <div className="flex items-center gap-2">
          <ContractingAuthorityForm mode="create" />
        </div>
      </div>
      <AuthoritiesTable data={authorities} />
    </div>
  );
}
