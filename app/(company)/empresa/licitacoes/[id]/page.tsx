import { notFound } from "next/navigation";

import DownloadFilesZip from "@/components/company/download-files-zip";
import LicitacaoRequirements from "@/components/company/licitacao-requirements";
import LicitacaoUpdateForm from "@/components/company/licitacao-update-form";
import { getAllAuthorities } from "@/lib/actions/authority.actions";
import { getAllRequirements } from "@/lib/actions/doc-requirement.actions";
import {
  addRequirementToLicitacao,
  getLicitacaoById,
} from "@/lib/actions/licitacao.actions";

export default async function LicitacaoDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [authorities, licitacao, requirements] = await Promise.all([
      getAllAuthorities(),
      getLicitacaoById(id),
      getAllRequirements(),
    ]);

    return (
      <div className="">
        <LicitacaoUpdateForm authorities={authorities} licitacao={licitacao} />
        <div className="space-y-2">
          <LicitacaoRequirements
            requirements={requirements}
            selected={licitacao.requirements}
            licitacaoId={licitacao.id}
          />
          <DownloadFilesZip licitacaoId={licitacao.id} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
