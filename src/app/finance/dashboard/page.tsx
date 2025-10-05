
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Invoice, Expense } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign, Receipt, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const cardIconStyle = "h-4 w-4 text-muted-foreground";

export default function FinanceDashboardPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const { laboratoryId } = useAuth();

    useEffect(() => {
        if (!laboratoryId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [invoicesSnapshot, expensesSnapshot] = await Promise.all([
                    getDocs(query(collection(db, "invoices"), where("laboratoryId", "==", laboratoryId))),
                    getDocs(query(collection(db, "expenses"), where("laboratoryId", "==", laboratoryId)))
                ]);
                setInvoices(invoicesSnapshot.docs.map(doc => doc.data() as Invoice));
                setExpenses(expensesSnapshot.docs.map(doc => doc.data() as Expense));
            } catch (error) {
                console.error("Error fetching finance data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [laboratoryId]);

    const kpiData = useMemo(() => {
        const totalRevenue = invoices.filter(inv => inv.status === 'Paid').reduce((acc, inv) => acc + inv.total, 0);
        const outstandingAmount = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue').reduce((acc, inv) => acc + inv.total, 0);
        const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
        return { totalRevenue, outstandingAmount, totalExpenses };
    }, [invoices, expenses]);

    const monthlyChartData = useMemo(() => {
        const data: { month: string; revenue: number; expenses: number }[] = [];
        const monthMap = new Map<string, { revenue: number; expenses: number }>();
        
        invoices.forEach(inv => {
            const month = new Date(inv.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthMap.has(month)) monthMap.set(month, { revenue: 0, expenses: 0 });
            if (inv.status === 'Paid') {
                monthMap.get(month)!.revenue += inv.total;
            }
        });
        expenses.forEach(exp => {
            const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthMap.has(month)) monthMap.set(month, { revenue: 0, expenses: 0 });
            monthMap.get(month)!.expenses += exp.amount;
        });

        const sortedMonths = Array.from(monthMap.keys()).sort((a,b) => new Date(`1 ${a}`) > new Date(`1 ${b}`) ? 1 : -1);
        sortedMonths.forEach(month => data.push({ month, ...monthMap.get(month)! }));
        
        return data.slice(-12); // Last 12 months
    }, [invoices, expenses]);

    const expenseCategoryData = useMemo(() => {
        const categoryMap = new Map<string, number>();
        expenses.forEach(exp => {
            categoryMap.set(exp.category, (categoryMap.get(exp.category) || 0) + exp.amount);
        });
        return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    if (loading) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className={cardIconStyle} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">UGX {kpiData.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From all paid invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle>
                        <Receipt className={cardIconStyle} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">UGX {kpiData.outstandingAmount.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From sent & overdue invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <TrendingUp className={cardIconStyle} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">UGX {kpiData.totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total recorded expenses</p>
                    </CardContent>
                </Card>
            </div>
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
        </div>
    );
}
