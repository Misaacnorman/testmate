
"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface SelectWithOtherProps {
  options: string[];
  value?: string;
  onValueChange: (value: string) => void;
  otherValue?: string;
  onOtherValueChange: (value: string) => void;
  placeholder?: string;
}

export function SelectWithOther({
  options,
  value,
  onValueChange,
  otherValue,
  onOtherValueChange,
  placeholder = "Select an option",
}: SelectWithOtherProps) {

  const handleSelectChange = (newValue: string) => {
    onValueChange(newValue)
  }

  return (
    <div className="flex gap-2">
      <Select value={value} onValueChange={handleSelectChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
      {value === "Other" && (
        <Input
          placeholder="Specify other"
          value={otherValue}
          onChange={(e) => onOtherValueChange(e.target.value)}
        />
      )}
    </div>
  )
}
