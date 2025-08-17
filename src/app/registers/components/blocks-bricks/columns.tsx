
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { GroupedBlockBrickSample } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const renderCellWithSubItems = (items: (string | number | undefined)[]) => (
  <div className="flex flex-col justify-center h-full">
    {items.map((item, index) => (
      <div key={index} className="flex-1 py-2 flex items-center justify-center relative">
        {item ?? '-'}
        {index < items.length - 1 && <Separator orientation="horizontal" className="absolute bottom-0 left-0 w-full" />}
      </div>
    ))}
  </div>
);

interface BlockBrickColumnsProps {
  onEdit: (sampleSet: GroupedBlockBrickSample) => void;
  onDelete: (receiptId: string, testId: string, setNumber: number) => void;
}

export const getBlockBrickColumns = ({ onEdit, onDelete }: BlockBrickColumnsProps): ColumnDef<GroupedBlockBrickSample>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        disabled // Always disabled for single selection mode
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
        return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.receivedAt ? format(parseISO(row.original.receivedAt), 'yyyy-MM-dd') : '-'}</div>
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
       const value = row.original.castingDate ? format(parseISO(row.original.castingDate), 'yyyy-MM-dd') : '-';
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{value}</div>
    }
  },
  {
    accessorKey: 'testingDate',
    header: 'Testing Date',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       const value = row.original.testingDate ? format(parseISO(row.original.testingDate), 'yyyy-MM-dd') : '-';
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{value}</div>
    }
  },
  {
    accessorKey: 'age',
    header: 'Age (Days)',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.age || '-'}</div>
    }
  },
  {
    accessorKey: 'areaOfUse',
    header: 'Area of Use',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.areaOfUse || '-'}</div>
    }
  },
  {
    accessorKey: 'sampleId',
    header: 'Sample ID',
    cell: ({ row }) => renderCellWithSubItems(row.original.samples.map(s => s.sampleSerialNumber)),
  },
  {
    id: 'dimensions',
    header: () => <div className="text-center px-0">Dimensions (mm)</div>,
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
    id: 'holeDimensions',
    header: () => <div className="text-center px-0">Dimensions of Holes &amp; No. for Hollow Blocks</div>,
    columns: [
        {
            id: 'holeA',
            header: () => <div className="border-x-2 border-white px-1">Hole a</div>,
            columns: [
                {
                    accessorKey: 'holeA_number',
                    header: 'No.',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.holeA_number)),
                },
                {
                    accessorKey: 'holeA_length',
                    header: 'L (mm)',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.holeA_length)),
                },
                {
                    accessorKey: 'holeA_width',
                    header: 'W (mm)',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.holeA_width)),
                }
            ]
        },
        {
            id: 'holeB',
            header: () => <div className="border-r-2 border-white px-1">Hole b</div>,
            columns: [
                {
                    accessorKey: 'holeB_number',
                    header: 'No.',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.holeB_number)),
                },
                {
                    accessorKey: 'holeB_length',
                    header: 'L (mm)',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.holeB_length)),
                },
                {
                    accessorKey: 'holeB_width',
                    header: 'W (mm)',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.holeB_width)),
                }
            ]
        },
        {
            id: 'notch',
            header: () => <div className="border-r-2 border-white px-1">Notch</div>,
            columns: [
                {
                    accessorKey: 'notch_number',
                    header: 'No.',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.notch_number)),
                },
                {
                    accessorKey: 'notch_length',
                    header: 'L (mm)',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.notch_length)),
                },
                {
                    accessorKey: 'notch_width',
                    header: 'W (mm)',
                    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.notch_width)),
                }
            ]
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
    accessorKey: 'modeOfFailure',
    header: 'Mode of Failure',
    cell: ({row}) => renderCellWithSubItems(row.original.samples.map(s => s.modeOfFailure)),
  },
  {
    accessorKey: 'machineUsed',
    header: 'Machine Used',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.machineUsed || '-'}</div>
    }
  },
  {
    accessorKey: 'recordedTemp',
    header: 'Temp (°C)',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.recordedTemp || '-'}</div>
    }
  },
  {
    accessorKey: 'certificateNumber',
    header: 'Certificate No.',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.certificateNumber || '-'}</div>
    }
  },
  {
    accessorKey: 'comment',
    header: 'Comment/Remark',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.comment || '-'}</div>
    }
  },
  {
    accessorKey: 'technician',
    header: 'Technician',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.technician || '-'}</div>
    }
  },
  {
    accessorKey: 'dateOfIssue',
    header: 'Date of Issue',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       const value = row.original.dateOfIssue ? format(parseISO(row.original.dateOfIssue), 'yyyy-MM-dd') : '-';
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{value}</div>
    }
  },
  {
    accessorKey: 'issueId',
    header: 'Issue ID/Serial No.',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.issueId || '-'}</div>
    }
  },
  {
    accessorKey: 'takenBy',
    header: 'Taken by',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.takenBy || '-'}</div>
    }
  },
  {
    accessorKey: 'dateTaken',
    header: 'Date Taken',
     cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       const value = row.original.dateTaken ? format(parseISO(row.original.dateTaken), 'yyyy-MM-dd') : '-';
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{value}</div>
    }
  },
  {
    accessorKey: 'contact',
    header: 'Contact',
    cell: ({ row }) => {
       const rowCount = row.original.samples.length;
       return <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">{row.original.contact || '-'}</div>
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
      const sampleSet = row.original;
      return (
        <div style={{ height: `${rowCount * 3}rem`}} className="flex items-center justify-center">
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
                  <DropdownMenuItem onClick={() => onEdit(sampleSet)}>Edit Record</DropdownMenuItem>
                  <DropdownMenuSeparator />
                   <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive">
                        Delete Record
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
              </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this entire
                        sample set ({sampleSet.samples.length} sample(s)) from the register.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(sampleSet.receiptId, sampleSet.testId, sampleSet.setNumber || 0)}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
      );
    },
  },
];
