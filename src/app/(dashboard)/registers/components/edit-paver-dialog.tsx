"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paver } from "@/types/paver";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const itemSchema = z.object({
  dateReceived: z.string().optional(),
  client: z.string().optional(),
  project: z.string().optional(),
  castingDate: z.string().optional(),
  testingDate: z.string().optional(),
  ageDays: z.coerce.number().optional(),
  areaOfUse: z.string().optional(),
  sampleId: z.string().optional(),
  paverType: z.string().optional(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }),
  paversPerSqMetre: z.coerce.number().optional(),
  calculatedArea: z.coerce.number().optional(),
  weightKg: z.coerce.number().optional(),
  machineUsed: z.string().optional(),
  loadKN: z.coerce.number().optional(),
  modeOfFailure: z.string().optional(),
  recordedTemperature: z.string().optional(),
  certificateNumber: z.string().optional(),
  comment: z.string().optional(),
  technician: z.string().optional(),
  dateOfIssue: z.string().optional(),
  issueIdSerialNo: z.string().optional(),
  takenBy: z.string().optional(),
  date: z.string().optional(),
  contact: z.string().optional(),
  sampleReceiptNo: z.string().optional(),
});

type EditPaverDialogProps = {
  item: Paver;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: (item: Paver) => void;
};

export function EditPaverDialog({ item, onOpenChange, onItemUpdated }: EditPaverDialogProps) {
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { ...item },
  });

  useEffect(() => {
    form.reset({ ...item });
  }, [item, form]);

  const onSubmit = (values: z.infer<typeof itemSchema>) => {
    onItemUpdated({ id: item.id, ...values } as Paver);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Paver Test</DialogTitle>
          <DialogDescription>
            Update the test details for Sample ID: {item.sampleId}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form id="edit-paver-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Primary Information</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Client</Label><Input {...form.register("client")} /></div>
                    <div className="space-y-2"><Label>Project</Label><Input {...form.register("project")} /></div>
                    <div className="space-y-2"><Label>Sample ID</Label><Input {...form.register("sampleId")} /></div>
                    <div className="space-y-2"><Label>Sample Receipt No.</Label><Input {...form.register("sampleReceiptNo")} /></div>
                    <div className="space-y-2"><Label>Date Received</Label><Input {...form.register("dateReceived")} placeholder="YYYY-MM-DD" /></div>
                 </div>
            </div>

             <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Testing Details</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Casting Date</Label><Input {...form.register("castingDate")} placeholder="YYYY-MM-DD" /></div>
                    <div className="space-y-2"><Label>Testing Date</Label><Input {...form.register("testingDate")} placeholder="YYYY-MM-DD" /></div>
                    <div className="space-y-2"><Label>Age (Days)</Label><Input type="number" {...form.register("ageDays")} /></div>
                    <div className="space-y-2"><Label>Length (mm)</Label><Input type="number" {...form.register("dimensions.length")} /></div>
                    <div className="space-y-2"><Label>Width (mm)</Label><Input type="number" {...form.register("dimensions.width")} /></div>
                    <div className="space-y-2"><Label>Height (mm)</Label><Input type="number" {...form.register("dimensions.height")} /></div>
                     <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" {...form.register("weightKg")} /></div>
                    <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" {...form.register("loadKN")} /></div>
                     <div className="space-y-2"><Label>Paver Type</Label><Input {...form.register("paverType")} /></div>
                    <div className="space-y-2"><Label>Pavers per m²</Label><Input type="number" {...form.register("paversPerSqMetre")} /></div>
                    <div className="space-y-2"><Label>Calculated Area (mm²)</Label><Input type="number" {...form.register("calculatedArea")} /></div>
                    <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register("areaOfUse")} /></div>
                    <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register("machineUsed")} /></div>
                    <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register("modeOfFailure")} /></div>
                    <div className="space-y-2"><Label>Recorded Temp. (°C)</Label><Input {...form.register("recordedTemperature")} /></div>
                 </div>
                 <div className="space-y-2"><Label>Comment</Label><Textarea {...form.register("comment")} /></div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Issuance Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Technician</Label><Input {...form.register("technician")} /></div>
                    <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register("certificateNumber")} /></div>
                    <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/></div>
                    <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register("issueIdSerialNo")} /></div>
                    <div className="space-y-2"><Label>Taken By</Label><Input {...form.register("takenBy")} /></div>
                    <div className="space-y-2"><Label>Date Taken</Label><Input {...form.register("date")} placeholder="YYYY-MM-DD" /></div>
                    <div className="space-y-2"><Label>Contact</Label><Input {...form.register("contact")} /></div>
                </div>
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" form="edit-paver-form">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
