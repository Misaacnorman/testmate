"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileUp, Filter, Search } from "lucide-react";
import { CreateTestDialog } from "./create-test-dialog";
import { Test } from "@/types/test";
import * as XLSX from 'xlsx';
import { useToast } from "@/hooks/use-toast";

interface TestActionsProps {
  onSearch: (searchTerm: string) => void;
  onExport: () => void;
  onImport: (tests: Omit<Test, 'id'>[]) => void;
  onTestCreated: (newTest: Omit<Test, 'id'>) => void;
}

export function TestActions({ onSearch, onExport, onImport, onTestCreated }: TestActionsProps) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json<any>(worksheet);

          const newTests: Omit<Test, 'id'>[] = json.map((row) => ({
            materialCategory: row['materialCategory'] || '',
            testCode: row['testCode'] || '',
            materialTest: row['materialTest'] || '',
            testMethods: row['testMethods'] || '',
            accreditation: row['accreditation'] || '',
            unit: row['unit'] || '',
            amountUGX: Number(row['amountUGX']) || 0,
            amountUSD: Number(row['amountUSD']) || 0,
            leadTimeDays: Number(row['leadTimeDays']) || 0,
          }));

          onImport(newTests);
        } catch (error) {
            console.error(error);
            toast({
              variant: "destructive",
              title: "Import Failed",
              description: "Please check the file format and try again. The file should contain columns like 'materialCategory', 'testCode', etc.",
            });
        } finally {
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search tests..." 
          className="pl-9 w-full md:w-[200px] lg:w-[300px]"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked disabled>Accreditation (coming soon)</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem disabled>Material Category (coming soon)</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" className="gap-1" onClick={handleImportClick}>
        <FileUp className="h-3.5 w-3.5" />
        <span>Import</span>
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx, .xls, .csv" style={{ display: 'none' }} />
      <Button variant="outline" className="gap-1" onClick={onExport}>
        <Download className="h-3.5 w-3.5" />
        <span>Export</span>
      </Button>
      <CreateTestDialog onTestCreated={onTestCreated} />
    </div>
  );
}
