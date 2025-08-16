
'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SamplesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center bg-background rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center p-8">
        <Button
          size="lg"
          className="h-20 px-10 text-xl font-bold transform transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-pulse"
          onClick={() => setIsModalOpen(true)}
        >
          Receive Sample
        </Button>
      </div>
    </div>
  );
}
