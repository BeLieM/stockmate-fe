"use client";

import React from "react";
import { Building2, Edit2, Trash2, Phone, MapPin, Map, Star } from "lucide-react";

export default function SupplierCard({ supplier, onEdit, onDelete, onReview, onOpenMap }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={14}
        className={index < Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-zinc-600 dark:text-zinc-600 fill-transparent"}
      />
    ));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center border border-orange-500/20 transition-colors">
            <Building2 className="text-orange-500" size={20} />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(supplier)}
              className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => onDelete(supplier)}
              className="p-1.5 text-red-500/70 hover:text-red-600 dark:hover:text-red-500 bg-white dark:bg-zinc-950 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors border border-red-200 dark:border-red-500/20 shadow-sm cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-2 transition-colors">
          {supplier.name}
        </h3>

        <div className="mb-4">
          <span className="bg-[#4DA6FF]/10 text-[#4DA6FF] text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors">
            {supplier.category}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mb-5">
          <div className="flex gap-0.5">
            {renderStars(supplier.averageRating)}
          </div>
          <span className="text-zinc-500 dark:text-zinc-400 text-xs ml-1">
            {supplier.averageRating} ({supplier.reviewCount} reviews)
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-2.5">
            <Phone size={14} className="text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
            <p className="text-zinc-600 dark:text-zinc-400 text-xs font-medium transition-colors">
              {supplier.phone || "-"}
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed transition-colors">
              {supplier.address || "-"}
            </p>
          </div>
          {supplier.coordinates && (
            <div className="flex items-start gap-2.5">
              <Map size={14} className="text-[#4DA6FF] mt-0.5 shrink-0" />
              <p className="text-zinc-600 dark:text-zinc-400 text-xs font-mono transition-colors">
                {supplier.coordinates}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onOpenMap(supplier.address, supplier.name)}
          className="w-full py-2.5 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer"
        >
          <MapPin size={14} className="text-red-500" /> Open in Maps
        </button>
        <button
          onClick={() => onReview(supplier)}
          className="w-full py-2.5 bg-transparent hover:bg-[#00E599]/10 text-[#00E599] text-xs font-bold rounded-lg border border-[#00E599] transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer"
        >
          Review
        </button>
      </div>
    </div>
  );
}