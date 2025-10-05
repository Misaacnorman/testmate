
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { User, Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

interface GetColumnsProps {
    roles: Role[];
}

export const getColumns = ({ roles }: GetColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
        const user = row.original;
        const nameInitial = user.name?.charAt(0) || user.email?.charAt(0) || "?";
        return (
            <Link href={`/personnel/${user.uid}`} className="flex items-center gap-3 group">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback>{nameInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium group-hover:underline">{user.name || 'N/A'}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            </Link>
        )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const user = row.original;
        const variant = user.status === 'active' ? 'secondary' : 'destructive';
        const statusText = user.status.charAt(0).toUpperCase() + user.status.slice(1);
        return (
            <Badge variant={variant}>
                {statusText}
            </Badge>
        )
    }
  },
   {
    accessorKey: "roleId",
    header: "Role",
    cell: ({ row }) => {
        const user = row.original;
        const role = roles.find(g => g.id === user.roleId);
        return role ? <Badge variant="outline">{role.name}</Badge> : <span className="text-muted-foreground">None</span>;
    }
  },
  {
    accessorKey: "workload",
    header: "Workload (Open Tasks)",
    cell: ({ row }) => {
        const workload = row.original.workload || 0;
        const progressValue = Math.min(workload * 10, 100);
        return (
            <div className="flex items-center gap-2">
                <Progress value={progressValue} className="w-24 h-2"/>
                <span className="text-sm font-medium">{workload}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "contact.phone",
    header: "Phone",
    cell: ({ row }) => row.original.contact?.phone || <span className="text-muted-foreground">N/A</span>
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
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
            <DropdownMenuItem asChild>
                <Link href={`/personnel/${user.uid}`}>View Profile</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href={`/admin/users`}>Edit User</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
