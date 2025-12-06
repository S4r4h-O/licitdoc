import CreateDocumentRequirementForm from "@/components/company/create-requirement-form";
import DocumentRequirementTable from "@/components/company/requirements-table";
import { getAllRequirements } from "@/lib/actions/doc-requirement.actions";

export default async function RequirementsPage() {
  const requirements = await getAllRequirements();

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-full h-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Requisitos</h1>

        <div className="flex items-center gap-2">
          <CreateDocumentRequirementForm />
        </div>
      </div>
      <DocumentRequirementTable data={requirements} />
    </div>
  );
}
