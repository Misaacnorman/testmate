"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export type MonthlyDatum = { month: string; revenue: number; expenses: number };
export type CategoryDatum = { name: string; value: number };

export function FinanceCharts({
  monthlyChartData,
  expenseCategoryData,
}: {
  monthlyChartData: MonthlyDatum[];
  expenseCategoryData: CategoryDatum[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={{}} className="h-[300px] w-full">
            <BarChart data={monthlyChartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
              <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[300px] w-full">
            <PieChart>
              <Tooltip content={<ChartTooltipContent />} />
              <Pie data={expenseCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {expenseCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
