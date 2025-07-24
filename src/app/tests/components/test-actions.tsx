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
  allData: Test[];
  onFilter: (filteredData: Test[]) => void;
  onDataUpdate: (newData: Test[]) => void;
  onTestCreated: (newTest: Omit<Test, 'id'>) => void;
}

export function TestActions({ allData, onFilter, onDataUpdate, onTestCreated }: TestActionsProps) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = allData.filter(item => 
        Object.values(item).some(val => 
            String(val).toLowerCase().includes(lowercasedSearch)
        )
    );
    onFilter(filtered);
  }, [search, allData, onFilter]);

  const handleExport = () => {
    if (allData.length === 0) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There is no data to export.",
      });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(allData.map(({id, ...rest}) => rest)); // Exclude ID from export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tests");
    XLSX.writeFile(workbook, "Test_Data.xlsx");
     toast({
        title: "Export Successful",
        description: `Exported ${allData.length} test records.`,
      });
  };

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

          const newTests: Test[] = json.map((row, index) => ({
            id: `imported-${Date.now()}-${index}`,
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

          onDataUpdate([...allData, ...newTests]);
          toast({
            title: "Import Successful",
            description: `${newTests.length} tests have been imported.`,
          });
        } catch (error) {
            console.error(error);
            toast({
              variant: "destructive",
              title: "Import Failed",
              description: "Please check the file format and try again.",
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
          onChange={e => setSearch(e.target.value)}
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
      <Button variant="outline" className="gap-1" onClick={handleExport}>
        <Download className="h-3.5 w-3.5" />
        <span>Export</span>
      </Button>
      <CreateTestDialog onTestCreated={onTestCreated} />
    </div>
  );
}
