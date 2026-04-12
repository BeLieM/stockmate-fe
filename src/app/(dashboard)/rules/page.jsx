"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import RuleFormModal from "@/components/rules/RuleFormModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal"; // Asumsi lokasinya di sini
// import Cookies from 'js-cookie'; 

export default function StockRulesPage() {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [selectedRule, setSelectedRule] = useState(null);

    const [rulesList, setRulesList] = useState([]);
    const [stats, setStats] = useState({ critical: 0, low: 0, active: 0, total: 0 });

    // --- MOCK API DATA ---
    useEffect(() => {
        const dummyData = [
            { id: 1, product: "Mie Instan Goreng", min: "20 pcs", current: 4, unit: "pcs", suggest: 50, outDate: "3 Mar 2026", status: "Critical" },
            { id: 2, product: "Aqua 600ml", min: "30 btl", current: 85, unit: "btl", suggest: 60, outDate: "18 Mar 2026", status: "Normal" },
            { id: 3, product: "Kopi Kapal Api", min: "15 pcs", current: 12, unit: "pcs", suggest: 30, outDate: "5 Mar 2026", status: "Low" },
            { id: 4, product: "Deterjen Rinso", min: "12 pcs", current: 3, unit: "pcs", suggest: 40, outDate: "3 Mar 2026", status: "Critical" },
            { id: 5, product: "Beras Premium 5kg", min: "10 krg", current: 22, unit: "krg", suggest: 20, outDate: "25 Mar 2026", status: "Normal" },
        ];
        setRulesList(dummyData);
        setStats({ critical: 2, low: 1, active: 7, total: 8 });
    }, []);

    /* // ==========================================
       // KODE API PRODUCTION (GET RULES)
       // ==========================================
    const fetchRulesAPI = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = Cookies.get("stockmate_token");
        const response = await fetch(`${API_URL}/rules`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setRulesList(data.data.rules);
        setStats(data.data.stats);
      } catch (error) {
        console.error(error);
      }
    };
    */

    const handleOpenAdd = () => {
        setFormMode("add");
        setSelectedRule(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (rule) => {
        setFormMode("edit");
        setSelectedRule(rule);
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (rule) => {
        setSelectedRule(rule);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = () => {
        console.log("[SLICING MODE] Hapus Rule ID:", selectedRule?.id);
        // API Call Delete diletakkan di sini
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
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 shrink-0">
                <Card className="bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 p-5 transition-colors shadow-sm">
                    <p className="text-red-600 dark:text-red-500 text-[10px] font-bold uppercase tracking-widest mb-2">Critical Rules Triggered</p>
                    <p className="text-red-600 dark:text-red-500 text-3xl font-bold mb-2">{stats.critical}</p>
                    <p className="text-red-700/60 dark:text-zinc-500 text-xs">Products below threshold</p>
                </Card>

                <Card className="bg-yellow-50 dark:bg-yellow-500/5 border-yellow-200 dark:border-yellow-500/20 p-5 transition-colors shadow-sm">
                    <p className="text-yellow-600 dark:text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-2">Low Stock Warnings</p>
                    <p className="text-yellow-600 dark:text-yellow-500 text-3xl font-bold mb-2">{stats.low}</p>
                    <p className="text-yellow-700/60 dark:text-zinc-500 text-xs">Products approaching threshold</p>
                </Card>

                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-5 transition-colors shadow-sm">
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Active Rules</p>
                    <p className="text-zinc-900 dark:text-white text-3xl font-bold mb-2 transition-colors">{stats.active}</p>
                    <p className="text-zinc-500 dark:text-zinc-500 text-xs">Out of {stats.total} products configured</p>
                </Card>
            </div>

            {/* MAIN TABLE CARD */}
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">

                {/* TOOLBAR */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Stock Rules Configuration</h3>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shrink-0 shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Add Rule
                    </button>
                </div>

                {/* TABLE KONTEN */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[900px]">
                        <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Product</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Min Threshold</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Current Stock</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Restock Suggestion</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Predicted Stockout</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Status</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rulesList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">No rules configured.</TableCell>
                                </TableRow>
                            ) : (
                                rulesList.map((rule) => {
                                    const isCritical = rule.status === 'Critical';
                                    const isLow = rule.status === 'Low';

                                    return (
                                        <TableRow key={rule.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-14">

                                            <TableCell className="font-bold text-zinc-900 dark:text-white text-sm align-middle text-center transition-colors">
                                                {rule.product}
                                            </TableCell>

                                            <TableCell className="font-mono text-zinc-600 dark:text-zinc-300 text-sm align-middle text-center transition-colors">
                                                {rule.min}
                                            </TableCell>

                                            <TableCell className={`font-mono text-sm font-bold align-middle text-center transition-colors ${isCritical ? 'text-red-600 dark:text-red-500' : isLow ? 'text-yellow-600 dark:text-yellow-500' : 'text-zinc-900 dark:text-white'
                                                }`}>
                                                {rule.current} {rule.unit}
                                            </TableCell>

                                            <TableCell className="font-mono text-sm font-bold text-[#00c985] dark:text-[#00E599] align-middle text-center">
                                                +{rule.suggest} {rule.unit}
                                            </TableCell>

                                            <TableCell className={`font-mono text-xs align-middle text-center transition-colors ${isCritical ? 'text-red-600 dark:text-red-500' : isLow ? 'text-yellow-600 dark:text-yellow-500' : 'text-zinc-500'
                                                }`}>
                                                {rule.outDate}
                                            </TableCell>

                                            <TableCell className="align-middle text-center">
                                                <div className="flex justify-center">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border w-fit ${getStatusColor(rule.status)}`}>
                                                        {rule.status}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="pr-6 align-middle text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleOpenEdit(rule)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleOpenDelete(rule)} className="p-2 text-red-500/80 hover:text-red-600 dark:hover:text-red-500 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/50 cursor-pointer shadow-sm">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <RuleFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                mode={formMode}
                initialData={selectedRule}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                itemName={selectedRule?.product}
                entityName="Stock Rule"
            />

        </div>
    );
}