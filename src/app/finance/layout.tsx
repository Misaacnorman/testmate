
"use client";

import * as React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter } from 'next/navigation';

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to determine the active tab from the pathname
  const activeTab = pathname.split('/')[2] || 'dashboard';

  const handleTabChange = (value: string) => {
    router.push(`/finance/${value}`);
  };
  
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Finance</h1>
            <p className="text-muted-foreground">
                Manage your laboratory's financial operations, from quotes to invoices.
            </p>
        </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="pt-4">{children}</div>
    </div>
  );
}
