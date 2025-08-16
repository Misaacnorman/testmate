import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { Sample } from '@/lib/types';

const samples: Sample[] = [
  {
    id: 'SMP-2024-001',
    status: 'Completed',
    location: 'Archive-C4',
    lastUpdate: '2023-07-01 10:00 AM',
    expectedNextStep: 'Archived',
    history: [],
  },
  {
    id: 'SMP-2024-002',
    status: 'In Progress',
    location: 'LC-MS-02',
    lastUpdate: '2023-07-03 02:15 PM',
    expectedNextStep: 'Data Analysis',
    history: [],
  },
  {
    id: 'SMP-2024-003',
    status: 'Pending',
    location: 'Accessioning',
    lastUpdate: '2023-07-05 09:30 AM',
    expectedNextStep: 'Preparation',
    history: [],
  },
  {
    id: 'SMP-2024-004',
    status: 'Requires Review',
    location: 'QC Hold',
    lastUpdate: '2023-07-06 11:00 AM',
    expectedNextStep: 'QC Review',
    history: [],
  },
  {
    id: 'SMP-2024-005',
    status: 'In Progress',
    location: 'Sequencer-A1',
    lastUpdate: '2023-07-07 04:45 PM',
    expectedNextStep: 'Primary Analysis',
    history: [],
  },
  {
    id: 'SMP-2024-006',
    status: 'Completed',
    location: 'Archive-C5',
    lastUpdate: '2023-07-08 01:20 PM',
    expectedNextStep: 'Archived',
    history: [],
  },
];

export default function SamplesPage() {
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="review" className="hidden sm:flex">
            Requires Review
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Location</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-7 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Sample
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Samples</CardTitle>
            <CardDescription>
              Track and manage all samples from accession to analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Sample ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Update
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        <FlaskConical className="h-5 w-5" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{sample.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          sample.status === 'Completed'
                            ? 'default'
                            : sample.status === 'Requires Review'
                            ? 'destructive'
                            : 'secondary'
                        }
                        className={
                          sample.status === 'Completed' ? 'bg-green-500/80' : ''
                        }
                      >
                        {sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sample.location}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {sample.lastUpdate}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Print Label</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-6</strong> of <strong>781</strong> samples
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
