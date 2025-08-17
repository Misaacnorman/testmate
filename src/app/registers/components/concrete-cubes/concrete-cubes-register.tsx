
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getConcreteCubes, updateCubeTestResults } from './data';
import { columns } from './columns';
import { ConcreteCubeSample, GroupedConcreteCubeSample } from '@/lib/types';
import { ConcreteCubesDataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { TestResultsDialog } from './test-results-dialog';
import { RowSelectionState } from '@tanstack/react-table';


export function ConcreteCubesRegister() {
  const [samples, setSamples] = React.useState<GroupedConcreteCubeSample[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);

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

  const selectedRowIndex = Object.keys(rowSelection)[0];
  const selectedRow = selectedRowIndex !== undefined ? samples[parseInt(selectedRowIndex, 10)] : null;
  const isOneRowSelected = Object.keys(rowSelection).length === 1;

  const handleTestResultsSave = async (updatedSamples: ConcreteCubeSample[]) => {
    try {
        await updateCubeTestResults(updatedSamples);
        toast({
            title: 'Success',
            description: 'Test results have been saved successfully.',
        });
        setIsTestDialogOpen(false);
        setRowSelection({});
        loadSamples(); // Refresh data
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to save test results.',
        });
    }
  }

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>Concrete Cubes Register</CardTitle>
                    <CardDescription>
                        Detailed records of all concrete cube samples.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button disabled={!isOneRowSelected} onClick={() => setIsTestDialogOpen(true)}>Test</Button>
                    <Button disabled={!isOneRowSelected}>Issue</Button>
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
        {selectedRow && (
            <TestResultsDialog
                open={isTestDialogOpen}
                onOpenChange={setIsTestDialogOpen}
                sampleSet={selectedRow}
                onSave={handleTestResultsSave}
            />
        )}
    </Card>
  );
}
