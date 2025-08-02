
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getReceipts, deleteReceipt } from '@/services/receipts';
import { Receipt } from '@/types/receipt';
import { useToast } from '@/hooks/use-toast';
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
import { TestTubeDiagonal, FileSignature } from 'lucide-react';
import { TestConcreteCubesDialog } from './components/test-concrete-cubes-dialog';
import { TestBlocksAndBricksDialog } from './components/test-blocks-and-bricks-dialog';
import { TestPaversDialog } from './components/test-pavers-dialog';
import { TestCylindersDialog } from './components/test-cylinders-dialog';
import { TestWaterAbsorptionsDialog } from './components/test-water-absorptions-dialog';
import { EditProjectDialog } from './components/edit-project-dialog';
import { CreateProjectDialog } from './components/create-project-dialog';
import { getColumns as getReceiptColumns } from './components/receipt-columns';
import { IssuanceConcreteCubesDialog } from './components/issuance-concrete-cubes-dialog';
import { IssuanceBlocksAndBricksDialog } from './components/issuance-blocks-and-bricks-dialog';
import { IssuancePaversDialog } from './components/issuance-pavers-dialog';
import { IssuanceCylindersDialog } from './components/issuance-cylinders-dialog';
import { IssuanceWaterAbsorptionsDialog } from './components/issuance-water-absorptions-dialog';


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
  
  const [isTestCubesDialogOpen, setIsTestCubesDialogOpen] = useState(false);
  const [isIssuanceCubesDialogOpen, setIsIssuanceCubesDialogOpen] = useState(false);
  const [selectedCubeSets, setSelectedCubeSets] = useState<ConcreteCubeSet[]>([]);

  const [isTestBlocksAndBricksDialogOpen, setIsTestBlocksAndBricksDialogOpen] = useState(false);
  const [isIssuanceBlocksAndBricksDialogOpen, setIsIssuanceBlocksAndBricksDialogOpen] = useState(false);
  const [selectedBlocksAndBricksSets, setSelectedBlocksAndBricksSets] = useState<BlockAndBrickSet[]>([]);
  
  const [isTestPaversDialogOpen, setIsTestPaversDialogOpen] = useState(false);
  const [isIssuancePaversDialogOpen, setIsIssuancePaversDialogOpen] = useState(false);
  const [selectedPaverSets, setSelectedPaverSets] = useState<PaverSet[]>([]);

  const [isTestCylindersDialogOpen, setIsTestCylindersDialogOpen] = useState(false);
  const [isIssuanceCylindersDialogOpen, setIsIssuanceCylindersDialogOpen] = useState(false);
  const [selectedCylinderSets, setSelectedCylinderSets] = useState<CylinderSet[]>([]);

  const [isTestWaterAbsorptionsDialogOpen, setIsTestWaterAbsorptionsDialogOpen] = useState(false);
  const [isIssuanceWaterAbsorptionsDialogOpen, setIsIssuanceWaterAbsorptionsDialogOpen] = useState(false);
  const [selectedWaterAbsorptionSets, setSelectedWaterAbsorptionSets] = useState<WaterAbsorptionSet[]>([]);

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
            description: `${items.length} ${entityName}(s) have been updated.`,
        });
        dialogCloser();
        fetcher().then(data => {
            setter(data);
            loaderSetter(false);
        });
    } catch (error) {
        console.error(`Failed to batch update ${entityName}:`, error);
        toast({
            variant: "destructive",
            title: "Error during Batch Update",
            description: `Could not save updated data for some ${entityName}(s).`,
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
  
  const groupIntoSets = <T extends { [key: string]: any; id: string }>(
    samples: T[],
    keyFields: string[]
  ): { id: string; samples: T[], [key: string]: any }[] => {
    if (!samples || samples.length === 0) return [];

    const sets = new Map<string, T[]>();
    samples.forEach(sample => {
      const key = keyFields.map(field => sample[field] ?? '').join('-');
      if (!sets.has(key)) {
        sets.set(key, []);
      }
      sets.get(key)!.push(sample);
    });
    
    return Array.from(sets.entries()).map(([key, groupedSamples]) => {
      const firstSample = groupedSamples[0];
      const commonData: { [key: string]: any } = {};
      keyFields.forEach(field => commonData[field] = firstSample[field]);

      return {
        id: key,
        samples: groupedSamples,
        ...commonData,
      };
    });
  };

  const concreteCubeSets: ConcreteCubeSet[] = useMemo(() => {
    return groupIntoSets<ConcreteCube>(concreteCubes, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'class', 'areaOfUse']);
  }, [concreteCubes]);

  const blocksAndBricksSets: BlockAndBrickSet[] = useMemo(() => {
    return groupIntoSets<BlockAndBrick>(blocksAndBricks, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'areaOfUse', 'sampleType']);
  }, [blocksAndBricks]);
  
  const paverSets: PaverSet[] = useMemo(() => {
    return groupIntoSets<Paver>(pavers, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'areaOfUse', 'paverType']);
  }, [pavers]);

  const cylinderSets: CylinderSet[] = useMemo(() => {
    return groupIntoSets<Cylinder>(cylinders, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'class', 'areaOfUse']);
  }, [cylinders]);

  const waterAbsorptionSets: WaterAbsorptionSet[] = useMemo(() => {
    return groupIntoSets<WaterAbsorption>(waterAbsorptions, ['client', 'project', 'dateReceived', 'castingDate', 'testingDate', 'areaOfUse', 'sampleType']);
  }, [waterAbsorptions]);

  const areAllTestsFilled = (samples: any[]) => {
    return samples.every(s => 
      s.dimensions &&
      s.weightKg != null &&
      s.loadKN != null &&
      s.modeOfFailure
    );
  };
  
  const issuanceDisabled = (sets: {samples: any[]}[]) => {
    if (sets.length === 0) return true;
    return !sets.every(set => areAllTestsFilled(set.samples));
  }

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
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Concrete Cubes</CardTitle>
                    <CardDescription>A register for all concrete cube tests.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                      <Button onClick={() => setIsTestCubesDialogOpen(true)} disabled={selectedCubeSets.length === 0}>
                          <TestTubeDiagonal className="mr-2 h-4 w-4" />
                          Test
                      </Button>
                      <Button onClick={() => setIsIssuanceCubesDialogOpen(true)} disabled={issuanceDisabled(selectedCubeSets)} variant="outline">
                          <FileSignature className="mr-2 h-4 w-4" />
                          Issuance
                      </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                  <ConcreteCubesTable 
                      columns={getConcreteCubesColumns({ onEdit: (samples) => { setIsTestCubesDialogOpen(true); setSelectedCubeSets([{id: 'edit', samples, client:'', project:'', dateReceived:'', castingDate:'', testingDate:'', class:'', areaOfUse:'' }])}})} 
                      data={concreteCubeSets} 
                      isLoading={isConcreteCubesLoading} 
                      onSelectionChange={(rows) => setSelectedCubeSets(rows)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks-and-bricks">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Sample Register/Log for Bricks &amp; Blocks</CardTitle>
                        <CardDescription>A register for all brick and block tests.</CardDescription>
                    </div>
                     <div className="flex items-center gap-2">
                        <Button onClick={() => setIsTestBlocksAndBricksDialogOpen(true)} disabled={selectedBlocksAndBricksSets.length === 0}>
                            <TestTubeDiagonal className="mr-2 h-4 w-4" />
                            Test
                        </Button>
                        <Button onClick={() => setIsIssuanceBlocksAndBricksDialogOpen(true)} disabled={issuanceDisabled(selectedBlocksAndBricksSets)} variant="outline">
                            <FileSignature className="mr-2 h-4 w-4" />
                            Issuance
                        </Button>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <BlocksAndBricksTable 
                        columns={getBlocksAndBricksColumns({ onEdit: (samples) => {setIsTestBlocksAndBricksDialogOpen(true); setSelectedBlocksAndBricksSets([{id: 'edit', samples, client:'', project:'', dateReceived:'', castingDate:'', testingDate:'', sampleType:'', areaOfUse:'' }])} })} 
                        data={blocksAndBricksSets} 
                        isLoading={isBlocksAndBricksLoading} 
                        onSelectionChange={(rows) => setSelectedBlocksAndBricksSets(rows)} 
                    />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pavers">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Sample Register/Log for Pavers</CardTitle>
                        <CardDescription>A register for all paver tests.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsTestPaversDialogOpen(true)} disabled={selectedPaverSets.length === 0}>
                            <TestTubeDiagonal className="mr-2 h-4 w-4" />
                            Test
                        </Button>
                        <Button onClick={() => setIsIssuancePaversDialogOpen(true)} disabled={issuanceDisabled(selectedPaverSets)} variant="outline">
                            <FileSignature className="mr-2 h-4 w-4" />
                            Issuance
                        </Button>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <PaversTable 
                        columns={getPaverColumns({ onEdit: (samples) => {setIsTestPaversDialogOpen(true); setSelectedPaverSets([{id: 'edit', samples, client:'', project:'', dateReceived:'', castingDate:'', testingDate:'', areaOfUse:'', paverType:'' }])}, onDelete: handlePaverSetDeleted })} 
                        data={paverSets} 
                        isLoading={isPaversLoading} 
                        onSelectionChange={(rows) => setSelectedPaverSets(rows)} 
                    />
                </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="cylinders">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Sample Register/Log for Concrete Cylinders</CardTitle>
                        <CardDescription>A register for all concrete cylinder tests.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsTestCylindersDialogOpen(true)} disabled={selectedCylinderSets.length === 0}>
                            <TestTubeDiagonal className="mr-2 h-4 w-4" />
                            Test
                        </Button>
                        <Button onClick={() => setIsIssuanceCylindersDialogOpen(true)} disabled={issuanceDisabled(selectedCylinderSets)} variant="outline">
                            <FileSignature className="mr-2 h-4 w-4" />
                            Issuance
                        </Button>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CylindersTable 
                        columns={getCylinderColumns({ onEdit: (samples) => { setIsTestCylindersDialogOpen(true); setSelectedCylinderSets([{id: 'edit', samples, client:'', project:'', dateReceived:'', castingDate:'', testingDate:'', class:'', areaOfUse:'' }])} })} 
                        data={cylinderSets} 
                        isLoading={isCylindersLoading} 
                        onSelectionChange={(rows) => setSelectedCylinderSets(rows)} 
                    />
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water-absorption">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Sample Register/Log for Bricks &amp; Blocks for Water</CardTitle>
                        <CardDescription>A register for all water absorption tests on bricks and blocks.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={() => setIsTestWaterAbsorptionsDialogOpen(true)} disabled={selectedWaterAbsorptionSets.length === 0}>
                            <TestTubeDiagonal className="mr-2 h-4 w-4" />
                            Test
                        </Button>
                        <Button onClick={() => setIsIssuanceWaterAbsorptionsDialogOpen(true)} disabled={selectedWaterAbsorptionSets.length === 0} variant="outline">
                            <FileSignature className="mr-2 h-4 w-4" />
                            Issuance
                        </Button>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <WaterAbsorptionTable 
                        columns={getWaterAbsorptionColumns({ onEdit: (samples) => { setIsTestWaterAbsorptionsDialogOpen(true); setSelectedWaterAbsorptionSets([{id: 'edit', samples, client:'', project:'', dateReceived:'', castingDate:'', testingDate:'', areaOfUse:'', sampleType:'' }])} })} 
                        data={waterAbsorptionSets} 
                        isLoading={isWaterAbsorptionsLoading} 
                        onSelectionChange={(rows) => setSelectedWaterAbsorptionSets(rows)} 
                    />
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
      
      {editingProject && <EditProjectDialog project={editingProject} onOpenChange={(open) => !open && setEditingProject(null)} onProjectUpdated={handleProjectUpdated} />}
      
      {isTestCubesDialogOpen && selectedCubeSets.length > 0 && <TestConcreteCubesDialog items={selectedCubeSets.flatMap(s => s.samples)} onOpenChange={setIsTestCubesDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateConcreteCube, getConcreteCubes, setConcreteCubes, setIsConcreteCubesLoading, 'concrete cube', () => setIsTestCubesDialogOpen(false))} />}
      {isIssuanceCubesDialogOpen && selectedCubeSets.length > 0 && <IssuanceConcreteCubesDialog items={selectedCubeSets.flatMap(s => s.samples)} onOpenChange={setIsIssuanceCubesDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateConcreteCube, getConcreteCubes, setConcreteCubes, setIsConcreteCubesLoading, 'concrete cube', () => setIsIssuanceCubesDialogOpen(false))} />}

      {isTestBlocksAndBricksDialogOpen && selectedBlocksAndBricksSets.length > 0 && <TestBlocksAndBricksDialog items={selectedBlocksAndBricksSets.flatMap(s => s.samples)} onOpenChange={setIsTestBlocksAndBricksDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateBlockAndBrick, getBlocksAndBricks, setBlocksAndBricks, setIsBlocksAndBricksLoading, 'block/brick', () => setIsTestBlocksAndBricksDialogOpen(false))} />}
      {isIssuanceBlocksAndBricksDialogOpen && selectedBlocksAndBricksSets.length > 0 && <IssuanceBlocksAndBricksDialog items={selectedBlocksAndBricksSets.flatMap(s => s.samples)} onOpenChange={setIsIssuanceBlocksAndBricksDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateBlockAndBrick, getBlocksAndBricks, setBlocksAndBricks, setIsBlocksAndBricksLoading, 'block/brick', () => setIsIssuanceBlocksAndBricksDialogOpen(false))} />}

      {isTestPaversDialogOpen && selectedPaverSets.length > 0 && <TestPaversDialog items={selectedPaverSets.flatMap(s => s.samples)} onOpenChange={setIsTestPaversDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updatePaver, getPavers, setPavers, setIsPaversLoading, 'paver', () => setIsTestPaversDialogOpen(false))} />}
      {isIssuancePaversDialogOpen && selectedPaverSets.length > 0 && <IssuancePaversDialog items={selectedPaverSets.flatMap(s => s.samples)} onOpenChange={setIsIssuancePaversDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updatePaver, getPavers, setPavers, setIsPaversLoading, 'paver', () => setIsIssuancePaversDialogOpen(false))} />}

      {isTestCylindersDialogOpen && selectedCylinderSets.length > 0 && <TestCylindersDialog items={selectedCylinderSets.flatMap(s => s.samples)} onOpenChange={setIsTestCylindersDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateCylinder, getCylinders, setCylinders, setIsCylindersLoading, 'cylinder', () => setIsTestCylindersDialogOpen(false))} />}
      {isIssuanceCylindersDialogOpen && selectedCylinderSets.length > 0 && <IssuanceCylindersDialog items={selectedCylinderSets.flatMap(s => s.samples)} onOpenChange={setIsIssuanceCylindersDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateCylinder, getCylinders, setCylinders, setIsCylindersLoading, 'cylinder', () => setIsIssuanceCylindersDialogOpen(false))} />}
      
      {isTestWaterAbsorptionsDialogOpen && selectedWaterAbsorptionSets.length > 0 && <TestWaterAbsorptionsDialog items={selectedWaterAbsorptionSets.flatMap(s => s.samples)} onOpenChange={setIsTestWaterAbsorptionsDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateWaterAbsorption, getWaterAbsorptions, setWaterAbsorptions, setIsWaterAbsorptionsLoading, 'water absorption', () => setIsTestWaterAbsorptionsDialogOpen(false))} />}
      {isIssuanceWaterAbsorptionsDialogOpen && selectedWaterAbsorptionSets.length > 0 && <IssuanceWaterAbsorptionsDialog items={selectedWaterAbsorptionSets.flatMap(s => s.samples)} onOpenChange={setIsIssuanceWaterAbsorptionsDialogOpen} onBatchUpdate={(items) => handleBatchUpdate(items, updateWaterAbsorption, getWaterAbsorptions, setWaterAbsorptions, setIsWaterAbsorptionsLoading, 'water absorption', () => setIsIssuanceWaterAbsorptionsDialogOpen(false))} />}
    </>
  );
}
