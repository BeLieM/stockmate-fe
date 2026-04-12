"use client";

import { useState, useEffect } from "react";
import { Calendar, Download, TrendingUp, TrendingDown, ArrowUpDown, Hash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
// import Cookies from 'js-cookie'; 

export default function ReportsPage() {
  const [reportsData, setReportsData] = useState([]);
  const [stats, setStats] = useState({ in: 0, out: 0, net: 0, total: 0 });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- MOCK API DATA ---
  useEffect(() => {
    // Dummy Data untuk 4 Kartu Statistik
    setStats({ in: 350, out: 323, net: 27, total: 673 });

    // Dummy Data untuk Tabel
    const dummyData = [
      { id: 1, product: "Mie Instan Goreng", category: "Makanan", totalIn: 0, totalOut: -24, net: -24, stock: 4, status: "Critical" },
      { id: 2, product: "Aqua 600ml", category: "Minuman", totalIn: 120, totalOut: 0, net: 120, stock: 85, status: "Normal" },
      { id: 3, product: "Kopi Kapal Api", category: "Minuman", totalIn: 0, totalOut: -6, net: -6, stock: 12, status: "Low" },
      { id: 4, product: "Gula Pasir 1kg", category: "Sembako", totalIn: 30, totalOut: 0, net: 30, stock: 18, status: "Normal" },
      { id: 5, product: "Deterjen Rinso", category: "Kebersihan", totalIn: 0, totalOut: -5, net: -5, stock: 3, status: "Critical" },
    ];
    setReportsData(dummyData);
  }, []);

  /* // ==========================================
     // KODE API PRODUCTION (GET REPORTS)
     // ==========================================
  const fetchReportsAPI = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate
      });

      const response = await fetch(`${API_URL}/reports?${queryParams.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Gagal mengambil data laporan");
      
      const data = await response.json();
      setReportsData(data.data.table);
      setStats(data.data.summary);
    } catch (error) {
      console.error("Fetch Reports Error:", error);
    }
  };

  // Trigger fetch jika tanggal berubah
  // useEffect(() => { fetchReportsAPI(); }, [startDate, endDate]);
  */

  const handleExportCSV = () => {
    console.log(`[SLICING MODE] Exporting Reports from ${startDate || 'All Time'} to ${endDate || 'All Time'}`);
    alert("Exporting data to CSV (Slicing Mode)");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-600 dark:text-red-500 bg-red-500/10 border-red-500/20';
      case 'Low': return 'text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-[#00c985] dark:text-[#00E599] bg-[#00E599]/10 border-[#00E599]/20';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden pb-6">
      {/* 4 STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 transition-colors shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors">Total Stock In</p>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={28} className="text-[#00c985] dark:text-[#00E599]" strokeWidth={2.5} />
            <p className="text-[#00c985] dark:text-[#00E599] text-3xl font-bold">{stats.in}</p>
          </div>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs transition-colors">This week</p>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 transition-colors shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors">Total Stock Out</p>
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown size={28} className="text-[#2b8eea] dark:text-[#4DA6FF]" strokeWidth={2.5} />
            <p className="text-[#2b8eea] dark:text-[#4DA6FF] text-3xl font-bold">{stats.out}</p>
          </div>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs transition-colors">This week</p>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 transition-colors shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors">Net Movement</p>
          <div className="flex items-center gap-3 mb-2">
            <ArrowUpDown size={28} className="text-yellow-500" strokeWidth={2.5} />
            <p className="text-yellow-500 text-3xl font-bold">{stats.net > 0 ? `+${stats.net}` : stats.net}</p>
          </div>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs transition-colors">This week</p>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 transition-colors shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 transition-colors">Total Transactions</p>
          <div className="flex items-center gap-3 mb-2">
            <Hash size={28} className="text-zinc-400 dark:text-zinc-500" strokeWidth={2.5} />
            <p className="text-zinc-900 dark:text-white text-3xl font-bold transition-colors">{stats.total}</p>
          </div>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs transition-colors">All time</p>
        </Card>
      </div>

      {/* MAIN REPORT CARD */}
      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">
        
        {/* TOOLBAR */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0 transition-colors">
          <div>
            <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Stock Movement Report</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 transition-colors">Per product breakdown</p>
          </div>

          <div className="flex gap-3">
            {/* Calendar Native Picker */}
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 transition-colors">
              <Calendar size={16} className="text-zinc-500" />
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none custom-date-input w-[110px]" 
              />
              <span className="text-zinc-400 dark:text-zinc-600 text-sm">→</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-transparent text-sm text-zinc-700 dark:text-zinc-300 focus:outline-none custom-date-input w-[110px]" 
              />
            </div>

            <button onClick={handleExportCSV} className="px-4 py-2 bg-[#00E599] text-zinc-950 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors flex items-center gap-2 shrink-0">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* TABLE KONTEN */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[800px]">
            <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest pl-6 h-10 text-center">Product</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Category</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Total In</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Total Out</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Net</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Current Stock</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest pr-6 h-10 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">No report data found for this period.</TableCell>
                </TableRow>
              ) : (
                reportsData.map((row) => (
                  <TableRow key={row.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-14">
                    
                    <TableCell className="pl-6 font-bold text-zinc-900 dark:text-white text-sm align-middle text-center transition-colors">
                      {row.product}
                    </TableCell>

                    <TableCell className="align-middle text-center">
                      <span className="bg-[#4DA6FF]/10 text-[#2b8eea] dark:text-[#4DA6FF] border border-[#4DA6FF]/20 font-semibold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                        {row.category}
                      </span>
                    </TableCell>

                    <TableCell className="font-mono font-bold text-[#00c985] dark:text-[#00E599] align-middle text-center">
                      +{row.totalIn}
                    </TableCell>

                    <TableCell className="font-mono font-bold text-[#2b8eea] dark:text-[#4DA6FF] align-middle text-center">
                      {row.totalOut}
                    </TableCell>

                    <TableCell className={`font-mono font-bold align-middle text-center ${row.net > 0 ? 'text-[#00c985] dark:text-[#00E599]' : row.net < 0 ? 'text-red-600 dark:text-red-500' : 'text-zinc-500'}`}>
                      {row.net > 0 ? `+${row.net}` : row.net}
                    </TableCell>

                    <TableCell className="font-bold text-zinc-900 dark:text-white text-base align-middle text-center transition-colors">
                      {row.stock}
                    </TableCell>

                    <TableCell className="pr-6 align-middle text-center">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border w-fit ${getStatusColor(row.status)}`}>
                          {row.status}
                        </span>
                      </div>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}