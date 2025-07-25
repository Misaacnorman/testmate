"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ReceiveSampleDialog } from "./components/receive-sample-dialog";
import { useState } from "react";
import { SampleReceipt } from "./components/sample-receipt";
import { FormData } from "@/types/form";

export default function RegisterSamplePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData) => {
    setReceiptData(data);
    setIsDialogOpen(false);
  }

  if (receiptData) {
    return <SampleReceipt data={receiptData} onBack={() => setReceiptData(null)} />;
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <Button 
        size="lg" 
        className="h-20 text-2xl px-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="mr-4 h-10 w-10" />
        Receive Sample
      </Button>
      <ReceiveSampleDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onFormSubmit={handleFormSubmit} />
    </div>
  );
}
