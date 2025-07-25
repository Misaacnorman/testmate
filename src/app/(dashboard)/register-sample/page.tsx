"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import React from 'react';

export default function RegisterSamplePage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Button
        size="lg"
        className="animate-gentle-bounce shadow-xl rounded-2xl h-32 w-64 text-xl flex-col"
        style={{
            backgroundColor: 'hsl(221, 83%, 53%)',
            color: 'white'
        }}
      >
        <PlusCircle className="w-12 h-12 mb-2" />
        <span>Receive Sample</span>
      </Button>
    </div>
  );
}
