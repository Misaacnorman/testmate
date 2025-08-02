
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
import { ConcreteCube } from "@/types/concrete-cube";
import { ScrollArea } from "@/components/ui/scroll-area";

const cubeSchema = z.object({
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
    length: z.coerce.number(),
    width: z.coerce.number(),
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
  sampleReceiptNumber: z.string(),
});

type EditConcreteCubeDialogProps = {
  item: ConcreteCube;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: (item: ConcreteCube) => void;
};

export function EditConcreteCubeDialog({ item, onOpenChange, onItemUpdated }: EditConcreteCubeDialogProps) {
  const form = useForm<z.infer<typeof cubeSchema>>({
    resolver: zodResolver(cubeSchema),
    defaultValues: {
      ...item,
      ageDays: item.ageDays || 0,
      dimensions: {
        length: item.dimensions?.length || 0,
        width: item.dimensions?.width || 0,
        height: item.dimensions?.height || 0,
      },
      weightKg: item.weightKg || 0,
      loadKN: item.loadKN || 0,
    },
  });

  useEffect(() => {
    form.reset({
       ...item,
      ageDays: item.ageDays || 0,
      dimensions: {
        length: item.dimensions?.length || 0,
        width: item.dimensions?.width || 0,
        height: item.dimensions?.height || 0,
      },
      weightKg: item.weightKg || 0,
      loadKN: item.loadKN || 0,
    });
  }, [item, form]);

  const onSubmit = (values: z.infer<typeof cubeSchema>) => {
    onItemUpdated({ ...item, ...values });
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Concrete Cube Test</DialogTitle>
          <DialogDescription>
            Update the test details for Sample ID: {item.sampleId}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form id="edit-cube-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Read-only section */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold text-lg mb-2">Initial Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div><Label>Client:</Label><p>{item.client}</p></div>
                <div><Label>Project:</Label><p>{item.project}</p></div>
                <div><Label>Sample ID:</Label><p className="font-mono">{item.sampleId}</p></div>
                <div><Label>Date Received:</Label><p>{item.dateReceived}</p></div>
                <div><Label>Casting Date:</Label><p>{item.castingDate}</p></div>
                <div><Label>Testing Date:</Label><p>{form.watch("testingDate")}</p></div>
              </div>
            </div>
            
            {/* Editable section */}
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions.length">Length (mm)</Label>
                  <Input id="dimensions.length" {...form.register("dimensions.length")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions.width">Width (mm)</Label>
                  <Input id="dimensions.width" {...form.register("dimensions.width")} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="dimensions.height">Height (mm)</Label>
                  <Input id="dimensions.height" {...form.register("dimensions.height")} />
                </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="weightKg">Weight (kg)</Label>
                    <Input id="weightKg" type="number" {...form.register("weightKg")} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="loadKN">Load (kN)</Label>
                    <Input id="loadKN" type="number" {...form.register("loadKN")} />
                 </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageDays">Age (Days)</Label>
                    <Input id="ageDays" type="number" {...form.register("ageDays")} />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Input id="class" {...form.register("class")} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="areaOfUse">Area of Use</Label>
                    <Input id="areaOfUse" {...form.register("areaOfUse")} />
                 </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="machineUsed">Machine Used</Label>
                    <Input id="machineUsed" {...form.register("machineUsed")} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="modeOfFailure">Mode of Failure</Label>
                    <Input id="modeOfFailure" {...form.register("modeOfFailure")} />
                 </div>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="comment">Comment</Label>
                  <Input id="comment" {...form.register("comment")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="technician">Technician</Label>
                    <Input id="technician" {...form.register("technician")} />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="recordedTemperature">Recorded Temperature (°C)</Label>
                    <Input id="recordedTemperature" {...form.register("recordedTemperature")} />
                 </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="dateOfIssue">Date of Issue</Label>
                    <Input id="dateOfIssue" {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="certificateNumber">Certificate Number</Label>
                    <Input id="certificateNumber" {...form.register("certificateNumber")} />
                 </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" form="edit-cube-form">Save Changes</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
