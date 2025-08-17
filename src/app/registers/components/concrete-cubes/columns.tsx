
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ConcreteCubeSample } from '@/lib/types';
import { format } from 'date-fns';

export const columns: ColumnDef<ConcreteCubeSample>[] = [
    {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    accessorKey: 'receivedAt',
    header: 'Date Received',
     cell: ({ row }) => format(new Date(row.getValue('receivedAt')), 'yyyy-MM-dd'),
  },
  {
    accessorKey: 'clientName',
    header: 'Client',
  },
  {
    accessorKey: 'projectTitle',
    header: 'Project',
  },
  {
    accessorKey: 'castingDate',
    header: 'Casting Date',
     cell: ({ row }) => row.getValue('castingDate') ? format(new Date(row.getValue('castingDate')), 'yyyy-MM-dd') : 'N/A',
  },
  {
    accessorKey: 'testingDate',
    header: 'Testing Date',
     cell: ({ row }) => row.getValue('testingDate') ? format(new Date(row.getValue('testingDate')), 'yyyy-MM-dd') : 'N/A',
  },
  {
    accessorKey: 'class',
    header: 'Class',
  },
  {
    accessorKey: 'age',
    header: 'Age (Days)',
  },
  {
    accessorKey: 'areaOfUse',
    header: 'Area of Use',
  },
  {
    accessorKey: 'sampleId',
    header: 'Sample ID',
  },
  {
    id: 'dimensions',
    header: () => <div className="text-center">Dimensions (mm)</div>,
    columns: [
        {
            accessorKey: 'length',
            header: 'Length',
            cell: ({row}) => row.original.length || 'N/A'
        },
        {
            accessorKey: 'width',
            header: 'Width',
            cell: ({row}) => row.original.width || 'N/A'
        },
        {
            accessorKey: 'height',
            header: 'Height',
            cell: ({row}) => row.original.height || 'N/A'
        }
    ]
  },
  {
    accessorKey: 'weight',
    header: 'Weight (kg)',
  },
  {
    accessorKey: 'machineUsed',
    header: 'Machine Used',
  },
  {
    accessorKey: 'load',
    header: 'Load (kN)',
  },
  {
    accessorKey: 'modeOfFailure',
    header: 'Mode of Failure',
  },
  {
    accessorKey: 'recordedTemp',
    header: 'Temp (°C)',
  },
  {
    accessorKey: 'certificateNumber',
    header: 'Certificate No.',
  },
  {
    accessorKey: 'comment',
    header: 'Comment/Remark',
  },
  {
    accessorKey: 'technician',
    header: 'Technician',
  },
  {
    accessorKey: 'dateOfIssue',
    header: 'Date of Issue',
  },
  {
    accessorKey: 'issueId',
    header: 'Issue ID/Serial No.',
  },
  {
    accessorKey: 'takenBy',
    header: 'Taken by',
  },
  {
    accessorKey: 'dateTaken',
    header: 'Date Taken',
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
  },
  {
    accessorKey: 'receiptId',
    header: 'Receipt No.',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const sample = row.original;
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
            <DropdownMenuItem>Edit Record</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete Record
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
