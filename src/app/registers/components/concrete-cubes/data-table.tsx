
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function ConcreteCubesDataTable<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="h-full flex flex-col">
       <div className="rounded-md border flex-grow overflow-auto relative">
            <Table>
            <TableHeader className="sticky top-0 bg-primary z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-primary/90">
                    {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan} className="text-white font-bold h-14">
                        {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </TableHead>
                    ))}
                </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {loading ? (
                Array.from({ length: 15 }).map((_, i) => (
                    <TableRow key={i}>
                    {table.getAllLeafColumns().map((column, j) => (
                        <TableCell key={`${i}-${j}`} className="p-0">
                            <div className="flex items-center justify-center w-full h-12">
                                <Skeleton className="h-6 w-4/5" />
                            </div>
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="[&_td]:p-0"
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center relative align-top border-b">
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                        </TableCell>
                    ))}
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                    >
                    No concrete cube samples found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
       </div>
      <div className="flex items-center justify-between space-x-2 p-4 border-t">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) found.
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
      </div>
    </div>
  );
}
