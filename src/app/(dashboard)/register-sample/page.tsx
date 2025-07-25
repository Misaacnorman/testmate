"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function RegisterSamplePage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-background">
      <Button size="lg" className="h-20 text-2xl px-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <PlusCircle className="mr-4 h-10 w-10" />
        Receive Sample
      </Button>
    </div>
  );
}
