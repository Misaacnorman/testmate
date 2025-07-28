
"use client"

import { WaterAbsorption } from "@/types/water-absorption";
import { ColumnDef } from "@tanstack/react-table"

const CenteredHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center font-bold text-black whitespace-normal">
    <div>{title}</div>
    {subtitle && <div className="font-normal">{subtitle}</div>}
  </div>
);

export const getColumns = (): ColumnDef<WaterAbsorption>[] => [
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
    accessorKey: "ovenDriedWeightBeforeSoaking",
    header: () => <CenteredHeader title="Oven Dried Weight" subtitle="Before soaking (kg)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("ovenDriedWeightBeforeSoaking")}</div>,
  },
  {
    accessorKey: "weightAfterSoaking",
    header: () => <CenteredHeader title="Weight After" subtitle="soaking (kg)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("weightAfterSoaking")}</div>,
  },
  {
    accessorKey: "weightOfWater",
    header: () => <CenteredHeader title="Weight of Water" subtitle="(kg)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("weightOfWater")}</div>,
  },
  {
    accessorKey: "calculatedWaterAbsorption",
    header: () => <CenteredHeader title="Calculated Water" subtitle="Absorption (%)" />,
    cell: ({ row }) => <div className="text-center">{row.getValue("calculatedWaterAbsorption")}</div>,
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
    header: () => <CenteredHeader title="Technician" subtitle="(Name & Signature)" />,
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
