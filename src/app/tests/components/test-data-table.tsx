"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getGlobalFacetedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestActions } from "./test-actions";
import { ImportPreviewDialog } from "./import-preview-dialog";
import type { Test } from "@/lib/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  onRefresh: () => void;
  onDeleteSelected: (selectedIds: string[]) => void;
}

export function TestDataTable<TData extends Test, TValue>({
  columns,
  data,
  loading,
  onRefresh,
  onDeleteSelected,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [isImporting, setIsImporting] = React.useState(false);
  const [importData, setImportData] = React.useState<Test[]>([]);
  const [showImportPreview, setShowImportPreview] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "auto",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const handleDeleteSelected = () => {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as Test).id!);
    onDeleteSelected(selectedIds);
    table.resetRowSelection();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const XLSX = await import("xlsx");
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          blankrows: false,
          raw: false,
        }) as any[][];

        const headers = json[0].map((h) => (h ? String(h).trim().toUpperCase() : ""));
        const headerMap: { [key: string]: keyof Test } = {
          "MATERIAL CATEGORY": "materialCategory",
          "TEST CODE": "testCode",
          "MATERIAL TEST": "materialTest",
          "TEST METHOD(S)": "testMethod",
          "ACCREDITATION STATUS": "accreditationStatus",
          UNIT: "unit",
          "AMOUNT (UGX)": "amountUGX",
          "AMOUNT (USD)": "amountUSD",
          "LEAD TIME (DAYS)": "leadTimeDays",
        };

        const importedTests: Test[] = json
          .slice(1)
          .map((row) => {
            const test: Partial<Test> = {};
            headers.forEach((header, index) => {
              const mappedHeader = headerMap[header];
              if (mappedHeader) {
                let value: any = row[index];
                if (value !== null && value !== undefined) {
                  if (
                    ["amountUGX", "amountUSD", "leadTimeDays"].includes(
                      mappedHeader
                    )
                  ) {
                    value = Number(String(value).replace(/[^0-9.-]+/g, ""));
                    if (isNaN(value)) value = undefined;
                  }
                   if (mappedHeader === 'accreditationStatus') {
                        value = ["accredited", "yes", "true", "1"].includes(String(value).toLowerCase());
                    }
                  (test as any)[mappedHeader] = value;
                }
              }
            });
            return test as Test;
          })
          .filter((test) => Object.keys(test).length > 0 && test.materialTest);

        setImportData(importedTests);
        setShowImportPreview(true);
        setIsImporting(false);
      };
      reader.readAsArrayBuffer(file);
      event.target.value = ""; // Reset file input
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <TestActions
            table={table}
            onImport={handleFileImport}
            isImporting={isImporting}
            onDeleteSelected={handleDeleteSelected}
          />
        </CardHeader>
        <CardContent>
          <div className="w-full rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading tests...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
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
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-end space-x-2 py-4">
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

      <ImportPreviewDialog
        isOpen={showImportPreview}
        onClose={() => setShowImportPreview(false)}
        importData={importData}
        onImportSuccess={onRefresh}
      />
    </>
  );
}
