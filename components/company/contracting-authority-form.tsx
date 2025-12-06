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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  createContractingAuthority,
  updateAuthority,
} from "@/lib/actions/authority.actions";
import { brStates } from "@/lib/contants/contants";
import { createAuthorityDefaultValues } from "@/lib/contants/defaultValues";
import { ContractingAuthorityFormSchema } from "@/lib/validators";
import { ContractingAuthority } from "@prisma/client";
import FormInput from "../input";

export default function ContractingAuthorityForm({
  mode,
  authority,
}: {
  mode: "create" | "update";
  authority?: ContractingAuthority;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof ContractingAuthorityFormSchema>>({
    resolver: zodResolver(ContractingAuthorityFormSchema),
    defaultValues:
      mode === "create"
        ? createAuthorityDefaultValues
        : {
            name: authority?.name ?? "",
            addressCity: authority?.addressCity ?? undefined,
            addressState: authority?.addressState ?? undefined,
          },
  });

  const router = useRouter();

  async function onSubmit(
    data: z.output<typeof ContractingAuthorityFormSchema>,
  ) {
    if (mode === "create") {
      const res = await createContractingAuthority(data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setOpen(false);
      router.refresh();
    } else {
      const res = await updateAuthority(authority!.id, data);
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success(res.message);
      setOpen(false);
      router.refresh();
    }
  }

  const formName = "create-authority-form";

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {mode === "create" ? (
            <Button variant="default" className="flex gap-2">
              <Plus size={16} /> Novo Órgão
            </Button>
          ) : (
            <span className="w-full">Editar</span>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <form id={formName} onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Adicionar novo órgão</DialogTitle>
              <DialogDescription>
                Preencha os dados de localização da entidade.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-6">
              <FormInput
                form={form}
                formName={formName}
                fieldName="name"
                label="Nome do órgão"
              />

              <div className="grid grid-cols-[110px_1fr] gap-4">
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-medium leading-none">
                    Estado
                  </span>
                  <Controller
                    name="addressState"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="UF" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {brStates.map((state) => (
                              <SelectItem value={state} key={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <FormInput
                  form={form}
                  formName={formName}
                  fieldName="addressCity"
                  label="Cidade"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
