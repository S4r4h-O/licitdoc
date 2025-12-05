"use client";

import {
  ContractingAuthorityInsertSchema,
  ContractingAuthoritySchema,
} from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";

import { brStates } from "@/lib/contants/contants";
import { createAuthorityDefaultValues } from "@/lib/contants/defaultValues";
import FormInput from "../input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FormData = z.infer<typeof ContractingAuthorityInsertSchema>;

export default function ContractingAuthorityForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(ContractingAuthorityInsertSchema),
    defaultValues: createAuthorityDefaultValues,
  });

  async function onSubmit(data: z.output<typeof ContractingAuthoritySchema>) {
    console.log(data);
  }

  const formName = "create-authority-form";

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="flex gap-2">
            <Plus size={16} /> Novo Órgão
          </Button>
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
              <Button type="submit">Salvar Órgão</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
