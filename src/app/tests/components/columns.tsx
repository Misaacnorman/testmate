
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import type { Test } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ColumnsProps {
  onEdit: (test: Test) => void;
  onDelete: (id: string) => void;
  onFieldUpdate: (id: string, field: keyof Test, value: any) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onFieldUpdate,
}: ColumnsProps): ColumnDef<Test>[] => [
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
    accessorKey: 'material',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="text-center w-full whitespace-normal"
      >
        <div>Material<br/>Category</div>
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-center">{row.getValue('material')}</div>,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Test Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium text-center">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: 'Material Test',
     cell: ({ row }) => <div className="text-center">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'method',
    header: 'Test Method(s)',
    cell: ({ row }) => <div className="text-center w-[200px]">{row.getValue('method')}</div>,
  },
  {
    accessorKey: 'isAccredited',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center w-full whitespace-normal"
        >
          <div>Accreditation<br/>Status</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
      const test = row.original;
      return (
        <div className="flex justify-center">
            <Switch
                checked={test.isAccredited}
                onCheckedChange={(value) => onFieldUpdate(test.id, 'isAccredited', value)}
                aria-label="Accreditation status"
            />
        </div>
      );
    },
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
        const test = row.original;
        return (
            <div className="text-center">
                <Input
                value={test.unit}
                onChange={(e) => onFieldUpdate(test.id, 'unit', e.target.value)}
                className="w-24 border-none bg-transparent focus:bg-white focus:ring-1 text-center"
                />
            </div>
        );
    }
  },
  {
    accessorKey: 'priceUGX',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center w-full"
        >
          <div>Amount<br/>(UGX)</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
        const test = row.original;
        const formatted = new Intl.NumberFormat('en-US').format(test.priceUGX);
        return <div className="text-center font-mono">{formatted}</div>;
    }
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center w-full"
        >
          <div>Amount<br/>(USD)</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const test = row.original;
        return (
            <div className="text-center">
                <Input
                type="number"
                value={test.price}
                onChange={(e) => onFieldUpdate(test.id, 'price', parseFloat(e.target.value) || 0)}
                className="w-24 border-none bg-transparent text-center font-mono focus:bg-white focus:ring-1"
                />
            </div>
        );
    }
  },
  {
    accessorKey: 'turnAroundTime',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="text-center w-full"
        >
          <div>Lead Time<br/>(Days)</div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => {
        const test = row.original;
        return (
            <div className="text-center">
                <Input
                value={test.turnAroundTime}
                onChange={(e) => onFieldUpdate(test.id, 'turnAroundTime', e.target.value)}
                className="w-32 border-none bg-transparent focus:bg-white focus:ring-1 text-center"
                />
            </div>
        );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const test = row.original;
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
                <DropdownMenuItem onClick={() => onEdit(test)}>
                Edit Full Record
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                onClick={() => onDelete(test.id)}
                className="text-destructive"
                >
                Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    },
  },
];
