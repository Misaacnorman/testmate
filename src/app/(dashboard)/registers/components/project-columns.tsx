
"use client"

import { Project } from "@/types/project"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
        className="w-full flex items-center justify-center"
    >
        <span className="text-center">{title}</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
);

type ProjectColumnsProps = {
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export const getColumns = ({ onEdit, onDelete }: ProjectColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => <SortableHeader title="DATE" column={column} />,
    cell: ({ row }) => <div className="text-center">{row.getValue("date")}</div>,
    enableSorting: true,
  },
  {
    id: "projectId",
    header: () => <CenteredHeader title="PROJECT ID" subtitle="NUMBER" />,
    columns: [
        {
            accessorKey: 'projectId.big',
            header: () => <CenteredHeader title="BIG PROJECTS" />,
            cell: ({ row }) => <div className="text-center">{row.original.projectId.big}</div>,
        },
        {
            accessorKey: 'projectId.small',
            header: () => <CenteredHeader title="SMALL" subtitle="PROJECTS & SAMPLES" />,
            cell: ({ row }) => <div className="text-center">{row.original.projectId.small}</div>,
        }
    ]
  },
   {
    accessorKey: "sampleReceiptNo",
    header: () => <CenteredHeader title="Sample Receipt" subtitle="Number" />,
    cell: ({ row }) => <div className="min-w-[120px] text-center">{row.original.sampleReceiptNo}</div>,
  },
  {
    accessorKey: "client",
    header: ({ column }) => <SortableHeader title="CLIENT" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("client")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "project",
    header: ({ column }) => <SortableHeader title="PROJECT" column={column} />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("project")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "engineerInCharge",
    header: () => <CenteredHeader title="ENGINEER" subtitle="IN CHARGE" />,
    cell: ({ row }) => <div className="min-w-[120px]">{row.getValue("engineerInCharge")}</div>,
  },
  {
    id: "labWork",
    header: () => <CenteredHeader title="SCOPE OF WORK" subtitle="(LABORATORY TESTING)" />,
    columns: [
        {
            accessorKey: 'labWork.details',
            header: () => <CenteredHeader title="Laboratory Test Description" subtitle="and number of tests" />,
            cell: ({ row }) => <div className="min-w-[200px]">{row.original.labWork.details}</div>,
        },
        {
            accessorKey: 'labWork.technician',
            header: () => <CenteredHeader title="Technician" subtitle="in Charge" />,
            cell: ({ row }) => <div className="min-w-[120px]">{row.original.labWork.technician}</div>,
        },
        {
            accessorKey: 'labWork.startDate',
            header: () => <CenteredHeader title="Start Date" />,
            cell: ({ row }) => <div className="text-center">{row.original.labWork.startDate}</div>,
        },
        {
            accessorKey: 'labWork.agreedDeliveryDate',
            header: () => <CenteredHeader title="Agreed" subtitle="Delivery Date" />,
            cell: ({ row }) => <div className="text-center">{row.original.labWork.agreedDeliveryDate}</div>,
        },
        {
            accessorKey: 'labWork.signatureAgreed',
            header: () => <CenteredHeader title="Signature" />,
            cell: ({ row }) => <div>{row.original.labWork.signatureAgreed}</div>,
        },
        {
            accessorKey: 'labWork.actualDeliveryDate',
            header: () => <CenteredHeader title="Actual" subtitle="Delivery date" />,
            cell: ({ row }) => <div className="text-center">{row.original.labWork.actualDeliveryDate}</div>,
        },
        {
            accessorKey: 'labWork.signatureActual',
            header: () => <CenteredHeader title="Signature" />,
            cell: ({ row }) => <div>{row.original.labWork.signatureActual}</div>,
        },
        {
            accessorKey: 'labWork.remarks',
            header: () => <CenteredHeader title="Remark(s)" />,
            cell: ({ row }) => <div className="min-w-[150px]">{row.original.labWork.remarks}</div>,
        },
    ]
  },
  {
    id: "fieldWork",
    header: () => <CenteredHeader title="FIELD WORK" subtitle="INSTRUCTIONS" />,
    columns: [
        {
            accessorKey: 'fieldWork.details',
            header: () => <CenteredHeader title="Field Tests in Detail" subtitle="including number of tests" />,
            cell: ({ row }) => <div className="min-w-[200px]">{row.original.fieldWork.details}</div>,
        },
        {
            accessorKey: 'fieldWork.technician',
            header: () => <CenteredHeader title="Technician" subtitle="in Charge" />,
            cell: ({ row }) => <div className="min-w-[120px]">{row.original.fieldWork.technician}</div>,
        },
        {
            accessorKey: 'fieldWork.startDate',
            header: () => <CenteredHeader title="Start Date" />,
            cell: ({ row }) => <div className="text-center">{row.original.fieldWork.startDate}</div>,
        },
        {
            accessorKey: 'fieldWork.endDate',
            header: () => <CenteredHeader title="End Date" />,
            cell: ({ row }) => <div className="text-center">{row.original.fieldWork.endDate}</div>,
        },
        {
            accessorKey: 'fieldWork.remarks',
            header: () => <CenteredHeader title="Remark(s)" />,
            cell: ({ row }) => <div className="min-w-[150px]">{row.original.fieldWork.remarks}</div>,
        },
    ]
  },
  {
    id: "dispatch",
    header: () => <CenteredHeader title="REPORT DISPATCH" subtitle="DETAILS" />,
    columns: [
        {
            accessorKey: 'dispatch.acknowledgement',
            header: () => <CenteredHeader title="Acknowledgement" subtitle="after Delivery" />,
            cell: ({ row }) => <div>{row.original.dispatch.acknowledgement}</div>,
        },
        {
            accessorKey: 'dispatch.issuedBy',
            header: () => <CenteredHeader title="Report" subtitle="issued By" />,
            cell: ({ row }) => <div className="min-w-[120px]">{row.original.dispatch.issuedBy}</div>,
        },
        {
            accessorKey: 'dispatch.deliveredTo',
            header: () => <CenteredHeader title="Report Picked/" subtitle="Delivered to" />,
            cell: ({ row }) => <div className="min-w-[120px]">{row.original.dispatch.deliveredTo}</div>,
        },
        {
            accessorKey: 'dispatch.contact',
            header: () => <CenteredHeader title="Contact" />,
            cell: ({ row }) => <div>{row.original.dispatch.contact}</div>,
        },
        {
            accessorKey: 'dispatch.dateTime',
            header: () => <CenteredHeader title="Date and Time" />,
            cell: ({ row }) => <div className="text-center min-w-[150px]">{row.original.dispatch.dateTime}</div>,
        },
    ]
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
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
              <DropdownMenuItem onClick={() => onEdit(item)}>
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
               <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete Project
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this project
                  and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(item.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
]
