"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import RuleFormModal from "@/components/rules/RuleFormModal";
import DeleteConfirmModal  from "@/components/shared/DeleteConfirmModal";
import { useRules } from "@/hooks/useRules";

export default function StockRulesPage() {
    const { rulesList, stats, isLoading, fetchRules, deleteRule } = useRules();
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [selectedRule, setSelectedRule] = useState(null);

    useEffect(() => {
        fetchRules();
    }, [fetchRules]);

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

    const executeDelete = async () => {
        if (!selectedRule) return;
        const success = await deleteRule(selectedRule.id);
        if (success) {
            setIsDeleteModalOpen(false);
            setSelectedRule(null);
        } else {
            alert("Gagal menghapus konfigurasi aturan stok.");
        }
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
            {/* STATS CARD SECTION */}
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

            {/* TABLE SECTION */}
            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Stock Rules Configuration</h3>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shrink-0 shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Add Rule
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[1000px]">
                        <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-left pl-6">Product</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Min Threshold</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Current Stock</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Restock Suggestion</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Predicted Stockout</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Status</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">Loading rules data...</TableCell>
                                </TableRow>
                            ) : rulesList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">No rules configured.</TableCell>
                                </TableRow>
                            ) : (
                                rulesList.map((rule) => {
                                    const isCritical = rule.status === 'Critical';
                                    const isLow = rule.status === 'Low';

                                    // Mengambil data predicted stockout
                                    const rawPredictDate = rule.predicted_stockout || rule.product?.predicted_stockout || null;
                                    
                                    const predDateFmt = rawPredictDate 
                                        ? new Date(rawPredictDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                                        : "-";

                                    // REVISI: Logika warna font mengikuti status aturan stok secara penuh
                                    let predictColor = 'text-[#00c985] dark:text-[#00E599]'; // Status Normal (Hijau)
                                    if (isCritical) {
                                        predictColor = 'text-red-600 dark:text-red-500 font-bold'; // Status Critical (Merah)
                                    } else if (isLow) {
                                        predictColor = 'text-yellow-600 dark:text-yellow-500 font-bold'; // Status Low (Kuning)
                                    }

                                    return (
                                        <TableRow key={rule.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-14">

                                            <TableCell className="font-bold text-zinc-900 dark:text-white text-sm align-middle text-left pl-6 transition-colors">
                                                {rule.product?.name || rule.product || "Unknown Product"}
                                            </TableCell>

                                            <TableCell className="font-mono text-zinc-600 dark:text-zinc-400 text-sm align-middle text-center transition-colors">
                                                {rule.min} {rule.unit}
                                            </TableCell>

                                            <TableCell className={`font-mono text-sm font-bold align-middle text-center transition-colors ${isCritical ? 'text-red-600 dark:text-red-500' : isLow ? 'text-yellow-600 dark:text-yellow-500' : 'text-zinc-900 dark:text-white'}`}>
                                                {rule.current} {rule.unit}
                                            </TableCell>

                                            <TableCell className="font-mono text-sm font-bold text-[#00c985] dark:text-[#00E599] align-middle text-center">
                                                +{rule.suggest} {rule.unit}
                                            </TableCell>

                                            {/* PREDICTED STOCKOUT DENGAN WARNA DINAMIS */}
                                            <TableCell className={`font-mono text-sm align-middle text-center transition-colors ${rawPredictDate ? predictColor : 'text-zinc-500'}`}>
                                                {predDateFmt}
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
                onSuccess={fetchRules}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                itemName={selectedRule?.product?.name || selectedRule?.product}
                entityName="Stock Rule"
            />
        </div>
    );
}