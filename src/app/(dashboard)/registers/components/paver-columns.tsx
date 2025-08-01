"use client"

import { Paver } from "@/types/paver";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CenteredHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div className="font-normal">{subtitle}</div>}
  </div>
);

const SortableHeader = ({ title, column }: { title: string, column: any }) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full"
    >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
);

type PaverColumnsProps = {
  onEdit: (item: Paver) => void;
  onDelete: (id: string) => void;
};

export const getColumns = ({ onEdit, onDelete }: PaverColumnsProps): ColumnDef<Paver>[] => [
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
    accessorKey: "dateReceived",
    header: ({ column }) => <SortableHeader title="Date Received" column={column} />,
    cell: ({ row }) => <div>{row.getValue("dateReceived")}</div>,
    enableSorting: true,
  },
   {
    accessorKey: "client",
    header: ({ column }) => <SortableHeader title="Client" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("client")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "project",
    header: ({ column }) => <SortableHeader title="Project" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("project")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "castingDate",
    header: () => <CenteredHeader title="Casting" subtitle="Date" />,
    cell: ({ row }) => <div>{row.getValue("castingDate")}</div>,
  },
  {
    accessorKey: "testingDate",
    header: () => <CenteredHeader title="Testing" subtitle="Date" />,
    cell: ({ row }) => <div>{row.getValue("testingDate")}</div>,
  },
  {
    accessorKey: "ageDays",
    header: () => <CenteredHeader title="Age" subtitle="(Days)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("ageDays")}</div>,
  },
  {
    accessorKey: "areaOfUse",
    header: () => <CenteredHeader title="Area of Use" />,
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue("areaOfUse")}</div>,
  },
  {
    accessorKey: "sampleId",
    header: () => <CenteredHeader title="Sample ID" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("sampleId")}</div>,
  },
  {
    accessorKey: "paverType",
    header: () => <CenteredHeader title="Paver Type" />,
    cell: ({ row }) => <div>{row.getValue("paverType")}</div>,
  },
  {
    id: "dimensions",
    header: () => <CenteredHeader title="Dimensions (mm)" />,
    columns: [
      {
        accessorKey: "dimensions.length",
        header: () => <CenteredHeader title="Length" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.length}</div>,
      },
      {
        accessorKey: "dimensions.width",
        header: () => <CenteredHeader title="Width" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.width}</div>,
      },
      {
        accessorKey: "dimensions.height",
        header: () => <CenteredHeader title="Height" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.height}</div>,
      },
    ],
  },
  {
    accessorKey: "paversPerSqMetre",
    header: () => <CenteredHeader title="Pavers per" subtitle="Square Metre" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("paversPerSqMetre")}</div>,
  },
    {
    accessorKey: "calculatedArea",
    header: () => <CenteredHeader title="Calculated" subtitle="Area (mm²)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("calculatedArea")}</div>,
  },
  {
    accessorKey: "weightKg",
    header: () => <CenteredHeader title="Weight" subtitle="(kg)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("weightKg")}</div>,
  },
  {
    accessorKey: "machineUsed",
    header: () => <CenteredHeader title="Machine Used" />,
    cell: ({ row }) => <div>{row.getValue("machineUsed")}</div>,
  },
  {
    accessorKey: "loadKN",
    header: () => <CenteredHeader title="Load" subtitle="(kN)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("loadKN")}</div>,
  },
  {
    accessorKey: "modeOfFailure",
    header: () => <CenteredHeader title="Mode of Failure" />,
    cell: ({ row }) => <div>{row.getValue("modeOfFailure")}</div>,
  },
  {
    accessorKey: "recordedTemperature",
    header: () => <CenteredHeader title="Recorded Temperature" subtitle="at the Facility (°C)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("recordedTemperature")}</div>,
  },
  {
    accessorKey: "certificateNumber",
    header: () => <CenteredHeader title="Certificate Number" />,
    cell: ({ row }) => <div>{row.getValue("certificateNumber")}</div>,
  },
  {
    accessorKey: "comment",
    header: () => <CenteredHeader title="Comment" />,
    cell: ({ row }) => <div>{row.getValue("comment")}</div>,
  },
  {
    accessorKey: "technician",
    header: () => <CenteredHeader title="Technician" subtitle="(Name &amp; Signature)" />,
    cell: ({ row }) => <div>{row.getValue("technician")}</div>,
  },
  {
    accessorKey: "dateOfIssue",
    header: () => <CenteredHeader title="Date of Issue" />,
    cell: ({ row }) => <div>{row.getValue("dateOfIssue")}</div>,
  },
  {
    accessorKey: "issueIdSerialNo",
    header: () => <CenteredHeader title="Issue ID/ Serial No." />,
    cell: ({ row }) => <div>{row.getValue("issueIdSerialNo")}</div>,
  },
  {
    accessorKey: "takenBy",
    header: () => <CenteredHeader title="Taken by" />,
    cell: ({ row }) => <div>{row.getValue("takenBy")}</div>,
  },
  {
    accessorKey: "date",
    header: () => <CenteredHeader title="Date" />,
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "contact",
    header: () => <CenteredHeader title="Contact" />,
    cell: ({ row }) => <div>{row.getValue("contact")}</div>,
  },
  {
    accessorKey: "sampleReceiptNo",
    header: () => <CenteredHeader title="Sample Receipt No" />,
    cell: ({ row }) => <div>{row.getValue("sampleReceiptNo")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original
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
              <DropdownMenuItem onClick={() => onEdit(item)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this test record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
];
