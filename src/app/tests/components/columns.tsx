"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { Test } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getColumns = (
    onEdit: (test: Test) => void,
    onDelete: (test: Test) => void
  ): ColumnDef<Test>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "materialCategory",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Material Category
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "testCode",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Test Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "materialTest",
    header: "Material Test",
  },
  {
    accessorKey: "testMethod",
    header: "Test Method(s)",
  },
  {
    accessorKey: "accreditationStatus",
    header: "Accreditation Status",
    cell: ({ row }) => (row.original.accreditationStatus ? "Accredited" : "Not Accredited"),
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "amountUGX",
    header: () => <div className="text-left">Amount<br/>(UGX)</div>,
    cell: ({ row }) => new Intl.NumberFormat('en-US').format(row.original.amountUGX || 0),
  },
  {
    accessorKey: "amountUSD",
    header: () => <div className="text-left">Amount<br/>(USD)</div>,
     cell: ({ row }) => new Intl.NumberFormat('en-US').format(row.original.amountUSD || 0),
  },
  {
    accessorKey: "leadTimeDays",
    header: () => <div className="text-left">Lead Time<br/>(Days)</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const test = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(test)}>
              Edit Test
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(test)}
            >
              Delete Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
