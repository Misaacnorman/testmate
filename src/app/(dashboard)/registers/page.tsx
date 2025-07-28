
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
import { getProjects } from '@/services/projects';
import { getColumns as getProjectColumns } from './components/project-columns';
import { ConcreteCubesTable } from './components/concrete-cubes-table';
import { getColumns as getConcreteCubesColumns } from './components/concrete-cubes-columns';
import { ConcreteCube } from '@/types/concrete-cube';
import { getConcreteCubes } from '@/services/concrete-cubes';
import { BlockAndBrick } from '@/types/block-and-brick';
import { getBlocksAndBricks } from '@/services/blocks-and-bricks';
import { getColumns as getBlocksAndBricksColumns } from './components/blocks-and-bricks-columns';
import { BlocksAndBricksTable } from './components/blocks-and-bricks-table';
import { Paver } from '@/types/paver';
import { getPavers } from '@/services/pavers';
import { getColumns as getPaverColumns } from './components/paver-columns';
import { PaversTable } from './components/pavers-table';

export default function RegistersPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [concreteCubes, setConcreteCubes] = useState<ConcreteCube[]>([]);
  const [blocksAndBricks, setBlocksAndBricks] = useState<BlockAndBrick[]>([]);
  const [pavers, setPavers] = useState<Paver[]>([]);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [isConcreteCubesLoading, setIsConcreteCubesLoading] = useState(true);
  const [isBlocksAndBricksLoading, setIsBlocksAndBricksLoading] = useState(true);
  const [isPaversLoading, setIsPaversLoading] = useState(true);
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
        const fetchedData = await getConcreteCubes();
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
        const fetchedData = await getBlocksAndBricks();
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
        const fetchedData = await getPavers();
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

  useEffect(() => {
    fetchReceipts();
    fetchProjects();
    fetchConcreteCubes();
    fetchBlocksAndBricks();
    fetchPavers();
  }, [fetchReceipts, fetchProjects, fetchConcreteCubes, fetchBlocksAndBricks, fetchPavers]);

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

  const receiptColumns = useMemo(() => getReceiptColumns({ onDelete: handleReceiptDeleted }), [handleReceiptDeleted]);
  const projectColumns = useMemo(() => getProjectColumns(), []);
  const concreteCubesColumns = useMemo(() => getConcreteCubesColumns(), []);
  const blocksAndBricksColumns = useMemo(() => getBlocksAndBricksColumns(), []);
  const paverColumns = useMemo(() => getPaverColumns(), []);


  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Registers</h2>
          <p className="text-muted-foreground">
            View and manage all laboratory registers.
          </p>
        </div>
      </div>
      <Tabs defaultValue="sample-receipts">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="sample-receipts">Sample Receipts</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="concrete-cubes">Concrete Cubes</TabsTrigger>
          <TabsTrigger value="blocks-and-bricks">Blocks &amp; Bricks</TabsTrigger>
          <TabsTrigger value="pavers">Pavers</TabsTrigger>
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
              <CardTitle>Projects and Samples Register/Log Book</CardTitle>
              <CardDescription>A log of all projects and their associated details.</CardDescription>
            </CardHeader>
            <CardContent>
                <ProjectsTable columns={projectColumns} data={projects} isLoading={isProjectsLoading} />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="concrete-cubes">
           <Card>
            <CardHeader>
              <CardTitle>Concrete Cubes</CardTitle>
              <CardDescription>A register for all concrete cube tests.</CardDescription>
            </CardHeader>
            <CardContent>
                <ConcreteCubesTable columns={concreteCubesColumns} data={concreteCubes} isLoading={isConcreteCubesLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blocks-and-bricks">
           <Card>
            <CardHeader>
              <CardTitle>Sample Register/Log for Bricks &amp; Blocks</CardTitle>
              <CardDescription>A register for all brick and block tests.</CardDescription>
            </CardHeader>
            <CardContent>
                <BlocksAndBricksTable columns={blocksAndBricksColumns} data={blocksAndBricks} isLoading={isBlocksAndBricksLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pavers">
           <Card>
            <CardHeader>
              <CardTitle>Sample Register/Log for Pavers</CardTitle>
              <CardDescription>A register for all paver tests.</CardDescription>
            </CardHeader>
            <CardContent>
                <PaversTable columns={paverColumns} data={pavers} isLoading={isPaversLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
