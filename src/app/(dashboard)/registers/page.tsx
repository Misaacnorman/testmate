
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getReceipts, deleteReceipt } from '@/services/receipts';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';
import { getColumns as getReceiptColumns } from './components/receipt-columns';
import { ReceiptsTable } from './components/receipts-table';
import { ProjectsTable } from './components/projects-table';
import { Project } from '@/types/project';
import { getProjects, updateProject, deleteProject } from '@/services/projects';
import { getColumns as getProjectColumns } from './components/project-columns';
import { ConcreteCubesTable } from './components/concrete-cubes-table';
import { getColumns as getConcreteCubesColumns } from './components/concrete-cubes-columns';
import { ConcreteCube, ConcreteCubeSet } from '@/types/concrete-cube';
import { getConcreteCubes, updateConcreteCube } from '@/services/concrete-cubes';
import { BlockAndBrick, BlockAndBrickSet } from '@/types/block-and-brick';
import { getBlocksAndBricks, updateBlockAndBrick } from '@/services/blocks-and-bricks';
import { getColumns as getBlocksAndBricksColumns } from './components/blocks-and-bricks-columns';
import { BlocksAndBricksTable } from './components/blocks-and-bricks-table';
import { Paver, PaverSet } from '@/types/paver';
import { getPavers, updatePaver, deletePaverSet } from '@/services/pavers';
import { getColumns as getPaverColumns } from './components/paver-columns';
import { PaversTable } from './components/pavers-table';
import { Cylinder, CylinderSet } from '@/types/cylinder';
import { getCylinders, updateCylinder } from '@/services/cylinders';
import { getColumns as getCylinderColumns } from './components/cylinder-columns';
import { CylindersTable } from './components/cylinders-table';
import { WaterAbsorption, WaterAbsorptionSet } from '@/types/water-absorption';
import { getWaterAbsorptions, updateWaterAbsorption } from '@/services/water-absorptions';
import { getColumns as getWaterAbsorptionColumns } from './components/water-absorption-columns';
import { WaterAbsorptionTable } from './components/water-absorption-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TestTubeDiagonal } from 'lucide-react';
import { EditConcreteCubeDialog } from './components/edit-concrete-cube-dialog';
import { EditBlockAndBrickDialog } from './components/edit-block-and-brick-dialog';
import { EditPaverDialog } from './components/edit-paver-dialog';
import { EditCylinderDialog } from './components/edit-cylinder-dialog';
import { EditWaterAbsorptionDialog } from './components/edit-water-absorption-dialog';
import { TestConcreteCubesDialog } from './components/test-concrete-cubes-dialog';
import { TestBlocksAndBricksDialog } from './components/test-blocks-and-bricks-dialog';
import { TestPaversDialog } from './components/test-pavers-dialog';
import { TestCylindersDialog } from './components/test-cylinders-dialog';
import { TestWaterAbsorptionsDialog } from './components/test-water-absorptions-dialog';
import { EditProjectDialog } from './components/edit-project-dialog';
import { CreateProjectDialog } from './components/create-project-dialog';

