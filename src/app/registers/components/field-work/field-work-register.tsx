
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getFieldWorkInstructions, createFieldWorkInstruction, deleteFieldWorkInstruction } from './data';
import { getFieldWorkColumns } from './columns';
import { FieldWorkInstruction } from '@/lib/types';
import { FieldWorkDataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NewProjectDialog } from './new-project-dialog'; // Import the new dialog

export function FieldWorkRegister() {
  const [instructions, setInstructions] = React.useState<FieldWorkInstruction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);


  const loadInstructions = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFieldWorkInstructions();
      setInstructions(data);
    } catch (error) {
      console.error('Failed to load field work instructions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load instructions from the register.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadInstructions();
  }, [loadInstructions]);

  const handleCreateProject = async (data: Omit<FieldWorkInstruction, 'id'>) => {
    setIsProcessing(true);
    try {
        await createFieldWorkInstruction(data);
        toast({
            title: 'Success',
            description: 'New project has been created successfully.'
        });
        setIsDialogOpen(false);
        loadInstructions(); // Refresh the data
    } catch (error) {
        console.error("Failed to create project:", error);
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: "Could not create the new project instruction."
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteFieldWorkInstruction(id);
        toast({
            title: 'Success',
            description: `Project has been deleted.`
        });
        loadInstructions(); // Refresh data
    } catch (error) {
        console.error("Failed to delete instruction:", error);
        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "Could not delete the instruction from the register."
        });
    }
  }

  const columns = React.useMemo(() => getFieldWorkColumns({ onDelete: handleDelete }), [handleDelete]);

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>
                        Records of all assigned field work instructions.
                    </CardDescription>
                </div>
                 <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <FieldWorkDataTable
                columns={columns}
                data={instructions}
                loading={loading}
            />
        </CardContent>
         <NewProjectDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleCreateProject}
            processing={isProcessing}
        />
    </Card>
  );
}
