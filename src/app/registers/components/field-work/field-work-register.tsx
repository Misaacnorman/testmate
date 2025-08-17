
'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getFieldWorkInstructions } from './data';
import { getFieldWorkColumns } from './columns';
import { FieldWorkInstruction } from '@/lib/types';
import { FieldWorkDataTable } from './data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function FieldWorkRegister() {
  const [instructions, setInstructions] = React.useState<FieldWorkInstruction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const loadInstructions = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFieldWorkInstructions();
      setInstructions(data);
    } catch (error) {
      console.error('Failed to load field work instructions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load instructions from the register.',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadInstructions();
  }, [loadInstructions]);

  const columns = React.useMemo(() => getFieldWorkColumns(), []);

  return (
    <Card className="h-full flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Field Work Instructions</CardTitle>
                    <CardDescription>
                        Records of all assigned field work.
                    </CardDescription>
                </div>
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Instruction
                </Button>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
            <FieldWorkDataTable
                columns={columns}
                data={instructions}
                loading={loading}
            />
        </CardContent>
    </Card>
  );
}

