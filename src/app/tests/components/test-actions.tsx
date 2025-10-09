"use client";

import * as React from "react";
import type { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Trash2, Upload } from "lucide-react";
import type { Test } from "@/lib/types";

interface TestActionsProps<TData> {
  table: Table<TData>;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
  onDeleteSelected: () => void;
}

export function TestActions<TData extends Test>({
  table,
  onImport,
  isImporting,
  onDeleteSelected,
}: TestActionsProps<TData>) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const handleExport = async () => {
    const XLSX = await import("xlsx");
    const dataToExport = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tests");
    XLSX.writeFile(workbook, "LIMS_Tests.xlsx");
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGlobalFilter(value);
    table.setGlobalFilter(value);
  };

  const numSelected = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter by category, code, test, or method..."
          value={globalFilter}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
        {numSelected > 0 && (
          <Button
            variant="destructive"
            onClick={onDeleteSelected}
            className="ml-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({numSelected})
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={onImport}
          accept=".xlsx, .xls, .csv"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
        >
          {isImporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Import
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
