
"use client"

import { PaverSet, Paver } from "@/types/paver";
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
  onEdit: (item: PaverSet) => void;
  onDelete: (item: PaverSet) => void;
};

export const getColumns = ({ onEdit, onDelete }: PaverColumnsProps): ColumnDef<PaverSet>[] => [
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
    cell: ({ row }) => <div>{row.original.dateReceived}</div>,
    enableSorting: true,
  },
   {
    accessorKey: "client",
    header: ({ column }) => <SortableHeader title="Client" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.original.client}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "project",
    header: ({ column }) => <SortableHeader title="Project" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.original.project}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "castingDate",
    header: () => <CenteredHeader title="Casting" subtitle="Date" />,
    cell: ({ row }) => <div>{row.original.castingDate}</div>,
  },
  {
    accessorKey: "testingDate",
    header: () => <CenteredHeader title="Testing" subtitle="Date" />,
    cell: ({ row }) => <div>{row.original.testingDate}</div>,
  },
  {
    accessorKey: "ageDays",
    header: () => <CenteredHeader title="Age" subtitle="(Days)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.ageDays || '-'}</div>)}</div>,
  },
  {
    accessorKey: "areaOfUse",
    header: () => <CenteredHeader title="Area of Use" />,
    cell: ({ row }) => <div className="min-w-[150px]">{row.original.areaOfUse}</div>,
  },
  {
    id: "sampleIds",
    header: () => <CenteredHeader title="Sample IDs" />,
    cell: ({ row }) => (
        <div className="flex flex-col items-center">
            {row.original.samples.map((s) => (
                <div key={s.id} className="py-1">{s.sampleId}</div>
            ))}
        </div>
    ),
  },
  {
    accessorKey: "paverType",
    header: () => <CenteredHeader title="Paver Type" />,
    cell: ({ row }) => <div>{row.original.paverType}</div>,
  },
  {
    id: "dimensions",
    header: () => <CenteredHeader title="Dimensions (mm)" />,
    columns: [
      {
        id: "length",
        header: () => <CenteredHeader title="Length" />,
        cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensions?.length || '-'}</div>)}</div>,
      },
      {
        id: "width",
        header: () => <CenteredHeader title="Width" />,
        cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensions?.width || '-'}</div>)}</div>,
      },
      {
        id: "height",
        header: () => <CenteredHeader title="Height" />,
        cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensions?.height || '-'}</div>)}</div>,
      },
    ],
  },
  {
    id: "paversPerSqMetre",
    header: () => <CenteredHeader title="Pavers per" subtitle="Square Metre" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.paversPerSqMetre || '-'}</div>)}</div>,
  },
    {
    id: "calculatedArea",
    header: () => <CenteredHeader title="Calculated" subtitle="Area (mm²)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.calculatedArea || '-'}</div>)}</div>,
  },
  {
    id: "weightKg",
    header: () => <CenteredHeader title="Weight" subtitle="(kg)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.weightKg || '-'}</div>)}</div>,
  },
  {
    id: "machineUsed",
    header: () => <CenteredHeader title="Machine Used" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.machineUsed || '-'}</div>)}</div>,
  },
  {
    id: "loadKN",
    header: () => <CenteredHeader title="Load" subtitle="(kN)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.loadKN || '-'}</div>)}</div>,
  },
  {
    id: "modeOfFailure",
    header: () => <CenteredHeader title="Mode of Failure" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.modeOfFailure || '-'}</div>)}</div>,
  },
  {
    id: "recordedTemperature",
    header: () => <CenteredHeader title="Recorded Temperature" subtitle="at the Facility (°C)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.recordedTemperature || '-'}</div>)}</div>,
  },
  {
    id: "certificateNumber",
    header: () => <CenteredHeader title="Certificate Number" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.certificateNumber || '-'}</div>)}</div>,
  },
  {
    id: "comment",
    header: () => <CenteredHeader title="Comment" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.comment || '-'}</div>)}</div>,
  },
  {
    id: "technician",
    header: () => <CenteredHeader title="Technician" subtitle="(Name &amp; Signature)" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.technician || '-'}</div>)}</div>,
  },
  {
    id: "dateOfIssue",
    header: () => <CenteredHeader title="Date of Issue" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.dateOfIssue || '-'}</div>)}</div>,
  },
  {
    id: "issueIdSerialNo",
    header: () => <CenteredHeader title="Issue ID/ Serial No." />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.issueIdSerialNo || '-'}</div>)}</div>,
  },
  {
    id: "takenBy",
    header: () => <CenteredHeader title="Taken by" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.takenBy || '-'}</div>)}</div>,
  },
  {
    id: "date",
    header: () => <CenteredHeader title="Date" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.date || '-'}</div>)}</div>,
  },
  {
    id: "contact",
    header: () => <CenteredHeader title="Contact" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.contact || '-'}</div>)}</div>,
  },
  {
    id: "sampleReceiptNo",
    header: () => <CenteredHeader title="Sample Receipt No" />,
    cell: ({ row }) => <div>{row.original.samples.map(s => <div key={s.id}>{s.sampleReceiptNo || '-'}</div>)}</div>,
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
                Edit Set
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete Set
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this test set and all ({item.samples.length}) of its samples.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(item)} className="bg-destructive hover:bg-destructive/90">
                  Delete Set
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )
    },
  },
];

    