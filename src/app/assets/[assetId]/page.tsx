
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, collection, getDocs, addDoc, query, orderBy, where, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams, useRouter } from 'next/navigation';
import { Asset, CalibrationRecord, MaintenanceRecord } from '@/lib/types';
import { Loader2, ArrowLeft, Thermometer, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow, addDays } from 'date-fns';
import { getCategoryName } from '@/lib/asset-categories';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalibrationLog } from './components/calibration-log';
import { MaintenanceLog } from './components/maintenance-log';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { HasPermission } from '@/components/auth/has-permission';

export default function AssetDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const { laboratoryId, user } = useAuth();
    const assetId = params.assetId as string;

    const [asset, setAsset] = useState<Asset | null>(null);
    const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!assetId || !laboratoryId) return;
        setLoading(true);
        try {
            const assetDocRef = doc(db, 'assets', assetId);
            const assetDoc = await getDoc(assetDocRef);

            if (assetDoc.exists() && assetDoc.data().laboratoryId === laboratoryId) {
                const assetData = { id: assetDoc.id, ...assetDoc.data() } as Asset;
                setAsset(assetData);

                const calQuery = query(
                    collection(db, 'calibrations'),
                    where('assetId', '==', assetId),
                    orderBy('date', 'desc')
                );
                const calSnapshot = await getDocs(calQuery);
                setCalibrations(calSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CalibrationRecord)));

                const maintQuery = query(
                    collection(db, 'maintenance'),
                    where('assetId', '==', assetId),
                    orderBy('date', 'desc')
                );
                const maintSnapshot = await getDocs(maintQuery);
                setMaintenance(maintSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MaintenanceRecord)));

            } else {
                toast({ variant: 'destructive', title: 'Not Found', description: 'Asset not found or you do not have permission to view it.' });
                router.push('/assets');
            }
        } catch (error) {
            console.error("Error fetching asset details:", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch asset details.' });
        } finally {
            setLoading(false);
        }
    }, [assetId, laboratoryId, router, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCalibrationAdded = async (newCalibration: Omit<CalibrationRecord, 'id' | 'assetId' | 'laboratoryId'>) => {
        if (!asset) return;
        
        try {
            await addDoc(collection(db, 'calibrations'), {
                ...newCalibration,
                assetId: asset.id,
                laboratoryId,
            });

            // Update next calibration date on asset
            if (asset.calibrationFrequency) {
                const nextDate = addDays(new Date(newCalibration.date), asset.calibrationFrequency);
                await updateDoc(doc(db, 'assets', asset.id), {
                    nextCalibrationDate: nextDate.toISOString(),
                });
            }

            toast({ title: "Success", description: "Calibration record added."});
            fetchData();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Could not add calibration record."});
        }
    };
    
    const handleMaintenanceAdded = async (newMaintenance: Omit<MaintenanceRecord, 'id' | 'assetId' | 'laboratoryId'>) => {
         if (!asset) return;
        
        try {
            await addDoc(collection(db, 'maintenance'), {
                ...newMaintenance,
                assetId: asset.id,
                laboratoryId,
            });

            if (asset.maintenanceFrequency) {
                const nextDate = addDays(new Date(newMaintenance.date), asset.maintenanceFrequency);
                await updateDoc(doc(db, 'assets', asset.id), {
                    nextMaintenanceDate: nextDate.toISOString(),
                });
            }

            toast({ title: "Success", description: "Maintenance record added."});
            fetchData();
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Could not add maintenance record."});
        }
    };

    if (loading) {
        return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!asset) {
        return null;
    }

    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.push('/assets')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Assets
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{asset.name}</CardTitle>
                    <CardDescription>Asset Tag: {asset.assetTag} | Serial No: {asset.serialNumber || 'N/A'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium">{asset.status}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-medium">{getCategoryName(asset.categoryId)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{asset.location}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Purchase Date</p>
                            <p className="font-medium">{asset.purchaseDate ? format(new Date(asset.purchaseDate), 'PPP') : 'N/A'}</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-muted-foreground">Purchase Cost</p>
                            <p className="font-medium">{asset.purchaseCost ? `$${asset.purchaseCost.toLocaleString()}`: 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Vendor</p>
                            <p className="font-medium">{asset.vendor || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Warranty Expiry</p>
                            <p className="font-medium">{asset.warrantyExpiryDate ? format(new Date(asset.warrantyExpiryDate), 'PPP') : 'N/A'}</p>
                        </div>
                        {asset.isCalibrated && (
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Next Calibration</p>
                                <p className="font-medium">{asset.nextCalibrationDate ? `${format(new Date(asset.nextCalibrationDate), 'PPP')} (${formatDistanceToNow(new Date(asset.nextCalibrationDate), { addSuffix: true })})` : 'Not Set'}</p>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Next Maintenance</p>
                            <p className="font-medium">{asset.nextMaintenanceDate ? `${format(new Date(asset.nextMaintenanceDate), 'PPP')} (${formatDistanceToNow(new Date(asset.nextMaintenanceDate), { addSuffix: true })})` : 'Not Set'}</p>
                        </div>
                    </div>
                    {asset.notes && (
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground">Notes</p>
                            <p className="text-sm whitespace-pre-wrap">{asset.notes}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue="calibration">
                <TabsList>
                    <TabsTrigger value="calibration"><Thermometer className="mr-2 h-4 w-4"/>Calibration</TabsTrigger>
                    <TabsTrigger value="maintenance"><Wrench className="mr-2 h-4 w-4"/>Maintenance</TabsTrigger>
                </TabsList>
                <TabsContent value="calibration">
                   <CalibrationLog calibrations={calibrations} onAddCalibration={handleCalibrationAdded} asset={asset} currentUser={user} />
                </TabsContent>
                <TabsContent value="maintenance">
                   <MaintenanceLog maintenance={maintenance} onAddMaintenance={handleMaintenanceAdded} currentUser={user} />
                </TabsContent>
            </Tabs>

        </div>
    );
}
