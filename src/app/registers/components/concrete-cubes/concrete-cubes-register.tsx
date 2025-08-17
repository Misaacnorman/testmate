
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getConcreteCubes } from './data';
import { columns } from './columns';
import { ConcreteCubeSample } from '@/lib/types';
import { ConcreteCubesDataTable } from './data-table';

export function ConcreteCubesRegister() {
  const [samples, setSamples] = React.useState<ConcreteCubeSample[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const loadSamples = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConcreteCubes();
      setSamples(data);
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

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <CardTitle>Concrete Cubes Register</CardTitle>
            <CardDescription>
                Detailed records of all concrete cube samples.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <ConcreteCubesDataTable
                columns={columns}
                data={samples}
                loading={loading}
            />
        </CardContent>
    </Card>
  );
}

