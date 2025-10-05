
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
import { BaseRegisterEntry } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "@/app/samples/components/date-picker";
import { differenceInDays, isValid } from "date-fns";

type Entry = BaseRegisterEntry & { [key: string]: any };

interface EditEntryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  entry: Entry;
  onSubmit: (data: Partial<Entry>) => Promise<void>;
  entryType: 'concrete_cubes_register' | 'pavers_register' | 'cylinders_register' | 'bricks_blocks_register' | 'water_absorption_register';
}

export function EditEntryDialog({ isOpen, onClose, entry, onSubmit, entryType }: EditEntryDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Entry>>(entry);

  React.useEffect(() => {
    if (entry) {
        const parseDate = (date: any) => {
            if (!date) return undefined;
            if (date.toDate) return date.toDate();
            return new Date(date);
        }
      setFormData({
        ...entry,
        dateReceived: parseDate(entry.dateReceived),
        castingDate: parseDate(entry.castingDate),
        testingDate: parseDate(entry.testingDate),
      });
    }
  }, [entry]);

  const handleInputChange = (field: keyof Entry, value: any) => {
    setFormData(prev => {
        const newData = { ...prev, [field]: value };

        const castingDate = newData.castingDate ? new Date(newData.castingDate) : null;
        const testingDate = newData.testingDate ? new Date(newData.testingDate) : null;

        if (field === 'castingDate' || field === 'testingDate') {
            if (castingDate && isValid(castingDate) && testingDate && isValid(testingDate)) {
                const days = differenceInDays(testingDate, castingDate);
                if (!isNaN(days)) {
                    newData.age = days > 28 ? ">28" : days;
                } else {
                    newData.age = "";
                }
            }
        }
        return newData;
    });
  };
  
  const handleSampleIdChange = (index: number, value: string) => {
    const newSampleIds = [...(formData.sampleIds || [])];
    newSampleIds[index] = value;
    setFormData(prev => ({ ...prev, sampleIds: newSampleIds }));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Register Entry</DialogTitle>
          <DialogDescription>
            Modify the details for entry <strong>{entry.receiptId}</strong> (Set {entry.setId}).
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow pr-6 -mr-6">
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Received</Label>
                <DatePicker value={formData.dateReceived} onChange={date => handleInputChange('dateReceived', date)} />
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Input value={formData.client || ''} onChange={e => handleInputChange('client', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Input value={formData.project || ''} onChange={e => handleInputChange('project', e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Casting Date</Label>
                <DatePicker value={formData.castingDate} onChange={date => handleInputChange('castingDate', date)} />
              </div>
              <div className="space-y-2">
                <Label>Testing Date</Label>
                <DatePicker value={formData.testingDate} onChange={date => handleInputChange('testingDate', date)} />
              </div>
               <div className="space-y-2">
                <Label>Age (Days)</Label>
                <Input value={formData.age?.toString() || ''} onChange={e => handleInputChange('age', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
                <Label>Area of Use</Label>
                <Input value={formData.areaOfUse || ''} onChange={e => handleInputChange('areaOfUse', e.target.value)} />
            </div>

            {(entryType === "concrete_cubes_register" || entryType === "cylinders_register") && (
                <div className="space-y-2">
                    <Label>Class</Label>
                    <Input value={formData.class || ''} onChange={e => handleInputChange('class', e.target.value)} />
                </div>
            )}
             {entryType === "pavers_register" && (
                <div className="space-y-2">
                    <Label>Paver Type</Label>
                    <Input value={formData.paverType || ''} onChange={e => handleInputChange('paverType', e.target.value)} />
                </div>
            )}
             {(entryType === "bricks_blocks_register" || entryType === "water_absorption_register") && (
                <div className="space-y-2">
                    <Label>Sample Type</Label>
                    <Input value={formData.sampleType || ''} onChange={e => handleInputChange('sampleType', e.target.value)} />
                </div>
            )}

            <div className="space-y-2">
              <Label>Sample IDs</Label>
              <div className="grid grid-cols-3 gap-2">
                {formData.sampleIds?.map((id, index) => (
                  <Input key={index} value={id} onChange={e => handleSampleIdChange(index, e.target.value)} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
                <Label>Machine Used</Label>
                <Input value={formData.machineUsed || ''} onChange={e => handleInputChange('machineUsed', e.target.value)} />
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleFormSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
