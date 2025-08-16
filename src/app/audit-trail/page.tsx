import { File, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AuditLog } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const auditLogs: AuditLog[] = [
  { id: 'LOG001', timestamp: '2023-07-15 10:05:12', user: 'Dr. Alice', action: 'CREATE', details: 'Sample SMP-2024-006 created.' },
  { id: 'LOG002', timestamp: '2023-07-15 10:15:45', user: 'LabBot-01', action: 'UPDATE', details: 'Sample SMP-2024-006 status changed to In Progress.' },
  { id: 'LOG003', timestamp: '2023-07-15 11:30:02', user: 'Dr. Bob', action: 'READ', details: 'Viewed report for Batch B.' },
  { id: 'LOG004', timestamp: '2023-07-15 12:00:50', user: 'System', action: 'ALERT', details: 'Anomaly detected on Instrument LC-MS-02.' },
  { id: 'LOG005', timestamp: '2023-07-15 14:22:18', user: 'Dr. Carol', action: 'DELETE', details: 'Deleted outdated calibration profile for SPEC-A.' },
  { id: 'LOG006', timestamp: '2023-07-15 16:45:00', user: 'LabBot-01', action: 'UPDATE', details: 'Sample SMP-2024-006 status changed to Completed.' },
];

const getActionVariant = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (action) {
        case 'CREATE':
            return 'default';
        case 'UPDATE':
            return 'secondary';
        case 'DELETE':
            return 'destructive';
        case 'ALERT':
            return 'destructive'
        default:
            return 'outline';
    }
};

export default function AuditTrailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>
          An immutable history of all lab activities and changes.
        </CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search logs by user, action, or details..."
              className="w-full bg-background pl-8"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Export</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="w-[50%]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>
                  <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
                </TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
