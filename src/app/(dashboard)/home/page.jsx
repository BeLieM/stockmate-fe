"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, ArrowUpDown, AlertTriangle, Target, ArrowRight,
  ArrowUp, ArrowDown 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- IMPORT RECHARTS ---
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';

export default function DashboardPage() {
  /* import Cookies from 'js-cookie';
     
     const [apiData, setApiData] = useState(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       const fetchDashboardData = async () => {
         try {
           const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
           const token = Cookies.get("stockmate_token"); // Ambil token dari cookie

           const response = await fetch(`${API_URL}/dashboard/overview`, {
             headers: {
               "Authorization": `Bearer ${token}`,
               "Content-Type": "application/json"
             }
           });

           if (!response.ok) throw new Error("Gagal mengambil data dashboard");

           const result = await response.json();
           setApiData(result.data); // Asumsi backend mereturn { data: { statCards, chartData, ... } }
         } catch (error) {
           console.error(error);
         } finally {
           setIsLoading(false);
         }
       };

       fetchDashboardData();
     }, []);

     // Nanti saat API siap, ganti variabel dummy di bawah dengan data dari `apiData` */

  // --- DATA DUMMY (Gunakan ini selama masa Slicing) ---
  const statCards = [
    { title: "TOTAL PRODUCTS", value: "8", subteks: "2 categories critical", icon: Package, iconColor: "text-[#00E599]" },
    { title: "TRANSACTIONS TODAY", value: "14", subteks: "+3 from yesterday", icon: ArrowUpDown, iconColor: "text-[#4DA6FF]" },
    { title: "CRITICAL STOCK", value: "2", subteks: "Needs immediate action", icon: AlertTriangle, iconColor: "text-red-500" },
    { title: "ACTIVE SUPPLIERS", value: "3", subteks: "All reachable", icon: Target, iconColor: "text-yellow-500" },
  ];

  const criticalStockAlerts = [
    { product: "Mie Instan Goreng", stock: 4, min: 20, status: "Critical", statusColor: "text-red-500", progressColor: "bg-red-500" },
    { product: "Deterjen Rinso", stock: 3, min: 12, status: "Critical", statusColor: "text-red-500", progressColor: "bg-red-500" },
    { product: "Kopi Kapal Api", stock: 12, min: 15, status: "Low", statusColor: "text-yellow-500", progressColor: "bg-yellow-500" },
  ];

  const recentTransactions = [
    { product: "Mie Instan Goreng", type: "OUT", typeColor: "text-[#4DA6FF]", typeBg: "bg-[#4DA6FF]/10", typeBorder: "border-[#4DA6FF]/20", qty: "-24", staff: "Andi", time: "10:32 • 02 Mar 2026" },
    { product: "Aqua 600ml", type: "IN", typeColor: "text-[#00E599]", typeBg: "bg-[#00E599]/10", typeBorder: "border-[#00E599]/20", qty: "+120", staff: "Budi", time: "09:14 • 02 Mar 2026" },
    { product: "Deterjen Rinso", type: "OUT", typeColor: "text-[#4DA6FF]", typeBg: "bg-[#4DA6FF]/10", typeBorder: "border-[#4DA6FF]/20", qty: "-5", staff: "Andi", time: "08:55 • 02 Mar 2026" },
    { product: "Gula Pasir 1kg", type: "IN", typeColor: "text-[#00E599]", typeBg: "bg-[#00E599]/10", typeBorder: "border-[#00E599]/20", qty: "+30", staff: "Citra", time: "11:00 • 01 Mar 2026" },
  ];

  const chartData = [
    { day: "Mon", in: 40, out: 60 },
    { day: "Tue", in: 70, out: 40 },
    { day: "Wed", in: 40, out: 50 },
    { day: "Thu", in: 65, out: 60 },
    { day: "Fri", in: 30, out: 70 },
    { day: "Sat", in: 80, out: 60 },
    { day: "Sun", in: 30, out: 40 },
  ];

  // Custom Tooltip untuk Recharts agar warnanya menyatu dengan tema Dark Mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="text-white text-sm font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-xs mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-zinc-400">{entry.name}:</span>
              <span className="text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <h2 className="text-white text-xl font-bold mb-3">Overview</h2>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="bg-zinc-900 border-zinc-800 text-white shadow-md rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  {card.title}
                </CardTitle>
                <div className="p-1.5 rounded-lg">
                  <Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.5} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{card.value}</div>
                <p className={`text-xs ${card.statusColor || "text-zinc-500"} mt-1 font-medium`}>
                  {card.subteks}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PERUBAHAN ADA DI SINI: 
        Menggunakan grid-cols-3 standar Tailwind. 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Stock Movement Chart: Mengambil porsi 2 kolom (lg:col-span-2) */}
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-md rounded-xl flex flex-col lg:col-span-2">
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <CardTitle className="text-white text-base font-semibold">Stock Movement</CardTitle>
                  <p className="text-zinc-400 text-xs mt-0.5">This week overview</p>
                </div>
                <div className="flex flex-row items-center gap-4 text-xs">
                  <div className="flex flex-row items-center gap-1.5 text-zinc-400">
                    <div className="w-2.5 h-2.5 rounded bg-[#00E599]"></div>
                    Stock In
                  </div>
                  <div className="flex flex-row items-center gap-1.5 text-zinc-400">
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
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis hide={true} />
                  
                  <Tooltip 
                    content={<CustomTooltip />} 
                    cursor={{ fill: '#27272a', opacity: 0.4 }} 
                  />
                  
                  <Bar 
                    dataKey="in" 
                    name="Stock In" 
                    fill="#00E599" 
                    radius={[4, 4, 0, 0]} 
                    barSize={16} 
                  />
                  <Bar 
                    dataKey="out" 
                    name="Stock Out" 
                    fill="#4DA6FF" 
                    radius={[4, 4, 0, 0]} 
                    barSize={16} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Critical Stock Alerts: Mengambil porsi sisa 1 kolom otomatis */}
        <Card className="bg-zinc-900 border-zinc-800 text-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-base font-semibold">Critical Stock Alert</CardTitle>
            <p className="text-zinc-400 text-xs mt-0.5">Requires immediate restock</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {criticalStockAlerts.map((alert, index) => (
              <div key={index} className="border border-zinc-800 rounded-xl p-2.5 bg-zinc-950">
                <div className="flex flex-row items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <p className="text-white text-sm font-semibold">{alert.product}</p>
                    <p className="text-zinc-500 text-[11px]">Stock: <span className={alert.statusColor}>{alert.stock}</span> / min {alert.min} pcs</p>
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${alert.statusColor} bg-${alert.statusColor.replace('text-', '')}/10 border border-${alert.statusColor.replace('text-', '')}/20`}>
                    {alert.status}
                  </div>
                </div>
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div style={{ width: `${(alert.stock / alert.min) * 100}%` }} className={`h-full ${alert.progressColor} rounded-full`}></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="bg-zinc-900 border-zinc-800 text-white shadow-md rounded-xl flex flex-col">
        <CardHeader className="pb-2 shrink-0">
          <div className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-base font-semibold">Recent Transactions</CardTitle>
            <button className="flex items-center gap-1.5 text-[#00E599] text-xs hover:underline font-medium">
              View all <ArrowRight size={14} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <Table className="text-zinc-200">
            <TableHeader className="border-b border-zinc-800">
              <TableRow className="hover:bg-zinc-800/20 border-zinc-800">
                <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-widest h-10">PRODUCT</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-widest h-10">TYPE</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-widest h-10">QTY</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-widest h-10">STAFF</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-widest h-10">TIME</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx, index) => {
                const TypeIcon = tx.type === "IN" ? ArrowUp : ArrowDown;
                return (
                  <TableRow key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <TableCell className="text-sm font-medium py-2">{tx.product}</TableCell>
                    <TableCell className="py-">
                        <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md ${tx.typeColor} ${tx.typeBg} border ${tx.typeBorder} w-fit`}>
                            <TypeIcon size={14} className={tx.typeColor} />
                            {tx.type}
                        </div>
                    </TableCell>
                    <TableCell className={`text-sm font-bold py-4 ${tx.typeColor}`}>{tx.qty}</TableCell>
                    <TableCell className="text-zinc-400 text-sm font-medium py-4">{tx.staff}</TableCell>
                    <TableCell className="text-zinc-400 text-sm font-medium py-4">{tx.time}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}