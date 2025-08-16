
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ReceiveSampleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = ['Client Info', 'Sample Details', 'Tests', 'Review & Save'];

export function ReceiveSampleDialog({
  open,
  onOpenChange,
}: ReceiveSampleDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setCurrentStep(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New Sample</DialogTitle>
          <DialogDescription>
            Follow the steps to register a new sample in the system.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>

        <div className="min-h-[300px] p-4 border rounded-md">
          {/* Content for each step will go here */}
          <p>Content for {steps[currentStep]}</p>
        </div>

        <DialogFooter className="pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button>Save Sample</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
