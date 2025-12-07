import { notFound } from "next/navigation";

import DocumentFileForm from "@/components/company/requirement-file-form";
import RequirementFilesTable from "@/components/company/requirement-files-table";
import UpdateDocumentRequirementForm from "@/components/company/update-requirement-form";
import { getDocumentRequirementById } from "@/lib/actions/doc-requirement.actions";
import { getFilesByRequirementId } from "@/lib/actions/document-file.actions";

export default async function RequirementDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Is getDocumentRequirementById necessary?
  try {
    const [docRequirement, requirementFiles] = await Promise.all([
      getDocumentRequirementById(id),
      getFilesByRequirementId(id),
    ]);

    return (
      <div>
        <UpdateDocumentRequirementForm docRequirement={docRequirement} />
        <hr />
        <DocumentFileForm requirement={docRequirement} />
        <hr />
        <div className="p-6">
          <h1 className="font-bold text-2xl">Documentos enviados</h1>
          <RequirementFilesTable data={requirementFiles} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
