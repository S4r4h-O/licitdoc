import LicitacaoRequirements from "@/components/company/licitacao-requirements";
import LicitacaoUpdateForm from "@/components/company/licitacao-update-form";
import { getAllAuthorities } from "@/lib/actions/authority.actions";
import { getAllRequirements } from "@/lib/actions/doc-requirement.actions";
import {
  addRequirementToLicitacao,
  getLicitacaoById,
} from "@/lib/actions/licitacao.actions";
import { notFound } from "next/navigation";

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
        <LicitacaoRequirements
          requirements={requirements}
          selected={licitacao.requirements}
          licitacaoId={licitacao.id}
        />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
