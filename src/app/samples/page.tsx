
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import { ReceiveSampleDialog } from "./components/receive-sample-dialog";

export default function SamplesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Register Sample
        </h1>
        <p className="text-lg text-muted-foreground">
          Start the sample registration process by clicking the button below.
        </p>
      </div>
      <Button
        size="lg"
        className="h-20 px-10 text-xl font-semibold shadow-lg rounded-xl"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="mr-3 h-6 w-6" />
        Receive Sample
      </Button>
      <ReceiveSampleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