export default function RegistersPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [concreteCubes, setConcreteCubes] = useState<ConcreteCube[]>([]);
  const [blocksAndBricks, setBlocksAndBricks] = useState<BlockAndBrick[]>([]);
  const [pavers, setPavers] = useState<Paver[]>([]);
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [waterAbsorptions, setWaterAbsorptions] = useState<WaterAbsorption[]>([]);
  
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isConcreteCubesLoading, setIsConcreteCubesLoading] = useState(true);
  const [isBlocksAndBricksLoading, setIsBlocksAndBricksLoading] = useState(true);
  const [isPaversLoading, setIsPaversLoading] = useState(true);
  const [isCylindersLoading, setIsCylindersLoading] = useState(true);
  const [isWaterAbsorptionsLoading, setIsWaterAbsorptionsLoading] = useState(true);
  
  const [projectFilter, setProjectFilter] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingConcreteCube, setEditingConcreteCube] = useState<ConcreteCube | null>(null);
  const [editingBlockAndBrick, setEditingBlockAndBrick] = useState<BlockAndBrick | null>(null);
  const [editingPaver, setEditingPaver] = useState<Paver | null>(null);
  const [editingCylinder, setEditingCylinder] = useState<Cylinder | null>(null);
  const [editingWaterAbsorption, setEditingWaterAbsorption] = useState<WaterAbsorption | null>(null);
  
  const [isTestCubesDialogOpen, setIsTestCubesDialogOpen] = useState(false);
  const [selectedCubes, setSelectedCubes] = useState<ConcreteCube[]>([]);

  const [isTestBlocksAndBricksDialogOpen, setIsTestBlocksAndBricksDialogOpen] = useState(false);
  const [selectedBlocksAndBricks, setSelectedBlocksAndBricks] = useState<BlockAndBrick[]>([]);

  const [isTestPaversDialogOpen, setIsTestPaversDialogOpen] = useState(false);
  const [selectedPavers, setSelectedPavers] = useState<Paver[]>([]);

  const [isTestCylindersDialogOpen, setIsTestCylindersDialogOpen] = useState(false);
  const [selectedCylinders, setSelectedCylinders] = useState<Cylinder[]>([]);

  const [isTestWaterAbsorptionsDialogOpen, setIsTestWaterAbsorptionsDialogOpen] = useState(false);
  const [selectedWaterAbsorptions, setSelectedWaterAbsorptions] = useState<WaterAbsorption[]>([]);

  const { toast } = useToast();

  const fetchAndSetData = useCallback(async (fetcher: () => Promise<any>, setter: (data: any) => void, loaderSetter: (loading: boolean) => void, entityName: string) => {
    loaderSetter(true);
    try {
      const data = await fetcher();
      setter(data);
    } catch (error) {
      console.error(`Failed to fetch ${entityName}:`, error);
      toast({
        variant: "destructive",
        title: `Error fetching ${entityName}`,
        description: `Could not retrieve ${entityName} from the database.`,
      });
    } finally {
      loaderSetter(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAndSetData(getReceipts, setReceipts, setIsReceiptsLoading, 'receipts');
    fetchAndSetData(getProjects, setProjects, setIsProjectsLoading, 'projects');
    fetchAndSetData(getConcreteCubes, setConcreteCubes, setIsConcreteCubesLoading, 'concrete cubes');
    fetchAndSetData(getBlocksAndBricks, setBlocksAndBricks, setIsBlocksAndBricksLoading, 'blocks and bricks');
    fetchAndSetData(getPavers, setPavers, setIsPaversLoading, 'pavers');
    fetchAndSetData(getCylinders, setCylinders, setIsCylindersLoading, 'cylinders');
    fetchAndSetData(getWaterAbsorptions, setWaterAbsorptions, setIsWaterAbsorptionsLoading, 'water absorptions');
  }, [fetchAndSetData]);

  const handleReceiptDeleted = useCallback(async (receiptId: string) => {
    // This function logic can be expanded to delete related test entries if needed
    try {
      await deleteReceipt(receiptId);
      toast({ title: "Receipt Deleted" });
      fetchAndSetData(getReceipts, setReceipts, setIsReceiptsLoading, 'receipts');
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting receipt" });
    }
  }, [fetchAndSetData]);

  const handleProjectUpdated = async (project: Project) => {
    try {
      await updateProject(project);
      toast({ title: "Project Updated" });
      setEditingProject(null);
      fetchAndSetData(getProjects, setProjects, setIsProjectsLoading, 'projects');
    } catch (error) {
       toast({ variant: "destructive", title: "Error updating project" });
    }
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      toast({ title: "Project Deleted" });
      fetchAndSetData(getProjects, setProjects, setIsProjectsLoading, 'projects');
    } catch (error) {
       toast({ variant: "destructive", title: "Error deleting project" });
    }
  };
  
  const handleBatchUpdate = async <T extends {id: string}>(items: T[], updater: (item: T) => Promise<void>, fetcher: () => Promise<any>, setter: (data: any) => void, loaderSetter: (loading: boolean) => void, entityName: string, dialogCloser: () => void) => {
    try {
        await Promise.all(items.map(item => updater(item)));
        toast({
            title: "Batch Update Successful",
            description: `${items.length} ${entityName} records have been updated.`,
        });
        fetcher().then(setter);
        dialogCloser();
    } catch (error) {
        console.error(`Failed to batch update ${entityName}:`, error);
        toast({
            variant: "destructive",
            title: "Error during Batch Update",
            description: `Could not save updated data for some ${entityName}.`,
        });
    }
  };

  const handlePaverSetDeleted = async (item: PaverSet) => {
    try {
      await deletePaverSet(item.samples.map(s => s.id));
      toast({ title: "Paver Test Set Deleted" });
      fetchAndSetData(getPavers, setPavers, setIsPaversLoading, 'pavers');
    } catch (error) {
      toast({ variant: "destructive", title: "Error Deleting Paver Set" });
    }
  };

  const groupIntoSets = <T extends { [key: string]: any; id: string }>(samples: T[], keyFields: string[]): any[] => {
    const sets = new Map<string, T[]>();
    samples.forEach(sample => {
      const key = keyFields.map(field => sample[field] ?? '').join('-');
      if (!sets.has(key)) {
        sets.set(key, []);
      }
      sets.get(key)!.push(sample);
    });
    
    return Array.from(sets.entries()).map(([key, samples]) => {
      const firstSample = samples[0];
      const commonData: { [key: string]: any } = {};
      keyFields.forEach(field => commonData[field] = firstSample[field]);

      return {
        id: key,
        samples: samples,
        ...commonData,
      };
    });
  };

  const concreteCubeSets = useMemo(() => groupIntoSets<ConcreteCube>(concreteCubes, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'class', 'areaOfUse']), [concreteCubes]);
  const blocksAndBricksSets = useMemo(() => groupIntoSets<BlockAndBrick>(blocksAndBricks, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'areaOfUse', 'sampleType']), [blocksAndBricks]);
  const paverSets = useMemo(() => groupIntoSets<Paver>(pavers, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'areaOfUse', 'paverType']), [pavers]);
  const cylinderSets = useMemo(() => groupIntoSets<Cylinder>(cylinders, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'class', 'areaOfUse']), [cylinders]);
  const waterAbsorptionSets = useMemo(() => groupIntoSets<WaterAbsorption>(waterAbsorptions, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'areaOfUse', 'sampleType']), [waterAbsorptions]);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Registers</h2>
            <p className="text-muted-foreground">
              View and manage all laboratory registers.
            </p>
          </div>
        </div>
        <Tabs defaultValue="projects">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="sample-receipts">Sample Receipts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="concrete-cubes">Concrete Cubes</TabsTrigger>
            <TabsTrigger value="blocks-and-bricks">Blocks &amp; Bricks</TabsTrigger>
            <TabsTrigger value="pavers">Pavers</TabsTrigger>
            <TabsTrigger value="cylinders">Cylinders</TabsTrigger>
            <TabsTrigger value="water-absorption">Water Absorption</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sample-receipts">
            <Card><CardHeader><CardTitle>Sample Receipt Log</CardTitle><CardDescription>A log of all sample receipts generated.</CardDescription></CardHeader><CardContent><ReceiptsTable columns={getReceiptColumns({ onDelete: handleReceiptDeleted })} data={receipts} isLoading={isReceiptsLoading} /></CardContent></Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader><div className="flex justify-between items-center gap-4"><div><CardTitle>Projects and Samples Register/Log Book</CardTitle><CardDescription>A log of all projects and their associated details.</CardDescription></div><div className="flex items-center gap-2"><Input placeholder="Search all projects..." value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="w-64" /><CreateProjectDialog onProjectCreated={() => fetchAndSetData(getProjects, setProjects, setIsProjectsLoading, 'projects')} /></div></div></CardHeader>
              <CardContent><ProjectsTable columns={getProjectColumns({ onEdit: setEditingProject, onDelete: handleProjectDeleted })} data={projects} isLoading={isProjectsLoading} globalFilter={projectFilter} /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concrete-cubes">
            <Card>
              <CardHeader><div className="flex justify-between items-center"><div><CardTitle>Concrete Cubes</CardTitle><CardDescription>A register for all concrete cube tests.</CardDescription></div><Button onClick={() => setIsTestCubesDialogOpen(true)} disabled={selectedCubes.length === 0}><TestTubeDiagonal className="mr-2 h-4 w-4" />Test ({selectedCubes.length})</Button></div></CardHeader>
              <CardContent><ConcreteCubesTable columns={getConcreteCubesColumns({ onEdit: setEditingConcreteCube })} data={concreteCubeSets} isLoading={isConcreteCubesLoading} onSelectionChange={(rows) => setSelectedCubes(rows.flatMap(set => set.samples))} /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks-and-bricks">
            <Card>
              <CardHeader><div className="flex justify-between items-center"><div><CardTitle>Sample Register/Log for Bricks &amp; Blocks</CardTitle><CardDescription>A register for all brick and block tests.</CardDescription></div><Button onClick={() => setIsTestBlocksAndBricksDialogOpen(true)} disabled={selectedBlocksAndBricks.length === 0}><TestTubeDiagonal className="mr-2 h-4 w-4" />Test ({selectedBlocksAndBricks.length})</Button></div></CardHeader>
              <CardContent><BlocksAndBricksTable columns={getBlocksAndBricksColumns({ onEdit: setEditingBlockAndBrick })} data={blocksAndBricksSets} isLoading={isBlocksAndBricksLoading} onSelectionChange={(rows) => setSelectedBlocksAndBricks(rows.flatMap(set => set.samples))} /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pavers">
            <Card>
              <CardHeader><div className="flex justify-between items-center"><div><CardTitle>Sample Register/Log for Pavers</CardTitle><CardDescription>A register for all paver tests.</CardDescription></div><Button onClick={() => setIsTestPaversDialogOpen(true)} disabled={selectedPavers.length === 0}><TestTubeDiagonal className="mr-2 h-4 w-4" />Test ({selectedPavers.length})</Button></div></CardHeader>
              <CardContent><PaversTable columns={getPaverColumns({ onEdit: setEditingPaver, onDelete: handlePaverSetDeleted })} data={paverSets} isLoading={isPaversLoading} onSelectionChange={(rows) => setSelectedPavers(rows.flatMap(set => set.samples))} /></CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="cylinders">
            <Card>
              <CardHeader><div className="flex justify-between items-center"><div><CardTitle>Sample Register/Log for Concrete Cylinders</CardTitle><CardDescription>A register for all concrete cylinder tests.</CardDescription></div><Button onClick={() => setIsTestCylindersDialogOpen(true)} disabled={selectedCylinders.length === 0}><TestTubeDiagonal className="mr-2 h-4 w-4" />Test ({selectedCylinders.length})</Button></div></CardHeader>
              <CardContent><CylindersTable columns={getCylinderColumns({ onEdit: setEditingCylinder })} data={cylinderSets} isLoading={isCylindersLoading} onSelectionChange={(rows) => setSelectedCylinders(rows.flatMap(set => set.samples))} /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water-absorption">
            <Card>
              <CardHeader><div className="flex justify-between items-center"><div><CardTitle>Sample Register/Log for Bricks &amp; Blocks for Water</CardTitle><CardDescription>A register for all water absorption tests on bricks and blocks.</CardDescription></div><Button onClick={() => setIsTestWaterAbsorptionsDialogOpen(true)} disabled={selectedWaterAbsorptions.length === 0}><TestTubeDiagonal className="mr-2 h-4 w-4" />Test ({selectedWaterAbsorptions.length})</Button></div></CardHeader>
              <CardContent><WaterAbsorptionTable columns={getWaterAbsorptionColumns({ onEdit: setEditingWaterAbsorption })} data={waterAbsorptionSets} isLoading={isWaterAbsorptionsLoading} onSelectionChange={(rows) => setSelectedWaterAbsorptions(rows.flatMap(set => set.samples))} /></CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
      
      {editingProject && <EditProjectDialog project={editingProject} onOpenChange={(open) => !open && setEditingProject(null)} onProjectUpdated={handleProjectUpdated} />}
      {editingConcreteCube && <EditConcreteCubeDialog item={editingConcreteCube} onOpenChange={(open) => !open && setEditingConcreteCube(null)} onItemUpdated={(item) => handleBatchUpdate([item], updateConcreteCube, getConcreteCubes, setConcreteCubes, setIsConcreteCubesLoading, 'concrete cube', () => setEditingConcreteCube(null))} />}
      {editingBlockAndBrick && <EditBlockAndBrickDialog item={editingBlockAndBrick} onOpenChange={(open) => !open && setEditingBlockAndBrick(null)} onItemUpdated={(item) => handleBatchUpdate([item], updateBlockAndBrick, getBlocksAndBricks, setBlocksAndBricks, setIsBlocksAndBricksLoading, 'block/brick', () => setEditingBlockAndBrick(null))} />}
      {editingPaver && <EditPaverDialog item={editingPaver} onOpenChange={(open) => !open && setEditingPaver(null)} onItemUpdated={(item) => handleBatchUpdate([item], updatePaver, getPavers, setPavers, setIsPaversLoading, 'paver', () => setEditingPaver(null))} />}
      {editingCylinder && <EditCylinderDialog item={editingCylinder} onOpenChange={(open) => !open && setEditingCylinder(null)} onItemUpdated={(item) => handleBatchUpdate([item], updateCylinder, getCylinders, setCylinders, setIsCylindersLoading, 'cylinder', () => setEditingCylinder(null))} />}
      {editingWaterAbsorption && <EditWaterAbsorptionDialog item={editingWaterAbsorption} onOpenChange={(open) => !open && setEditingWaterAbsorption(null)} onItemUpdated={(item) => handleBatchUpdate([item], updateWaterAbsorption, getWaterAbsorptions, setWaterAbsorptions, setIsWaterAbsorptionsLoading, 'water absorption', () => setEditingWaterAbsorption(null))} />}
      
      {isTestCubesDialogOpen && selectedCubes.length > 0 && <TestConcreteCubesDialog items={selectedCubes} onOpenChange={setIsTestCubesDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateConcreteCube, getConcreteCubes, setConcreteCubes, setIsConcreteCubesLoading, 'concrete cube', () => setIsTestCubesDialogOpen(false))} />}
      {isTestBlocksAndBricksDialogOpen && selectedBlocksAndBricks.length > 0 && <TestBlocksAndBricksDialog items={selectedBlocksAndBricks} onOpenChange={setIsTestBlocksAndBricksDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateBlockAndBrick, getBlocksAndBricks, setBlocksAndBricks, setIsBlocksAndBricksLoading, 'block/brick', () => setIsTestBlocksAndBricksDialogOpen(false))} />}
      {isTestPaversDialogOpen && selectedPavers.length > 0 && <TestPaversDialog items={selectedPavers} onOpenChange={setIsTestPaversDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updatePaver, getPavers, setPavers, setIsPaversLoading, 'paver', () => setIsTestPaversDialogOpen(false))} />}
      {isTestCylindersDialogOpen && selectedCylinders.length > 0 && <TestCylindersDialog items={selectedCylinders} onOpenChange={setIsTestCylindersDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateCylinder, getCylinders, setCylinders, setIsCylindersLoading, 'cylinder', () => setIsTestCylindersDialogOpen(false))} />}
      {isTestWaterAbsorptionsDialogOpen && selectedWaterAbsorptions.length > 0 && <TestWaterAbsorptionsDialog items={selectedWaterAbsorptions} onOpenChange={setIsTestWaterAbsorptionsDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateWaterAbsorption, getWaterAbsorptions, setWaterAbsorptions, setIsWaterAbsorptionsLoading, 'water absorption', () => setIsTestWaterAbsorptionsDialogOpen(false))} />}
    </>
  );
}
