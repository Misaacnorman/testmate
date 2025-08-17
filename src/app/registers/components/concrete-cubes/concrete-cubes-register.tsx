
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getConcreteCubes, deleteCubeTestGroup, updateSampleSetDetails } from './data';
import { getConcreteCubeColumns } from './columns';
import { ConcreteCubeSample, GroupedConcreteCubeSample } from '@/lib/types';
import { ConcreteCubesDataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { RowSelectionState } from '@tanstack/react-table';
import { EditSampleSetDialog } from './edit-sample-set-dialog';

export function ConcreteCubesRegister() {
  const [samples, setSamples] = React.useState<GroupedConcreteCubeSample[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [selectedSampleSet, setSelectedSampleSet] = React.useState<GroupedConcreteCubeSample | null>(null);

  const loadSamples = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConcreteCubes();
      
      const groupedData: { [key: string]: ConcreteCubeSample[] } = {};
      data.forEach(sample => {
        const key = `${sample.receiptId}-${sample.setNumber || '0'}`;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(sample);
      });

      const processedData: GroupedConcreteCubeSample[] = Object.values(groupedData).map(group => {
        const firstSample = group[0];
        
        const sortedSamples = [...group].sort((a, b) => {
            const serialA = a.sampleSerialNumber || '';
            const serialB = b.sampleSerialNumber || '';
            return serialA.localeCompare(serialB, undefined, { numeric: true, sensitivity: 'base' });
        });

        return {
            ...firstSample,
            samples: sortedSamples,
        };
      }).sort((a, b) => (b.receivedAt || '').localeCompare(a.receivedAt || ''));

      setSamples(processedData);

    } catch (error) {
      console.error('Failed to load concrete cube samples:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load samples from the register.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  const handleOpenEditDialog = (sampleSet?: GroupedConcreteCubeSample) => {
    let setToOpen = sampleSet;
    if (!setToOpen) {
        const selectedIndex = parseInt(Object.keys(rowSelection)[0], 10);
        if (isNaN(selectedIndex) || !samples[selectedIndex]) return;
        setToOpen = samples[selectedIndex];
    }
    
    if (setToOpen) {
        setSelectedSampleSet(setToOpen);
        setEditDialogOpen(true);
    }
  };


  const handleDelete = async (receiptId: string, setNumber: number) => {
    try {
      await deleteCubeTestGroup(receiptId, setNumber);
      toast({
        title: 'Success',
        description: `Sample group ${receiptId}-${setNumber} has been deleted.`,
      });
      loadSamples(); // Refresh data
    } catch (error) {
      console.error('Failed to delete sample group:', error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Could not delete the sample group from the register.',
      });
    }
  };

  const handleSave = async (data: Partial<GroupedConcreteCubeSample>) => {
    if (!selectedSampleSet) return;
    try {
      await updateSampleSetDetails(selectedSampleSet.receiptId, selectedSampleSet.setNumber || 0, data);
      toast({
        title: 'Success',
        description: 'Sample set details have been updated.',
      });
      setEditDialogOpen(false);
      setRowSelection({});
      loadSamples();
    } catch (error) {
      console.error('Failed to save details:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the updated details.',
      });
    }
  };
  
  const columns = React.useMemo(() => getConcreteCubeColumns({ onEdit: handleOpenEditDialog, onDelete: handleDelete }), [handleDelete]);

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Concrete Cubes Register</CardTitle>
                    <CardDescription>
                        Detailed records of all concrete cube samples.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={() => handleOpenEditDialog()}
                        disabled={Object.keys(rowSelection).length !== 1}
                    >
                        Edit / Enter Data
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <ConcreteCubesDataTable
                columns={columns}
                data={samples}
                loading={loading}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />
        </CardContent>
        {selectedSampleSet && (
            <EditSampleSetDialog
                open={isEditDialogOpen}
                onOpenChange={setEditDialogOpen}
                sampleSet={selectedSampleSet}
                onSave={handleSave}
            />
        )}
    </Card>
  );
}
