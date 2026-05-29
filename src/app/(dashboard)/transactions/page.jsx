"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowUp, ArrowDown, Download, Search, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import StockInModal from "@/components/transactions/StockInModal";
import StockOutModal from "@/components/transactions/StockOutModal";
import { useTransaction } from "@/hooks/useTransaction";

export default function TransactionsPage() {
  const { transactions, isLoading, error, fetchTransactions, exportTransactions } = useTransaction();

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter(t => {
    const typeStr = (t.type || t.transaction_type || "").toUpperCase();
    const productName = (t.product?.name || t.product || "").toUpperCase();
    const trxDate = t.date || t.transaction_date || t.created_at;

    const matchType = filterType === "ALL" || typeStr === filterType.toUpperCase();
    const matchSearch = productName.includes(searchQuery.toUpperCase());

    let matchDate = true;
    if (startDate || endDate) {
      const tDate = new Date(trxDate);
      if (startDate) {
        matchDate = matchDate && tDate >= new Date(startDate);
      }
      if (endDate) {
        const endD = new Date(endDate);
        endD.setHours(23, 59, 59, 999);
        matchDate = matchDate && tDate <= endD;
      }
    }

    return matchType && matchSearch && matchDate;
  });

  const handleExportCSV = async () => {
    setIsExporting(true);

    let exportStart = startDate;
    let exportEnd = endDate;

    if (!exportStart) {
      if (transactions.length > 0) {
        const earliestDate = transactions.reduce((min, trx) => {
          const tDate = new Date(trx.date || trx.transaction_date || trx.created_at);
          return tDate < min ? tDate : min;
        }, new Date());
        
        exportStart = earliestDate.toISOString().split('T')[0];
      } else {
        exportStart = "2020-01-01"; 
      }
    }

    if (!exportEnd) {
      exportEnd = new Date().toISOString().split('T')[0];
    }

    const success = await exportTransactions(exportStart, exportEnd);
    
    if (!success) {
      alert("Gagal mengekspor laporan transaksi. Pastikan koneksi aman.");
    }
    
    setIsExporting(false);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dayMonth = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return `${time} • ${dayMonth}`;
  };

  const formatIDR = (num) => {
    return `Rp ${Number(num).toLocaleString('id-ID')}`;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden pb-6">
      <div className="flex justify-end mb-6 shrink-0">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={16} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors shadow-sm"
            placeholder="Search product..."
          />
        </div>
      </div>

      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 overflow-x-auto custom-scrollbar transition-colors">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 shrink-0 transition-colors">
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

          <div className="flex gap-3 shrink-0">
            <div className="flex gap-2 mr-2">
              <button onClick={() => setFilterType("ALL")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${filterType === "ALL" ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700' : 'bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                All Types
              </button>

              <button onClick={() => setFilterType("IN")} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border ${filterType === "IN" ? 'bg-[#00E599]/10 text-[#00c985] dark:text-[#00E599] border-[#00E599]/30' : 'bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-[#00E599]/10 hover:text-[#00c985] dark:hover:text-[#00E599]'}`}>
                <ArrowUp size={16} /> Stock In
              </button>

              <button onClick={() => setFilterType("OUT")} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border ${filterType === "OUT" ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-red-500/10 hover:text-red-500'}`}>
                <ArrowDown size={16} /> Stock Out
              </button>
            </div>

            <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 my-auto mx-1 transition-colors"></div>

            <button onClick={() => setIsStockInOpen(true)} className="px-3 py-2 bg-white dark:bg-zinc-950 text-[#00c985] dark:text-[#00E599] border border-[#00E599]/20 hover:border-[#00E599]/50 hover:bg-[#00E599]/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
              <Plus size={16} /> In
            </button>
            <button onClick={() => setIsStockOutOpen(true)} className="px-3 py-2 bg-white dark:bg-zinc-950 text-red-500 border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
              <Plus size={16} /> Out
            </button>

            <button 
              onClick={handleExportCSV} 
              disabled={isExporting}
              className="px-4 py-2 bg-[#00E599] text-zinc-950 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors flex items-center gap-2 ml-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <><span className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></span> Mengunduh...</>
              ) : (
                <><Download size={16} /> Export Report</>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[1000px]">
            <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">#</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Product</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Type</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Quantity</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Total Amount</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Staff</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Note</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Date & Time</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                 <TableRow>
                   <TableCell colSpan={8} className="text-center py-12 text-zinc-500 align-middle">Loading transactions...</TableCell>
                 </TableRow>
              ) : error ? (
                 <TableRow>
                   <TableCell colSpan={8} className="text-center py-12 text-red-500 align-middle">Failed to load data. Please try again.</TableCell>
                 </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-zinc-500 align-middle">No transactions found.</TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((trx) => {
                  const type = trx.type || trx.transaction_type; 
                  const typeUpper = (type || "").toUpperCase();
                  const productName = trx.product?.name || trx.product || "Unknown Product";
                  const qty = parseInt(trx.qty || trx.quantity || 0, 10);
                  const staffName = trx.staff?.name || trx.user?.name || "Admin";
                  const initial = staffName.charAt(0).toUpperCase();
                  const isStockIn = typeUpper === 'IN';
                  
                  const transPrice = parseInt(trx.trans_price || 0, 10);
                  const perPcs = qty > 0 ? transPrice / qty : 0;
                  
                  const colors = ["bg-red-500", "bg-blue-500", "bg-[#00E599]", "bg-purple-500", "bg-orange-500"];
                  const badgeColor = trx.staff?.color || colors[initial.charCodeAt(0) % colors.length];

                  return (
                    <TableRow key={trx.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-14">
                      
                      <TableCell className="text-zinc-500 text-xs font-mono align-middle text-center">
                        #{trx.id?.toString().slice(0,6) || "---"}
                      </TableCell>

                      <TableCell className="font-bold text-zinc-900 dark:text-white text-sm align-middle text-center transition-colors">
                        {productName}
                      </TableCell>

                      <TableCell className="align-middle text-center">
                        <div className="flex justify-center">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border w-fit ${isStockIn ? 'bg-[#00E599]/10 text-[#00c985] dark:text-[#00E599] border-[#00E599]/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {isStockIn ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                            {typeUpper}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className={`font-mono text-base font-bold align-middle text-center ${isStockIn ? 'text-[#00c985] dark:text-[#00E599]' : 'text-red-500'}`}>
                        {isStockIn && qty > 0 ? `+${qty}` : qty}
                      </TableCell>

                      <TableCell className="align-middle text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`font-mono font-bold text-sm ${isStockIn ? 'text-red-500' : 'text-[#00c985] dark:text-[#00E599]' }`}>
                            {isStockIn ? '-' : '+'}{formatIDR(transPrice)}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400 text-[10px] mt-0.5">
                            {formatIDR(perPcs)} /pcs
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="align-middle text-center">
                        <div className="flex items-center justify-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${badgeColor}`}>
                            {initial}
                          </div>
                          <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium transition-colors">{staffName}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 align-middle text-center transition-colors">
                        {trx.note || trx.notes || "-"}
                      </TableCell>

                      <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 font-mono align-middle text-center transition-colors">
                        {formatDateTime(trx.date || trx.transaction_date || trx.created_at)}
                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <StockInModal 
        isOpen={isStockInOpen} 
        onClose={() => setIsStockInOpen(false)} 
        onSuccess={fetchTransactions} 
      />
      <StockOutModal 
        isOpen={isStockOutOpen} 
        onClose={() => setIsStockOutOpen(false)} 
        onSuccess={fetchTransactions} 
      />
    </div>
  );
}