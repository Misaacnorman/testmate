
"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useRouter } from "next/navigation";
import { ColorPickerRow } from "@/components/dashboard/color-picker-row";

const emptyCompanyProfile = {
    logo: "",
    name: "",
    location: "",
    email: "",
    address: "",
    bio: "",
    sidebarBg: "#111827",
    contentBg: "#f0f9ff",
    topbarBg: "#ffffff",
};

export default function CompanyProfileOnboardingPage() {
  const { laboratory, laboratoryId, refresh, user, permissions } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = React.useState(emptyCompanyProfile);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (laboratory) {
        setProfile({
            logo: laboratory.logo || "",
            name: laboratory.name || "",
            location: laboratory.location || "",
            email: laboratory.email || "",
            address: laboratory.address || "",
            bio: laboratory.bio || "",
            sidebarBg: laboratory.themeColors?.sidebarBg || "#111827",
            contentBg: laboratory.themeColors?.contentBg || "#f0f9ff",
            topbarBg: laboratory.themeColors?.topbarBg || "#ffffff",
        });
        setIsLoading(false);
    } else if (laboratoryId) {
        setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [laboratory, laboratoryId, refresh, user, permissions]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleColorChange = (id: string, value: string) => {
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
      reader.readAsDataURL(event.target.files[0]);
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
        toast({ variant: "destructive", title: "Error", description: "No laboratory context found." });
        return;
    }
    
    setIsSaving(true);
    try {
        const docRef = doc(db, "laboratories", laboratoryId);
        await setDoc(docRef, { 
            name: profile.name,
            logo: profile.logo,
            location: profile.location,
            address: profile.address,
            email: profile.email,
            bio: profile.bio,
            themeColors: {
                sidebarBg: profile.sidebarBg,
                contentBg: profile.contentBg,
                topbarBg: profile.topbarBg,
            }
         }, { merge: true });

        // Explicitly refresh the auth context to get the latest lab data
        await refresh();

        toast({
            title: "Profile Updated!",
            description: "Your laboratory profile has been updated.",
        });
        router.push('/');
    } catch (error) {
        console.error("Error saving company profile:", error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: "Could not save laboratory profile to the database.",
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading your laboratory profile...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Welcome! Let's set up your laboratory profile.</CardTitle>
                <CardDescription>
                Provide your laboratory's details. You can change these later in settings.
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

                <div className="space-y-4">
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
                            rows={3}
                            disabled={isSaving}
                        />
                    </div>
                </div>
                 <div className="space-y-4 rounded-lg border p-4">
                      <h3 className="font-medium text-sm">Theme Colors (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <ColorPickerRow label="Sidebar" value={profile.sidebarBg} onChange={(v) => handleColorChange('sidebarBg', v)}/>
                         <ColorPickerRow label="Content" value={profile.contentBg} onChange={(v) => handleColorChange('contentBg', v)}/>
                         <ColorPickerRow label="Top Bar" value={profile.topbarBg} onChange={(v) => handleColorChange('topbarBg', v)}/>
                      </div>
                  </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save and Continue
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}

