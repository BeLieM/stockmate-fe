"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowUp, ArrowDown, Download, Search, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import StockInModal from "@/components/transactions/StockInModal";
import StockOutModal from "@/components/transactions/StockOutModal";
// import Cookies from 'js-cookie'; 

export default function TransactionsPage() {
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("ALL"); // Opsi: ALL, IN, OUT
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- MOCK API DATA (SLICING MODE) ---
  useEffect(() => {
    const dummyData = [
      { id: "001", product: "Mie Instan Goreng", type: "OUT", qty: -24, staff: { name: "Andi", init: "A", color: "bg-red-500" }, note: "Penjualan siang", date: "16:32 • 02 Mar" },
      { id: "002", product: "Aqua 600ml", type: "IN", qty: 120, staff: { name: "Budi", init: "B", color: "bg-blue-500" }, note: "Restock pagi", date: "09:14 • 02 Mar" },
      { id: "003", product: "Deterjen Rinso", type: "OUT", qty: -5, staff: { name: "Andi", init: "A", color: "bg-red-500" }, note: "-", date: "08:55 • 02 Mar" },
      { id: "004", product: "Gula Pasir 1kg", type: "IN", qty: 30, staff: { name: "Citra", init: "C", color: "bg-[#00E599]" }, note: "Stok bulanan", date: "11:00 • 01 Mar" },
      { id: "005", product: "Sabun Lifebuoy", type: "OUT", qty: -4, staff: { name: "Andi", init: "A", color: "bg-red-500" }, note: "-", date: "16:45 • 01 Mar" },
    ];
    setTransactions(dummyData);
  }, []);

  /* // ==========================================
     // KODE API PRODUCTION (GET TRANSACTIONS)
     // ==========================================
  const fetchTransactionsAPI = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      
      // Mengirim filter sebagai query parameter
      const queryParams = new URLSearchParams({
        type: filterType !== "ALL" ? filterType : "",
        search: searchQuery,
        start_date: startDate,
        end_date: endDate
      });

      const response = await fetch(`${API_URL}/transactions?${queryParams.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Gagal mengambil data transaksi");
      
      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      console.error("Fetch Transactions Error:", error);
    }
  };

  // Gunakan useEffect ini jika API sudah siap:
  // useEffect(() => { fetchTransactionsAPI(); }, [filterType, startDate, endDate]); 
  */

  // --- LOGIKA FILTER SLICING ---
  const filteredTransactions = transactions.filter(t => {
    const matchType = filterType === "ALL" || t.type === filterType;
    const matchSearch = t.product.toLowerCase().includes(searchQuery.toLowerCase());
    // (Logika filter tanggal dilewati untuk slicing, biasanya ditangani oleh Backend)
    return matchType && matchSearch;
  });

  const handleExportCSV = () => {
    console.log("[SLICING MODE] Exporting to CSV...");
    alert("Exporting data to CSV (Slicing Mode)");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden pb-6">
      
      {/* HEADER PAGE */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-white text-2xl font-bold">Transaction History</h2>
          <p className="text-zinc-500 text-sm">All stock movements</p>
        </div>
        
        {/* Opsional: Search Bar di Header (Sesuai Desain Gambar Pertama) */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-9 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
            placeholder="Search product..." 
          />
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden">
        
        {/* TOOLBARS (Filters & Modals) */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0 overflow-x-auto custom-scrollbar">
          
          {/* Date Range Filters */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 shrink-0">
            <Calendar size={16} className="text-zinc-500" />
            <input 
              type="date" 
              value={startDate} 
              onChange={(e)=>setStartDate(e.target.value)} 
              className="bg-transparent text-sm text-zinc-300 focus:outline-none custom-date-input w-[110px]" 
            />
            <span className="text-zinc-600 text-sm">→</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e)=>setEndDate(e.target.value)} 
              className="bg-transparent text-sm text-zinc-300 focus:outline-none custom-date-input w-[110px]" 
            />
          </div>

          {/* Type Filters & Action Buttons */}
          <div className="flex gap-3 shrink-0">
            {/* Filter Buttons */}
            <div className="flex gap-2 mr-2">
              <button onClick={() => setFilterType("ALL")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${filterType === "ALL" ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'}`}>
                All Types
              </button>
              
              <button onClick={() => setFilterType("IN")} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border ${filterType === "IN" ? 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/30' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-[#00E599]/10 hover:text-[#00E599]'}`}>
                <ArrowUp size={16} /> Stock In
              </button>
              
              <button onClick={() => setFilterType("OUT")} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border ${filterType === "OUT" ? 'bg-[#4DA6FF]/10 text-[#4DA6FF] border-[#4DA6FF]/30' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-[#4DA6FF]/10 hover:text-[#4DA6FF]'}`}>
                <ArrowDown size={16} /> Stock Out
              </button>
            </div>

            {/* Modals Triggers */}
            <div className="w-px h-8 bg-zinc-800 my-auto mx-1"></div> {/* Divider */}

            <button onClick={() => setIsStockInOpen(true)} className="px-3 py-2 bg-zinc-950 text-[#00E599] border border-[#00E599]/20 hover:border-[#00E599]/50 hover:bg-[#00E599]/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
              <Plus size={16} /> In
            </button>
            <button onClick={() => setIsStockOutOpen(true)} className="px-3 py-2 bg-zinc-950 text-[#4DA6FF] border border-[#4DA6FF]/20 hover:border-[#4DA6FF]/50 hover:bg-[#4DA6FF]/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
              <Plus size={16} /> Out
            </button>

            {/* Export CSV */}
            <button onClick={handleExportCSV} className="px-4 py-2 bg-[#00E599] text-zinc-950 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors flex items-center gap-2 ml-2">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* TABLE KONTEN */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <Table className="text-zinc-200 w-full min-w-[900px]">
            <TableHeader className="border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                {/* SEMUA HEADER RATA TENGAH (text-center) */}
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">#</TableHead>
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Product</TableHead>
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Type</TableHead>
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Quantity</TableHead>
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Staff</TableHead>
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Note</TableHead>
                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">No transactions found.</TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((trx) => (
                  <TableRow key={trx.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors h-14">
                    
                    {/* SEMUA ISI RATA TENGAH (text-center align-middle) */}
                    <TableCell className="text-zinc-500 text-xs font-mono align-middle text-center">
                      #{trx.id}
                    </TableCell>
                    
                    <TableCell className="font-bold text-white text-sm align-middle text-center">
                      {trx.product}
                    </TableCell>
                    
                    {/* TYPE BADGE (justify-center) */}
                    <TableCell className="align-middle text-center">
                      <div className="flex justify-center">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border w-fit ${trx.type === 'IN' ? 'bg-[#00E599]/10 text-[#00E599] border-[#00E599]/20' : 'bg-[#4DA6FF]/10 text-[#4DA6FF] border-[#4DA6FF]/20'}`}>
                          {trx.type === 'IN' ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                          {trx.type}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className={`font-mono text-base font-bold align-middle text-center ${trx.type === 'IN' ? 'text-[#00E599]' : 'text-[#4DA6FF]'}`}>
                      {trx.qty > 0 ? `+${trx.qty}` : trx.qty}
                    </TableCell>

                    {/* STAFF AVATAR (justify-center) */}
                    <TableCell className="align-middle text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${trx.staff.color}`}>
                          {trx.staff.init}
                        </div>
                        <span className="text-sm text-zinc-300 font-medium">{trx.staff.name}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-zinc-500 align-middle text-center">
                      {trx.note}
                    </TableCell>

                    <TableCell className="text-xs text-zinc-500 font-mono align-middle text-center">
                      {trx.date}
                    </TableCell>
                    
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Panggilan Modal */}
      <StockInModal isOpen={isStockInOpen} onClose={() => setIsStockInOpen(false)} />
      <StockOutModal isOpen={isStockOutOpen} onClose={() => setIsStockOutOpen(false)} />
      
    </div>
  );
}