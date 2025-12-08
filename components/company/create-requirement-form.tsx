"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { FieldError, FieldGroup } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { createDocumentRequirement } from "@/lib/actions/doc-requirement.actions";
import { JurisdictionLevelValues } from "@/lib/contants/contants";
import { DocumentRequirementInsertSchema } from "@/lib/validators";
import FormInput from "../input";

export default function CreateDocumentRequirementForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof DocumentRequirementInsertSchema>>({
    resolver: zodResolver(DocumentRequirementInsertSchema),
    defaultValues: {
      name: "",
      jurisdictionLevel: undefined,
    },
  });

  const router = useRouter();

  const formName = "create-requirement-form";

  async function onSubmit(
    data: z.output<typeof DocumentRequirementInsertSchema>,
  ) {
    const res = await createDocumentRequirement(data);
    if (!res.success) {
      toast.error(res.message);
      setOpen(false);
      return;
    }

    toast.success(res.message);
    setOpen(false);
    router.refresh();
  }

  const { MUNICIPAL, ESTADUAL, FEDERAL, OUTRO } = JurisdictionLevelValues;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Adicionar requisito
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form id={formName} onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="mb-2">
            <DialogTitle>Novo requisito</DialogTitle>
            <DialogDescription>
              Prencha os dados básicos para adicionar à lista
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FieldGroup>
              <FormInput
                form={form}
                formName={formName}
                placeholder="Ex: Certidão FGTS"
                fieldName="name"
                label="Nome do requisito"
                input="input"
              />
            </FieldGroup>
            <div className="flex flex-col gap-2">
              <span className="">Jurisdição</span>

              <Controller
                name="jurisdictionLevel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                  >
                    <SelectTrigger>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
