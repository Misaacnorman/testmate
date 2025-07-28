
"use client"

import { BlockAndBrick } from "@/types/block-and-brick";
import { ColumnDef } from "@tanstack/react-table"

const CenteredHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div className="font-normal">{subtitle}</div>}
  </div>
);

export const getColumns = (): ColumnDef<BlockAndBrick>[] => [
  {
    accessorKey: "dateReceived",
    header: () => <CenteredHeader title="Date" subtitle="Received" />,
    cell: ({ row }) => <div>{row.getValue("dateReceived")}</div>,
  },
   {
    accessorKey: "client",
    header: () => <CenteredHeader title="Client" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("client")}</div>,
  },
  {
    accessorKey: "project",
    header: () => <CenteredHeader title="Project" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("project")}</div>,
  },
  {
    accessorKey: "castingDate",
    header: () => <CenteredHeader title="Casting" subtitle="Date" />,
    cell: ({ row }) => <div>{row.getValue("castingDate")}</div>,
  },
  {
    accessorKey: "testingDate",
    header: () => <CenteredHeader title="Testing" subtitle="Date" />,
    cell: ({ row }) => <div>{row.getValue("testingDate")}</div>,
  },
  {
    accessorKey: "ageDays",
    header: () => <CenteredHeader title="Age" subtitle="(Days)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("ageDays")}</div>,
  },
  {
    accessorKey: "areaOfUse",
    header: () => <CenteredHeader title="Area of Use" />,
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue("areaOfUse")}</div>,
  },
  {
    accessorKey: "sampleId",
    header: () => <CenteredHeader title="Sample ID" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("sampleId")}</div>,
  },
  {
    accessorKey: "sampleType",
    header: () => <CenteredHeader title="Sample Type" />,
    cell: ({ row }) => <div>{row.getValue("sampleType")}</div>,
  },
  {
    id: "dimensions",
    header: () => <CenteredHeader title="Dimensions (mm)" />,
    columns: [
      {
        accessorKey: "dimensions.length",
        header: () => <CenteredHeader title="Length" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.length}</div>,
      },
      {
        accessorKey: "dimensions.width",
        header: () => <CenteredHeader title="Width" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.width}</div>,
      },
      {
        accessorKey: "dimensions.height",
        header: () => <CenteredHeader title="Height" />,
        cell: ({ row }) => <div className="text-center">{row.original.dimensions.height}</div>,
      },
    ],
  },
  {
    id: "dimensionsOfHoles",
    header: () => <CenteredHeader title="Dimensions of Holes & No." subtitle="for Hollow Blocks" />,
    columns: [
        {
            id: 'holeA',
            header: () => <CenteredHeader title="Hole a" />,
            columns: [
                { accessorKey: 'dimensionsOfHoles.holeA.no', header: () => <CenteredHeader title="No." />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.holeA.no}</div> },
                { accessorKey: 'dimensionsOfHoles.holeA.l', header: () => <CenteredHeader title="L" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.holeA.l}</div> },
                { accessorKey: 'dimensionsOfHoles.holeA.w', header: () => <CenteredHeader title="W" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.holeA.w}</div> },
            ]
        },
        {
            id: 'holeB',
            header: () => <CenteredHeader title="Hole b" />,
            columns: [
                { accessorKey: 'dimensionsOfHoles.holeB.no', header: () => <CenteredHeader title="No." />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.holeB.no}</div> },
                { accessorKey: 'dimensionsOfHoles.holeB.l', header: () => <CenteredHeader title="L" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.holeB.l}</div> },
                { accessorKey: 'dimensionsOfHoles.holeB.w', header: () => <CenteredHeader title="W" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.holeB.w}</div> },
            ]
        },
        {
            id: 'notch',
            header: () => <CenteredHeader title="Notch" />,
            columns: [
                { accessorKey: 'dimensionsOfHoles.notch.no', header: () => <CenteredHeader title="No." />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.notch.no}</div> },
                { accessorKey: 'dimensionsOfHoles.notch.l', header: () => <CenteredHeader title="L" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.notch.l}</div> },
                { accessorKey: 'dimensionsOfHoles.notch.w', header: () => <CenteredHeader title="W" subtitle="(mm)" />, cell: ({row}) => <div className="text-center">{row.original.dimensionsOfHoles.notch.w}</div> },
            ]
        }
    ]
  },
  {
    accessorKey: "weightKg",
    header: () => <CenteredHeader title="Weight" subtitle="(kg)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("weightKg")}</div>,
  },
  {
    accessorKey: "machineUsed",
    header: () => <CenteredHeader title="Machine Used" />,
    cell: ({ row }) => <div>{row.getValue("machineUsed")}</div>,
  },
  {
    accessorKey: "loadKN",
    header: () => <CenteredHeader title="Load" subtitle="(kN)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("loadKN")}</div>,
  },
  {
    accessorKey: "modeOfFailure",
    header: () => <CenteredHeader title="Mode of Failure" />,
    cell: ({ row }) => <div>{row.getValue("modeOfFailure")}</div>,
  },
  {
    accessorKey: "recordedTemperature",
    header: () => <CenteredHeader title="Recorded Temperature" subtitle="at the Facility (°C)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("recordedTemperature")}</div>,
  },
  {
    accessorKey: "certificateNumber",
    header: () => <CenteredHeader title="Certificate Number" />,
    cell: ({ row }) => <div>{row.getValue("certificateNumber")}</div>,
  },
  {
    accessorKey: "comment",
    header: () => <CenteredHeader title="Comment" />,
    cell: ({ row }) => <div>{row.getValue("comment")}</div>,
  },
  {
    accessorKey: "technician",
    header: () => <CenteredHeader title="Technician" />,
    cell: ({ row }) => <div>{row.getValue("technician")}</div>,
  },
  {
    accessorKey: "dateOfIssue",
    header: () => <CenteredHeader title="Date of Issue" />,
    cell: ({ row }) => <div>{row.getValue("dateOfIssue")}</div>,
  },
  {
    accessorKey: "issueIdSerialNo",
    header: () => <CenteredHeader title="Issue ID/ Serial No." />,
    cell: ({ row }) => <div>{row.getValue("issueIdSerialNo")}</div>,
  },
  {
    accessorKey: "takenBy",
    header: () => <CenteredHeader title="Taken by" />,
    cell: ({ row }) => <div>{row.getValue("takenBy")}</div>,
  },
  {
    accessorKey: "date",
    header: () => <CenteredHeader title="Date" />,
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "contact",
    header: () => <CenteredHeader title="Contact" />,
    cell: ({ row }) => <div>{row.getValue("contact")}</div>,
  },
  {
    accessorKey: "sampleReceiptNo",
    header: () => <CenteredHeader title="Sample Receipt No" />,
    cell: ({ row }) => <div>{row.getValue("sampleReceiptNo")}</div>,
  },
];
