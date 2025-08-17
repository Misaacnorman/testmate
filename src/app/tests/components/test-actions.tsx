
'use client';

import * as React from 'react';
import { Search, ListFilter, Download, Upload, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


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
  const [accreditationFilter, setAccreditationFilter] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const materials = React.useMemo(() => {
    const allMaterials = data.map((test) => test.material).filter(Boolean);
    return [...new Set(allMaterials)];
  }, [data]);

  React.useEffect(() => {
    let filtered = data;

    if (searchTerm) {
      filtered = filtered.filter((test) => {
        const term = searchTerm.toLowerCase();
        return (
          (test.name && test.name.toLowerCase().includes(term)) ||
          (test.id && test.id.toLowerCase().includes(term)) ||
          (test.material && test.material.toLowerCase().includes(term))
        );
      });
    }
    
    if (materialFilter.length > 0) {
      filtered = filtered.filter((test) =>
        test.material && materialFilter.includes(test.material)
      );
    }

    if(accreditationFilter !== null) {
        const isAccredited = accreditationFilter === 'Accredited';
        filtered = filtered.filter(test => test.isAccredited === isAccredited);
    }

    onFilter(filtered);
  }, [searchTerm, materialFilter, accreditationFilter, data, onFilter]);

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
    
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    toast({
        title: "Export Successful",
        description: "Your file is ready for download.",
        action: <a href={url} download="tests_export.xlsx"><Button variant="link"><LinkIcon className="mr-2" />Download</Button></a>,
    });
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
  
  const activeFilterCount = (materialFilter.length > 0 ? 1 : 0) + (accreditationFilter !== null ? 1 : 0);

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by test name, code, or material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
          disabled={processing}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1" disabled={processing}>
            <ListFilter className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Filter</span>
            {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount}</Badge>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
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
           <DropdownMenuSeparator />
           <DropdownMenuLabel>Accreditation</DropdownMenuLabel>
           <DropdownMenuCheckboxItem checked={accreditationFilter === 'Accredited'} onCheckedChange={() => setAccreditationFilter(accreditationFilter === 'Accredited' ? null : 'Accredited')}>Accredited</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={accreditationFilter === 'Not Accredited'} onCheckedChange={() => setAccreditationFilter(accreditationFilter === 'Not Accredited' ? null : 'Not Accredited')}>Not Accredited</DropdownMenuCheckboxItem>

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
        {processing ? <Loader2 className="animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
        <span className="sr-only sm:not-sr-only">Import</span>
      </Button>

      <Button variant="outline" size="sm" className="h-9 gap-1" onClick={handleExport} disabled={processing || data.length === 0}>
        <Download className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Export</span>
      </Button>
      
      {selectionCount > 0 && (
          <Button variant="destructive" size="sm" className="h-9 gap-1" onClick={onDeleteSelected} disabled={processing}>
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete ({selectionCount})</span>
          </Button>
      )}
       <div className="text-sm text-muted-foreground">
        {data.length} tests
      </div>
    </div>
  );
}
