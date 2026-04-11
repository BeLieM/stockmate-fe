"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
// import Cookies from 'js-cookie'; 

export default function CategoriesPage() {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formMode, setFormMode] = useState("add");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // --- MOCK API DATA ---
    useEffect(() => {
        const dummyData = [
            { id: "001", name: "Makanan", total: 1, created: "01 Jan 2026", description: "" },
            { id: "002", name: "Minuman", total: 3, created: "01 Jan 2026", description: "" },
            { id: "003", name: "Kebersihan", total: 2, created: "01 Jan 2026", description: "" },
            { id: "004", name: "Sembako", total: 2, created: "01 Jan 2026", description: "" },
        ];
        setCategories(dummyData);
    }, []);

    /* // ==========================================
       // KODE API PRODUCTION (GET)
       // ==========================================
    const fetchCategoriesAPI = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = Cookies.get("stockmate_token");
        const response = await fetch(`${API_URL}/categories`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    */

    // --- LOGIKA FILTER SEARCH ---
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
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

    const executeDelete = () => {
        console.log("[SLICING MODE] Hapus data kategori API untuk ID:", selectedCategory?.id);
        // API Call untuk delete diletakkan di sini nantinya
    };

    return (
        <div className="h-full flex flex-col overflow-hidden pb-6">

            {/* HEADER */}
            <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                    <h2 className="text-white text-2xl font-bold">Categories</h2>
                    <p className="text-zinc-500 text-sm">{filteredCategories.length} product categories</p>
                </div>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden">

                {/* TOOLBAR */}
                <div className="p-4 border-b border-zinc-800 flex gap-4 shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors"
                            placeholder="Search category name..."
                        />
                    </div>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer text-sm">
                        <Plus size={18} strokeWidth={3} /> Add Category
                    </button>
                </div>

                {/* TABLE CONTENT */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-200 w-full min-w-[600px]">
                        <TableHeader className="border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">ID</TableHead>
                                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Name</TableHead>
                                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Total Products</TableHead>
                                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Created Date</TableHead>
                                <TableHead className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500 bg-zinc-900/50">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <TableRow key={cat.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors h-16">

                                        <TableCell className="text-zinc-500 text-xs font-mono text-center">
                                            #{cat.id}
                                        </TableCell>

                                        <TableCell className="font-bold text-white text-sm text-center">
                                            {cat.name}
                                        </TableCell>

                                        <TableCell className="text-sm text-zinc-400 text-center">
                                            <span className="text-[#00E599] font-bold text-base mr-1">{cat.total}</span>
                                        </TableCell>

                                        <TableCell className="text-xs text-zinc-500 font-medium text-center">
                                            {cat.created}
                                        </TableCell>

                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(cat)} className="p-2 text-zinc-500 hover:text-white bg-zinc-950 rounded-lg transition-colors border border-zinc-800 cursor-pointer">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleOpenDelete(cat)} className="p-2 text-red-500/70 hover:text-red-500 bg-zinc-950 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/50 cursor-pointer">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </TableCell>

                                    </TableRow>
                                ))
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