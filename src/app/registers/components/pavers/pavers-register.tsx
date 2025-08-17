'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getPavers, deletePaverTestGroup, updateSampleSetDetails, updatePaverTestResults, issueCertificateForPaverTest } from './data';
import { getPaverColumns } from './columns';
import { PaverSample, GroupedPaverSample } from '@/lib/types';
import { PaversDataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { RowSelectionState } from '@tanstack/react-table';
import { EditSampleSetDialog } from './edit-sample-set-dialog';
import { TestResultsDialog } from './test-results-dialog';
import { IssueCertificateDialog } from './issue-certificate-dialog';

export function PaversRegister() {
  const [samples, setSamples] = React.useState<GroupedPaverSample[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isTestDialogOpen, setTestDialogOpen] = React.useState(false);
  const [isIssueDialogOpen, setIssueDialogOpen] = React.useState(false);
  const [selectedSampleSet, setSelectedSampleSet] = React.useState<GroupedPaverSample | null>(null);

  const loadSamples = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPavers();
      
      const groupedData: { [key: string]: PaverSample[] } = {};
      data.forEach(sample => {
        const key = `${sample.receiptId}-${sample.testId}-${sample.setNumber || '0'}`;
        if (!groupedData[key]) {
          groupedData[key] = [];
        }
        groupedData[key].push(sample);
      });

      const processedData: GroupedPaverSample[] = Object.values(groupedData).map(group => {
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
      }).sort((a, b) => {
          const dateA = a.receivedAt ? new Date(a.receivedAt).getTime() : 0;
          const dateB = b.receivedAt ? new Date(b.receivedAt).getTime() : 0;
          return dateB - dateA;
      });

      setSamples(processedData);

    } catch (error) {
      console.error('Failed to load paver samples:', error);
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

 const handleOpenEditDialog = (sampleSet: GroupedPaverSample) => {
    setSelectedSampleSet(sampleSet);
    setEditDialogOpen(true);
  };
  
  const handleOpenTestDialog = () => {
    const selectedIndex = parseInt(Object.keys(rowSelection)[0], 10);
    if (isNaN(selectedIndex) || !samples[selectedIndex]) return;
    setSelectedSampleSet(samples[selectedIndex]);
    setTestDialogOpen(true);
  };

  const handleOpenIssueDialog = () => {
    const selectedIndex = parseInt(Object.keys(rowSelection)[0], 10);
    if (isNaN(selectedIndex) || !samples[selectedIndex]) return;
    setSelectedSampleSet(samples[selectedIndex]);
    setIssueDialogOpen(true);
  };

  const handleDelete = async (receiptId: string, testId: string, setNumber: number) => {
    try {
      await deletePaverTestGroup(receiptId, testId, setNumber);
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

  const handleSaveEdit = async (data: Partial<GroupedPaverSample>) => {
    if (!selectedSampleSet) return;
    try {
      await updateSampleSetDetails(selectedSampleSet.receiptId, selectedSampleSet.testId, selectedSampleSet.setNumber || 0, data);
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

  const handleSaveTestResults = async (data: Partial<GroupedPaverSample>) => {
    if (!selectedSampleSet) return;
    try {
      await updatePaverTestResults(selectedSampleSet.receiptId, selectedSampleSet.testId, selectedSampleSet.setNumber || 0, data);
      toast({
        title: 'Success',
        description: 'Test results have been saved.',
      });
      setTestDialogOpen(false);
      setRowSelection({});
      loadSamples();
    } catch (error) {
      console.error('Failed to save test results:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the test results.',
      });
    }
  };
  
  const handleIssueCertificate = async (data: any) => {
     if (!selectedSampleSet) return;
    try {
      await issueCertificateForPaverTest(selectedSampleSet.receiptId, selectedSampleSet.testId, selectedSampleSet.setNumber || 0, data);
      toast({
        title: 'Success',
        description: 'Certificate details have been issued and saved.',
      });
      setIssueDialogOpen(false);
      setRowSelection({});
      loadSamples();
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      toast({
        variant: 'destructive',
        title: 'Issue Failed',
        description: 'Could not save certificate details.',
      });
    }
  };

  const columns = React.useMemo(() => getPaverColumns({ onEdit: handleOpenEditDialog, onDelete: handleDelete }), [handleDelete]);
  
  const isTestButtonDisabled = Object.keys(rowSelection).length !== 1;
  const isIssueButtonDisabled = () => {
    if (Object.keys(rowSelection).length !== 1) return true;
    const selectedIndex = parseInt(Object.keys(rowSelection)[0], 10);
    const sampleSet = samples[selectedIndex];
    // Disable if any sample in the set doesn't have a load value
    return !sampleSet || !sampleSet.samples.every(s => s.load);
  };


  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Pavers Register</CardTitle>
                    <CardDescription>
                        Detailed records of all paver samples.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleOpenTestDialog}
                        disabled={isTestButtonDisabled}
                    >
                        Test
                    </Button>
                     <Button 
                        onClick={handleOpenIssueDialog}
                        disabled={isIssueButtonDisabled()}
                    >
                        Issue
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <PaversDataTable
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
                onSave={handleSaveEdit}
            />
        )}
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
