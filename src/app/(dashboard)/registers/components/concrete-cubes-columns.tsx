
"use client"

import { ConcreteCube, ConcreteCubeSet } from "@/types/concrete-cube";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CenteredHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold whitespace-normal">
    <div>{title}</div>
    {subtitle && <div className="font-normal text-xs">{subtitle}</div>}
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

type ConcreteCubesColumnsProps = {
  onEdit: (cube: ConcreteCube) => void;
};

export const getColumns = ({ onEdit }: ConcreteCubesColumnsProps): ColumnDef<ConcreteCubeSet>[] => [
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
    cell: ({ row }) => <div className="text-center">{row.original.dateReceived}</div>,
  },
   {
    accessorKey: "client",
    header: ({ column }) => <SortableHeader title="Client" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.original.client}</div>,
  },
  {
    accessorKey: "project",
    header: ({ column }) => <SortableHeader title="Project" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.original.project}</div>,
  },
  {
    accessorKey: "castingDate",
    header: () => <CenteredHeader title="Casting" subtitle="Date" />,
    cell: ({ row }) => <div className="text-center">{row.original.castingDate}</div>,
  },
  {
    accessorKey: "testingDate",
    header: () => <CenteredHeader title="Testing" subtitle="Date" />,
    cell: ({ row }) => <div className="text-center">{row.original.testingDate}</div>,
  },
  {
    accessorKey: "class",
    header: () => <CenteredHeader title="Class" />,
    cell: ({ row }) => <div className="text-center">{row.original.class}</div>,
  },
  {
    accessorKey: "areaOfUse",
    header: () => <CenteredHeader title="Area of Use" />,
    cell: ({ row }) => <div className="min-w-[150px]">{row.original.areaOfUse}</div>,
  },
  {
    id: 'sampleId',
    header: () => <CenteredHeader title="Sample ID" />,
    cell: ({ row }) => (
        <div className="flex flex-col items-center">
            {row.original.samples.map((sample) => (
                <div key={sample.id} className="py-1">{sample.sampleId}</div>
            ))}
        </div>
    ),
  },
  {
    id: 'ageDays',
    header: () => <CenteredHeader title="Age" subtitle="(Days)" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.ageDays || '-'}</div>)}</div>,
  },
  {
    id: "modeOfFailure",
    header: () => <CenteredHeader title="Mode of Failure" />,
    cell: ({ row }) => <div className="text-center">{row.original.samples.map(s => <div key={s.id}>{s.modeOfFailure || '-'}</div>)}</div>,
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
            {samples.map((sample) => (
                 <DropdownMenuItem key={sample.id} onClick={() => onEdit(sample)}>
                    Edit Sample {sample.sampleId}
                 </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

    