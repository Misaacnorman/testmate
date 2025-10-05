

"use client";

import * as React from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";
import { ConcreteCubeRegisterEntry, WaterAbsorptionRegisterEntry, BricksBlocksRegisterEntry, PaverRegisterEntry, CertificateStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Eye, Loader2 } from "lucide-react";
import { ConcreteCubeCertificate } from "./components/ConcreteCubeCertificate";
import { WaterAbsorptionCertificate } from "./components/WaterAbsorptionCertificate";
import { SolidBlockCertificate } from "./components/SolidBlockCertificate";
import { BrickCertificate } from "./components/BrickCertificate";
import { HollowBlockCertificate } from "./components/HollowBlockCertificate";
import { PaverCertificate } from "./components/PaverCertificate";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Certificate = 
    (ConcreteCubeRegisterEntry & { certType: 'concrete' }) | 
    (WaterAbsorptionRegisterEntry & { certType: 'water' }) |
    (BricksBlocksRegisterEntry & { certType: 'solid_block' | 'brick' | 'hollow_block' }) |
    (PaverRegisterEntry & { certType: 'paver' });

const formatDateFromFirestore = (dateValue: any): string => {
    if (!dateValue) return '-';
    try {
        let date: Date;
        if (dateValue && typeof dateValue.seconds === 'number') {
            date = dateValue.toDate();
        } else {
            date = new Date(dateValue);
        }
        if (isNaN(date.getTime())) return '-';
        return format(date, "PPP");
    } catch {
        return '-';
    }
};

const statusColors: Record<CertificateStatus, string> = {
    'Pending Initial Approval': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Pending Final Approval': 'bg-blue-100 text-blue-800 border-blue-300',
    'Approved': 'bg-green-100 text-green-800 border-green-300',
    'Rejected': 'bg-red-100 text-red-800 border-red-300',
};


export default function TestCertificatesPage() {
    const [certificates, setCertificates] = React.useState<Certificate[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { laboratoryId } = useAuth();
    const [viewingCertificate, setViewingCertificate] = React.useState<Certificate | null>(null);

    React.useEffect(() => {
        const fetchCertificates = async () => {
            if (!laboratoryId) return;
            setLoading(true);
            try {
                const concreteQuery = query(collection(db, "concrete_cubes_register"));
                const waterQuery = query(collection(db, "water_absorption_register"));
                const bricksQuery = query(collection(db, "bricks_blocks_register"));
                const paversQuery = query(collection(db, "pavers_register"));

                const [concreteSnapshot, waterSnapshot, bricksSnapshot, paversSnapshot] = await Promise.all([
                    getDocs(concreteQuery),
                    getDocs(waterQuery),
                    getDocs(bricksQuery),
                    getDocs(paversQuery)
                ]);

                const concreteCerts = concreteSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), certType: 'concrete' } as Certificate))
                    .filter(c => c.results && c.results.length > 0 && c.certificateNumber);

                const waterCerts = waterSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), certType: 'water' } as Certificate))
                    .filter(c => c.results && c.results.length > 0 && c.certificateNumber);
                
                const solidBlockCerts = bricksSnapshot.docs
                    .filter(doc => doc.data().sampleType === 'Solid')
                    .map(doc => ({ id: doc.id, ...doc.data(), certType: 'solid_block' } as Certificate))
                    .filter(c => c.results && c.results.length > 0 && c.certificateNumber);

                const brickCerts = bricksSnapshot.docs
                    .filter(doc => doc.data().sampleType === 'Brick')
                    .map(doc => ({ id: doc.id, ...doc.data(), certType: 'brick' } as Certificate))
                    .filter(c => c.results && c.results.length > 0 && c.certificateNumber);
                
                const hollowBlockCerts = bricksSnapshot.docs
                    .filter(doc => doc.data().sampleType === 'Hollow')
                    .map(doc => ({ id: doc.id, ...doc.data(), certType: 'hollow_block' } as Certificate))
                    .filter(c => c.results && c.results.length > 0 && c.certificateNumber);

                const paverCerts = paversSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data(), certType: 'paver' } as Certificate))
                    .filter(c => c.results && c.results.length > 0 && c.certificateNumber);
                
                setCertificates([
                    ...concreteCerts, 
                    ...waterCerts, 
                    ...solidBlockCerts, 
                    ...brickCerts, 
                    ...hollowBlockCerts,
                    ...paverCerts
                ].sort((a,b) => (b.dateOfIssue || 0) > (a.dateOfIssue || 0) ? 1 : -1));

            } catch (error) {
                console.error("Error fetching certificates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, [laboratoryId]);
    
    if (viewingCertificate) {
        if (viewingCertificate.certType === 'concrete') {
            return <ConcreteCubeCertificate certificateData={viewingCertificate as ConcreteCubeRegisterEntry} onBack={() => setViewingCertificate(null)} />;
        }
        if (viewingCertificate.certType === 'water') {
            return <WaterAbsorptionCertificate certificateData={viewingCertificate as WaterAbsorptionRegisterEntry} onBack={() => setViewingCertificate(null)} />;
        }
        if (viewingCertificate.certType === 'solid_block') {
            return <SolidBlockCertificate certificateData={viewingCertificate as BricksBlocksRegisterEntry} onBack={() => setViewingCertificate(null)} />;
        }
        if (viewingCertificate.certType === 'brick') {
            return <BrickCertificate certificateData={viewingCertificate as BricksBlocksRegisterEntry} onBack={() => setViewingCertificate(null)} />;
        }
        if (viewingCertificate.certType === 'hollow_block') {
            return <HollowBlockCertificate certificateData={viewingCertificate as BricksBlocksRegisterEntry} onBack={() => setViewingCertificate(null)} />;
        }
        if (viewingCertificate.certType === 'paver') {
            return <PaverCertificate certificateData={viewingCertificate as PaverRegisterEntry} onBack={() => setViewingCertificate(null)} />;
        }
    }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Test Certificates</h1>
        <p className="text-muted-foreground">
          View and manage generated test certificates for all sample types.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Generated Certificates</CardTitle>
          <CardDescription>A list of all test certificates ready for viewing or printing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate Type</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date Tested</TableHead>
                  <TableHead>Cert. Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No certificates have been generated yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((cert) => (
                    <TableRow key={`${cert.id}-${cert.certType}`}>
                      <TableCell className="font-medium">
                        {cert.certType === 'concrete' && 'Concrete Cube Compressive Strength'}
                        {cert.certType === 'water' && 'Water Absorption'}
                        {cert.certType === 'solid_block' && 'Solid Block Compressive Strength'}
                        {cert.certType === 'brick' && 'Brick Compressive Strength'}
                        {cert.certType === 'hollow_block' && 'Hollow Block Compressive Strength'}
                        {cert.certType === 'paver' && 'Paving Block Compressive Strength'}
                      </TableCell>
                      <TableCell>{cert.client}</TableCell>
                      <TableCell>{cert.project}</TableCell>
                      <TableCell>{formatDateFromFirestore(cert.testingDate)}</TableCell>
                      <TableCell>{cert.certificateNumber}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs", statusColors[cert.status])}>
                            {cert.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => setViewingCertificate(cert)}>
                            <Eye className="mr-2 h-4 w-4"/>
                            View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
