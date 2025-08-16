
'use client';

import * as React from 'react';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TestActions } from './components/test-actions';
import { TestDataTable } from './components/test-data-table';
import { columns } from './components/columns';
import { CreateTestDialog } from './components/create-test-dialog';
import { EditTestDialog } from './components/edit-test-dialog';
import {
  ImportPreviewDialog,
  ParsedData,
} from './components/import-preview-dialog';
import type { Test } from '@/lib/types';
import { processImportedFile } from '@/ai/flows/process-import-flow';

export default function TestsPage() {
  const { toast } = useToast();
  const [tests, setTests] = React.useState<Test[]>([]);
  const [filteredData, setFilteredData] = React.useState<Test[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isImportPreviewOpen, setImportPreviewOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<Test | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});
  const [importData, setImportData] = React.useState<ParsedData>({
    headers: [],
    rows: [],
  });
  
  React.useEffect(() => {
    // In a real app, you'd fetch data here.
    // For now, we just set loading to false.
    setLoading(false);
  }, []);


  const handleFieldUpdate = (id: string, field: keyof Test, value: any) => {
    setTests(currentTests => currentTests.map(t => t.id === id ? {...t, [field]: value} : t));
    // Here you would also add a call to your backend to save the change
  };


  const handleCreateTest = (newTest: Omit<Test, 'id'> & { id: string }) => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const updatedTests = [...tests, newTest];
      setTests(updatedTests);
      setProcessing(false);
      setCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Test created successfully.',
      });
    }, 1000);
  };

  const handleEditTest = (updatedTest: Test) => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const updatedTests = tests.map((test) =>
        test.id === updatedTest.id ? updatedTest : test
      );
      setTests(updatedTests);
      setProcessing(false);
      setEditDialogOpen(false);
      setSelectedTest(null);
      toast({
        title: 'Success',
        description: 'Test updated successfully.',
      });
    }, 1000);
  };

  const openEditDialog = (test: Test) => {
    setSelectedTest(test);
    setEditDialogOpen(true);
  };

  const handleDeleteTest = (testId: string) => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const updatedTests = tests.filter((test) => test.id !== testId);
      setTests(updatedTests);
      setProcessing(false);
      toast({
        title: 'Success',
        description: 'Test deleted successfully.',
      });
    }, 1000);
  };

  const handleDeleteSelected = () => {
    setProcessing(true);
    const selectedIds = Object.keys(rowSelection).map(
      (key) => filteredData[parseInt(key)].id
    );
    // Simulate API call
    setTimeout(() => {
      const updatedTests = tests.filter(
        (test) => !selectedIds.includes(test.id)
      );
      setTests(updatedTests);
      setRowSelection({});
      setProcessing(false);
      toast({
        title: 'Success',
        description: `${selectedIds.length} tests deleted successfully.`,
      });
    }, 1000);
  };

  const handleImport = (data: ParsedData) => {
    setImportData(data);
    setImportPreviewOpen(true);
  };

  const confirmImport = async () => {
    setProcessing(true);
    try {
      const importedTests = await processImportedFile(importData);
      
      const newTests: Test[] = importedTests.map((testData) => ({
        id: testData.testCode,
        name: testData.materialTest,
        material: testData.materialCategory,
        method: testData.testMethods,
        turnAroundTime: testData.leadTimeDays,
        price: testData.amountUSD,
        priceUGX: testData.amountUGX,
        unit: testData.unit,
        isAccredited: testData.accreditationStatus === 'Accredited',
      }));

      const updatedTests = [...tests, ...newTests];
      setTests(updatedTests);
      setImportPreviewOpen(false);
      toast({
        title: 'Success',
        description: `${newTests.length} tests imported successfully.`,
      });
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description:
          'There was an error processing the file. Please check the console for details.',
      });
    } finally {
      setProcessing(false);
    }
  };

  const tableColumns = columns({
    onEdit: openEditDialog,
    onDelete: handleDeleteTest,
    onFieldUpdate: handleFieldUpdate,
  });

  React.useEffect(() => {
    // When the main `tests` array changes, we update the `filteredData` as well.
    // This ensures that filters are re-applied when data changes.
    // A more sophisticated implementation might preserve filters.
    setFilteredData(tests);
  }, [tests]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground">
            Manage the catalog of available tests.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Test
        </Button>
      </div>

      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <TestActions
            data={tests}
            onFilter={setFilteredData}
            onImport={handleImport}
            onDeleteSelected={handleDeleteSelected}
            processing={processing}
            selectionCount={Object.keys(rowSelection).length}
        />
      </div>
      
      <div className="flex-1 overflow-auto">
        <TestDataTable
            columns={tableColumns}
            data={filteredData}
            loading={loading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
        />
      </div>

      <CreateTestDialog
        open={isCreateDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTest}
        processing={processing}
      />

      {selectedTest && (
        <EditTestDialog
          open={isEditDialogOpen}
          onOpenChange={setEditDialogOpen}
          test={selectedTest}
          onSubmit={handleEditTest}
          processing={processing}
        />
      )}

      <ImportPreviewDialog
        open={isImportPreviewOpen}
        onOpenChange={setImportPreviewOpen}
        data={importData}
        onConfirm={confirmImport}
        processing={processing}
      />
    </div>
  );
}
