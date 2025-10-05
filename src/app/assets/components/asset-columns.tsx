
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow, addDays } from "date-fns";
import Link from 'next/link';
import { Asset, AssetStatus } from "@/lib/types";
import { getCategoryName } from "@/lib/asset-categories";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface GetColumnsProps {
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
}

const statusIcons: Record<AssetStatus, React.ReactNode> = {
    'Active': <CheckCircle2 className="h-4 w-4 text-green-500" />,
    'In Repair': <Wrench className="h-4 w-4 text-orange-500" />,
    'Under Maintenance': <Clock className="h-4 w-4 text-blue-500" />,
    'Decommissioned': <AlertCircle className="h-4 w-4 text-gray-500" />,
    'Lost/Stolen': <AlertCircle className="h-4 w-4 text-red-500" />,
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<Asset>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "name",
    header: "Asset",
    cell: ({ row }) => {
        const asset = row.original;
        return (
            <Link href={`/assets/${asset.id}`} className="font-medium text-primary hover:underline">
                {asset.name}
            </Link>
        )
    }
  },
  {
    accessorKey: "assetTag",
    header: "Tag",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.original.status;
        return (
            <div className="flex items-center gap-2">
                {statusIcons[status]}
                <span>{status}</span>
            </div>
        )
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
   {
    accessorKey: "categoryId",
    header: "Category",
    cell: ({ row }) => getCategoryName(row.original.categoryId),
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "nextCalibrationDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Next Calibration
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const { nextCalibrationDate, isCalibrated } = row.original;
        if (!isCalibrated) return <span className="text-muted-foreground">N/A</span>;
        if (!nextCalibrationDate) return <span className="text-muted-foreground">Not Set</span>;
        const date = new Date(nextCalibrationDate);
        const distance = formatDistanceToNow(date, { addSuffix: true });
        const isPast = date < new Date();
        return <span className={isPast ? "text-destructive" : ""}>{format(date, "PPP")} ({distance})</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const asset = row.original;
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
            <DropdownMenuItem asChild><Link href={`/assets/${asset.id}`}>View Details</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(asset)}>
                Edit Asset
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(asset)}>
                Delete Asset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
