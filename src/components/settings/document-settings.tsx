

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface SequenceSettings {
  sampleReceiptStart: number;
  bigProjectStart: number;
  smallProjectStart: number;
}

interface StampSettings {
  stampUrl?: string;
  stampSerialPart1?: string;
  stampSerialPart2?: number;
}

export function DocumentSettings() {
  const { laboratory, laboratoryId, refresh } = useAuth();
  const [sequenceSettings, setSequenceSettings] = useState<SequenceSettings>({
    sampleReceiptStart: 1,
    bigProjectStart: 1,
    smallProjectStart: 1,
  });
  const [stampSettings, setStampSettings] = useState<StampSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!laboratoryId) return;
      setIsLoading(true);
      try {
        const docRef = doc(db, "laboratories", laboratoryId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const labData = docSnap.data();
          if (labData.sequenceSettings) {
            setSequenceSettings(labData.sequenceSettings);
          }
          if (labData.stampSettings) {
            setStampSettings(labData.stampSettings);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          variant: "destructive",
          title: "Failed to load settings",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [laboratoryId, toast]);

  const handleSequenceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSequenceSettings((prev) => ({ ...prev, [id]: Number(value) || 0 }));
  };

  const handleStampInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setStampSettings(prev => ({ ...prev, [id]: id === 'stampSerialPart2' ? Number(value) : value }));
  };

  const handleStampUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 1 * 1024 * 1024) { // 1MB limit for stamp
          toast({ variant: "destructive", title: "File too large", description: "Stamp image must be under 1MB." });
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setStampSettings((prev) => ({ ...prev, stampUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveChanges = async () => {
    if (!laboratoryId) {
      toast({ variant: "destructive", title: "Error", description: "No laboratory context found." });
      return;
    }
    setIsSaving(true);
    try {
      const docRef = doc(db, "laboratories", laboratoryId);
      await setDoc(docRef, { sequenceSettings, stampSettings }, { merge: true });
      await refresh();
      toast({
        title: "Settings Saved!",
        description: "Document settings have been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save document settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document & ID Settings</CardTitle>
          <CardDescription>
            Manage starting numbers and lab stamp for official documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document & ID Settings</CardTitle>
        <CardDescription>
          Manage starting sequence numbers and the official lab stamp for documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Sequence Numbers */}
        <div>
          <h3 className="text-lg font-medium mb-4">ID Sequences</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sampleReceiptStart">Sample Receipt Start Number</Label>
              <Input
                id="sampleReceiptStart"
                type="number"
                min={1}
                value={sequenceSettings.sampleReceiptStart}
                onChange={handleSequenceInputChange}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">Next receipt ID will start from this number.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bigProjectStart">Big Project ID Start Number</Label>
              <Input
                id="bigProjectStart"
                type="number"
                min={1}
                value={sequenceSettings.bigProjectStart}
                onChange={handleSequenceInputChange}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">For large-scale projects.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smallProjectStart">Small Project ID Start Number</Label>
              <Input
                id="smallProjectStart"
                type="number"
                min={1}
                value={sequenceSettings.smallProjectStart}
                onChange={handleSequenceInputChange}
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">For smaller projects or individual samples.</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Lab Stamp */}
        <div>
           <h3 className="text-lg font-medium mb-4">Laboratory Stamp</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               <div className="space-y-4">
                  <Label>Stamp Image</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 rounded-md">
                        <AvatarImage src={stampSettings.stampUrl || "/testmate-stamp.png"} alt="Lab Stamp" className="object-contain" />
                        <AvatarFallback>Stamp</AvatarFallback>
                    </Avatar>
                    <div>
                        <Input
                        id="stamp-upload"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleStampUpload}
                        className="hidden"
                        accept="image/png, image/jpeg"
                        />
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isSaving}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Stamp
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                        PNG or JPG, up to 1MB. Recommended: Transparent background.
                        </p>
                    </div>
                  </div>
               </div>

                <div className="space-y-4">
                  <Label>Stamp Serial Number</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stampSerialPart1" className="text-xs text-muted-foreground">Part 1 (Prefix)</Label>
                      <Input
                        id="stampSerialPart1"
                        placeholder="e.g., UM"
                        value={stampSettings.stampSerialPart1 || ''}
                        onChange={handleStampInputChange}
                        disabled={isSaving}
                      />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="stampSerialPart2" className="text-xs text-muted-foreground">Part 2 (Starting Number)</Label>
                       <Input
                        id="stampSerialPart2"
                        type="number"
                        min={1}
                        placeholder="e.g., 1000"
                        value={stampSettings.stampSerialPart2 || ''}
                        onChange={handleStampInputChange}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                   <p className="text-xs text-muted-foreground">This rolling serial number will appear on approved certificates.</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Document Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
