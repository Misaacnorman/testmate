
'use client';

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  FlaskConical,
  Rss,
  Thermometer,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const chartData = [
  { status: 'Pending', count: 186, fill: 'var(--color-pending)' },
  { status: 'In Progress', count: 305, fill: 'var(--color-inProgress)' },
  { status: 'Completed', count: 237, fill: 'var(--color-completed)' },
  { status: 'Review', count: 73, fill: 'var(--color-review)' },
];

const chartConfig = {
  count: {
    label: 'Samples',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-4))',
  },
  inProgress: {
    label: 'In Progress',
    color: 'hsl(var(--chart-2))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))',
  },
  review: {
    label: 'Requires Review',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

const equipment = [
  { name: 'Spectrometer Alpha', status: 'Online' as const, id: 'SPEC-A' },
  { name: 'Centrifuge Prime', status: 'Offline' as const, id: 'CENT-P' },
  { name: 'PCR Machine 1', status: 'Maintenance' as const, id: 'PCR-1' },
  { name: 'Incubator Unit 3', status: 'Online' as const, id: 'INC-3' },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">781</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Equipment Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 / 4</div>
            <p className="text-xs text-muted-foreground">
              50% operational capacity
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +2 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sample Processing Overview</CardTitle>
            <CardDescription>
              A summary of all sample statuses this month.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>
              Real-time status of all connected lab instruments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrument</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'Online'
                            ? 'default'
                            : item.status === 'Maintenance'
                            ? 'secondary'
                            : 'destructive'
                        }
                        className={
                          item.status === 'Online' ? 'bg-green-500/80' : ''
                        }
                      >
                        {item.status === 'Online' && (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        )}
                        {item.status === 'Offline' && (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {item.status === 'Maintenance' && (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
