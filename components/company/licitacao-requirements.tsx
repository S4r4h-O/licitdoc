"use client";

import { DocumentRequirement, Prisma } from "@prisma/client";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addRequirementToLicitacao,
  removeRequirementFromLicitacao,
} from "@/lib/actions/licitacao.actions";

type LicitacaoRequirementWithDoc = Prisma.LicitacaoRequirementGetPayload<{
  include: { requirement: true };
}>;

interface LicitacaoRequirementsProps {
  // available requirements from the db,
  // added by the user
  requirements: DocumentRequirement[];
  // selected is the requirements stored in the db
  // for a particular licitação
  selected: LicitacaoRequirementWithDoc[];
  licitacaoId: string;
}

export default function LicitacaoRequirements({
  requirements: availableRequirements,
  selected,
  licitacaoId,
}: LicitacaoRequirementsProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function handleSelect(req: DocumentRequirement) {
    const res = await addRequirementToLicitacao(req.id, licitacaoId);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.message(res.message);
    router.refresh();
  }

  async function handleRemove(id: string) {
    console.log(id);

    const res = await removeRequirementFromLicitacao(id, licitacaoId);
    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.message(res.message);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium leading-none text-foreground">
          Requisitos do processo
        </h3>
        <span className="text-xs text-muted-foreground">
          {selected.length > 0 && `${selected.length} selecionados`}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 rounded-xl border border-input bg-transparent p-3 min-h-[56px] items-center">
        {selected.map((req) => (
          <Badge
            key={req.id}
            variant="secondary"
            className="pl-3 pr-1 py-1 h-8 rounded-full text-sm font-medium gap-1 bg-secondary/50 hover:bg-secondary/70 transition-colors border-transparent"
          >
            {req.requirement.name}
            <button
              type="button"
              className="ml-1 h-5 w-5 rounded-full flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-3 w-3" onClick={() => handleRemove(req.id)} />
              <span className="sr-only">Remover</span>
            </button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-8 rounded-full border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary bg-transparent px-3 text-xs"
              size="sm"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Adicionar
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[250px]" align="start">
            <Command>
              <CommandInput placeholder="Buscar requisito..." />
              <CommandList>
                <CommandEmpty>Nenhum requisito encontrado.</CommandEmpty>
                <CommandGroup heading="Disponíveis">
                  {availableRequirements.map((req) => {
                    // show only those not selected
                    const isAlreadySelected = selected.some(
                      (s) => s.requirement.id === req.id,
                    );
                    if (isAlreadySelected) return null;
                    return (
                      <CommandItem
                        key={req.id}
                        value={req.name}
                        onSelect={() => {
                          handleSelect(req);
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        {req.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
