
"use client"

import { WaterAbsorption, WaterAbsorptionSet } from "@/types/water-absorption";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

type WaterAbsorptionColumnsProps = {
  onEdit: (items: WaterAbsorption[]) => void;
};

export const getColumns = ({ onEdit }: WaterAbsorptionColumnsProps): ColumnDef<WaterAbsorptionSet>[] => [
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
    cell: ({ row }) => <div className="text-center">{row.original.samples[0]?.ageDays || '-'}</div>,
  },
  {
    accessorKey: "areaOfUse",
    header: () => <CenteredHeader title="Area of Use" />,
    cell: ({ row }) => <div className="min-w-[150px]">{row.original.areaOfUse}</div>,
  },
  {
    id: "sampleId",
    header: () => <CenteredHeader title="Sample ID" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.sampleId}</div>)}</div>,
  },
  {
    accessorKey: "sampleType",
    header: () => <CenteredHeader title="Sample Type" />,
    cell: ({ row }) => <div>{row.original.sampleType}</div>,
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
    id: "ovenDriedWeightBeforeSoaking",
    header: () => <CenteredHeader title="Oven Dried Weight" subtitle="Before soaking (kg)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.ovenDriedWeightBeforeSoaking || '-'}</div>)}</div>,
  },
  {
    id: "weightAfterSoaking",
    header: () => <CenteredHeader title="Weight After" subtitle="soaking (kg)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.weightAfterSoaking || '-'}</div>)}</div>,
  },
  {
    id: "weightOfWater",
    header: () => <CenteredHeader title="Weight of Water" subtitle="(kg)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.weightOfWater || '-'}</div>)}</div>,
  },
  {
    id: "calculatedWaterAbsorption",
    header: () => <CenteredHeader title="Calculated Water" subtitle="Absorption (%)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.calculatedWaterAbsorption || '-'}</div>)}</div>,
  },
  {
    accessorKey: "certificateNumber",
    header: () => <CenteredHeader title="Certificate Number" />,
    cell: ({ row }) => <div>{row.original.samples[0].certificateNumber}</div>,
  },
  {
    accessorKey: "comment",
    header: () => <CenteredHeader title="Comment" />,
    cell: ({ row }) => <div>{row.original.samples[0].comment}</div>,
  },
  {
    accessorKey: "technician",
    header: () => <CenteredHeader title="Technician" subtitle="(Name &amp; Signature)" />,
    cell: ({ row }) => <div>{row.original.samples[0].technician}</div>,
  },
  {
    accessorKey: "dateOfIssue",
    header: () => <CenteredHeader title="Date of Issue" />,
    cell: ({ row }) => <div>{row.original.samples[0].dateOfIssue}</div>,
  },
  {
    accessorKey: "issueIdSerialNo",
    header: () => <CenteredHeader title="Issue ID/ Serial No." />,
    cell: ({ row }) => <div>{row.original.samples[0].issueIdSerialNo}</div>,
  },
  {
    accessorKey: "takenBy",
    header: () => <CenteredHeader title="Taken by" />,
    cell: ({ row }) => <div>{row.original.samples[0].takenBy}</div>,
  },
  {
    accessorKey: "date",
    header: () => <CenteredHeader title="Date" />,
    cell: ({ row }) => <div>{row.original.samples[0].date}</div>,
  },
  {
    accessorKey: "contact",
    header: () => <CenteredHeader title="Contact" />,
    cell: ({ row }) => <div>{row.original.samples[0].contact}</div>,
  },
  {
    accessorKey: "sampleReceiptNo",
    header: () => <CenteredHeader title="Sample Receipt No" />,
    cell: ({ row }) => <div>{row.original.samples[0].sampleReceiptNo}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { samples } = row.original;
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
            <DropdownMenuItem onClick={() => onEdit(samples)}>
              Edit Set ({samples.length} samples)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
