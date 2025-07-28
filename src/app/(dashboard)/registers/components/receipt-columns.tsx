
"use client"

import { Receipt } from "@/types/receipt"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { format } from "date-fns"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

type ColumnsProps = {
  onDelete: (id: string) => void;
}

export const getColumns = ({ onDelete }: ColumnsProps): ColumnDef<Receipt>[] => [
  {
    accessorKey: "id",
    header: "Receipt ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return (
        <Link href={`/logs/${id}`} className="font-mono text-primary hover:underline">
          {id}
        </Link>
      );
    },
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

        return <div>{format(validDate, "PPP")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const receipt = row.original
      return (
        <AlertDialog>
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
                    <DropdownMenuSeparator />
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
             <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this receipt
                    and remove its data from our servers.
                </Description>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(receipt.id)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
]
