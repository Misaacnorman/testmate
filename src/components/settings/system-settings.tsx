"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ColorPickerRow } from "@/components/dashboard/color-picker-row";
import { Button } from "../ui/button";
import { Paintbrush } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ThemeColors } from "@/hooks/use-theme";

interface SystemSettingsProps {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
}

export function SystemSettings({ colors, setColors }: SystemSettingsProps) {
  const { toast } = useToast();

  const handleApplyTheme = () => {
    toast({
      title: "Theme Applied!",
      description: "Your new color theme has been saved.",
    });
  };

  const resetColors = () => {
    const defaultColors = {
      sidebarBg: "#111827",
      contentBg: "#f0f9ff",
      topbarBg: "#ffffff",
    };
    setColors(defaultColors);
    toast({
        title: "Theme Reset",
        description: "The color theme has been reset to its default values.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard environment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-medium">Theme Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPickerRow
              label="Sidebar Background"
              value={colors.sidebarBg}
              onChange={(v) => setColors({ ...colors, sidebarBg: v })}
            />
            <ColorPickerRow
              label="Content Background"
              value={colors.contentBg}
              onChange={(v) => setColors({ ...colors, contentBg: v })}
            />
            <ColorPickerRow
              label="Top Bar Background"
              value={colors.topbarBg}
              onChange={(v) => setColors({ ...colors, topbarBg: v })}
            />
            </div>
        </div>
        <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Experiment with different color schemes.</p>
            <div className="flex gap-2">
            <Button variant="outline" onClick={resetColors}>
                Reset to Defaults
            </Button>
            <Button onClick={handleApplyTheme}>
                <Paintbrush className="mr-2 h-4 w-4" />
                Apply Theme
            </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
