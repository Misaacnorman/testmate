
"use client"

import { BlockAndBrick } from "@/types/block-and-brick";
import { ColumnDef } from "@tanstack/react-table"

const MultiLineHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div>{subtitle}</div>}
  </div>
);

export const getColumns = (): ColumnDef<BlockAndBrick>[] => [
  {
    accessorKey: "dateReceived",
    header: () => <MultiLineHeader title="Date" subtitle="Received" />,
    cell: ({ row }) => <div>{row.getValue("dateReceived")}</div>,
  },
   {
    accessorKey: "client",
    header: () => <MultiLineHeader title="Client" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("client")}</div>,
  },
  {
    accessorKey: "project",
    header: () => <MultiLineHeader title="Project" />,
    cell: ({ row }) => <div className="min-w-[200px]">{row.getValue("project")}</div>,
  },
  {
    accessorKey: "castingDate",
    header: () => <MultiLineHeader title="Casting" subtitle="Date" />,
    cell: ({ row }) => <div>{row.getValue("castingDate")}</div>,
  },
  {
    accessorKey: "testingDate",
    header: () => <MultiLineHeader title="Testing" subtitle="Date" />,
    cell: ({ row }) => <div>{row.getValue("testingDate")}</div>,
  },
  {
    accessorKey: "ageDays",
    header: () => <MultiLineHeader title="Age" subtitle="(Days)" />,
    cell: ({ row }) => <div>{row.getValue("ageDays")}</div>,
  },
  {
    accessorKey: "areaOfUse",
    header: () => <MultiLineHeader title="Area of Use" />,
    cell: ({ row }) => <div className="min-w-[150px]">{row.getValue("areaOfUse")}</div>,
  },
  {
    accessorKey: "sampleId",
    header: () => <MultiLineHeader title="Sample ID" />,
    cell: ({ row }) => <div>{row.getValue("sampleId")}</div>,
  },
  {
    accessorKey: "sampleType",
    header: () => <MultiLineHeader title="Sample Type" />,
    cell: ({ row }) => <div>{row.getValue("sampleType")}</div>,
  },
  {
    id: "dimensions",
    header: () => <MultiLineHeader title="Dimensions (mm)" />,
    columns: [
      {
        accessorKey: "dimensions.length",
        header: () => <MultiLineHeader title="Length" />,
        cell: ({ row }) => row.original.dimensions.length,
      },
      {
        accessorKey: "dimensions.width",
        header: () => <MultiLineHeader title="Width" />,
        cell: ({ row }) => row.original.dimensions.width,
      },
      {
        accessorKey: "dimensions.height",
        header: () => <MultiLineHeader title="Height" />,
        cell: ({ row }) => row.original.dimensions.height,
      },
    ],
  },
  {
    id: "dimensionsOfHoles",
    header: () => <MultiLineHeader title="Dimensions of Holes &amp; No. for Hollow Blocks" />,
    columns: [
        {
            id: 'holeA',
            header: () => <MultiLineHeader title="Hole a" />,
            columns: [
                { accessorKey: 'dimensionsOfHoles.holeA.no', header: () => <MultiLineHeader title="No." />, cell: ({row}) => row.original.dimensionsOfHoles.holeA.no },
                { accessorKey: 'dimensionsOfHoles.holeA.l', header: () => <MultiLineHeader title="L" subtitle="(mm)" />, cell: ({row}) => row.original.dimensionsOfHoles.holeA.l },
                { accessorKey: 'dimensionsOfHoles.holeA.w', header: () => <MultiLineHeader title="W" subtitle="(mm)" />, cell: ({row}) => row.original.dimensionsOfHoles.holeA.w },
            ]
        },
        {
            id: 'holeB',
            header: () => <MultiLineHeader title="Hole b" />,
            columns: [
                { accessorKey: 'dimensionsOfHoles.holeB.no', header: () => <MultiLineHeader title="No." />, cell: ({row}) => row.original.dimensionsOfHoles.holeB.no },
                { accessorKey: 'dimensionsOfHoles.holeB.l', header: () => <MultiLineHeader title="L" subtitle="(mm)" />, cell: ({row}) => row.original.dimensionsOfHoles.holeB.l },
                { accessorKey: 'dimensionsOfHoles.holeB.w', header: () => <MultiLineHeader title="W" subtitle="(mm)" />, cell: ({row}) => row.original.dimensionsOfHoles.holeB.w },
            ]
        },
        {
            id: 'notch',
            header: () => <MultiLineHeader title="Notch" />,
            columns: [
                { accessorKey: 'dimensionsOfHoles.notch.no', header: () => <MultiLineHeader title="No." />, cell: ({row}) => row.original.dimensionsOfHoles.notch.no },
                { accessorKey: 'dimensionsOfHoles.notch.l', header: () => <MultiLineHeader title="L" subtitle="(mm)" />, cell: ({row}) => row.original.dimensionsOfHoles.notch.l },
                { accessorKey: 'dimensionsOfHoles.notch.w', header: () => <MultiLineHeader title="W" subtitle="(mm)" />, cell: ({row}) => row.original.dimensionsOfHoles.notch.w },
            ]
        }
    ]
  },
  {
    accessorKey: "weightKg",
    header: () => <MultiLineHeader title="Weight" subtitle="(kg)" />,
    cell: ({ row }) => <div>{row.getValue("weightKg")}</div>,
  },
  {
    accessorKey: "machineUsed",
    header: () => <MultiLineHeader title="Machine Used" />,
    cell: ({ row }) => <div>{row.getValue("machineUsed")}</div>,
  },
  {
    accessorKey: "loadKN",
    header: () => <MultiLineHeader title="Load" subtitle="(kN)" />,
    cell: ({ row }) => <div>{row.getValue("loadKN")}</div>,
  },
  {
    accessorKey: "modeOfFailure",
    header: () => <MultiLineHeader title="Mode of Failure" />,
    cell: ({ row }) => <div>{row.getValue("modeOfFailure")}</div>,
  },
  {
    accessorKey: "recordedTemperature",
    header: () => <MultiLineHeader title="Recorded Temperature at the Facility (°C)" />,
    cell: ({ row }) => <div>{row.getValue("recordedTemperature")}</div>,
  },
  {
    accessorKey: "certificateNumber",
    header: () => <MultiLineHeader title="Certificate Number" />,
    cell: ({ row }) => <div>{row.getValue("certificateNumber")}</div>,
  },
  {
    accessorKey: "comment",
    header: () => <MultiLineHeader title="Comment" />,
    cell: ({ row }) => <div>{row.getValue("comment")}</div>,
  },
  {
    accessorKey: "technician",
    header: () => <MultiLineHeader title="Technician" />,
    cell: ({ row }) => <div>{row.getValue("technician")}</div>,
  },
  {
    accessorKey: "dateOfIssue",
    header: () => <MultiLineHeader title="Date of Issue" />,
    cell: ({ row }) => <div>{row.getValue("dateOfIssue")}</div>,
  },
  {
    accessorKey: "issueIdSerialNo",
    header: () => <MultiLineHeader title="Issue ID/ Serial No." />,
    cell: ({ row }) => <div>{row.getValue("issueIdSerialNo")}</div>,
  },
  {
    accessorKey: "takenBy",
    header: () => <MultiLineHeader title="Taken by" />,
    cell: ({ row }) => <div>{row.getValue("takenBy")}</div>,
  },
  {
    accessorKey: "date",
    header: () => <MultiLineHeader title="Date" />,
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
  },
  {
    accessorKey: "contact",
    header: () => <MultiLineHeader title="Contact" />,
    cell: ({ row }) => <div>{row.getValue("contact")}</div>,
  },
  {
    accessorKey: "sampleReceiptNo",
    header: () => <MultiLineHeader title="Sample Receipt No" />,
    cell: ({ row }) => <div>{row.getValue("sampleReceiptNo")}</div>,
  },
];
