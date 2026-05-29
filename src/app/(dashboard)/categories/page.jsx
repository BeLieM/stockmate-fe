"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
    const { categories, isLoading, fetchCategories, deleteCategory } = useCategories();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // --- LOGIKA FILTER SEARCH ---
    const filteredCategories = categories.filter((cat) =>
        cat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAdd = () => {
        setFormMode("add");
        setSelectedCategory(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (cat) => {
        setFormMode("edit");
        setSelectedCategory(cat);
        setIsFormModalOpen(true);
    };

    const handleOpenDelete = (cat) => {
        setSelectedCategory(cat);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!selectedCategory) return;
        const success = await deleteCategory(selectedCategory.id);
        if (success) {
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
        } else {
            alert("Gagal menghapus kategori. Pastikan tidak ada produk yang terikat dengan kategori ini.");
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden pb-6">

            {/* SEARCH BAR */}
            <div className="flex justify-end mb-6 shrink-0">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={16} />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors shadow-sm"
                        placeholder="Search category name..."
                    />
                </div>
            </div>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">

                {/* TOOLBAR */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Categories List</h3>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer text-sm shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Add Category
                    </button>
                </div>

                {/* TABLE CONTENT */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[600px]">
                        <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Name</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Total Products</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500 dark:text-zinc-500 align-middle">
                                        Loading categories...
                                    </TableCell>
                                </TableRow>
                            ) : filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500 dark:text-zinc-500 align-middle">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((cat) => {
                                    const totalProducts = cat._count?.products || cat.products?.length || cat.total_products || cat.total || 0;

                                    return (
                                        <TableRow key={cat.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-14">

                                            <TableCell className="font-bold text-zinc-900 dark:text-white text-sm align-middle text-center transition-colors">
                                                {cat.name}
                                            </TableCell>

                                            <TableCell className="text-sm text-zinc-600 dark:text-zinc-400 align-middle text-center transition-colors">
                                                <span className="text-[#00c985] dark:text-[#00E599] font-bold text-base mr-1">{totalProducts}</span>
                                            </TableCell>

                                            <TableCell className="align-middle text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleOpenEdit(cat)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleOpenDelete(cat)} className="p-2 text-red-500/80 hover:text-red-600 dark:hover:text-red-500 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/50 cursor-pointer shadow-sm">
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

            <CategoryFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                mode={formMode}
                initialData={selectedCategory}
                onSuccess={fetchCategories}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                itemName={selectedCategory?.name}
                entityName="Category"
            />
        </div>
    );
}