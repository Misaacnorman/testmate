
"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const placeholderRows = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  date: '',
  bigProject: '',
  smallProject: '',
  client: '',
  project: '',
  engineer: '',
  fieldTests: '',
  fieldTech: '',
  fieldStart: '',
  fieldEnd: '',
  fieldRemarks: '',
  labTests: '',
  labTech: '',
  labStart: '',
  labDelivery: '',
  signature: '',
}));

export function ProjectsTable() {
    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <Table className="border-collapse border border-gray-400">
                <TableHeader>
                    <TableRow className="bg-gray-200">
                        <TableHead rowSpan={2} className="border border-gray-400 text-center font-bold text-black align-middle">DATE</TableHead>
                        <TableHead colSpan={2} className="border border-gray-400 text-center font-bold text-black">PROJECT ID NUMBER</TableHead>
                        <TableHead rowSpan={2} className="border border-gray-400 text-center font-bold text-black align-middle">CLIENT</TableHead>
                        <TableHead rowSpan={2} className="border border-gray-400 text-center font-bold text-black align-middle">PROJECT</TableHead>
                        <TableHead rowSpan={2} className="border border-gray-400 text-center font-bold text-black align-middle">ENGINEER IN CHARGE</TableHead>
                        <TableHead colSpan={5} className="border border-gray-400 text-center font-bold text-black">FIELD WORK INSTRUCTIONS</TableHead>
                        <TableHead colSpan={5} className="border border-gray-400 text-center font-bold text-black">SCOPE OF WORK (LABORATORY TESTS)</TableHead>
                    </TableRow>
                    <TableRow className="bg-gray-200">
                        <TableHead className="border border-gray-400 text-center font-bold text-black">BIG PROJECTS</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">SMALL PROJECTS & SAMPLES</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Field Tests in Detail including number of tests</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Technician in Charge</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Start Date</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">End Date</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Remark(s)</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Laboratory Test Description and number of tests</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Technician in Charge</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Start Date</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Agreed Delivery Date</TableHead>
                        <TableHead className="border border-gray-400 text-center font-bold text-black">Signature</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {placeholderRows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                            <TableCell className="border border-gray-400 p-0 h-10"></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
