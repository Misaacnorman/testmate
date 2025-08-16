
'use client';

import * as React from 'react';
import { Search, ListFilter, Download, Upload, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Test } from '@/lib/types';
import { ParsedData } from './import-preview-dialog';


interface TestActionsProps {
  data: Test[];
  onFilter: (filteredData: Test[]) => void;
  onImport: (data: ParsedData) => void;
  onDeleteSelected: () => void;
  processing: boolean;
  selectionCount: number;
}

export function TestActions({
  data,
  onFilter,
  onImport,
  onDeleteSelected,
  processing,
  selectionCount,
}: TestActionsProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [materialFilter, setMaterialFilter] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const materials = React.useMemo(() => {
    const allMaterials = data.map((test) => test.material);
    return [...new Set(allMaterials)];
  }, [data]);

  React.useEffect(() => {
    let filtered = data.filter((test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (materialFilter.length > 0) {
      filtered = filtered.filter((test) =>
        materialFilter.includes(test.material)
      );
    }
    onFilter(filtered);
  }, [searchTerm, materialFilter, data, onFilter]);

  const handleMaterialFilterChange = (material: string) => {
    setMaterialFilter((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tests');
    XLSX.writeFile(workbook, 'tests_export.xlsx');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target?.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (json.length > 1) {
                const headers = json[0] as string[];
                const rows = json.slice(1) as (string|number|boolean)[][];
                onImport({ headers, rows });
            }
        };
        reader.readAsBinaryString(file);
    }
    // Reset file input
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by test name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background pl-8 md:w-[200px] lg:w-[320px]"
          disabled={processing}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1" disabled={processing}>
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Material</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {materials.map((material) => (
            <DropdownMenuCheckboxItem
              key={material}
              checked={materialFilter.includes(material)}
              onCheckedChange={() => handleMaterialFilterChange(material)}
            >
              {material}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx, .xls, .csv"
      />
      <Button variant="outline" size="sm" className="h-9 gap-1" disabled={processing} onClick={() => fileInputRef.current?.click()}>
        <Upload className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Import</span>
      </Button>

      <Button variant="outline" size="sm" className="h-9 gap-1" onClick={handleExport} disabled={processing}>
        <Download className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Export</span>
      </Button>
      
      {selectionCount > 0 && (
          <Button variant="destructive" size="sm" className="h-9 gap-1" onClick={onDeleteSelected} disabled={processing}>
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete ({selectionCount})</span>
          </Button>
      )}
    </div>
  );
}
