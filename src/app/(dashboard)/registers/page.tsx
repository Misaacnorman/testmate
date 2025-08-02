
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
import { ConcreteCubeSet } from '@/types/concrete-cube';
import { getConcreteCubeSets, updateConcreteCubeSet } from '@/services/concrete-cubes';
import { BlockAndBrickSet } from '@/types/block-and-brick';
import { getBlocksAndBricksSets, updateBlockAndBrickSet } from '@/services/blocks-and-bricks';
import { getColumns as getBlocksAndBricksColumns } from './components/blocks-and-bricks-columns';
import { BlocksAndBricksTable } from './components/blocks-and-bricks-table';
import { PaverSet } from '@/types/paver';
import { getPaverSets, updatePaverSet, deletePaverSet } from '@/services/pavers';
import { getColumns as getPaverColumns } from './components/paver-columns';
import { PaversTable } from './components/pavers-table';
import { CylinderSet } from '@/types/cylinder';
import { getCylinderSets, updateCylinderSet } from '@/services/cylinders';
import { getColumns as getCylinderColumns } from './components/cylinder-columns';
import { CylindersTable } from './components/cylinders-table';
import { WaterAbsorptionSet } from '@/types/water-absorption';
import { getWaterAbsorptionSets, updateWaterAbsorptionSet } from '@/services/water-absorptions';
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
  const [concreteCubes, setConcreteCubes] = useState<ConcreteCubeSet[]>([]);
  const [blocksAndBricks, setBlocksAndBricks] = useState<BlockAndBrickSet[]>([]);
  const [pavers, setPavers] = useState<PaverSet[]>([]);
  const [cylinders, setCylinders] = useState<CylinderSet[]>([]);
  const [waterAbsorptions, setWaterAbsorptions] = useState<WaterAbsorptionSet[]>([]);
  
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isConcreteCubesLoading, setIsConcreteCubesLoading] = useState(true);
  const [isBlocksAndBricksLoading, setIsBlocksAndBricksLoading] = useState(true);
  const [isPaversLoading, setIsPaversLoading] = useState(true);
  const [isCylindersLoading, setIsCylindersLoading] = useState(true);
  const [isWaterAbsorptionsLoading, setIsWaterAbsorptionsLoading] = useState(true);
  
  const [projectFilter, setProjectFilter] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingConcreteCube, setEditingConcreteCube] = useState<ConcreteCubeSet | null>(null);
  const [editingBlockAndBrick, setEditingBlockAndBrick] = useState<BlockAndBrickSet | null>(null);
  const [editingPaver, setEditingPaver] = useState<PaverSet | null>(null);
  const [editingCylinder, setEditingCylinder] = useState<CylinderSet | null>(null);
  const [editingWaterAbsorption, setEditingWaterAbsorption] = useState<WaterAbsorptionSet | null>(null);
  
  const [isTestCubesDialogOpen, setIsTestCubesDialogOpen] = useState(false);
  const [selectedCubes, setSelectedCubes] = useState<ConcreteCubeSet[]>([]);

  const [isTestBlocksAndBricksDialogOpen, setIsTestBlocksAndBricksDialogOpen] = useState(false);
  const [selectedBlocksAndBricks, setSelectedBlocksAndBricks] = useState<BlockAndBrickSet[]>([]);

  const [isTestPaversDialogOpen, setIsTestPaversDialogOpen] = useState(false);
  const [selectedPavers, setSelectedPavers] = useState<PaverSet[]>([]);

  const [isTestCylindersDialogOpen, setIsTestCylindersDialogOpen] = useState(false);
  const [selectedCylinders, setSelectedCylinders] = useState<CylinderSet[]>([]);

  const [isTestWaterAbsorptionsDialogOpen, setIsTestWaterAbsorptionsDialogOpen] = useState(false);
  const [selectedWaterAbsorptions, setSelectedWaterAbsorptions] = useState<WaterAbsorptionSet[]>([]);

  const { toast } = useToast();

  const fetchReceipts = useCallback(async () => {
    setIsReceiptsLoading(true);
    try {
      const fetchedReceipts = await getReceipts();
      setReceipts(fetchedReceipts);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
      toast({
        variant: "destructive",
        title: "Error fetching receipts",
        description: "Could not retrieve receipts from the database.",
      });
    } finally {
      setIsReceiptsLoading(false);
    }
  }, [toast]);
  
  const fetchProjects = useCallback(async () => {
    setIsProjectsLoading(true);
    try {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast({
        variant: "destructive",
        title: "Error fetching projects",
        description: "Could not retrieve projects from the database.",
      });
    } finally {
      setIsProjectsLoading(false);
    }
  }, [toast]);

  const fetchConcreteCubes = useCallback(async () => {
    setIsConcreteCubesLoading(true);
    try {
        const fetchedData = await getConcreteCubeSets();
        setConcreteCubes(fetchedData);
    } catch (error) {
        console.error("Failed to fetch concrete cubes:", error);
        toast({
            variant: "destructive",
            title: "Error fetching concrete cubes",
            description: "Could not retrieve concrete cube data.",
        });
    } finally {
        setIsConcreteCubesLoading(false);
    }
  }, [toast]);

  const fetchBlocksAndBricks = useCallback(async () => {
    setIsBlocksAndBricksLoading(true);
    try {
        const fetchedData = await getBlocksAndBricksSets();
        setBlocksAndBricks(fetchedData);
    } catch (error) {
        console.error("Failed to fetch blocks and bricks:", error);
        toast({
            variant: "destructive",
            title: "Error fetching blocks and bricks",
            description: "Could not retrieve blocks and bricks data.",
        });
    } finally {
        setIsBlocksAndBricksLoading(false);
    }
  }, [toast]);

  const fetchPavers = useCallback(async () => {
    setIsPaversLoading(true);
    try {
        const fetchedData = await getPaverSets();
        setPavers(fetchedData);
    } catch (error) {
        console.error("Failed to fetch pavers:", error);
        toast({
            variant: "destructive",
            title: "Error fetching pavers",
            description: "Could not retrieve paver data.",
        });
    } finally {
        setIsPaversLoading(false);
    }
  }, [toast]);

  const fetchCylinders = useCallback(async () => {
    setIsCylindersLoading(true);
    try {
        const fetchedData = await getCylinderSets();
        setCylinders(fetchedData);
    } catch (error) {
        console.error("Failed to fetch cylinders:", error);
        toast({
            variant: "destructive",
            title: "Error fetching cylinders",
            description: "Could not retrieve cylinder data.",
        });
    } finally {
        setIsCylindersLoading(false);
    }
  }, [toast]);

  const fetchWaterAbsorptions = useCallback(async () => {
    setIsWaterAbsorptionsLoading(true);
    try {
        const fetchedData = await getWaterAbsorptionSets();
        setWaterAbsorptions(fetchedData);
    } catch (error) {
        console.error("Failed to fetch water absorptions:", error);
        toast({
            variant: "destructive",
            title: "Error fetching water absorptions",
            description: "Could not retrieve water absorption data.",
        });
    } finally {
        setIsWaterAbsorptionsLoading(false);
    }
    }, [toast]);

  useEffect(() => {
    fetchReceipts();
    fetchProjects();
    fetchConcreteCubes();
    fetchBlocksAndBricks();
    fetchPavers();
    fetchCylinders();
    fetchWaterAbsorptions();
  }, [fetchReceipts, fetchProjects, fetchConcreteCubes, fetchBlocksAndBricks, fetchPavers, fetchCylinders, fetchWaterAbsorptions]);

  const handleReceiptDeleted = useCallback(async (receiptId: string) => {
    try {
      await deleteReceipt(receiptId);
      toast({
        title: "Receipt Deleted",
        description: "The receipt has been successfully deleted.",
      });
      fetchReceipts(); // Refetch data to update the table
    } catch (error) {
      console.error("Failed to delete receipt:", error);
      toast({
        variant: "destructive",
        title: "Error deleting receipt",
        description: "Could not delete the receipt.",
      });
    }
  }, [fetchReceipts, toast]);

  const handleProjectUpdated = async (project: Project) => {
    try {
      await updateProject(project);
      toast({
        title: "Project Updated",
        description: `Project ${project.project} has been updated.`,
      });
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
       console.error("Failed to update project:", error);
       toast({
         variant: "destructive",
         title: "Error updating project",
         description: "Could not save the updated project data.",
       });
    }
  };

  const handleProjectDeleted = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      toast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
      });
      fetchProjects();
    } catch (error) {
       console.error("Failed to delete project:", error);
       toast({
         variant: "destructive",
         title: "Error deleting project",
         description: "Could not delete the project.",
       });
    }
  };

  const handleConcreteCubeUpdated = async (cubeSet: ConcreteCubeSet) => {
    try {
      await updateConcreteCubeSet(cubeSet);
      toast({
        title: "Test Set Updated",
        description: `Concrete Cube Test Set has been updated.`,
      });
      setEditingConcreteCube(null);
      fetchConcreteCubes();
    } catch (error) {
       console.error("Failed to update concrete cube set:", error);
       toast({
         variant: "destructive",
         title: "Error updating test set",
         description: "Could not save the updated test data.",
       });
    }
  };
  
  const handleBatchCubesUpdate = async (updatedCubes: ConcreteCubeSet[]) => {
    try {
      await Promise.all(updatedCubes.map(cube => updateConcreteCubeSet(cube)));
       toast({
        title: "Batch Update Successful",
        description: `${updatedCubes.length} concrete cube test sets have been updated.`,
      });
      fetchConcreteCubes();
      setIsTestCubesDialogOpen(false);
      setSelectedCubes([]);
    } catch(error) {
       console.error("Failed to batch update concrete cubes:", error);
       toast({
         variant: "destructive",
         title: "Error during Batch Update",
         description: "Could not save the updated test data for some items.",
       });
    }
  }

  const handleBlockAndBrickUpdated = async (item: BlockAndBrickSet) => {
    try {
      await updateBlockAndBrickSet(item);
      toast({
        title: "Test Set Updated",
        description: `Block/Brick Test Set has been updated.`,
      });
      setEditingBlockAndBrick(null);
      fetchBlocksAndBricks();
    } catch (error) {
       console.error("Failed to update block/brick set:", error);
       toast({
         variant: "destructive",
         title: "Error updating test",
         description: "Could not save the updated test data.",
       });
    }
  };

  const handleBatchBlocksAndBricksUpdate = async (updatedItems: BlockAndBrickSet[]) => {
    try {
      await Promise.all(updatedItems.map(item => updateBlockAndBrickSet(item)));
       toast({
        title: "Batch Update Successful",
        description: `${updatedItems.length} blocks/bricks test sets have been updated.`,
      });
      fetchBlocksAndBricks();
      setIsTestBlocksAndBricksDialogOpen(false);
      setSelectedBlocksAndBricks([]);
    } catch(error) {
       console.error("Failed to batch update blocks/bricks:", error);
       toast({
         variant: "destructive",
         title: "Error during Batch Update",
         description: "Could not save the updated test data for some items.",
       });
    }
  }

  const handlePaverUpdated = async (item: PaverSet) => {
    try {
      await updatePaverSet(item);
      toast({
        title: "Test Set Updated",
        description: `Paver Test Set has been updated.`,
      });
      setEditingPaver(null);
      fetchPavers();
    } catch (error) {
       console.error("Failed to update paver set:", error);
       toast({
         variant: "destructive",
         title: "Error updating test set",
         description: "Could not save the updated test data.",
       });
    }
  };

  const handlePaverDeleted = async (paverSetId: string) => {
    try {
      await deletePaverSet(paverSetId);
      toast({
        title: "Paver Test Set Deleted",
        description: "The paver test set has been successfully deleted.",
      });
      fetchPavers();
    } catch (error) {
      console.error("Failed to delete paver:", error);
      toast({
        variant: "destructive",
        title: "Error Deleting Paver Set",
        description: "Could not delete the paver test set.",
      });
    }
  };

  const handleBatchPaversUpdate = async (updatedItems: PaverSet[]) => {
    try {
      await Promise.all(updatedItems.map(item => updatePaverSet(item)));
       toast({
        title: "Batch Update Successful",
        description: `${updatedItems.length} paver test sets have been updated.`,
      });
      fetchPavers();
      setIsTestPaversDialogOpen(false);
      setSelectedPavers([]);
    } catch(error) {
       console.error("Failed to batch update pavers:", error);
       toast({
         variant: "destructive",
         title: "Error during Batch Update",
         description: "Could not save the updated test data for some items.",
       });
    }
  }

  const handleCylinderUpdated = async (item: CylinderSet) => {
    try {
      await updateCylinderSet(item);
      toast({
        title: "Test Set Updated",
        description: `Cylinder Test Set has been updated.`,
      });
      setEditingCylinder(null);
      fetchCylinders();
    } catch (error) {
       console.error("Failed to update cylinder set:", error);
       toast({
         variant: "destructive",
         title: "Error updating test set",
         description: "Could not save the updated test data.",
       });
    }
  };

  const handleBatchCylindersUpdate = async (updatedItems: CylinderSet[]) => {
    try {
      await Promise.all(updatedItems.map(item => updateCylinderSet(item)));
       toast({
        title: "Batch Update Successful",
        description: `${updatedItems.length} cylinder test sets have been updated.`,
      });
      fetchCylinders();
      setIsTestCylindersDialogOpen(false);
      setSelectedCylinders([]);
    } catch(error) {
       console.error("Failed to batch update cylinders:", error);
       toast({
         variant: "destructive",
         title: "Error during Batch Update",
         description: "Could not save the updated test data for some items.",
       });
    }
  }

  const handleWaterAbsorptionUpdated = async (item: WaterAbsorptionSet) => {
    try {
      await updateWaterAbsorptionSet(item);
      toast({
        title: "Test Set Updated",
        description: `Water Absorption Test Set has been updated.`,
      });
      setEditingWaterAbsorption(null);
      fetchWaterAbsorptions();
    } catch (error) {
       console.error("Failed to update water absorption test set:", error);
       toast({
         variant: "destructive",
         title: "Error updating test set",
         description: "Could not save the updated test data.",
       });
    }
  };

   const handleBatchWaterAbsorptionsUpdate = async (updatedItems: WaterAbsorptionSet[]) => {
    try {
      await Promise.all(updatedItems.map(item => updateWaterAbsorptionSet(item)));
       toast({
        title: "Batch Update Successful",
        description: `${updatedItems.length} water absorption test sets have been updated.`,
      });
      fetchWaterAbsorptions();
      setIsTestWaterAbsorptionsDialogOpen(false);
      setSelectedWaterAbsorptions([]);
    } catch(error) {
       console.error("Failed to batch update water absorptions:", error);
       toast({
         variant: "destructive",
         title: "Error during Batch Update",
         description: "Could not save the updated test data for some items.",
       });
    }
  }

  const receiptColumns = useMemo(() => getReceiptColumns({ onDelete: handleReceiptDeleted }), [handleReceiptDeleted]);
  const projectColumns = useMemo(() => getProjectColumns({ onEdit: setEditingProject, onDelete: handleProjectDeleted }), [handleProjectDeleted]);
  const concreteCubesColumns = useMemo(() => getConcreteCubesColumns({ onEdit: setEditingConcreteCube }), []);
  const blocksAndBricksColumns = useMemo(() => getBlocksAndBricksColumns({ onEdit: setEditingBlockAndBrick }), []);
  const paverColumns = useMemo(() => getPaverColumns({ onEdit: setEditingPaver, onDelete: handlePaverDeleted }), [handlePaverDeleted]);
  const cylinderColumns = useMemo(() => getCylinderColumns({ onEdit: setEditingCylinder }), []);
  const waterAbsorptionColumns = useMemo(() => getWaterAbsorptionColumns({ onEdit: setEditingWaterAbsorption }), []);

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
            <Card>
              <CardHeader>
                <CardTitle>Sample Receipt Log</CardTitle>
                <CardDescription>A log of all sample receipts generated.</CardDescription>
              </CardHeader>
              <CardContent>
                <ReceiptsTable columns={receiptColumns} data={receipts} isLoading={isReceiptsLoading} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center gap-4">
                  <div>
                      <CardTitle>Projects and Samples Register/Log Book</CardTitle>
                      <CardDescription>A log of all projects and their associated details.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                        placeholder="Search all projects..."
                        value={projectFilter}
                        onChange={(event) => setProjectFilter(event.target.value)}
                        className="w-64"
                    />
                    <CreateProjectDialog onProjectCreated={fetchProjects} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                  <ProjectsTable columns={projectColumns} data={projects} isLoading={isProjectsLoading} globalFilter={projectFilter} />
              </CardContent>
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
                    <Button 
                      onClick={() => setIsTestCubesDialogOpen(true)} 
                      disabled={selectedCubes.length === 0}
                    >
                       <TestTubeDiagonal className="mr-2 h-4 w-4" />
                       Test ({selectedCubes.length})
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                  <ConcreteCubesTable columns={concreteCubesColumns} data={concreteCubes} isLoading={isConcreteCubesLoading} onSelectionChange={setSelectedCubes}/>
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
                   <Button 
                      onClick={() => setIsTestBlocksAndBricksDialogOpen(true)} 
                      disabled={selectedBlocksAndBricks.length === 0}
                    >
                       <TestTubeDiagonal className="mr-2 h-4 w-4" />
                       Test ({selectedBlocksAndBricks.length})
                    </Button>
                </div>
              </CardHeader>
              <CardContent>
                  <BlocksAndBricksTable columns={blocksAndBricksColumns} data={blocksAndBricks} isLoading={isBlocksAndBricksLoading} onSelectionChange={setSelectedBlocksAndBricks} />
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
                  <Button 
                    onClick={() => setIsTestPaversDialogOpen(true)} 
                    disabled={selectedPavers.length === 0}
                  >
                      <TestTubeDiagonal className="mr-2 h-4 w-4" />
                      Test ({selectedPavers.length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                  <PaversTable columns={paverColumns} data={pavers} isLoading={isPaversLoading} onSelectionChange={setSelectedPavers} />
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
                     <Button 
                        onClick={() => setIsTestCylindersDialogOpen(true)} 
                        disabled={selectedCylinders.length === 0}
                      >
                         <TestTubeDiagonal className="mr-2 h-4 w-4" />
                         Test ({selectedCylinders.length})
                      </Button>
                </div>
              </CardHeader>
              <CardContent>
                  <CylindersTable columns={cylinderColumns} data={cylinders} isLoading={isCylindersLoading} onSelectionChange={setSelectedCylinders} />
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
                      <Button 
                          onClick={() => setIsTestWaterAbsorptionsDialogOpen(true)} 
                          disabled={selectedWaterAbsorptions.length === 0}
                        >
                           <TestTubeDiagonal className="mr-2 h-4 w-4" />
                           Test ({selectedWaterAbsorptions.length})
                        </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                      <WaterAbsorptionTable columns={waterAbsorptionColumns} data={waterAbsorptions} isLoading={isWaterAbsorptionsLoading} onSelectionChange={setSelectedWaterAbsorptions} />
                  </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
      {editingProject && (
        <EditProjectDialog
            project={editingProject}
            onOpenChange={(open) => !open && setEditingProject(null)}
            onProjectUpdated={handleProjectUpdated}
        />
      )}
      {editingConcreteCube && (
        <EditConcreteCubeDialog 
          cubeSet={editingConcreteCube}
          onOpenChange={(open) => !open && setEditingConcreteCube(null)}
          onCubeUpdated={handleConcreteCubeUpdated}
        />
      )}
      {isTestCubesDialogOpen && selectedCubes.length > 0 && (
        <TestConcreteCubesDialog
          cubes={selectedCubes}
          onOpenChange={setIsTestCubesDialogOpen}
          onBatchUpdate={handleBatchCubesUpdate}
        />
      )}
      {editingBlockAndBrick && (
        <EditBlockAndBrickDialog 
          item={editingBlockAndBrick}
          onOpenChange={(open) => !open && setEditingBlockAndBrick(null)}
          onItemUpdated={handleBlockAndBrickUpdated}
        />
      )}
      {isTestBlocksAndBricksDialogOpen && selectedBlocksAndBricks.length > 0 && (
        <TestBlocksAndBricksDialog
          items={selectedBlocksAndBricks}
          onOpenChange={setIsTestBlocksAndBricksDialogOpen}
          onBatchUpdate={handleBatchBlocksAndBricksUpdate}
        />
      )}
      {editingPaver && (
        <EditPaverDialog
          item={editingPaver}
          onOpenChange={(open) => !open && setEditingPaver(null)}
          onItemUpdated={handlePaverUpdated}
        />
      )}
      {isTestPaversDialogOpen && selectedPavers.length > 0 && (
        <TestPaversDialog
          items={selectedPavers}
          onOpenChange={setIsTestPaversDialogOpen}
          onBatchUpdate={handleBatchPaversUpdate}
        />
      )}
      {editingCylinder && (
        <EditCylinderDialog
          item={editingCylinder}
          onOpenChange={(open) => !open && setEditingCylinder(null)}
          onItemUpdated={handleCylinderUpdated}
        />
      )}
       {isTestCylindersDialogOpen && selectedCylinders.length > 0 && (
        <TestCylindersDialog
          items={selectedCylinders}
          onOpenChange={setIsTestCylindersDialogOpen}
          onBatchUpdate={handleBatchCylindersUpdate}
        />
      )}
      {editingWaterAbsorption && (
        <EditWaterAbsorptionDialog
          item={editingWaterAbsorption}
          onOpenChange={(open) => !open && setEditingWaterAbsorption(null)}
          onItemUpdated={handleWaterAbsorptionUpdated}
        />
      )}
       {isTestWaterAbsorptionsDialogOpen && selectedWaterAbsorptions.length > 0 && (
        <TestWaterAbsorptionsDialog
          items={selectedWaterAbsorptions}
          onOpenChange={setIsTestWaterAbsorptionsDialogOpen}
          onBatchUpdate={handleBatchWaterAbsorptionsUpdate}
        />
      )}
    </>
  );
}
