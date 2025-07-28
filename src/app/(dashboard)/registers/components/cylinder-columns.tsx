
"use client"

import { Cylinder } from "@/types/cylinder";
import { ColumnDef } from "@tanstack/react-table"

const MultiLineHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div>{subtitle}</div>}
  </div>
);

export const getColumns = (): ColumnDef<Cylinder>[] => [
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
    accessorKey: "class",
    header: () => <MultiLineHeader title="Class" />,
    cell: ({ row }) => <div>{row.getValue("class")}</div>,
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
    id: "dimensions",
    header: () => <MultiLineHeader title="Dimensions (mm)" />,
    columns: [
      {
        accessorKey: "dimensions.diameter",
        header: () => <MultiLineHeader title="Diameter" />,
        cell: ({ row }) => row.original.dimensions.diameter,
      },
      {
        accessorKey: "dimensions.height",
        header: () => <MultiLineHeader title="Height" />,
        cell: ({ row }) => row.original.dimensions.height,
      },
    ],
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
    header: () => <MultiLineHeader title="Technician" subtitle="(Name & Signature)" />,
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
