"use client"

import { Receipt } from "@/types/receipt"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"

export const columns: ColumnDef<Receipt>[] = [
  {
    accessorKey: "id",
    header: "Receipt ID",
    cell: ({ row }) => <div className="font-mono">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "formData.clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
     cell: ({ row }) => <div>{row.original.formData.clientName}</div>,
  },
  {
    accessorKey: "formData.projectTitle",
    header: "Project Title",
    cell: ({ row }) => <div>{row.original.formData.projectTitle}</div>,
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = row.getValue("receiptDate") as Date | string;
        // Firestore timestamps might be deserialized as objects
        const validDate = date instanceof Date ? date : (date as any)?.toDate ? (date as any).toDate() : new Date(date);
        
        if (isNaN(validDate.getTime())) {
            return <div>Invalid Date</div>;
        }

        return <div>{format(validDate, "PPP p")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const receipt = row.original
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/logs/${receipt.id}`}>View Receipt</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
