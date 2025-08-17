
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getConcreteCubes, updateCubeTestResults, deleteCubeTestGroup, issueCertificateForCubeTest } from './data';
import { getConcreteCubeColumns } from './columns';
import { ConcreteCubeSample, GroupedConcreteCubeSample, IssueCertificateData } from '@/lib/types';
import { ConcreteCubesDataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { TestResultsDialog } from './test-results-dialog';
import { IssueCertificateDialog } from './issue-certificate-dialog';
import { RowSelectionState } from '@tanstack/react-table';

export function ConcreteCubesRegister() {
  const [samples, setSamples] = React.useState<GroupedConcreteCubeSample[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isTestDialogOpen, setTestDialogOpen] = React.useState(false);
  const [isIssueDialogOpen, setIssueDialogOpen] = React.useState(false);
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

  const handleOpenTestDialog = (sampleSet?: GroupedConcreteCubeSample) => {
    let setToOpen = sampleSet;
    if (!setToOpen) {
        const selectedIndex = parseInt(Object.keys(rowSelection)[0], 10);
        if (isNaN(selectedIndex) || !samples[selectedIndex]) return;
        setToOpen = samples[selectedIndex];
    }
    
    if (setToOpen) {
        // If certificate number exists, it means it has been issued, so we edit the issue details.
        // Otherwise, we edit the test results.
        if (setToOpen.certificateNumber) {
            handleOpenIssueDialog(setToOpen);
        } else {
            setSelectedSampleSet(setToOpen);
            setTestDialogOpen(true);
        }
    }
  };
  
  const handleOpenIssueDialog = (sampleSet?: GroupedConcreteCubeSample) => {
    let setToOpen = sampleSet;
    if (!setToOpen) {
        const selectedIndex = parseInt(Object.keys(rowSelection)[0], 10);
        if (isNaN(selectedIndex) || !samples[selectedIndex]) return;
        setToOpen = samples[selectedIndex];
    }
    
    if (setToOpen) {
        setSelectedSampleSet(setToOpen);
        setIssueDialogOpen(true);
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

  const handleSaveTestResults = async (updatedSamples: ConcreteCubeSample[]) => {
    try {
        await updateCubeTestResults(updatedSamples);
        toast({
            title: "Success",
            description: "Test results have been saved successfully.",
        });
        setTestDialogOpen(false);
        setRowSelection({});
        // Reload data to reflect changes
        loadSamples(); 
    } catch (error) {
        console.error("Failed to save test results:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save the test results.",
        });
    }
  }

  const handleIssueCertificate = async (data: IssueCertificateData) => {
     if (!selectedSampleSet) return;
    try {
      await issueCertificateForCubeTest(selectedSampleSet.receiptId, selectedSampleSet.setNumber || 0, data);
      toast({
        title: 'Success',
        description: 'Certificate details have been saved.',
      });
      setIssueDialogOpen(false);
      setRowSelection({});
      loadSamples();
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save certificate details.',
      });
    }
  };
  
  const columns = React.useMemo(() => getConcreteCubeColumns({ onEdit: handleOpenTestDialog, onDelete: handleDelete, onIssue: handleOpenIssueDialog }), [handleDelete]);

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
                        onClick={() => handleOpenTestDialog()}
                        disabled={Object.keys(rowSelection).length !== 1}
                    >
                        Test
                    </Button>
                    <Button 
                        onClick={() => handleOpenIssueDialog()}
                        variant="outline"
                        disabled={Object.keys(rowSelection).length !== 1}
                    >
                        Issue
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
            <TestResultsDialog 
                open={isTestDialogOpen}
                onOpenChange={setTestDialogOpen}
                sampleSet={selectedSampleSet}
                onSave={handleSaveTestResults}
            />
        )}
        {selectedSampleSet && (
            <IssueCertificateDialog
                open={isIssueDialogOpen}
                onOpenChange={setIssueDialogOpen}
                sampleSet={selectedSampleSet}
                onSave={handleIssueCertificate}
            />
        )}
    </Card>
  );
}
