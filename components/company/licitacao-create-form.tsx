"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ContractingAuthority } from "@prisma/client";
import { CalendarIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

import { createLicitacao } from "@/lib/actions/licitacao.actions";
import { LicitacaoFormSchema } from "@/lib/validators";
import FormInput from "../input";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

export default function LicitacaoCreateForm({
  authorities,
}: {
  authorities: ContractingAuthority[];
}) {
  const form = useForm<z.infer<typeof LicitacaoFormSchema>>({
    resolver: zodResolver(LicitacaoFormSchema),
  });

  const router = useRouter();

  async function onSubmit(data: z.output<typeof LicitacaoFormSchema>) {
    const res = await createLicitacao(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);
    router.refresh();
  }

  const formName = "licitacao-create-form";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} /> Nova licitação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar nova licitação</DialogTitle>
          <DialogDescription>
            Insira os dados do processo e vincule ao órgão responsável.
          </DialogDescription>
        </DialogHeader>

        <form
          id={formName}
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-4 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              form={form}
              formName={formName}
              fieldName="licitacaoNumber"
              label="Número da licitação"
            />

            <FormInput
              form={form}
              formName={formName}
              fieldName="processNumber"
              label="Número do processo"
            />

            {/* TODO: USE SHADCN CALENDAR */}
            <Controller
              control={form.control}
              name="openingDate"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Data de abertura</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "dd/MM/yyy", { locale: ptBR })
                          : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="mx-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium leading-none">
              Órgão contratante
            </span>
            <Controller
              name="contractor"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {authorities.map((authority) => (
                          <SelectItem
                            value={authority.id}
                            key={authority.name}
                            onSelect={(e) => e.preventDefault()}
                          >
                            {authority.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <span className="text-xs font-medium text-destructive">
                      {fieldState.error?.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
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
  );
}
