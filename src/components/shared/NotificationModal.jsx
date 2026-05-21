"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, AlertTriangle, Box, X, Check, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { useNotification } from "@/hooks/useNotification";

export default function NotificationModal() {
  const { notifications, fetchNotifications, markAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    // Fetch awal
    fetchNotifications();

    // BACKGROUND POLLING: Tarik data API diam-diam setiap 5 detik
    // Karena cache sudah dimatikan, ini akan selalu membawa data terbaru!
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 5000); // <-- Diubah menjadi 5000 ms

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !(n.is_read || n.isRead)).length;

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const dayMonth = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${time} • ${dayMonth}`;
  };

  const getNotifStyle = (type) => {
    const t = type?.toLowerCase() || 'info';
    if (t === 'critical') return { icon: AlertTriangle, colorClass: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-500' };
    if (t === 'low') return { icon: Box, colorClass: 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/30 text-yellow-600 dark:text-yellow-500' };
    return { icon: Info, colorClass: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-500' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="relative p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-zinc-200 dark:border-zinc-800 transition-colors"></span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-sm [&>button]:hidden">
        <DialogDescription className="sr-only">List of system notifications and alerts</DialogDescription>

        {isMounted && (
          <Draggable handle=".drag-area" nodeRef={nodeRef}>
            <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">

              <DialogHeader className="p-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-center justify-between transition-colors shrink-0">
                <div>
                  <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">Notifications</DialogTitle>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[10px] mt-0.5 transition-colors">
                    {unreadCount} Unread Alerts
                  </p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </DialogHeader>

              {/* Menggunakan div murni dengan overflow-y-auto untuk memastikan scroll lancar tanpa bug komponen */}
              <div className="max-h-[400px] overflow-y-auto p-4 custom-scrollbar">
                <div className="space-y-3 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No new notifications available.
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const style = getNotifStyle(notif.type);
                      const Icon = style.icon;
                      const isRead = notif.is_read || notif.isRead;

                      return (
                        <div 
                          key={notif.id} 
                          // Tambahkan efek animasi scale dan meredup saat tombol centang diklik
                          className={`${style.colorClass} ${isRead ? 'opacity-40 scale-95' : 'opacity-100 scale-100'} border rounded-lg p-3 space-y-2 transition-all duration-500 ease-in-out`}
                        >
                          <div className="flex gap-3 justify-between items-start">
                            
                            <div className="flex gap-3 flex-1">
                              <div className={`p-1.5 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 h-fit transition-colors`}>
                                <Icon size={16} />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white transition-colors leading-tight">
                                      {notif.title || "System Alert"}
                                    </h4>
                                </div>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 transition-colors">
                                  {formatDateTime(notif.created_at || notif.created)}
                                </p>
                              </div>
                            </div>

                            {!isRead && (
                              <button 
                                onClick={() => markAsRead(notif.id)} 
                                className="shrink-0 p-1 text-zinc-400 hover:text-[#00c985] dark:hover:text-[#00E599] bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors cursor-pointer"
                                title="Mark as read"
                              >
                                <Check size={14} strokeWidth={3} />
                              </button>
                            )}

                          </div>

                          <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed pl-9 transition-colors">
                            {notif.message || notif.description || notif.desc}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </Draggable>
        )}
      </DialogContent>
    </Dialog>
  );
}