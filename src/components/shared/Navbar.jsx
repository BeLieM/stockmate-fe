"use client";

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import NotificationModal from "./NotificationModal";

export default function Navbar() {

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-[#0A0A0A] border-b border-zinc-800 px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-white text-xl font-bold capitalize">
          Dashboard
        </h1>
        <p suppressHydrationWarning className="text-zinc-400 text-xs mt-0.5">
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationModal />
      </div>
    </header>
  );
}