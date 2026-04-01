"use client";

import { ContractingAuthority, Licitacao } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { deleteLicitacao } from "@/lib/actions/licitacao.actions";
import DeleteDialog from "../delete-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Types

type LicitacaoWithContractor = Licitacao & {
  contractor: ContractingAuthority;
};

// Constants

const COLUMN_LABELS: Record<string, string> = {
  licitacaoNumber: "Número da licitação",
  processNumber: "Número do processo",
  openingDate: "Data de abertura",
  contractor: "Órgão",
};

// Helpers

function SortableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" onClick={onClick}>
      {label} <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

function DateCell({ value }: { value: unknown }) {
  const date = value as Date | null;
  if (!date) return <span className="text-muted-foreground">-</span>;
  return <div>{date.toLocaleDateString("pt-BR")}</div>;
}

function ActionsCell({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/empresa/licitacoes/${id}`} className="flex gap-4">
            <Eye /> Ver
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-4 text-red-500"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash />
          <DeleteDialog onConfirm={async () => await deleteLicitacao(id)} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Column definitions

const columns: ColumnDef<LicitacaoWithContractor>[] = [
  {
    accessorKey: "licitacaoNumber",
    header: "Número da licitação",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("licitacaoNumber")}</div>
    ),
  },
  {
    accessorKey: "processNumber",
    header: "Número do processo",
    cell: ({ row }) => <div>{row.getValue("processNumber")}</div>,
  },
  {
    accessorKey: "openingDate",
    header: ({ column }) => (
      <SortableHeader
        label="Data de abertura"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("openingDate")} />,
  },
  {
    accessorKey: "contractor",
    header: ({ column }) => (
      <SortableHeader
        label="Órgão"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <div>{row.original.contractor.name}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];

// Component

export default function LicitacoesTable({
  data,
}: {
  data: LicitacaoWithContractor[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar processos..."
          value={
            (table.getColumn("contractor")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("contractor")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {COLUMN_LABELS[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {selectedCount} of {filteredCount} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
