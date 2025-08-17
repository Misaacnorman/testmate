
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';
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

interface FieldWorkColumnsProps {
  onDelete: (id: string) => void;
}

export const getFieldWorkColumns = ({ onDelete }: FieldWorkColumnsProps): ColumnDef<FieldWorkInstruction>[] => [
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
            accessorKey: 'fieldTechnician',
            header: 'Technician in Charge',
        },
        {
            accessorKey: 'fieldStartDate',
            header: 'Start Date',
            cell: ({ row }) => <div>{row.original.fieldStartDate ? format(parseISO(row.original.fieldStartDate), 'yyyy-MM-dd') : '-'}</div>,
        },
        {
            accessorKey: 'fieldEndDate',
            header: 'End Date',
            cell: ({ row }) => <div>{row.original.fieldEndDate ? format(parseISO(row.original.fieldEndDate), 'yyyy-MM-dd') : '-'}</div>,
        },
        {
            accessorKey: 'fieldRemarks',
            header: 'Remark(s)',
        },
    ]
  },
  {
    id: 'labWorkInstructions',
    header: () => <div className="text-center">SCOPE OF WORK (LABORATORY TESTING)</div>,
    columns: [
        { accessorKey: 'labTestsDescription', header: 'Laboratory Test Description and number of tests' },
        { accessorKey: 'labTechnician', header: 'Technician in Charge' },
        { accessorKey: 'labStartDate', header: 'Start Date', cell: ({ row }) => <div>{row.original.labStartDate ? format(parseISO(row.original.labStartDate), 'yyyy-MM-dd') : '-'}</div> },
        { accessorKey: 'labAgreedDeliveryDate', header: 'Agreed Delivery Date', cell: ({ row }) => <div>{row.original.labAgreedDeliveryDate ? format(parseISO(row.original.labAgreedDeliveryDate), 'yyyy-MM-dd') : '-'}</div> },
        { accessorKey: 'labAgreedDeliverySignature', header: 'Signature' },
        { accessorKey: 'labActualDeliveryDate', header: 'Actual Delivery date', cell: ({ row }) => <div>{row.original.labActualDeliveryDate ? format(parseISO(row.original.labActualDeliveryDate), 'yyyy-MM-dd') : '-'}</div> },
        { accessorKey: 'labActualDeliverySignature', header: 'Signature' },
        { accessorKey: 'labRemarks', header: 'Remark(s)' },
    ]
  },
  { accessorKey: 'acknowledgement', header: 'Acknowledgement after Delivery' },
  { accessorKey: 'reportIssuedBy', header: 'Report issued By' },
  { accessorKey: 'reportPickedBy', header: 'Report Picked/ Delivered to' },
  { accessorKey: 'reportContact', header: 'Contact' },
  { accessorKey: 'reportDateTime', header: 'Date and Time', cell: ({ row }) => <div>{row.original.reportDateTime ? format(parseISO(row.original.reportDateTime), 'yyyy-MM-dd p') : '-'}</div> },
  { accessorKey: 'sampleReceiptNumber', header: 'Sample Receipt Number' },
  {
    id: 'actions',
    cell: ({ row }) => {
      const instruction = row.original;
      return (
        <div className="text-center">
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this project instruction.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(instruction.id)}>
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
