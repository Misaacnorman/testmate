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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from "react"

type ColumnsProps = {
  onEdit: (test: Test) => void;
  onDelete: (id: string) => void;
}

export const getColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Test>[] => [
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
    cell: ({ row }) => <div className="text-center">{row.getValue("materialCategory")}</div>,
  },
  {
    accessorKey: "testCode",
    header: () => <div className="text-center">Test Code</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("testCode")}</div>,
  },
  {
    accessorKey: "materialTest",
    header: () => <div className="text-center">Material Test</div>,
     cell: ({ row }) => <div className="text-center">{row.getValue("materialTest")}</div>,
  },
  {
    accessorKey: "testMethods",
    header: () => <div className="text-center">Test Method(s)</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("testMethods")}</div>,
  },
  {
    accessorKey: "accreditation",
    header: () => <div className="text-center">Accreditation</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("accreditation")}</div>,
  },
  {
    accessorKey: "unit",
    header: () => <div className="text-center">Unit</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("unit")}</div>,
  },
  {
    accessorKey: "amountUGX",
    header: ({ column }) => {
        return (
          <div className="text-center">
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
        const amount = parseFloat(row.getValue("amountUGX"))
        const formatted = new Intl.NumberFormat("en-US").format(amount)
        return <div className="text-center font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "amountUSD",
    header: ({ column }) => {
        return (
          <div className="text-center">
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
        const amount = parseFloat(row.getValue("amountUSD"))
        const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
        return <div className="text-center font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "leadTimeDays",
    header: () => <div className="text-center">Lead Time (Days)</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue("leadTimeDays")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const test = row.original
      return (
        <AlertDialog>
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
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this test
                and remove its data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(test.id)} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
