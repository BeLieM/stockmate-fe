"use client";

import { useState, useEffect } from "react";
import { Search, Plus, RefreshCw } from "lucide-react";
import SupplierFormModal from "@/components/suppliers/SupplierFormModal";
import SupplierReviewModal from "@/components/suppliers/SupplierReviewModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import SupplierCard from "@/components/suppliers/SupplierCard";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SuppliersPage() {
  const { suppliers, isLoading, fetchSuppliers, deleteSupplier } = useSuppliers();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = suppliers.filter((sup) =>
    sup.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormMode("add");
    setSelectedSupplier(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setFormMode("edit");
    setSelectedSupplier(sup);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (sup) => {
    setSelectedSupplier(sup);
    setIsDeleteModalOpen(true);
  };

  const handleOpenReview = (sup) => {
    setSelectedSupplier(sup);
    setIsReviewModalOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedSupplier) return;
    const success = await deleteSupplier(selectedSupplier.id);
    if (success) {
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
    } else {
      alert("Gagal menghapus data supplier. Pastikan tidak ada data yang terkait dengan supplier ini.");
    }
  };

  const handleOpenMap = (address, name) => {
    if (!address) {
      alert("Alamat tidak tersedia untuk supplier ini.");
      return;
    }
    const query = encodeURIComponent(`${name} ${address}`);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=$${query}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden pb-6">
      <div className="flex gap-4 shrink-0 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors shadow-sm"
            placeholder="Search supplier name..."
          />
        </div>
        <button onClick={fetchSuppliers} disabled={isLoading} className="bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer">
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} /> Refresh
        </button>
        <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
          <Plus size={18} strokeWidth={3} /> Add Supplier
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
        {isLoading ? (
          <div className="text-center py-12 text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors shadow-sm">
            Loading suppliers data...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors shadow-sm">
            No suppliers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSuppliers.map((sup) => (
              <SupplierCard
                key={sup.id}
                supplier={sup}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onReview={handleOpenReview}
                onOpenMap={handleOpenMap}
              />
            ))}
          </div>
        )}
      </div>

      <SupplierFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        mode={formMode}
        initialData={selectedSupplier}
        onSuccess={fetchSuppliers}
      />

      <SupplierReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        supplier={selectedSupplier}
        onSuccess={fetchSuppliers}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        itemName={selectedSupplier?.name}
        entityName="Supplier"
      />
    </div>
  );
}