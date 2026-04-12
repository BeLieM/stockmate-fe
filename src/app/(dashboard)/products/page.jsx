"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import ProductFormModal from "@/components/products/ProductFormModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
// import Cookies from 'js-cookie'; 

export default function ProductsPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // --- MOCK API DATA ---
  useEffect(() => {
    const dummyData = [
      { id: 1, name: "Mie Instan Goreng", sub: "min. 20 pcs", category: "Makanan", stock: 4, unit: "pcs", min: 20, buy: 3200, sell: 3500, status: "Critical" },
      { id: 2, name: "Aqua 600ml", sub: "min. 30 btl", category: "Minuman", stock: 85, unit: "btl", min: 30, buy: 2500, sell: 3000, status: "Normal" },
      { id: 3, name: "Kopi Kapal Api", sub: "min. 15 pcs", category: "Minuman", stock: 12, unit: "pcs", min: 15, buy: 1500, sell: 2000, status: "Low" },
      { id: 4, name: "Deterjen Rinso", sub: "min. 12 pcs", category: "Kebersihan", stock: 3, unit: "pcs", min: 12, buy: 8500, sell: 10000, status: "Critical" },
      { id: 5, name: "Beras Premium 5kg", sub: "min. 10 krg", category: "Sembako", stock: 22, unit: "krg", min: 10, buy: 65000, sell: 75000, status: "Normal" },
    ];
    setProducts(dummyData);
    setIsLoading(false);
  }, []);

  /* // ==========================================
     // KODE API PRODUCTION
     // ==========================================
  const fetchProductsAPI = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/products`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Gagal mengambil data produk");
      const data = await response.json();
      setProducts(data.data); 
    } catch (error) {
      console.error("Fetch API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  */

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "All Categories" || product.category === categoryFilter;
    const matchStatus = statusFilter === "All Status" || product.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Critical': return 'text-red-600 dark:text-red-500 bg-red-500/10 border-red-500/20';
      case 'Low': return 'text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-[#00c985] dark:text-[#00E599] bg-[#00E599]/10 border-[#00E599]/20';
    }
  };

  const handleOpenAdd = () => {
    setFormMode("add");
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedProduct) return;
    return new Promise((resolve) => {
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
        resolve(); 
      }, 1500);
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden pb-6">
      
      {/* SEARCH BAR (Header Text Removed, Aligned to Right) */}
      <div className="flex justify-end mb-6 shrink-0">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={16} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-9 pr-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors shadow-sm" 
            placeholder="Search product name..." 
          />
        </div>
      </div>

      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">
        
        {/* TOOLBARS (Filters & Buttons) */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
          
          <div className="flex gap-4">
            {/* Filter: Category */}
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="All Categories">All Categories</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Kebersihan">Kebersihan</option>
              <option value="Sembako">Sembako</option>
            </select>

            {/* Filter: Status */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none appearance-none cursor-pointer min-w-[120px]"
            >
              <option value="All Status">All Status</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
            <Plus size={18} strokeWidth={3} /> Add Product
          </button>
        </div>

        {/* TABLE KONTEN */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[800px]">
            <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest pl-6 h-10">Product</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">Category</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">Stock</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">Buy Price</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">Sell Price</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10">Status</TableHead>
                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-right pr-6 h-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">Loading data...</TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-zinc-500 align-middle">
                    No products found matching your search and filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((p) => (
                  <TableRow key={p.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white transition-colors">{p.name}</div>
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors">{p.sub}</div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="bg-[#4DA6FF]/10 text-[#2b8eea] dark:text-[#4DA6FF] border border-[#4DA6FF]/20 font-semibold px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">{p.category}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`text-sm font-bold ${p.status === 'Critical' ? 'text-red-600 dark:text-red-500' : p.status === 'Low' ? 'text-yellow-600 dark:text-yellow-500' : 'text-zinc-700 dark:text-zinc-300'}`}>{p.stock}</span>
                      <span className="text-zinc-500 dark:text-zinc-500 text-[10px] ml-1">{p.unit}</span>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-600 dark:text-zinc-400 font-mono py-4 transition-colors">Rp {p.buy.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-zinc-900 dark:text-white font-mono font-bold py-4 transition-colors">Rp {p.sell.toLocaleString()}</TableCell>
                    <TableCell className="py-4">
                      <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border w-fit ${getStatusColor(p.status)}`}>{p.status}</div>
                    </TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-sm">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleOpenDelete(p)} className="p-2 text-red-500/80 hover:text-red-600 dark:hover:text-red-500 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/50 cursor-pointer shadow-sm">
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

      <ProductFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        mode={formMode}
        initialData={selectedProduct}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}               
        itemName={selectedProduct?.name}        
        entityName="Product"                    
      />
    </div>
  );
}