
"use client"

import { Cylinder } from "@/types/cylinder";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CenteredHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold whitespace-normal">
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

type CylinderColumnsProps = {
  onEdit: (item: Cylinder) => void;
};

export const getColumns = ({ onEdit }: CylinderColumnsProps): ColumnDef<Cylinder>[] => [
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
    cell: ({ row }) => <div className="text-center">{row.getValue("dateReceived")}</div>,
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
    cell: ({ row }) => <div className="text-center">{row.getValue("castingDate")}</div>,
  },
  {
    accessorKey: "testingDate",
    header: () => <CenteredHeader title="Testing" subtitle="Date" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("testingDate")}</div>,
  },
  {
    accessorKey: "class",
    header: () => <CenteredHeader title="Class" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("class")}</div>,
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
    id: "dimensions",
    header: () => <CenteredHeader title="Dimensions (mm)" />,
    columns: [
      {
        accessorKey: "dimensions.diameter",
        header: () => <CenteredHeader title="Diameter" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.diameter}</div>,
      },
      {
        accessorKey: "dimensions.height",
        header: () => <CenteredHeader title="Height" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.height}</div>,
      },
    ],
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
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
