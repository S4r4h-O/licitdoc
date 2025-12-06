"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentRequirement, JurisdictionLevel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { FieldError, FieldGroup } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { updateDocumentRequirement } from "@/lib/actions/doc-requirement.actions";
import {
  DocumentRequirementFormSchema,
  DocumentRequirementUpdateSchema,
} from "@/lib/validators";
import FormInput from "../input";

export default function UpdateDocumentRequirementForm({
  docRequirement,
}: {
  docRequirement: DocumentRequirement;
}) {
  const form = useForm<z.infer<typeof DocumentRequirementFormSchema>>({
    resolver: zodResolver(DocumentRequirementFormSchema),
    defaultValues: {
      name: docRequirement.name,
      jurisdictionLevel: docRequirement.jurisdictionLevel ?? undefined,
    },
  });

  const router = useRouter();

  const formName = "create-requirement-form";

  async function onSubmit(
    data: z.output<typeof DocumentRequirementUpdateSchema>,
  ) {
    const res = await updateDocumentRequirement(docRequirement.id, data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.refresh();
  }

  const { MUNICIPAL, ESTADUAL, FEDERAL, OUTRO } = JurisdictionLevel;

  return (
    <div className="max-w-2xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          {docRequirement.name}
        </h2>
      </div>
      <form
        id={formName}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="space-y-6">
          <FieldGroup className="space-y-2">
            <FormInput
              form={form}
              formName={formName}
              placeholder="Ex: Certidão FGTS"
              fieldName="name"
              label="Nome do requisito"
              input="input"
            />
          </FieldGroup>

          <div className="space-y-2">
            <span className="text-sm font-medium mb-2">Jurisdição</span>
            <Controller
              name="jurisdictionLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={MUNICIPAL}>{MUNICIPAL}</SelectItem>
                      <SelectItem value={ESTADUAL}>{ESTADUAL}</SelectItem>
                      <SelectItem value={FEDERAL}>{FEDERAL}</SelectItem>
                      <SelectItem value={OUTRO}>{OUTRO}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.jurisdictionLevel && (
              <FieldError errors={[form.formState.errors.jurisdictionLevel]} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando..." : "Salvar Requisito"}
          </Button>
        </div>
      </form>
    </div>
  );
}
