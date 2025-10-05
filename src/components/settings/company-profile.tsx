
"use client";

import React from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/auth-context";

const emptyCompanyProfile = {
    logo: "",
    name: "",
    email: "",
    address: "",
    bio: "",
    location: "",
};

export function CompanyProfile() {
  const { laboratory, laboratoryId, loading, refresh } = useAuth();
  const [profile, setProfile] = React.useState(emptyCompanyProfile);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setIsLoading(loading);
    if (laboratory) {
        setProfile({
            logo: laboratory.logo || "",
            name: laboratory.name || "",
            email: laboratory.email || "",
            address: laboratory.address || "",
            bio: laboratory.bio || "",
            location: laboratory.location || "",
        });
    }
  }, [laboratory, loading]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
          toast({ variant: "destructive", title: "File too large", description: "Logo image must be under 5MB." });
          return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!profile.name || !profile.address) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill in all mandatory fields (Company Name and Address).",
        });
        return;
    }
    if (!laboratoryId) {
        toast({ variant: "destructive", title: "Authentication Error", description: "Cannot find laboratory ID." });
        return;
    }
    setIsSaving(true);
    try {
        const docRef = doc(db, "laboratories", laboratoryId);
        // We use merge: true to avoid overwriting fields not managed here like themeColors
        await setDoc(docRef, { 
            name: profile.name,
            logo: profile.logo,
            location: profile.location,
            address: profile.address,
            email: profile.email,
            bio: profile.bio,
         }, { merge: true });
        
        await refresh(); // Refresh auth context to reflect changes immediately
        
        toast({
            title: "Success!",
            description: "Your company profile has been updated.",
        });
    } catch (error) {
        console.error("Error saving company profile:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save company profile to the database.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  Update your company's profile information. Fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>
          Update your company's profile information. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.logo || undefined} alt="Company Logo" data-ai-hint="logo" />
            <AvatarFallback>LOGO</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="logo-upload">Company Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </Button>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 5MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input id="name" value={profile.name} onChange={handleInputChange} disabled={isSaving} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" value={profile.email} onChange={handleInputChange} disabled={isSaving}/>
          </div>
        </div>

         <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={profile.location} onChange={handleInputChange} disabled={isSaving}/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input id="address" value={profile.address} onChange={handleInputChange} disabled={isSaving}/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Company Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={handleInputChange}
            rows={4}
            disabled={isSaving}
          />
        </div>

        <div className="flex justify-end gap-2">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
