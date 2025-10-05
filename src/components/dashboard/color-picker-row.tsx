"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPickerRow({
  label,
  value,
  onChange,
}: ColorPickerRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border p-0"
        aria-label={label}
      />
    </div>
  );
}
