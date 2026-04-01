"use client";

import { DocumentFile } from "@prisma/client";
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
  Copy,
  Download,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { deleteDocumentFile } from "@/lib/actions/document-file.actions";
import { formatFileSize } from "@/lib/utils";
import DeleteDialog from "../delete-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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

type DocumentFileWithUrl = DocumentFile & { presignedUrl: string | null };

// Constants

const COLUMN_LABELS: Record<string, string> = {
  fileName: "Nome do arquivo",
  fileSize: "Tamanho",
  issuingAuthority: "Órgão Expeditor",
  issueDate: "Emissão",
  expirationDate: "Vencimento",
  documentNumber: "Nº Documento",
  status: "Status",
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
  const date = value as Date | undefined;
  if (!date) return <span className="text-muted-foreground">-</span>;
  return <div>{date.toLocaleDateString("pt-BR")}</div>;
}

function ActionsCell({
  url,
  s3Key,
  id,
}: {
  url: string | null;
  s3Key: string | null;
  id: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={url ?? "#"} className="flex gap-4">
            <Download /> Baixar arquivo
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => url && navigator.clipboard.writeText(url)}
          className="flex gap-4"
        >
          <Copy /> Copiar url
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-4 text-red-600"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash />
          <DeleteDialog
            onConfirm={async () => await deleteDocumentFile(s3Key!, id)}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Column definitions

const columns: ColumnDef<DocumentFileWithUrl>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => (
      <SortableHeader
        label="Nome do arquivo"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fileName")}</div>
    ),
  },
  {
    accessorKey: "issuingAuthority",
    header: ({ column }) => (
      <SortableHeader
        label="Órgão Expeditor"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <div>{row.getValue("issuingAuthority")}</div>,
  },
  {
    accessorKey: "documentNumber",
    header: "Nº Documento",
    cell: ({ row }) => <div>{row.getValue("documentNumber")}</div>,
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <SortableHeader
        label="Emissão"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("issueDate")} />,
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <SortableHeader
        label="Vencimento"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => <DateCell value={row.getValue("expirationDate")} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader
        label="Status"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    // TODO: EXPIRATION RULES TO UPDATE THE STATUS
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "fileSize",
    header: ({ column }) => (
      <SortableHeader
        label="Tamanho"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {formatFileSize(row.getValue("fileSize"))}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionsCell
        url={row.original.presignedUrl}
        s3Key={row.original.s3Key}
        id={row.original.id}
      />
    ),
  },
];

// Component

export default function RequirementFilesTable({
  data,
}: {
  data: DocumentFileWithUrl[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

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
    state: { sorting, columnFilters, columnVisibility },
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const totalCount = table.getCoreRowModel().rows.length;

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar documento"
          value={
            (table.getColumn("fileName")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("fileName")?.setFilterValue(e.target.value)
          }
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
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {COLUMN_LABELS[col.id] ?? col.id}
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
          Mostrando {filteredCount} de {totalCount}.
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
