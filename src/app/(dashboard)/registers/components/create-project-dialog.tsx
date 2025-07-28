
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Project } from "@/types/project";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addProject } from "@/services/projects";


const projectSchema = z.object({
  date: z.string().min(1, "Date is required"),
  projectId: z.object({
    big: z.string().optional(),
    small: z.string().optional(),
  }),
  client: z.string().min(1, "Client is required"),
  project: z.string().min(1, "Project is required"),
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

type CreateProjectDialogProps = {
  onProjectCreated: () => void;
};

export function CreateProjectDialog({ onProjectCreated }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      projectId: { big: '', small: '' },
      client: '',
      project: '',
      engineerInCharge: '',
      fieldWork: { details: '', technician: '', startDate: '', endDate: '', remarks: '' },
      labWork: { details: '', technician: '', startDate: '', agreedDeliveryDate: '', signatureAgreed: '', actualDeliveryDate: '', signatureActual: '', remarks: ''},
      dispatch: { acknowledgement: '', issuedBy: '', deliveredTo: '', contact: '', dateTime: '' }
    },
  });

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    try {
        await addProject(values);
        toast({
            title: "Project Created",
            description: "The new project has been successfully added to the register.",
        });
        onProjectCreated();
        setOpen(false);
        form.reset();
    } catch (error) {
        console.error("Failed to create project:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not create the project. Please try again.",
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details for the new project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-2">Project Identifiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Date</Label><Input {...form.register("date")} /></div>
                    <div className="space-y-2"><Label>Client</Label><Input {...form.register("client")} /></div>
                    <div className="space-y-2"><Label>Project Title</Label><Input {...form.register("project")} /></div>
                    <div className="space-y-2"><Label>Engineer in Charge</Label><Input {...form.register("engineerInCharge")} /></div>
                    <div className="space-y-2"><Label>Project ID (Big)</Label><Input {...form.register("projectId.big")} /></div>
                    <div className="space-y-2"><Label>Project ID (Small)</Label><Input {...form.register("projectId.small")} /></div>
                </div>
            </div>

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
            
            <DialogFooter className="pt-4">
              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Project"}</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
