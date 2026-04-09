"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Package, ArrowRightLeft,
    Truck, Grid, Users, FileText, Settings, User, AlertTriangle
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/home", icon: LayoutDashboard },
        { name: "Products", href: "/products", icon: Package },
        { name: "Transactions", href: "/transactions", icon: ArrowRightLeft },
        { name: "Suppliers", href: "/suppliers", icon: Truck },
        { name: "Categories", href: "/categories", icon: Grid },
        { name: "Staff", href: "/staff", icon: Users },
        { name: "Reports", href: "/reports", icon: FileText },
        { name: "Stock Rules", href: "/rules", icon: Settings },
        { name: "Account", href: "/account", icon: User },
    ];

    return (
        <aside className="w-64 h-full bg-[#0A0A0A] border-r border-zinc-800 flex flex-col justify-between overflow-y-auto">
            <div>
                {/* Logo Section */}
                <div className="p-6">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <Image src="/stockmate-logo.webp" alt="StockMate Logo" width={28} height={28} className="rounded-md" />
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg tracking-tight leading-tight">Stock<span className="text-[#00E599]">Mate</span></span>
                            <span className="text-zinc-500 text-[10px] uppercase tracking-widest leading-none">Inventory</span>
                        </div>
                    </Link>
                </div>

                {/* Active Store Section */}
                <div className="px-6 mb-6">
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Active Store</p>
                    <p className="text-white text-sm font-semibold">Toko Berkah Jaya</p>
                    <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00E599]"></div>
                        <p className="text-[#00E599] text-xs">Owner Mode</p>
                    </div>
                </div>

                {/* Navigation */}
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
                                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                    }`}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section (Alert & Profile) */}
            <div className="p-4 space-y-4">
                {/* Critical Alert */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-red-500 text-xs font-bold">2 Critical Stock</p>
                        <p className="text-zinc-400 text-[10px]">Immediate restock needed</p>
                    </div>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-[#00E599] flex items-center justify-center text-[#0A0A0A] font-bold text-xs shrink-0">
                        MA
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-sm font-semibold truncate">Marcel A.</p>
                        <p className="text-zinc-500 text-xs truncate">Owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}