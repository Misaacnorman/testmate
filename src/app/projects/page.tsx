
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your client projects.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            No projects found
          </h3>
          <p className="text-sm text-muted-foreground">
            Get started by creating a new project.
          </p>
        </div>
      </div>
    </div>
  );
}
