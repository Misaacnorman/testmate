
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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
import type { GroupedConcreteCubeSample } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const renderCellWithSubItems = (items: (string | number | undefined)[]) => (
  <div className="flex flex-col justify-center h-full">
    {items.map((item, index) => (
      <div key={index} className="flex-1 py-2 flex items-center justify-center">
        {item ?? 'N/A'}
        {index < items.length - 1 && <Separator orientation="horizontal" className="absolute bottom-0 left-0 w-full" />}
      </div>
    ))}
  </div>
);

export const columns: ColumnDef<GroupedConcreteCubeSample>[] = [
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
    cell: ({ row }) => {
        const rowCount = row.original.samples.length;
        return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.receivedAt ? format(parseISO(row.original.receivedAt), 'yyyy-MM-dd') : 'N/A'}</div>
    },
  },
  {
    accessorKey: 'clientName',
    header: 'Client',
    cell: ({ row }) => {
        const rowCount = row.original.samples.length;
        return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.clientName}</div>
    }
  },
  {
    accessorKey: 'projectTitle',
    header: 'Project',
    cell: ({ row }) => {
         const rowCount = row.original.samples.length;
        return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.projectTitle}</div>
    }
  },
  {
    accessorKey: 'castingDate',
    header: 'Casting Date',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       const value = row.original.castingDate ? format(parseISO(row.original.castingDate), 'yyyy-MM-dd') : 'N/A';
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{value}</div>
    }
  },
  {
    accessorKey: 'testingDate',
    header: 'Testing Date',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       const value = row.original.testingDate ? format(parseISO(row.original.testingDate), 'yyyy-MM-dd') : 'N/A';
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{value}</div>
    }
  },
  {
    accessorKey: 'class',
    header: 'Class',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.class || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'age',
    header: 'Age (Days)',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.age || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'areaOfUse',
    header: 'Area of Use',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.areaOfUse || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'sampleId',
    header: 'Sample ID',
    cell: ({ row }) => renderCellWithSubItems(row.original.samples.map(s => s.sampleSerialNumber)),
  },
  {
    id: 'dimensions',
    header: () => <div className="text-center">Dimensions (mm)</div>,
    columns: [
        {
            accessorKey: 'length',
            header: 'Length',
            cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.length)),
        },
        {
            accessorKey: 'width',
            header: 'Width',
            cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.width)),
        },
        {
            accessorKey: 'height',
            header: 'Height',
            cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.height)),
        }
    ]
  },
  {
    accessorKey: 'weight',
    header: 'Weight (kg)',
    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.weight)),
  },
  {
    accessorKey: 'load',
    header: 'Load (kN)',
    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.load)),
  },
  {
    accessorKey: 'machineUsed',
    header: 'Machine Used',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.machineUsed || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'modeOfFailure',
    header: 'Mode of Failure',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.modeOfFailure || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'recordedTemp',
    header: 'Temp (°C)',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.recordedTemp || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'certificateNumber',
    header: 'Certificate No.',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.certificateNumber || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'comment',
    header: 'Comment/Remark',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.comment || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'technician',
    header: 'Technician',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.technician || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'dateOfIssue',
    header: 'Date of Issue',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.dateOfIssue || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'issueId',
    header: 'Issue ID/Serial No.',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.issueId || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'takenBy',
    header: 'Taken by',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.takenBy || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'dateTaken',
    header: 'Date Taken',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.dateTaken || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.contact || 'N/A'}</div>
    }
  },
  {
    accessorKey: 'receiptId',
    header: 'Receipt No.',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.receiptId}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const rowCount = row.original.samples.length;
      return (
        <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">
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
        </div>
      );
    },
  },
];
