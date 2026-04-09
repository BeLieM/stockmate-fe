"use client";

import { Bell } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Navbar() {
  // Membuat tanggal dinamis format: Monday, 02 March 2026
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-[#0A0A0A] border-b border-zinc-800 px-8 flex items-center justify-between shrink-0">
      
      {/* Left Side: Title & Date */}
      <div>
        <h1 className="text-white text-xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 text-xs mt-0.5">{currentDate}</p>
      </div>

      {/* Right Side: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle Button pengganti Search Bar */}
        <ThemeToggle />

        {/* Notification Icon */}
        <button className="relative p-2 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Bell size={20} />
          {/* Notification Badge */}
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#0A0A0A]"></span>
        </button>
      </div>
    </header>
  );
}