
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
import { BlockAndBrick } from "@/types/block-and-brick";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const itemSchema = z.object({
  dateReceived: z.string(),
  client: z.string(),
  project: z.string(),
  castingDate: z.string(),
  testingDate: z.string(),
  ageDays: z.coerce.number(),
  areaOfUse: z.string().optional(),
  sampleId: z.string(),
  sampleType: z.string(),
  dimensions: z.object({
    length: z.coerce.number(),
    width: z.coerce.number(),
    height: z.coerce.number(),
  }),
  dimensionsOfHoles: z.object({
    holeA: z.object({ no: z.coerce.number(), l: z.coerce.number(), w: z.coerce.number() }),
    holeB: z.object({ no: z.coerce.number(), l: z.coerce.number(), w: z.coerce.number() }),
    notch: z.object({ no: z.coerce.number(), l: z.coerce.number(), w: z.coerce.number() }),
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

type EditBlockAndBrickDialogProps = {
  item: BlockAndBrick;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: (item: BlockAndBrick) => void;
};

export function EditBlockAndBrickDialog({ item, onOpenChange, onItemUpdated }: EditBlockAndBrickDialogProps) {
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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Brick/Block Test</DialogTitle>
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
                <div><Label>Sample Type:</Label><p>{item.sampleType}</p></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Length (mm)</Label><Input {...form.register("dimensions.length")} /></div>
                <div className="space-y-2"><Label>Width (mm)</Label><Input {...form.register("dimensions.width")} /></div>
                <div className="space-y-2"><Label>Height (mm)</Label><Input {...form.register("dimensions.height")} /></div>
              </div>

              <Separator />
              <Label className="font-semibold">Dimensions of Holes &amp; No. (for Hollow Blocks)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 p-2 border rounded-md">
                 <Label className="md:col-span-3 font-medium">Hole A</Label>
                 <div className="space-y-2"><Label>No.</Label><Input {...form.register("dimensionsOfHoles.holeA.no")} /></div>
                 <div className="space-y-2"><Label>L (mm)</Label><Input {...form.register("dimensionsOfHoles.holeA.l")} /></div>
                 <div className="space-y-2"><Label>W (mm)</Label><Input {...form.register("dimensionsOfHoles.holeA.w")} /></div>
                 
                 <Label className="md:col-span-3 font-medium">Hole B</Label>
                 <div className="space-y-2"><Label>No.</Label><Input {...form.register("dimensionsOfHoles.holeB.no")} /></div>
                 <div className="space-y-2"><Label>L (mm)</Label><Input {...form.register("dimensionsOfHoles.holeB.l")} /></div>
                 <div className="space-y-2"><Label>W (mm)</Label><Input {...form.register("dimensionsOfHoles.holeB.w")} /></div>

                 <Label className="md:col-span-3 font-medium">Notch</Label>
                 <div className="space-y-2"><Label>No.</Label><Input {...form.register("dimensionsOfHoles.notch.no")} /></div>
                 <div className="space-y-2"><Label>L (mm)</Label><Input {...form.register("dimensionsOfHoles.notch.l")} /></div>
                 <div className="space-y-2"><Label>W (mm)</Label><Input {...form.register("dimensionsOfHoles.notch.w")} /></div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" {...form.register("weightKg")} /></div>
                 <div className="space-y-2"><Label>Load (kN)</Label><Input type="number" {...form.register("loadKN")} /></div>
                 <div className="space-y-2"><Label>Age (Days)</Label><Input type="number" {...form.register("ageDays")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Area of Use</Label><Input {...form.register("areaOfUse")} /></div>
                 <div className="space-y-2"><Label>Machine Used</Label><Input {...form.register("machineUsed")} /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Mode of Failure</Label><Input {...form.register("modeOfFailure")} /></div>
                 <div className="space-y-2"><Label>Recorded Temperature (°C)</Label><Input {...form.register("recordedTemperature")} /></div>
              </div>
              <div className="space-y-2"><Label>Comment</Label><Input {...form.register("comment")} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Technician</Label><Input {...form.register("technician")} /></div>
                 <div className="space-y-2"><Label>Date of Issue</Label><Input {...form.register("dateOfIssue")} placeholder="YYYY-MM-DD"/></div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2"><Label>Certificate Number</Label><Input {...form.register("certificateNumber")} /></div>
                 <div className="space-y-2"><Label>Issue ID/Serial No.</Label><Input {...form.register("issueIdSerialNo")} /></div>
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
