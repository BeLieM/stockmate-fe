"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import StaffFormModal from "@/components/staff/StaffFormModal";
import EditStaffModal from "@/components/staff/EditStaffModal";
import DeleteConfirmModal from "@/components/shared/DeleteConfirmModal";
import { useStaff } from "@/hooks/useStaff";

export default function StaffPage() {
    const { staffList, isLoading, fetchStaff, deleteStaff } = useStaff();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);

    useEffect(() => {
        fetchStaff();
    }, [fetchStaff]);

    const filteredStaff = staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenAdd = () => setIsFormModalOpen(true);

    const handleOpenEdit = (staff) => {
        setSelectedStaff(staff);
        setIsEditModalOpen(true);
    };

    const handleOpenDelete = (staff) => {
        setSelectedStaff(staff);
        setIsDeleteModalOpen(true);
    };

    const executeDelete = async () => {
        if (!selectedStaff) return;
        const success = await deleteStaff(selectedStaff.id);
        if (success) {
            setIsDeleteModalOpen(false);
            setSelectedStaff(null);
        } else {
            alert("Gagal menghapus akun staff.");
        }
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
                        placeholder="Search staff name..."
                    />
                </div>
            </div>

            <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col flex-1 min-h-0 overflow-hidden transition-colors shadow-sm">

                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center shrink-0 transition-colors">
                    <h3 className="text-zinc-900 dark:text-white font-bold text-base transition-colors">Staff List</h3>
                    <button onClick={handleOpenAdd} className="bg-[#00E599] text-zinc-950 px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                        <Plus size={18} strokeWidth={3} /> Add Staff
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                    <Table className="text-zinc-700 dark:text-zinc-200 w-full min-w-[700px]">
                        <TableHeader className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-zinc-50 dark:bg-zinc-900 z-10 transition-colors">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest pl-6 h-10">Staff</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Email</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest h-10 text-center">Role</TableHead>
                                <TableHead className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest text-right pr-6 h-10 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500 dark:text-zinc-500 align-middle">Loading staff data...</TableCell>
                                </TableRow>
                            ) : filteredStaff.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500 dark:text-zinc-500 align-middle">No staff found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredStaff.map((staff) => (
                                    <TableRow key={staff.id} className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors h-16">

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
                                            <span className="bg-[#4DA6FF]/10 border border-[#4DA6FF]/20 text-[#2b8eea] dark:text-[#4DA6FF] text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors capitalize">
                                                {staff.role}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right pr-6 align-middle">
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(staff)}
                                                    className="px-5 py-1.5 h-8 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-950 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleOpenDelete(staff)} 
                                                    className="w-8 h-8 flex items-center justify-center text-red-500/80 hover:text-red-600 dark:hover:text-red-500 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/50 cursor-pointer shadow-sm"
                                                    title="Delete Staff"
                                                >
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

            <StaffFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSuccess={fetchStaff} />
            <EditStaffModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} staffData={selectedStaff} onSuccess={fetchStaff} />
            
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDelete}
                itemName={selectedStaff?.name}
                entityName="Staff"
            />
        </div>
    );
}