"use client";

import { useState, useEffect } from "react";
import { Search, Plus, RefreshCw, Edit2, Trash2, Phone, MapPin, Map, Building2 } from "lucide-react";
import SupplierFormModal from "@/components/suppliers/SupplierFormModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
// import Cookies from 'js-cookie'; 

export default function SuppliersPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); 
  const [selectedSupplier, setSelectedSupplier] = useState(null); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- MOCK API DATA ---
  useEffect(() => {
    const dummyData = [
      { id: 1, name: "PT Indofood Sukses", phone: "021-5795-8888", address: "Jl. Raya Bogor Km 26, Jakarta", lat: "-6.20", lng: "106.80", category: "Makanan & Minuman" },
      { id: 2, name: "CV Sumber Makmur", phone: "022-420-1234", address: "Jl. Soekarno-Hatta No.45, Bandung", lat: "-6.91", lng: "107.61", category: "Sembako" },
      { id: 3, name: "UD Berkah Jaya", phone: "031-822-5566", address: "Jl. Ahmad Yani No.12, Surabaya", lat: "-7.25", lng: "112.75", category: "Kebersihan" },
    ];
    setSuppliers(dummyData);
  }, []);

  /* // ==========================================
     // KODE API PRODUCTION (GET)
     // ==========================================
  const fetchSuppliersAPI = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/suppliers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      setSuppliers(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  */

  const filteredSuppliers = suppliers.filter((sup) => 
    sup.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const executeDelete = () => {
    console.log("[SLICING MODE] Hapus data API untuk ID:", selectedSupplier?.id);
    // API Call untuk delete diletakkan di sini nantinya
  };

  const handleOpenMap = (lat, lng, name) => {
    if (!lat || !lng) {
      alert("Coordinates not available for this supplier.");
      return;
    }
    
    // KODE DUMMY SLICING
    console.log(`[SLICING MODE] Membuka Maps untuk ${name} di kordinat: ${lat}, ${lng}`);
    
    // KODE PRODUCTION (Google Maps Link)
    // Uncomment baris di bawah ini jika ingin membuka tab baru Google Maps sungguhan
    // window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden pb-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-white text-2xl font-bold">Supplier Management</h2>
          <p className="text-zinc-500 text-sm">{filteredSuppliers.length} registered suppliers</p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex gap-4 shrink-0 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
            placeholder="Search supplier name..." 
          />
        </div>
        <button className="bg-zinc-950 text-zinc-400 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-800 hover:bg-zinc-800 transition-colors flex items-center gap-2">
          <RefreshCw size={14} /> Refresh
        </button>
        <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer">
          <Plus size={18} strokeWidth={3} /> Add Supplier
        </button>
      </div>

      {/* GRID CARDS CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-xl">
            No suppliers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSuppliers.map((sup) => (
              <div key={sup.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition-colors">
                
                <div>
                  {/* Top Row: Icon & Actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800/50">
                      <Building2 className="text-[#00E599]" size={20} />
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleOpenEdit(sup)} className="p-1.5 text-zinc-500 hover:text-white bg-zinc-950 rounded-md transition-colors border border-zinc-800">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => handleOpenDelete(sup)} className="p-1.5 text-red-500/70 hover:text-red-500 bg-zinc-950 rounded-md transition-colors border border-red-500/20">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Info: Name & Category */}
                  <h3 className="text-white font-bold text-lg mb-2">{sup.name}</h3>
                  <span className="inline-block bg-[#4DA6FF]/10 text-[#4DA6FF] text-[10px] font-bold px-2.5 py-1 rounded-md mb-4 border border-[#4DA6FF]/20">
                    {sup.category}
                  </span>

                  {/* Details: Phone, Address, Lat/Lng */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2.5">
                      <Phone size={14} className="text-zinc-500 mt-0.5 shrink-0" />
                      <p className="text-zinc-400 text-xs font-medium">{sup.phone}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
                      <p className="text-zinc-400 text-xs leading-relaxed">{sup.address}</p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Map size={14} className="text-[#4DA6FF] mt-0.5 shrink-0" />
                      <p className="text-zinc-400 text-xs">{sup.lat}, {sup.lng}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Button */}
                <button 
                  onClick={() => handleOpenMap(sup.lat, sup.lng, sup.name)}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg border border-zinc-800 transition-colors flex justify-center items-center gap-2"
                >
                  <MapPin size={14} className="text-red-500" /> Open in Maps
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      <SupplierFormModal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        mode={formMode}
        initialData={selectedSupplier}
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