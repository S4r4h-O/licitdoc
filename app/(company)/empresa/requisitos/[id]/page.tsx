import DocumentFileForm from "@/components/company/requirement-file-form";
import UpdateDocumentRequirementForm from "@/components/company/update-requirement-form";
import UploadFile from "@/components/upload-file";
import { getDocumentRequirementById } from "@/lib/actions/doc-requirement.actions";

export default async function RequirementDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const docRequirement = await getDocumentRequirementById(id);
  console.log(docRequirement);

  return (
    <div>
      <div>
        <UpdateDocumentRequirementForm docRequirement={docRequirement} />
      </div>
      <div className="">
        <DocumentFileForm requirement={docRequirement} />
      </div>
    </div>
  );
}
