"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Package, ArrowRightLeft,
    Truck, Grid, Users, FileText, Settings, User, AlertTriangle
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { useAccount } from "@/hooks/useAccount";
import { useProduct } from "@/hooks/useProduct";

export default function Sidebar() {
    const pathname = usePathname();
    const { storeName, isLoading: isStoreLoading } = useStore();
    const { profile, fetchProfile } = useAccount();
    const { products, fetchProducts } = useProduct();

    useEffect(() => {
        fetchProfile();
        fetchProducts();

        const handleUpdate = () => {
            fetchProducts();
        };

        window.addEventListener('stockmate-update', handleUpdate);
        return () => window.removeEventListener('stockmate-update', handleUpdate);
    }, [fetchProfile, fetchProducts]);

    const criticalCount = products.filter(p => p.status === 'Critical').length;
    
    const userName = profile?.name || profile?.full_name || "Loading...";
    const userRole = profile?.role || "Staff";
    const userInitials = profile ? userName.charAt(0).toUpperCase() : "XX";

    const navItems = [
        { name: "Dashboard", href: "/home", icon: LayoutDashboard },
        { name: "Products", href: "/products", icon: Package },
        { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
        { name: "Suppliers", href: "/suppliers", icon: Truck },
        { name: "Categories", href: "/categories", icon: Grid },
        { name: "Staff", href: "/staff", icon: Users },
        // { name: "Reports", href: "/reports", icon: FileText },
        { name: "Stock Rules", href: "/rules", icon: Settings },
        { name: "Account", href: "/account", icon: User },
    ];

    return (
        <aside className="w-64 h-full bg-white dark:bg-[#0A0A0A] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between overflow-y-auto transition-colors duration-200">
            <div>
                <div className="p-6">
                    <Link href="/home" className="flex items-center gap-3">
                        <Image src="/stockmate-logo.webp" alt="StockMate Logo" width={28} height={28} className="rounded-md" />
                        <div className="flex flex-col">
                            <span className="text-zinc-900 dark:text-white font-bold text-lg tracking-tight leading-tight transition-colors">
                                Stock<span className="text-[#00E599]">Mate</span>
                            </span>
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest leading-none">Inventory</span>
                        </div>
                    </Link>
                </div>

                <div className="px-6 mb-6">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
                        Active Store
                    </p>
                    <p className={`text-sm font-semibold transition-colors ${isStoreLoading ? 'text-zinc-400 animate-pulse' : 'text-zinc-900 dark:text-white'}`}>
                        {storeName}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00E599]"></div>
                        <p className="text-[#00E599] text-xs font-medium">Active Mode</p>
                    </div>
                </div>

                <nav className="px-3 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-[#00E599]/10 text-[#00E599] border border-[#00E599]/20"
                                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                                    }`}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 space-y-4">
                
                {criticalCount > 0 ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2 shadow-sm transition-colors">
                        <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-red-600 dark:text-red-500 text-xs font-bold">{criticalCount} Critical Stock</p>
                            <p className="text-red-600/80 dark:text-red-500/80 text-[10px] mt-0.5">Immediate restock needed</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex items-center gap-2 shadow-sm transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#00E599]"></div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-[10px] font-bold">System Status: Normal</p>
                    </div>
                )}

                <Link href="/account" className="flex items-center gap-3 px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#00E599] flex items-center justify-center text-zinc-950 font-bold text-xs shrink-0">
                        {userInitials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-zinc-900 dark:text-white text-sm font-semibold truncate transition-colors">{userName}</p>
                        <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-wider truncate transition-colors">{userRole}</p>
                    </div>
                </Link>
            </div>
        </aside>
    );
}