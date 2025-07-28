
"use client"

import { Project } from "@/types/project"
import { ColumnDef } from "@tanstack/react-table"

const CenteredHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div className="font-normal">{subtitle}</div>}
  </div>
);

export const getColumns = (): ColumnDef<Project>[] => [
  {
    accessorKey: "date",
    header: () => <CenteredHeader title="DATE" />,
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
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
    accessorKey: "client",
    header: () => <CenteredHeader title="CLIENT" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("client")}</div>,
  },
  {
    accessorKey: "project",
    header: () => <CenteredHeader title="PROJECT" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("project")}</div>,
  },
  {
    accessorKey: "engineerInCharge",
    header: () => <CenteredHeader title="ENGINEER" subtitle="IN CHARGE" />,
    cell: ({ row }) => <div>{row.getValue("engineerInCharge")}</div>,
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
            cell: ({ row }) => <div>{row.original.fieldWork.technician}</div>,
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
            cell: ({ row }) => <div>{row.original.fieldWork.remarks}</div>,
        },
    ]
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
            cell: ({ row }) => <div>{row.original.labWork.technician}</div>,
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
            cell: ({ row }) => <div>{row.original.labWork.remarks}</div>,
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
            cell: ({ row }) => <div>{row.original.dispatch.issuedBy}</div>,
        },
        {
            accessorKey: 'dispatch.deliveredTo',
            header: () => <CenteredHeader title="Report Picked/" subtitle="Delivered to" />,
            cell: ({ row }) => <div>{row.original.dispatch.deliveredTo}</div>,
        },
        {
            accessorKey: 'dispatch.contact',
            header: () => <CenteredHeader title="Contact" />,
            cell: ({ row }) => <div>{row.original.dispatch.contact}</div>,
        },
        {
            accessorKey: 'dispatch.dateTime',
            header: () => <CenteredHeader title="Date and Time" />,
            cell: ({ row }) => <div className="text-center">{row.original.dispatch.dateTime}</div>,
        },
    ]
  },
]
