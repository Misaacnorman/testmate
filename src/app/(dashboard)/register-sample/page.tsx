"use client";

import { Button } from "@/components/ui/button";
import React from 'react';

export default function RegisterSamplePage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Button
        size="lg"
        className="animate-gentle-bounce shadow-xl rounded-2xl h-32 w-32 text-xl"
        style={{
            backgroundColor: 'hsl(221, 83%, 53%)',
            color: 'white'
        }}
      >
        Receive Sample
      </Button>
    </div>
  );
}
