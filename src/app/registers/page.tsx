
'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConcreteCubesRegister } from './components/concrete-cubes/concrete-cubes-register';
import { PaversRegister } from './components/pavers/pavers-register';
import { BlocksBricksRegister } from './components/blocks-bricks/blocks-bricks-register';
import { CylindersRegister } from './components/cylinders/cylinders-register';

export default function RegistersPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sample Registers</h1>
          <p className="text-muted-foreground">
            Permanent records for all registered samples.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="concrete-cubes" className="w-full h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="concrete-cubes">Concrete Cubes</TabsTrigger>
            <TabsTrigger value="blocks-bricks">Blocks & Bricks</TabsTrigger>
            <TabsTrigger value="pavers">Pavers</TabsTrigger>
            <TabsTrigger value="cylinders">Cylinders</TabsTrigger>
            <TabsTrigger value="water-absorption">Water Absorption</TabsTrigger>
          </TabsList>
          <TabsContent value="concrete-cubes" className="flex-grow">
            <ConcreteCubesRegister />
          </TabsContent>
          <TabsContent value="pavers" className="flex-grow">
            <PaversRegister />
          </TabsContent>
           <TabsContent value="blocks-bricks" className="flex-grow">
             <BlocksBricksRegister />
          </TabsContent>
          <TabsContent value="cylinders" className="flex-grow">
             <CylindersRegister />
          </TabsContent>
          <TabsContent value="water-absorption">
            <Card>
                <CardHeader>
                    <CardTitle>Water Absorption Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Content for Water Absorption will be added here.</p>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
