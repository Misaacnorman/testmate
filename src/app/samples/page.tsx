
'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SamplesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 flex items-center justify-center">
        <Button
          size="lg"
          className="h-24 px-12 text-2xl font-semibold shadow-md transition-shadow duration-200 hover:shadow-lg"
          onClick={() => setIsModalOpen(true)}
        >
          Receive Sample
        </Button>
    </div>
  );
}
