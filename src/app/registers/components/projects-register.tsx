
'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ProjectsRegister() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                    Manage all your client projects.
                </CardDescription>
            </div>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
                No projects found
            </h3>
            <p className="text-sm text-muted-foreground">
                Get started by creating a new project.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
