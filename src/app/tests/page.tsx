
'use client';

import * as React from 'react';
import { PlusCircle, Download, Upload, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TestActions } from './components/test-actions';
import { TestDataTable } from './components/test-data-table';
import { columns } from './components/columns';
import { CreateTestDialog } from './components/create-test-dialog';
import { EditTestDialog } from './components/edit-test-dialog';
import { ImportPreviewDialog, ParsedData } from './components/import-preview-dialog';
import type { Test } from '@/lib/types';

// Mock data for tests
const initialTests: Test[] = [
    { id: 'T001', name: 'Complete Blood Count', material: 'Blood', method: 'Automated Hematology', turnAroundTime: '24 hours', price: 50.00, isAccredited: true },
    { id: 'T002', name: 'Urinalysis', material: 'Urine', method: 'Microscopy', turnAroundTime: '48 hours', price: 35.00, isAccredited: true },
    { id: 'T003', name: 'Glucose Tolerance Test', material: 'Blood', method: 'Spectrophotometry', turnAroundTime: '72 hours', price: 75.00, isAccredited: false },
    { id: 'T004', name: 'Thyroid Panel', material: 'Blood', method: 'Immunoassay', turnAroundTime: '48 hours', price: 120.00, isAccredited: true },
    { id: 'T005', name: 'Stool Culture', material: 'Stool', method: 'Culture', turnAroundTime: '96 hours', price: 60.00, isAccredited: false },
];


export default function TestsPage() {
  const { toast } = useToast();
  const [tests, setTests] = React.useState<Test[]>(initialTests);
  const [filteredData, setFilteredData] = React.useState<Test[]>(initialTests);
  const [loading, setLoading] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [isImportPreviewOpen, setImportPreviewOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<Test | null>(null);
  const [rowSelection, setRowSelection] = React.useState({});
  const [importData, setImportData] = React.useState<ParsedData>({ headers: [], rows: [] });


  const handleCreateTest = (newTest: Omit<Test, 'id'>) => {
    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const createdTest: Test = { id: `T${String(tests.length + 1).padStart(3, '0')}`, ...newTest };
      const updatedTests = [...tests, createdTest];
      setTests(updatedTests);
      setFilteredData(updatedTests);
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
      setFilteredData(updatedTests);
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
      setFilteredData(updatedTests);
      setProcessing(false);
      toast({
        title: 'Success',
        description: 'Test deleted successfully.',
      });
    }, 1000);
  };

  const handleDeleteSelected = () => {
    setProcessing(true);
    const selectedIds = Object.keys(rowSelection).map(key => filteredData[parseInt(key)].id);
    // Simulate API call
    setTimeout(() => {
        const updatedTests = tests.filter(test => !selectedIds.includes(test.id));
        setTests(updatedTests);
        setFilteredData(updatedTests);
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
  
  const confirmImport = () => {
    setProcessing(true);
    // Simulate API call to save imported data
    setTimeout(() => {
        const newTests: Test[] = importData.rows.map((row, index) => ({
            id: `T${String(tests.length + index + 1).padStart(3, '0')}`,
            name: row[importData.headers.indexOf('name')] as string,
            material: row[importData.headers.indexOf('material')] as string,
            method: row[importData.headers.indexOf('method')] as string,
            turnAroundTime: row[importData.headers.indexOf('turnAroundTime')] as string,
            price: parseFloat(row[importData.headers.indexOf('price')] as string),
            isAccredited: row[importData.headers.indexOf('isAccredited')] === 'true'
        }));

        const updatedTests = [...tests, ...newTests];
        setTests(updatedTests);
        setFilteredData(updatedTests);
        setProcessing(false);
        setImportPreviewOpen(false);
        toast({
            title: "Success",
            description: "Data imported successfully."
        });
    }, 1000);
  };

  const tableColumns = columns({ onEdit: openEditDialog, onDelete: handleDeleteTest });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Tests</h1>
            <p className="text-muted-foreground">Manage the catalog of available tests.</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Test
        </Button>
      </div>

      <TestActions
        data={tests}
        onFilter={setFilteredData}
        onImport={handleImport}
        onDeleteSelected={handleDeleteSelected}
        processing={processing}
        selectionCount={Object.keys(rowSelection).length}
      />
      
      <TestDataTable
        columns={tableColumns}
        data={filteredData}
        loading={loading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

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
