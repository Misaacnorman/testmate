"use client"

import { Test } from "@/types/test"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "MATERIAL CATEGORY",
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
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue("MATERIAL CATEGORY")}</div>,
  },
  {
    accessorKey: "TEST CODE",
    header: "Test Code",
  },
  {
    accessorKey: "MATERIAL TEST",
    header: "Material Test",
     cell: ({ row }) => <div className="min-w-[150px]">{row.getValue("MATERIAL TEST")}</div>,
  },
  {
    accessorKey: "TEST METHOD(S)",
    header: "Test Method(s)",
  },
  {
    accessorKey: "ACCREDITATION",
    header: "Accreditation",
  },
  {
    accessorKey: "UNIT",
    header: "Unit",
  },
  {
    accessorKey: "AMOUNT (UGX)",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Amount (UGX)
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("AMOUNT (UGX)"))
        const formatted = new Intl.NumberFormat("en-US").format(amount)
        return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "AMOUNT (USD)",
    header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Amount (USD)
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("AMOUNT (USD)"))
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
        return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "LEAD TIME (DAYS)",
    header: "Lead Time (Days)",
    cell: ({ row }) => <div className="text-center">{row.getValue("LEAD TIME (DAYS)")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const test = row.original
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
            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
