
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FieldWorkInstruction } from '@/lib/types';


export const getFieldWorkColumns = (): ColumnDef<FieldWorkInstruction>[] => [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div>{row.original.date ? format(parseISO(row.original.date), 'yyyy-MM-dd') : '-'}</div>,
  },
  {
    id: 'projectId',
    header: () => <div className="text-center">PROJECT ID NUMBER</div>,
    columns: [
        {
            accessorKey: 'projectIdBig',
            header: 'BIG PROJECTS',
            cell: ({row}) => <div>{row.original.projectIdBig}</div>
        },
        {
            accessorKey: 'projectIdSmall',
            header: 'SMALL PROJECTS & SAMPLES',
            cell: ({row}) => <div>{row.original.projectIdSmall}</div>
        }
    ]
  },
  {
    accessorKey: 'client',
    header: 'Client',
  },
  {
    accessorKey: 'project',
    header: 'Project',
  },
  {
    accessorKey: 'engineerInCharge',
    header: 'Engineer In Charge',
  },
  {
    id: 'fieldWorkInstructions',
    header: () => <div className="text-center">FIELD WORK INSTRUCTIONS</div>,
    columns: [
        {
            accessorKey: 'fieldTests',
            header: 'Field Tests in Detail including number of tests',
            cell: ({row}) => <div className="w-[200px]">{row.original.fieldTests}</div>
        },
        {
            accessorKey: 'technicianInCharge',
            header: 'Technician in Charge',
        },
        {
            accessorKey: 'startDate',
            header: 'Start Date',
            cell: ({ row }) => <div>{row.original.startDate ? format(parseISO(row.original.startDate), 'yyyy-MM-dd') : '-'}</div>,
        },
        {
            accessorKey: 'endDate',
            header: 'End Date',
            cell: ({ row }) => <div>{row.original.endDate ? format(parseISO(row.original.endDate), 'yyyy-MM-dd') : '-'}</div>,
        },
        {
            accessorKey: 'remarks',
            header: 'Remark(s)',
        },
    ]
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const instruction = row.original;
      return (
        <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
