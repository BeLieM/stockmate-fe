"use client";

import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import StaffFormModal from "@/components/staff/StaffFormModal";
import StaffStatusModal from "@/components/staff/StaffStatusModal";
// import Cookies from 'js-cookie'; 

export default function StaffPage() {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

    const [staffList, setStaffList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);

    // --- MOCK API DATA ---
    useEffect(() => {
        const dummyData = [
            { id: 1, name: "Andi Saputra", init: "AS", color: "bg-red-400 dark:bg-red-500", email: "andi@tokoberkahjaya.id", role: "Staff", status: "Active", txToday: 8, joined: "01 Jan 2026" },
            { id: 2, name: "Budi Santoso", init: "BS", color: "bg-blue-400 dark:bg-blue-500", email: "budi@tokoberkahjaya.id", role: "Staff", status: "Active", txToday: 4, joined: "01 Jan 2026" },
            { id: 3, name: "Citra Dewi", init: "CD", color: "bg-[#00c985] dark:bg-[#00E599] text-white dark:text-zinc-950", email: "citra@tokoberkahjaya.id", role: "Staff", status: "Suspended", txToday: 0, joined: "15 Jan 2026" },
        ];
        setStaffList(dummyData);
    }, []);

    /* // ==========================================
       // KODE API PRODUCTION (GET STAFF)
       // ==========================================
    const fetchStaffAPI = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = Cookies.get("stockmate_token");
        const response = await fetch(`${API_URL}/staff`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        setStaffList(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    */

    const filteredStaff = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAdd = () => setIsFormModalOpen(true);

    const handleOpenStatus = (staff) => {
        setSelectedStaff(staff);
        setIsStatusModalOpen(true);
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
                        placeholder="Search staff name..."
                    />
                </div>
            </div>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">

                {/* TOOLBAR */}
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Staff List</h3>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Add Staff
                    </button>
                </div>

                {/* TABLE KONTEN */}
                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[800px]">
                        <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest pl-6 h-10">Staff</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Email</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Role</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Status</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">TX Today</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Joined</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-right pr-6 h-10 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500 dark:text-zinc-500 align-middle">No staff found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredStaff.map((staff) => (
                                    <TableRow key={staff.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-16">

                                        {/* STAFF PROFILE */}
                                        <TableCell className="pl-6 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white ${staff.color}`}>
                                                    {staff.init}
                                                </div>
                                                <span className="font-bold text-zinc-900 dark:text-white text-sm transition-colors">{staff.name}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-zinc-600 dark:text-zinc-400 text-xs align-middle text-center transition-colors">{staff.email}</TableCell>

                                        <TableCell className="align-middle text-center">
                                            <span className="bg-[#4DA6FF]/10 border border-[#4DA6FF]/20 text-[#2b8eea] dark:text-[#4DA6FF] text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors">
                                                {staff.role}
                                            </span>
                                        </TableCell>

                                        <TableCell className="align-middle text-center">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border transition-colors ${staff.status === 'Active' ? 'bg-[#00E599]/10 border-[#00E599]/20 text-[#00c985] dark:text-[#00E599]' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-500'}`}>
                                                {staff.status}
                                            </span>
                                        </TableCell>

                                        <TableCell className="font-mono font-bold text-zinc-900 dark:text-white align-middle text-center transition-colors">{staff.txToday}</TableCell>
                                        <TableCell className="font-mono text-zinc-600 dark:text-zinc-400 text-xs align-middle text-center transition-colors">{staff.joined}</TableCell>

                                        <TableCell className="text-right pr-6 align-middle">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenStatus(staff)}
                                                    className="px-5 py-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
                                                >
                                                    Edit
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

            <StaffFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />
            <StaffStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} staffData={selectedStaff} />

        </div>
    );
}