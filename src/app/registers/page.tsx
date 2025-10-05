
"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConcreteCubesTable } from "./components/concrete-cubes-table";
import { PaversTable } from "./components/pavers-table";
import { CylindersTable } from "./components/cylinders-table";
import { BricksBlocksTable } from "./components/bricks-blocks-table";
import { WaterAbsorptionTable } from "./components/water-absorption-table";
import { ProjectsTable } from "./components/projects-table";

export default function RegistersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registers</h1>
        <p className="text-muted-foreground">
          This is the registers module. You can manage your different registers
          from here.
        </p>
      </div>
      <Tabs defaultValue="concrete-cubes">
        <TabsList>
          <TabsTrigger value="concrete-cubes">Concrete Cubes</TabsTrigger>
          <TabsTrigger value="pavers">Pavers</TabsTrigger>
          <TabsTrigger value="cylinders">Cylinders</TabsTrigger>
          <TabsTrigger value="bricks-blocks">Bricks & Blocks</TabsTrigger>
          <TabsTrigger value="water-absorption">Water Absorption</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="concrete-cubes">
          <ConcreteCubesTable />
        </TabsContent>
        <TabsContent value="pavers">
          <PaversTable />
        </TabsContent>
        <TabsContent value="cylinders">
          <CylindersTable />
        </TabsContent>
        <TabsContent value="bricks-blocks">
          <BricksBlocksTable />
        </TabsContent>
        <TabsContent value="water-absorption">
          <WaterAbsorptionTable />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
