
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
import { Project } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const projectSchema = z.object({
  date: z.string(),
  projectId: z.object({
    big: z.string().optional(),
    small: z.string().optional(),
  }),
  client: z.string(),
  project: z.string(),
  engineerInCharge: z.string().optional(),
  fieldWork: z.object({
    details: z.string().optional(),
    technician: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    remarks: z.string().optional(),
  }),
  labWork: z.object({
    details: z.string().optional(),
    technician: z.string().optional(),
    startDate: z.string().optional(),
    agreedDeliveryDate: z.string().optional(),
    signatureAgreed: z.string().optional(),
    actualDeliveryDate: z.string().optional(),
    signatureActual: z.string().optional(),
    remarks: z.string().optional(),
  }),
  dispatch: z.object({
    acknowledgement: z.string().optional(),
    issuedBy: z.string().optional(),
    deliveredTo: z.string().optional(),
    contact: z.string().optional(),
    dateTime: z.string().optional(),
  }),
});

type EditProjectDialogProps = {
  project: Project;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated: (project: Project) => void;
};

export function EditProjectDialog({ project, onOpenChange, onProjectUpdated }: EditProjectDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: project,
  });

  useEffect(() => {
    form.reset(project);
  }, [project, form]);

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    onProjectUpdated({ id: project.id, ...values });
  };
  
  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Project (Step {currentStep} of 4)</DialogTitle>
          <DialogDescription>
            Update the details for project: {project.project}. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form id="edit-project-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
                 <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Project Identifiers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Client</Label><Input {...form.register("client")} readOnly /></div>
                        <div className="space-y-2"><Label>Project Title</Label><Input {...form.register("project")} readOnly /></div>
                        <div className="space-y-2"><Label>Project ID (Big)</Label><Input {...form.register("projectId.big")} /></div>
                        <div className="space-y-2"><Label>Project ID (Small)</Label><Input {...form.register("projectId.small")} /></div>
                        <div className="space-y-2"><Label>Engineer in Charge</Label><Input {...form.register("engineerInCharge")} /></div>
                    </div>
                </div>
            )}
            {currentStep === 2 && (
                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Laboratory Work</h4>
                    <div className="space-y-2"><Label>Test Description</Label><Textarea {...form.register("labWork.details")} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Technician</Label><Input {...form.register("labWork.technician")} /></div>
                        <div className="space-y-2"><Label>Start Date</Label><Input {...form.register("labWork.startDate")} placeholder="YYYY-MM-DD" /></div>
                        <div className="space-y-2"><Label>Agreed Delivery Date</Label><Input {...form.register("labWork.agreedDeliveryDate")} placeholder="YYYY-MM-DD" /></div>
                        <div className="space-y-2"><Label>Actual Delivery Date</Label><Input {...form.register("labWork.actualDeliveryDate")} placeholder="YYYY-MM-DD" /></div>
                        <div className="space-y-2"><Label>Signature (Agreed)</Label><Input {...form.register("labWork.signatureAgreed")} /></div>
                        <div className="space-y-2"><Label>Signature (Actual)</Label><Input {...form.register("labWork.signatureActual")} /></div>
                    </div>
                    <div className="space-y-2"><Label>Remarks</Label><Textarea {...form.register("labWork.remarks")} /></div>
                </div>
            )}
             {currentStep === 3 && (
                <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Field Work</h4>
                    <div className="space-y-2"><Label>Field Test Details</Label><Textarea {...form.register("fieldWork.details")} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Technician</Label><Input {...form.register("fieldWork.technician")} /></div>
                        <div className="space-y-2"><Label>Start Date</Label><Input {...form.register("fieldWork.startDate")} placeholder="YYYY-MM-DD" /></div>
                        <div className="space-y-2"><Label>End Date</Label><Input {...form.register("fieldWork.endDate")} placeholder="YYYY-MM-DD" /></div>
                    </div>
                    <div className="space-y-2"><Label>Remarks</Label><Textarea {...form.register("fieldWork.remarks")} /></div>
                </div>
             )}
             {currentStep === 4 && (
                 <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Report Dispatch</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Acknowledgement</Label><Input {...form.register("dispatch.acknowledgement")} /></div>
                        <div className="space-y-2"><Label>Report Issued By</Label><Input {...form.register("dispatch.issuedBy")} /></div>
                        <div className="space-y-2"><Label>Report Delivered To</Label><Input {...form.register("dispatch.deliveredTo")} /></div>
                        <div className="space-y-2"><Label>Contact</Label><Input {...form.register("dispatch.contact")} /></div>
                    </div>
                    <div className="space-y-2"><Label>Date and Time</Label><Input {...form.register("dispatch.dateTime")} placeholder="YYYY-MM-DD HH:MM" /></div>
                </div>
             )}
          </form>
        </ScrollArea>
        <DialogFooter className="pt-4 justify-between">
            <div>
                 <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            </div>
            <div className="flex gap-2">
                {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                )}
                {currentStep < 4 ? (
                    <Button type="button" onClick={handleNext}>Next</Button>
                ) : (
                    <Button type="submit" form="edit-project-form">Save Changes</Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

