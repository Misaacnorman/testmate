
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, doc, addDoc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Asset, AssetCategory, AssetStatus, ASSET_STATUSES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Wrench, Thermometer, AlertTriangle, PackageCheck } from 'lucide-react';
import { AssetDialog } from './components/asset-dialog';
import { useToast } from '@/hooks/use-toast';
import { AssetsDataTable } from './components/asset-data-table';
import { getColumns } from './components/asset-columns';
import { useAuth } from '@/context/auth-context';
import { ASSET_CATEGORIES } from '@/lib/asset-categories';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addDays, differenceInDays } from 'date-fns';
import { HasPermission } from '@/components/auth/has-permission';

export default function AssetsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { laboratoryId } = useAuth();
  
  const [deletingAssetIds, setDeletingAssetIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!laboratoryId) return;
    setLoading(true);
    
    try {
      const assetsSnapshot = await getDocs(query(collection(db, "assets"), where("laboratoryId", "==", laboratoryId)));
      const assetsData = assetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
      setAssets(assetsData);
    } catch (error) {
      console.error("Error fetching assets: ", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch assets",
        description: "Could not load assets from Firestore.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, laboratoryId]);

  useEffect(() => {
    if(laboratoryId) {
      fetchData();
    }
  }, [fetchData, laboratoryId]);

  const handleDialogOpen = (asset: Asset | null = null) => {
    setEditingAsset(asset);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditingAsset(null);
    setIsDialogOpen(false);
  };

  const handleFormSubmit = async (assetData: Partial<Omit<Asset, 'id' | 'laboratoryId'>>) => {
    if (!laboratoryId) return;
    
    const dataToSave = {
      ...assetData,
      laboratoryId,
    };

    try {
      if (editingAsset) {
        const assetRef = doc(db, "assets", editingAsset.id);
        await updateDoc(assetRef, dataToSave);
        toast({ title: "Asset Updated", description: `The asset "${assetData.name}" has been updated.` });
      } else {
        await addDoc(collection(db, "assets"), dataToSave);
        toast({ title: "Asset Created", description: `The asset "${assetData.name}" has been created.` });
      }
      fetchData();
      handleDialogClose();
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the asset.",
      });
    }
  };

  const openDeleteDialog = (assetIds: string[]) => {
    setDeletingAssetIds(assetIds);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteAssets = async () => {
    if (deletingAssetIds.length === 0) return;
    
    try {
      const batch = writeBatch(db);
      deletingAssetIds.forEach(id => {
        batch.delete(doc(db, 'assets', id));
      });
      await batch.commit();

      toast({ title: "Assets Deleted", description: `${deletingAssetIds.length} asset(s) have been deleted.` });
      fetchData();
    } catch (error) {
      console.error("Error deleting assets:", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the selected assets." });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingAssetIds([]);
    }
  };
  
  const { needsCalibration, needsMaintenance } = useMemo(() => {
    const now = new Date();
    const needsCalibration: Asset[] = [];
    const needsMaintenance: Asset[] = [];

    assets.forEach(asset => {
        if(asset.isCalibrated && asset.nextCalibrationDate) {
            const daysUntil = differenceInDays(new Date(asset.nextCalibrationDate), now);
            if (daysUntil <= 30) needsCalibration.push(asset);
        }
        if(asset.nextMaintenanceDate) {
            const daysUntil = differenceInDays(new Date(asset.nextMaintenanceDate), now);
            if (daysUntil <= 30) needsMaintenance.push(asset);
        }
    });

    return { needsCalibration, needsMaintenance };
  }, [assets]);

  const columns = getColumns({ onEdit: handleDialogOpen, onDelete: (asset) => openDeleteDialog([asset.id]) });

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Asset Management</h1>
                <p className="text-muted-foreground">
                  Track and manage your laboratory's equipment and assets.
                </p>
            </div>
            <HasPermission permissionId="assets:create">
                <Button onClick={() => handleDialogOpen()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Asset
                </Button>
            </HasPermission>
       </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">
              Total number of registered assets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Calibration</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsCalibration.length}</div>
            <p className="text-xs text-muted-foreground">
              Assets due for calibration in 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsMaintenance.length}</div>
            <p className="text-xs text-muted-foreground">
              Assets due for maintenance in 30 days
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Repair</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.filter(a => a.status === 'In Repair').length}</div>
            <p className="text-xs text-muted-foreground">
             Assets currently under repair
            </p>
          </CardContent>
        </Card>
       </div>
      
       <AssetsDataTable columns={columns} data={assets} loading={loading} onDeleteSelected={openDeleteDialog} />

      <AssetDialog 
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        asset={editingAsset}
        categories={ASSET_CATEGORIES}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete {deletingAssetIds.length} asset(s). This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAssets}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
