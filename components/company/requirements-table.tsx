"use client";

import { DocumentRequirement } from "@prisma/client";
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
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { deleteDocumentRequirement } from "@/lib/actions/doc-requirement.actions";
import DeleteDialog from "../delete-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

function ActionsCell({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-neutral-600 space-y-4 p-2 rounded-md"
      >
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-accent rounded-md"
          onSelect={(e) => e.preventDefault()}
        >
          <Link
            href={`/empresa/requisitos/${id}`}
            className="flex items-center w-full"
          >
            <Eye className="mr-2 h-4 w-4" /> Ver
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-md"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash className="mr-2 h-4 w-4" />
          <DeleteDialog onConfirm={async () => deleteDocumentRequirement(id)} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Column definitions

const columns: ColumnDef<DocumentRequirement>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader
        label="Nome"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "jurisdictionLevel",
    header: ({ column }) => (
      <SortableHeader
        label="Jurisdição"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell id={row.original.id} />,
  },
];

// Component

export default function DocumentRequirementTable({
  data,
}: {
  data: DocumentRequirement[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const visibleCount = table.getRowModel().rows.length;
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar Jurisdição"
          value={
            (table
              .getColumn("jurisdictionLevel")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("jurisdictionLevel")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
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
                <TableRow key={row.id}>
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
          Mostrando {visibleCount} de {filteredCount} registros
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
