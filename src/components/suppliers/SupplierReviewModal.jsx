"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Star } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SupplierReviewModal({ isOpen, onClose, supplier, onSuccess }) {
  const { addReview } = useSuppliers();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Silakan berikan rating bintang terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      supplier_id: supplier?.id,
      star: rating,
      review: comment
    };

    const success = await addReview(payload);
    setIsSubmitting(false);

    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError("Gagal mengirim review. Silakan coba lagi.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSubmitting ? onClose : undefined}>
      <DialogContent className="bg-white dark:bg-[#1E232F] border-none shadow-2xl p-0 max-w-md [&>button]:hidden">
        <DialogHeader className="p-5 pb-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
            Review {supplier?.name}
          </DialogTitle>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="text-zinc-900 dark:text-white text-sm font-semibold mb-2 block">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <Star
                    key={index}
                    size={32}
                    className={`cursor-pointer transition-colors ${
                      starValue <= (hoverRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-zinc-400 dark:text-zinc-600 fill-transparent"
                    }`}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-zinc-900 dark:text-white text-sm font-semibold mb-2 block">
              Komentar (opsional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              placeholder="Bagikan pengalaman Anda dengan supplier ini..."
              className="w-full bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-medium bg-transparent border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
              ) : null}
              Kirim Review
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}