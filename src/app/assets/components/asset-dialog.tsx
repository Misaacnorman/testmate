
"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/app/samples/components/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Asset, AssetCategory, ASSET_STATUSES } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { addDays } from "date-fns";

const formSchema = z.object({
  name: z.string().min(1, "Asset name is required"),
  assetTag: z.string().min(1, "Asset tag is required"),
  serialNumber: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(ASSET_STATUSES),
  location: z.string().min(1, "Location is required"),
  purchaseDate: z.date().optional(),
  purchaseCost: z.coerce.number().optional(),
  vendor: z.string().optional(),
  warrantyExpiryDate: z.date().optional(),
  notes: z.string().optional(),
  isCalibrated: z.boolean(),
  calibrationFrequency: z.coerce.number().optional(),
  nextCalibrationDate: z.date().optional(),
  maintenanceFrequency: z.coerce.number().optional(),
  nextMaintenanceDate: z.date().optional(),
});

type AssetFormData = z.infer<typeof formSchema>;

interface AssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => Promise<void>;
  asset: Asset | null;
  categories: AssetCategory[];
}

export function AssetDialog({ isOpen, onClose, onSubmit, asset, categories }: AssetDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<AssetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      assetTag: '',
      serialNumber: '',
      categoryId: '',
      status: 'Active',
      location: '',
      isCalibrated: false,
    },
  });

  React.useEffect(() => {
    if (asset) {
      form.reset({
        ...asset,
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate) : undefined,
        warrantyExpiryDate: asset.warrantyExpiryDate ? new Date(asset.warrantyExpiryDate) : undefined,
        nextCalibrationDate: asset.nextCalibrationDate ? new Date(asset.nextCalibrationDate) : undefined,
        nextMaintenanceDate: asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate) : undefined,
      });
    } else {
      form.reset({
        name: '',
        assetTag: `ASSET-${Date.now().toString().slice(-6)}`,
        serialNumber: '',
        categoryId: '',
        status: 'Active',
        location: '',
        isCalibrated: false,
        purchaseCost: undefined,
        calibrationFrequency: undefined,
        maintenanceFrequency: undefined,
      });
    }
  }, [asset, isOpen, form]);

  const watchIsCalibrated = form.watch("isCalibrated");

  const handleFormSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    try {
        const dataToSubmit = {
            ...data,
            purchaseDate: data.purchaseDate?.toISOString(),
            warrantyExpiryDate: data.warrantyExpiryDate?.toISOString(),
            nextCalibrationDate: data.nextCalibrationDate?.toISOString(),
            nextMaintenanceDate: data.nextMaintenanceDate?.toISOString(),
        }
      await onSubmit(dataToSubmit as any);
    } catch (error) {
      toast({ variant: "destructive", title: "Submission Failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{asset ? "Edit Asset" : "Add New Asset"}</DialogTitle>
          <DialogDescription>
            Fill in the details for the asset. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-6 -mr-6">
                    <div className="space-y-4 py-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Asset Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="assetTag" render={({ field }) => (
                                <FormItem><FormLabel>Asset Tag *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="serialNumber" render={({ field }) => (
                                <FormItem><FormLabel>Serial Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="categoryId" render={({ field }) => (
                                <FormItem><FormLabel>Category *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{categories.map(cat => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem><FormLabel>Status *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger></FormControl><SelectContent>{ASSET_STATUSES.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        
                        <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="purchaseDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Purchase Date</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="purchaseCost" render={({ field }) => (
                                <FormItem><FormLabel>Purchase Cost</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="vendor" render={({ field }) => (
                                <FormItem><FormLabel>Vendor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="warrantyExpiryDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Warranty Expiry</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                        </div>
                        
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Notes</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>

                         <FormField control={form.control} name="isCalibrated" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>This asset requires calibration</FormLabel></div></FormItem>
                        )}/>

                        {watchIsCalibrated && (
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="calibrationFrequency" render={({ field }) => (
                                    <FormItem><FormLabel>Calibration Frequency (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="nextCalibrationDate" render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>Next Calibration Date</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                                )}/>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="maintenanceFrequency" render={({ field }) => (
                                <FormItem><FormLabel>Maintenance Frequency (days)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="nextMaintenanceDate" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Next Maintenance Date</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {asset ? "Save Changes" : "Create Asset"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
