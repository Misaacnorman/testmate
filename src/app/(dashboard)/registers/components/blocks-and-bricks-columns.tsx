
"use client"

import { BlockAndBrick, BlockAndBrickSet } from "@/types/block-and-brick";
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

type BlocksAndBricksColumnsProps = {
  onEdit: (items: BlockAndBrick[]) => void;
};

export const getColumns = ({ onEdit }: BlocksAndBricksColumnsProps): ColumnDef<BlockAndBrickSet>[] => [
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
    accessorKey: "sampleType",
    header: () => <CenteredHeader title="Sample Type" />,
    cell: ({ row }) => <div>{row.original.sampleType}</div>,
  },
  {
    id: "dimensions",
    header: () => <CenteredHeader title="Dimensions (mm)" />,
    columns: [
      {
        id: 'length',
        header: () => <CenteredHeader title="Length" />,
        cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensions?.length || '-'}</div>)}</div>,
      },
      {
        id: 'width',
        header: () => <CenteredHeader title="Width" />,
        cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensions?.width || '-'}</div>)}</div>,
      },
      {
        id: 'height',
        header: () => <CenteredHeader title="Height" />,
        cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensions?.height || '-'}</div>)}</div>,
      },
    ],
  },
  {
    id: "dimensionsOfHoles",
    header: () => <CenteredHeader title="Dimensions of Holes &amp; No." subtitle="for Hollow Blocks" />,
    columns: [
        {
            id: 'holeA',
            header: () => <CenteredHeader title="Hole a" />,
            columns: [
                { id: 'holeAno', header: () => <CenteredHeader title="No." />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.holeA?.no || '-'}</div>)}</div> },
                { id: 'holeAl', header: () => <CenteredHeader title="L" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.holeA?.l || '-'}</div>)}</div> },
                { id: 'holeAw', header: () => <CenteredHeader title="W" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.holeA?.w || '-'}</div>)}</div> },
            ]
        },
        {
            id: 'holeB',
            header: () => <CenteredHeader title="Hole b" />,
            columns: [
                { id: 'holeBno', header: () => <CenteredHeader title="No." />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.holeB?.no || '-'}</div>)}</div> },
                { id: 'holeBl', header: () => <CenteredHeader title="L" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.holeB?.l || '-'}</div>)}</div> },
                { id: 'holeBw', header: () => <CenteredHeader title="W" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.holeB?.w || '-'}</div>)}</div> },
            ]
        },
        {
            id: 'notch',
            header: () => <CenteredHeader title="Notch" />,
            columns: [
                { id: 'notchno', header: () => <CenteredHeader title="No." />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.notch?.no || '-'}</div>)}</div> },
                { id: 'notchl', header: () => <CenteredHeader title="L" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.notch?.l || '-'}</div>)}</div> },
                { id: 'notchw', header: () => <CenteredHeader title="W" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.dimensionsOfHoles?.notch?.w || '-'}</div>)}</div> },
            ]
        }
    ]
  },
  {
    id: "weightKg",
    header: () => <CenteredHeader title="Weight" subtitle="(kg)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.weightKg || '-'}</div>)}</div>,
  },
  {
    id: "machineUsed",
    header: () => <CenteredHeader title="Machine Used" />,
    cell: ({ row }) => <div>{row.original.samples[0].machineUsed || '-'}</div>,
  },
  {
    id: "loadKN",
    header: () => <CenteredHeader title="Load" subtitle="(kN)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.loadKN || '-'}</div>)}</div>,
  },
  {
    id: "modeOfFailure",
    header: () => <CenteredHeader title="Mode of Failure" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.modeOfFailure || '-'}</div>)}</div>,
  },
  {
    id: "recordedTemperature",
    header: () => <CenteredHeader title="Recorded Temperature" subtitle="at the Facility (°C)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples[0].recordedTemperature || '-'}</div>,
  },
  {
    id: "certificateNumber",
    header: () => <CenteredHeader title="Certificate Number" />,
    cell: ({ row }) => <div>{row.original.samples[0].certificateNumber}</div>,
  },
  {
    id: "comment",
    header: () => <CenteredHeader title="Comment" />,
    cell: ({ row }) => <div>{row.original.samples[0].comment}</div>,
  },
  {
    id: "technician",
    header: () => <CenteredHeader title="Technician" />,
    cell: ({ row }) => <div>{row.original.samples[0].technician}</div>,
  },
  {
    id: "dateOfIssue",
    header: () => <CenteredHeader title="Date of Issue" />,
    cell: ({ row }) => <div>{row.original.samples[0].dateOfIssue}</div>,
  },
  {
    id: "issueIdSerialNo",
    header: () => <CenteredHeader title="Issue ID/ Serial No." />,
    cell: ({ row }) => <div>{row.original.samples[0].issueIdSerialNo}</div>,
  },
  {
    id: "takenBy",
    header: () => <CenteredHeader title="Taken by" />,
    cell: ({ row }) => <div>{row.original.samples[0].takenBy}</div>,
  },
  {
    id: "date",
    header: () => <CenteredHeader title="Date" />,
    cell: ({ row }) => <div>{row.original.samples[0].date}</div>,
  },
  {
    id: "contact",
    header: () => <CenteredHeader title="Contact" />,
    cell: ({ row }) => <div>{row.original.samples[0].contact}</div>,
  },
  {
    id: "sampleReceiptNo",
    header: () => <CenteredHeader title="Sample Receipt No" />,
    cell: ({ row }) => <div>{row.original.samples[0].sampleReceiptNo}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { samples } = row.original
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
