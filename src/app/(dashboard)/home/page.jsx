"use client";

import React, { useEffect } from 'react';
import { Package, ArrowUpDown, AlertTriangle, Target, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { 
    stats, chartData, criticalStocks, recentTransactions, isLoading, fetchDashboardData 
  } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-4 border-[#00E599]/30 border-t-[#00E599] rounded-full animate-spin"></span>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "TOTAL PRODUCTS", value: stats.totalProducts, subteks: "Registered in system", icon: Package, iconColor: "text-[#00c985] dark:text-[#00E599]" },
    { 
      title: "TRANSACTIONS TODAY", 
      value: stats.transactionsToday, 
      subteks: stats.transactionDiff ? `${stats.transactionDiff} from yesterday` : "Today's activity", 
      icon: ArrowUpDown, 
      iconColor: "text-[#2b8eea] dark:text-[#4DA6FF]" 
    },
    { title: "CRITICAL STOCK", value: stats.criticalStock, subteks: "Needs immediate action", icon: AlertTriangle, iconColor: "text-red-600 dark:text-red-500" },
    { title: "ACTIVE SUPPLIERS", value: stats.activeSuppliers, subteks: "Registered suppliers", icon: Target, iconColor: "text-yellow-600 dark:text-yellow-500" },
  ];

  const getAlertStyles = (status) => {
    if (status === "Critical") {
      return { text: "text-red-600 dark:text-red-500", badge: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-500", progress: "bg-red-500" };
    }
    return { text: "text-yellow-600 dark:text-yellow-500", badge: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-500", progress: "bg-yellow-500" };
  };

  const getTxStyles = (type) => {
    if (type === "IN") {
      return { icon: ArrowUp, color: "text-[#00c985] dark:text-[#00E599]", badge: "bg-[#00E599]/10 border-[#00E599]/20 text-[#00c985] dark:text-[#00E599]" };
    }
    return { icon: ArrowDown, color: "text-[#2b8eea] dark:text-[#4DA6FF]", badge: "bg-[#4DA6FF]/10 border-[#4DA6FF]/20 text-[#2b8eea] dark:text-[#4DA6FF]" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-xl transition-colors">
          <p className="text-zinc-900 dark:text-white text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-zinc-500 dark:text-zinc-400">{entry.name}:</span>
              <span className="text-zinc-900 dark:text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <h2 className="text-zinc-900 dark:text-white text-xl font-bold mb-3 transition-colors">Overview</h2>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none">
                  {card.title}
                </CardTitle>
                <div className="p-1.5 rounded-lg">
                  <Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-zinc-900 dark:text-white transition-colors">{card.value}</div>
                <p className={`text-xs mt-1 font-medium ${card.iconColor.includes('red') || card.iconColor.includes('yellow') ? card.iconColor : 'text-zinc-500 dark:text-zinc-500'}`}>
                  {card.subteks}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Stock Movement Chart */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl flex flex-col lg:col-span-2 transition-colors">
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle className="text-zinc-900 dark:text-white text-base font-semibold transition-colors">Stock Movement</CardTitle>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">This week overview</p>
                </div>
                <div className="flex flex-row items-center gap-4 text-xs">
                  <div className="flex flex-row items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <div className="w-2.5 h-2.5 rounded bg-[#00E599]"></div>
                    Stock In
                  </div>
                  <div className="flex flex-row items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                    <div className="w-2.5 h-2.5 rounded bg-[#4DA6FF]"></div>
                    Stock Out
                  </div>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 pb-2">
            <div className="w-full h-40 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={8}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                  <YAxis hide={true} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#a1a1aa', opacity: 0.1 }} />
                  <Bar dataKey="in" name="Stock In" fill="#00E599" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="out" name="Stock Out" fill="#4DA6FF" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Critical Stock Alerts */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl transition-colors">
          <CardHeader>
            <CardTitle className="text-zinc-900 dark:text-white text-base font-semibold transition-colors">Critical Stock Alert</CardTitle>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">Requires immediate restock</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalStocks.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No critical stock alerts. All good!
              </div>
            ) : (
              criticalStocks.map((alert, index) => {
                const styles = getAlertStyles(alert.status);
                const progressWidth = Math.min((alert.stock / alert.min) * 100, 100);

                return (
                  <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 bg-zinc-50 dark:bg-zinc-950 transition-colors">
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <p className="text-zinc-900 dark:text-white text-sm font-semibold transition-colors">{alert.product}</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          Stock: <span className={styles.text}>{alert.stock}</span> / min {alert.min}
                        </p>
                      </div>
                      <div className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${styles.badge}`}>
                        {alert.status}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors">
                      <div style={{ width: `${progressWidth}%` }} className={`h-full ${styles.progress} rounded-full`}></div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl flex flex-col transition-colors">
        <CardHeader className="pb-2 shrink-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-zinc-900 dark:text-white text-base font-semibold transition-colors">Recent Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[600px]">
            <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 transition-colors">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">PRODUCT</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">TYPE</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">QTY</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">STAFF</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">TIME</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500 dark:text-zinc-500">
                    No recent transactions available.
                  </TableCell>
                </TableRow>
              ) : (
                recentTransactions.map((tx, index) => {
                  const styles = getTxStyles(tx.type);
                  const TypeIcon = styles.icon;
                  
                  return (
                    <TableRow key={index} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <TableCell className="text-sm font-medium py-4 text-zinc-900 dark:text-white transition-colors">{tx.product}</TableCell>
                      <TableCell className="py-4">
                          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border w-fit ${styles.badge}`}>
                              <TypeIcon size={12} strokeWidth={3} />
                              {tx.type}
                          </div>
                      </TableCell>
                      <TableCell className={`text-sm font-bold py-4 ${styles.color}`}>{tx.qty}</TableCell>
                      <TableCell className="text-zinc-600 dark:text-zinc-400 text-sm font-medium py-4 transition-colors">{tx.staff}</TableCell>
                      <TableCell className="text-zinc-500 dark:text-zinc-400 text-xs font-mono py-4 transition-colors">{tx.time}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}