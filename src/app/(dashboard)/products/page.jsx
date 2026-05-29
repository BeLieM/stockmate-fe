"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, AlertTriangle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import ProductFormModal from "@/components/products/ProductFormModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { useProduct } from "@/hooks/useProduct";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function ProductsPage() {
    const { products, isLoading, fetchProducts, deleteProduct } = useProduct();
    const { suppliers, fetchSuppliers } = useSuppliers();
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formMode, setFormMode] = useState("add");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, [fetchProducts, fetchSuppliers]);

    //LOGIKA FILTER GANDA (PENCARIAN & SUPPLIER)
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSupplier = selectedSupplier ? p.supplier_id === selectedSupplier : true;
        return matchesSearch && matchesSupplier;
    });

    const handleOpenAdd = () => {
        setFormMode("add");
        setSelectedProduct(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (p) => {
        setFormMode("edit");
        setSelectedProduct(p);
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (p) => {
        setSelectedProduct(p);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!selectedProduct) return;
        await deleteProduct(selectedProduct.id);
        setIsDeleteModalOpen(false);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="h-full flex flex-col overflow-hidden pb-6">
            <div className="flex justify-end items-center gap-3 mb-6 shrink-0">
            
                <div className="w-48">
                    <select
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="">All Suppliers</option>
                        {suppliers.map(sup => (
                            <option key={sup.id} value={sup.id}>{sup.name}</option>
                        ))}
                    </select>
                </div>

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
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Inventory Products</h3>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Add Product
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[1200px]">
                        <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-left pl-6">Product</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Category</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Stock</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Buy Price</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Sell Price</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Status</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Predict Stock Out</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-12 text-zinc-500">Loading products...</TableCell></TableRow>
                            ) : filteredProducts.map((p) => {
                                
                                // LOGIKA PREDICTED STOCK OUT
                                const predDateFmt = p.predicted_stockout 
                                    ? new Date(p.predicted_stockout).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
                                    : "-";
                                
                                let daysText = "-";
                                if (p.predicted_stockout) {
                                    const today = new Date();
                                    today.setHours(0,0,0,0);
                                    const target = new Date(p.predicted_stockout);
                                    target.setHours(0,0,0,0);
                                    
                                    const diffTime = target - today;
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    
                                    if (diffDays < 0) daysText = `${Math.abs(diffDays)} days ago`;
                                    else if (diffDays === 0) daysText = "Today";
                                    else daysText = `${diffDays} days left`;
                                }

                                // LOGIKA WARNA BERDASARKAN STATUS
                                let statusColor = 'text-[#00c985] dark:text-[#00E599]';
                                let showWarning = false;
                                if (p.status === 'Critical') {
                                    statusColor = 'text-red-600 dark:text-red-500';
                                    showWarning = true;
                                } else if (p.status === 'Low') {
                                    statusColor = 'text-yellow-600 dark:text-yellow-500';
                                    showWarning = true;
                                }

                                return (
                                <TableRow key={p.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-20">
                                    {/* PRODUCT & MIN THRESHOLD */}
                                    <TableCell className="align-middle text-left pl-6">
                                        <div className="font-bold text-zinc-900 dark:text-white text-sm transition-colors">{p.name}</div>
                                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">min. {p.min_threshold || 0} {p.unit || 'pcs'}</div>
                                    </TableCell>
                                    
                                    {/* CATEGORY (PILL STYLE) */}
                                    <TableCell className="align-middle text-center">
                                        <span className="bg-[#4DA6FF]/10 text-[#4DA6FF] text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors">
                                            {p.category}
                                        </span>
                                    </TableCell>
                                    
                                    {/* STOCK & UNIT STACKED */}
                                    <TableCell className="align-middle text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className={`font-mono text-base font-bold ${statusColor}`}>{p.stock}</span>
                                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{p.unit || 'pcs'}</span>
                                        </div>
                                    </TableCell>
                                    
                                    <TableCell className="font-mono text-zinc-600 dark:text-zinc-400 text-xs align-middle text-center">{formatCurrency(p.buy)}</TableCell>
                                    <TableCell className="font-mono text-zinc-900 dark:text-white text-xs font-bold align-middle text-center transition-colors">{formatCurrency(p.sell)}</TableCell>
                                    
                                    {/* STATUS */}
                                    <TableCell className="align-middle text-center">
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border w-fit ${
                                                p.status === 'Critical' ? 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20' : 
                                                p.status === 'Low' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-500/20' : 
                                                'bg-[#00E599]/10 text-[#00c985] dark:text-[#00E599] border-[#00E599]/20'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* PREDICT STOCK OUT (NEW) */}
                                    <TableCell className="align-middle text-center">
                                        {p.predicted_stockout ? (
                                            <div className="flex flex-col items-center justify-center">
                                                <div className={`flex items-center gap-1.5 font-mono text-xs font-bold ${statusColor}`}>
                                                    {showWarning && <AlertTriangle size={12} strokeWidth={3} />}
                                                    {predDateFmt}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                                                    <Clock size={10} />
                                                    {daysText}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-zinc-500">-</span>
                                        )}
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell className="align-middle text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleOpenEdit(p)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleOpenDelete(p)} className="p-2 text-red-500/80 hover:text-red-600 dark:hover:text-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20 cursor-pointer">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <ProductFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} mode={formMode} initialData={selectedProduct} onSuccess={fetchProducts} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={executeDelete} itemName={selectedProduct?.name} entityName="Product" />
        </div>
    );
}