"use client";

import React, { useState, useEffect } from 'react';
import { TestDataTable } from "./components/test-data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TestActions } from "./components/test-actions";
import { Test } from "@/types/test";

const mockTests: Test[] = [
    { id: '1', 'MATERIAL CATEGORY': 'Concrete', 'TEST CODE': 'CON-001', 'MATERIAL TEST': 'Compressive Strength', 'TEST METHOD(S)': 'ASTM C39', 'ACCREDITATION': 'ISO 17025', 'UNIT': 'MPa', 'AMOUNT (UGX)': 50000, 'AMOUNT (USD)': 14, 'LEAD TIME (DAYS)': 3 },
    { id: '2', 'MATERIAL CATEGORY': 'Soil', 'TEST CODE': 'SOIL-002', 'MATERIAL TEST': 'Moisture Content', 'TEST METHOD(S)': 'ASTM D2216', 'ACCREDITATION': 'Yes', 'UNIT': '%', 'AMOUNT (UGX)': 30000, 'AMOUNT (USD)': 8, 'LEAD TIME (DAYS)': 1 },
    { id: '3', 'MATERIAL CATEGORY': 'Asphalt', 'TEST CODE': 'ASP-003', 'MATERIAL TEST': 'Bitumen Content', 'TEST METHOD(S)': 'ASTM D2172', 'ACCREDITATION': 'Yes', 'UNIT': '%', 'AMOUNT (UGX)': 120000, 'AMOUNT (USD)': 33, 'LEAD TIME (DAYS)': 2 },
    { id: '4', 'MATERIAL CATEGORY': 'Steel', 'TEST CODE': 'STL-004', 'MATERIAL TEST': 'Tensile Strength', 'TEST METHOD(S)': 'ASTM E8', 'ACCREDITATION': 'No', 'UNIT': 'psi', 'AMOUNT (UGX)': 80000, 'AMOUNT (USD)': 22, 'LEAD TIME (DAYS)': 5 },
    { id: '5', 'MATERIAL CATEGORY': 'Water', 'TEST CODE': 'WAT-005', 'MATERIAL TEST': 'pH Level', 'TEST METHOD(S)': 'EPA 150.1', 'ACCREDITATION': 'Yes', 'UNIT': 'pH', 'AMOUNT (UGX)': 25000, 'AMOUNT (USD)': 7, 'LEAD TIME (DAYS)': 1 },
];

export default function TestsPage() {
  const [data, setData] = useState<Test[]>([]);
  const [filteredData, setFilteredData] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from Firestore.
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData(mockTests);
      setFilteredData(mockTests);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDataUpdate = (newData: Test[]) => {
      setData(newData);
      setFilteredData(newData);
  };
  
  return (
    <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test Management</h2>
          <p className="text-muted-foreground">
            View, search, and manage all laboratory tests.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>All Tests</CardTitle>
            <CardDescription>A comprehensive list of all tests conducted in the laboratory.</CardDescription>
          </div>
          <TestActions allData={data} onFilter={setFilteredData} onDataUpdate={handleDataUpdate} />
        </CardHeader>
        <CardContent>
          <TestDataTable data={filteredData} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
