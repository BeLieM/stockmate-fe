"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, Box, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";

export default function NotificationModal() {
  /* --- API CALL LOGIC (UNCOMMENT NANTI) ---
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // fetch('/api/notifications')...
  }, []);
  */

  // --- DATA DUMMY ---
  const notifications = [
    { id: 1, type: 'critical', title: 'Critical Stock Alert — Deterjen Rinso', time: '08:55 • 02 Mar 2026', desc: 'Stock has dropped to 3 units, below minimum threshold of 12.', icon: AlertTriangle, color: 'border-red-500' },
    { id: 2, type: 'low', title: 'Low Stock Warning — Kopi Kapal Api', time: '14:20 • 02 Mar 2026', desc: 'Stock has dropped to 12 units, below minimum threshold of 15.', icon: Box, color: 'border-yellow-500' },
    { id: 3, type: 'low', title: 'Low Stock Warning — Kopi Kapal Api', time: '14:20 • 02 Mar 2026', desc: 'Stock has dropped to 12 units, below minimum threshold of 15.', icon: Box, color: 'border-yellow-500' },
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
        <button className="relative p-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-yellow-500 rounded-full border-2 border-[#0A0A0A]"></span>
        </button>
      </DialogTrigger>

      {/* Konten Modal */}
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-sm [&>button]:hidden">
        {isMounted && (
          <Draggable handle=".drag-area" nodeRef={nodeRef}>
            <div ref={nodeRef} className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0">
              
              <DialogHeader className="p-4 pb-3 border-b border-zinc-800 bg-zinc-900/50 drag-area cursor-move flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-lg font-bold text-white">Notification</DialogTitle>
                  <p className="text-zinc-500 text-[10px] mt-0.5">All System Alert</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </DialogHeader>
              
              <ScrollArea className="max-h-[400px] p-4">
                <div className="space-y-3 pr-3">
                  {notifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                      <div key={notif.id} className={`bg-zinc-900/30 border ${notif.color} rounded-lg p-3 space-y-2`}>
                        <div className="flex gap-3">
                          <div className={`p-1.5 rounded-md bg-zinc-950 h-fit ${notif.type === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-white">{notif.title}</h4>
                            <p className="text-[10px] text-zinc-500">{notif.time}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-relaxed pl-9">
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