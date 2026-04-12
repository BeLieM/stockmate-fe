"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, Box, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";

export default function NotificationModal() {
  /* --- API CALL LOGIC (UNCOMMENT NANTI) ---
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // fetch('/api/notifications')...
  }, []);
  */

  // --- DATA DUMMY (Sudah disesuaikan class warnanya untuk Light/Dark Mode) ---
  const notifications = [
    {
      id: 1, type: 'critical', title: 'Critical Stock Alert — Deterjen Rinso', time: '08:55 • 02 Mar 2026',
      desc: 'Stock has dropped to 3 units, below minimum threshold of 12.', icon: AlertTriangle,
      colorClass: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
    },
    {
      id: 2, type: 'low', title: 'Low Stock Warning — Kopi Kapal Api', time: '14:20 • 02 Mar 2026',
      desc: 'Stock has dropped to 12 units, below minimum threshold of 15.', icon: Box,
      colorClass: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30'
    },
    {
      id: 3, type: 'low', title: 'Low Stock Warning — Gula Pasir 1kg', time: '10:15 • 01 Mar 2026',
      desc: 'Stock has dropped to 18 units, approaching minimum threshold of 15.', icon: Box,
      colorClass: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30'
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Tombol dimiripkan dengan ThemeToggle */}
        <button className="relative p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
          <Bell size={20} />
          {/* Titik notifikasi (Badge) disesuaikan border-nya dengan warna background tombol */}
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-zinc-200 dark:border-zinc-800 transition-colors"></span>
        </button>
      </DialogTrigger>

      {/* Konten Modal */}
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-sm [&>button]:hidden">

        {/* Menyembunyikan Description untuk mencegah warning Screen Reader */}
        <DialogDescription className="sr-only">List of system notifications and alerts</DialogDescription>

        {isMounted && (
          <Draggable handle=".drag-area" nodeRef={nodeRef}>
            <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors">

              {/* Header Modal */}
              <DialogHeader className="p-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-center justify-between transition-colors">
                <div>
                  <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">Notification</DialogTitle>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[10px] mt-0.5 transition-colors">All System Alert</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </DialogHeader>

              {/* Body / List Notifikasi */}
              <ScrollArea className="max-h-[400px] p-4">
                <div className="space-y-3 pr-3">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className={`${notif.colorClass} border rounded-lg p-3 space-y-2 transition-colors`}>
                        <div className="flex gap-3">

                          {/* Ikon Notifikasi */}
                          <div className={`p-1.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 h-fit transition-colors ${notif.type === 'critical' ? 'text-red-600 dark:text-red-500' : 'text-yellow-600 dark:text-yellow-500'}`}>
                            <Icon size={16} />
                          </div>

                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-white transition-colors">{notif.title}</h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 transition-colors">{notif.time}</p>
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed pl-9 transition-colors">
                          {notif.desc} Immediate restock recommended.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </Draggable>
        )}
      </DialogContent>
    </Dialog>
  );
}