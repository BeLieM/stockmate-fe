"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Star, MessageSquareOff, Loader2 } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SupplierViewReview({ isOpen, onClose, supplier }) {
  const { getReview } = useSuppliers();
  const [reviews, setReviews] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSupplierReviews = async () => {
      if (isOpen && supplier?.id) {
        setIsFetching(true);
        const data = await getReview(supplier.id);
        if (isMounted) {
          setReviews(data);
          setIsFetching(false);
        }
      } else if (!isOpen) {
        setReviews([]);
      }
    };

    fetchSupplierReviews();

    return () => {
      isMounted = false;
    };
  }, [isOpen, supplier, getReview]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-zinc-300 dark:text-zinc-700 fill-transparent"}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#1E232F] border-none shadow-2xl p-0 max-w-lg [&>button]:hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between shrink-0">
          <div>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              Ulasan Supplier
            </DialogTitle>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {supplier?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
            {isFetching ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <Loader2 size={32} className="text-[#00E599] animate-spin mb-3" />
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Memuat ulasan...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <MessageSquareOff size={40} className="text-zinc-300 dark:text-zinc-700 mb-3" />
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Belum ada ulasan</p>
                    <p className="text-xs text-zinc-500 mt-1">Supplier ini belum menerima ulasan apapun.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-zinc-50 dark:bg-zinc-900/50 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-1">
                                    {renderStars(review.star || review.rating)}
                                </div>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                                    {review.created_at ? new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ""}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                {review.review || review.comment || <span className="italic text-zinc-400">Tanpa komentar</span>}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}