"use client";

import { useEffect, useState } from "react";
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
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleNext = () => setCurrentStep(prev => prev < 2 ? prev + 1 : prev);
  const handleBack = () => setCurrentStep(prev => prev > 1 ? prev - 1 : prev);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Paver Test (Step {currentStep} of 2)</DialogTitle>
          <DialogDescription>
            Update the test details for Sample ID: {item.sampleId}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form id="edit-paver-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold text-lg mb-2">Sample Information</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div><Label>Client:</Label><p>{item.client}</p></div>
                    <div><Label>Project:</Label><p>{item.project}</p></div>
                    <div><Label>Sample ID:</Label><p className="font-mono">{item.sampleId}</p></div>
                    <div><Label>Date Received:</Label><p>{item.dateReceived}</p></div>
                    <div><Label>Casting Date:</Label><p>{item.castingDate}</p></div>
                    <div><Label>Testing Date:</Label><p>{item.testingDate}</p></div>
                 </div>
            </div>

            {currentStep === 1 && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Test Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Length (mm)</Label><Input type="number" step="any" {...form.register("dimensions.length")} /></div>
                  <div className="space-y-2"><Label>Width (mm)</Label><Input type="number" step="any" {...form.register("dimensions.width")} /></div>
                  <div className="space-y-2"><Label>Height (mm)</Label><Input type="number" step="any" {...form.register("dimensions.height")} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" step="any" {...form.register("weightKg")} /></div>
                  <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" step="any" {...form.register("loadKN")} /></div>
                  <div className="space-y-2"><Label>Calculated Area (mm²)</Label><Input type="number" step="any" {...form.register("calculatedArea")} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register("areaOfUse")} /></div>
                  <div className="space-y-2"><Label>Paver Type</Label><Input {...form.register("paverType")} /></div>
                  <div className="space-y-2"><Label>Pavers per m²</Label><Input type="number" {...form.register("paversPerSqMetre")} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register("machineUsed")} /></div>
                  <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register("modeOfFailure")} /></div>
                </div>
                <div className="space-y-2"><Label>Recorded Temp. (°C)</Label><Input {...form.register("recordedTemperature")} /></div>
                <div className="space-y-2"><Label>Comment</Label><Textarea {...form.register("comment")} /></div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Issuance Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Technician</Label><Input {...form.register("technician")} /></div>
                    <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register("certificateNumber")} /></div>
                    <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/></div>
                    <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register("issueIdSerialNo")} /></div>
                    <div className="space-y-2"><Label>Taken By</Label><Input {...form.register("takenBy")} /></div>
                    <div className="space-y-2"><Label>Date Taken</Label><Input {...form.register("date")} placeholder="YYYY-MM-DD" /></div>
                    <div className="space-y-2 md:col-span-2"><Label>Contact</Label><Input {...form.register("contact")} /></div>
                </div>
              </div>
            )}
          </form>
        </ScrollArea>
        <DialogFooter className="pt-4 justify-between">
           <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <div className="flex gap-2">
                {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                )}
                {currentStep < 2 ? (
                    <Button type="button" onClick={handleNext}>Next</Button>
                ) : (
                    <Button type="submit" form="edit-paver-form">Save Changes</Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
