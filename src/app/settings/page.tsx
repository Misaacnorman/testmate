
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyProfile } from "@/components/settings/company-profile";
import { SystemSettings } from "@/components/settings/system-settings";
import { useTheme } from "@/hooks/use-theme";
import { DocumentSettings } from "@/components/settings/document-settings";
import { MachineSettings } from "@/components/settings/machine-settings";

export default function SettingsPage() {
    const { colors, setColors, isMounted } = useTheme();

  if (!isMounted) {
    return null; // Avoid hydration mismatch
  }
  
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your company and system settings.</p>
        </div>
      <Tabs defaultValue="company-profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company-profile">Company Profile</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="system-settings">System Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="company-profile">
          <CompanyProfile />
        </TabsContent>
        <TabsContent value="documents">
            <DocumentSettings />
        </TabsContent>
        <TabsContent value="machines">
            <MachineSettings />
        </TabsContent>
        <TabsContent value="system-settings">
          <SystemSettings colors={colors} setColors={setColors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
