
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { CorrectionFactorMachine } from "@/lib/types";

interface MachineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (machine: Partial<CorrectionFactorMachine>) => Promise<void>;
  machine: Partial<CorrectionFactorMachine> | null;
}

export function MachineDialog({ isOpen, onClose, onSubmit, machine }: MachineDialogProps) {
  const [formData, setFormData] = React.useState<Partial<CorrectionFactorMachine>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(machine || {});
    }
  }, [machine, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const isNumeric = ['factorM', 'factorC'].includes(id);
    setFormData(prev => ({ ...prev, [id]: isNumeric ? Number(value) : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{machine?.id ? "Edit Machine" : "Add New Machine"}</DialogTitle>
          <DialogDescription>
            Enter the details for the compressive strength machine and its correction factors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Machine Name</Label>
                    <Input id="name" value={formData.name || ''} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tagId">Machine Tag ID</Label>
                    <Input id="tagId" value={formData.tagId || ''} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                    <Label>Correction Factor (y = mx + c)</Label>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="factorM" className="text-sm text-muted-foreground">Factor 'm'</Label>
                            <Input id="factorM" type="number" step="any" value={formData.factorM ?? ''} onChange={handleInputChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="factorC" className="text-sm text-muted-foreground">Factor 'c'</Label>
                            <Input id="factorC" type="number" step="any" value={formData.factorC ?? ''} onChange={handleInputChange} required />
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {machine?.id ? "Save Changes" : "Add Machine"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
