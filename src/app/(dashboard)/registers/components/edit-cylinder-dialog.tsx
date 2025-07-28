
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
import { Cylinder } from "@/types/cylinder";
import { ScrollArea } from "@/components/ui/scroll-area";

const itemSchema = z.object({
  dateReceived: z.string(),
  client: z.string(),
  project: z.string(),
  castingDate: z.string(),
  testingDate: z.string(),
  class: z.string().optional(),
  ageDays: z.coerce.number(),
  areaOfUse: z.string().optional(),
  sampleId: z.string(),
  dimensions: z.object({
    diameter: z.coerce.number(),
    height: z.coerce.number(),
  }),
  weightKg: z.coerce.number(),
  machineUsed: z.string().optional(),
  loadKN: z.coerce.number(),
  modeOfFailure: z.string().optional(),
  recordedTemperature: z.string().optional(),
  certificateNumber: z.string().optional(),
  comment: z.string().optional(),
  technician: z.string(),
  dateOfIssue: z.string().optional(),
  issueIdSerialNo: z.string().optional(),
  takenBy: z.string(),
  date: z.string(),
  contact: z.string(),
  sampleReceiptNo: z.string(),
});

type EditCylinderDialogProps = {
  item: Cylinder;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: (item: Cylinder) => void;
};

export function EditCylinderDialog({ item, onOpenChange, onItemUpdated }: EditCylinderDialogProps) {
  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: { ...item },
  });

  useEffect(() => {
    form.reset({ ...item });
  }, [item, form]);

  const onSubmit = (values: z.infer<typeof itemSchema>) => {
    onItemUpdated({ id: item.id, ...values });
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Concrete Cylinder Test</DialogTitle>
          <DialogDescription>
            Update the test details for Sample ID: {item.sampleId}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold text-lg mb-2">Initial Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div><Label>Client:</Label><p>{item.client}</p></div>
                <div><Label>Project:</Label><p>{item.project}</p></div>
                <div><Label>Sample ID:</Label><p className="font-mono">{item.sampleId}</p></div>
              </div>
            </div>
            
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Diameter (mm)</Label><Input {...form.register("dimensions.diameter")} /></div>
                <div className="space-y-2"><Label>Height (mm)</Label><Input {...form.register("dimensions.height")} /></div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" {...form.register("weightKg")} /></div>
                 <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" {...form.register("loadKN")} /></div>
                  <div className="space-y-2"><Label>Age (Days)</Label><Input type="number" {...form.register("ageDays")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Class</Label><Input {...form.register("class")} /></div>
                 <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register("areaOfUse")} /></div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register("machineUsed")} /></div>
                 <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register("modeOfFailure")} /></div>
              </div>
              <div className="space-y-2"><Label>Comment</Label><Input {...form.register("comment")} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Technician</Label><Input {...form.register("technician")} /></div>
                 <div className="space-y-2"><Label>Recorded Temperature (°C)</Label><Input {...form.register("recordedTemperature")} /></div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/></div>
                 <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register("certificateNumber")} /></div>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
