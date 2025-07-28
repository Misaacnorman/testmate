
"use client"

import { Project } from "@/types/project"
import { ColumnDef } from "@tanstack/react-table"

const MultiLineHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div>{subtitle}</div>}
  </div>
);

export const getColumns = (): ColumnDef<Project>[] => [
  {
    accessorKey: "date",
    header: () => <MultiLineHeader title="DATE" />,
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    id: "projectId",
    header: () => <MultiLineHeader title="PROJECT ID" subtitle="NUMBER" />,
    columns: [
        {
            accessorKey: 'projectId.big',
            header: () => <MultiLineHeader title="BIG PROJECTS" />,
            cell: ({ row }) => row.original.projectId.big,
        },
        {
            accessorKey: 'projectId.small',
            header: () => <MultiLineHeader title="SMALL" subtitle="PROJECTS & SAMPLES" />,
            cell: ({ row }) => row.original.projectId.small,
        }
    ]
  },
  {
    accessorKey: "client",
    header: () => <MultiLineHeader title="CLIENT" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("client")}</div>,
  },
  {
    accessorKey: "project",
    header: () => <MultiLineHeader title="PROJECT" />,
    cell: ({ row }) => <div>{row.getValue("project")}</div>,
  },
  {
    accessorKey: "engineerInCharge",
    header: () => <MultiLineHeader title="ENGINEER" subtitle="IN CHARGE" />,
    cell: ({ row }) => <div>{row.getValue("engineerInCharge")}</div>,
  },
  {
    id: "fieldWork",
    header: () => <MultiLineHeader title="FIELD WORK" subtitle="INSTRUCTIONS" />,
    columns: [
        {
            accessorKey: 'fieldWork.details',
            header: () => <MultiLineHeader title="Field Tests in Detail" subtitle="including number of tests" />,
            cell: ({ row }) => row.original.fieldWork.details,
        },
        {
            accessorKey: 'fieldWork.technician',
            header: () => <MultiLineHeader title="Technician" subtitle="in Charge" />,
            cell: ({ row }) => row.original.fieldWork.technician,
        },
        {
            accessorKey: 'fieldWork.startDate',
            header: () => <MultiLineHeader title="Start Date" />,
            cell: ({ row }) => row.original.fieldWork.startDate,
        },
        {
            accessorKey: 'fieldWork.endDate',
            header: () => <MultiLineHeader title="End Date" />,
            cell: ({ row }) => row.original.fieldWork.endDate,
        },
        {
            accessorKey: 'fieldWork.remarks',
            header: () => <MultiLineHeader title="Remark(s)" />,
            cell: ({ row }) => row.original.fieldWork.remarks,
        },
    ]
  },
  {
    id: "labWork",
    header: () => <MultiLineHeader title="SCOPE OF WORK" subtitle="(LABORATORY TESTING)" />,
    columns: [
        {
            accessorKey: 'labWork.details',
            header: () => <MultiLineHeader title="Laboratory Test Description" subtitle="and number of tests" />,
            cell: ({ row }) => row.original.labWork.details,
        },
        {
            accessorKey: 'labWork.technician',
            header: () => <MultiLineHeader title="Technician" subtitle="in Charge" />,
            cell: ({ row }) => row.original.labWork.technician,
        },
        {
            accessorKey: 'labWork.startDate',
            header: () => <MultiLineHeader title="Start Date" />,
            cell: ({ row }) => row.original.labWork.startDate,
        },
        {
            accessorKey: 'labWork.agreedDeliveryDate',
            header: () => <MultiLineHeader title="Agreed" subtitle="Delivery Date" />,
            cell: ({ row }) => row.original.labWork.agreedDeliveryDate,
        },
        {
            accessorKey: 'labWork.signatureAgreed',
            header: () => <MultiLineHeader title="Signature" />,
            cell: ({ row }) => row.original.labWork.signatureAgreed,
        },
        {
            accessorKey: 'labWork.actualDeliveryDate',
            header: () => <MultiLineHeader title="Actual" subtitle="Delivery date" />,
            cell: ({ row }) => row.original.labWork.actualDeliveryDate,
        },
        {
            accessorKey: 'labWork.signatureActual',
            header: () => <MultiLineHeader title="Signature" />,
            cell: ({ row }) => row.original.labWork.signatureActual,
        },
        {
            accessorKey: 'labWork.remarks',
            header: () => <MultiLineHeader title="Remark(s)" />,
            cell: ({ row }) => row.original.labWork.remarks,
        },
    ]
  },
  {
    id: "dispatch",
    header: () => <MultiLineHeader title="REPORT DISPATCH" subtitle="DETAILS" />,
    columns: [
        {
            accessorKey: 'dispatch.acknowledgement',
            header: () => <MultiLineHeader title="Acknowledgement" subtitle="after Delivery" />,
            cell: ({ row }) => row.original.dispatch.acknowledgement,
        },
        {
            accessorKey: 'dispatch.issuedBy',
            header: () => <MultiLineHeader title="Report" subtitle="issued By" />,
            cell: ({ row }) => row.original.dispatch.issuedBy,
        },
        {
            accessorKey: 'dispatch.deliveredTo',
            header: () => <MultiLineHeader title="Report Picked/" subtitle="Delivered to" />,
            cell: ({ row }) => row.original.dispatch.deliveredTo,
        },
        {
            accessorKey: 'dispatch.contact',
            header: () => <MultiLineHeader title="Contact" />,
            cell: ({ row }) => row.original.dispatch.contact,
        },
        {
            accessorKey: 'dispatch.dateTime',
            header: () => <MultiLineHeader title="Date and Time" />,
            cell: ({ row }) => row.original.dispatch.dateTime,
        },
    ]
  },
]
