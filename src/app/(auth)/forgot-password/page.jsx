"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi
    if (email.trim() === '') {
      setFieldError("Email address is required!"); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldError("Please enter a valid email address!"); return;
    }

    // Lolos Validasi
    setFieldError(null);
    setIsLoading(true);
    setError(null);
    
    // Slicing mockup API call
    setTimeout(() => {
      console.log("Kirim link reset ke:", email);
      setIsLoading(false);
      setIsSuccess(true); // Ubah state untuk menampilkan pesan sukses
    }, 1500);
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (fieldError) setFieldError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 mb-8">
          <Image src="/stockmate-logo.webp" alt="StockMate Logo" width={32} height={32} priority className="rounded-lg" />
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Stock</span><span className="text-[#00E599]">Mate</span>
          </h1>
        </div>

        <div className="bg-zinc-900 w-full rounded-xl p-8 shadow-2xl border border-zinc-800 text-center">
          
          <div className="text-4xl mb-4">🔐</div>
          
          <div className="mb-6">
            <h1 className="text-white text-2xl font-semibold mb-1">Forgot your password?</h1>
            <p className="text-zinc-400 text-sm">Enter your email and we'll send you a reset link.</p>
          </div>

          {!isSuccess ? (
            <form noValidate onSubmit={handleSubmit} className="space-y-5 text-left">
              {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Email Address</label>
                <input
                  type="email" value={email} onChange={handleInputChange} placeholder="owner@tokoberkahjaya.id"
                  className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${
                    fieldError ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                  }`}
                />
                {fieldError && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldError}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#00E599] text-zinc-950 font-semibold rounded-lg py-3 mt-4 hover:bg-[#00c985] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                {isLoading ? (
                  <><svg className="animate-spin h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending...</>
                ) : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="bg-[#00E599]/10 border border-[#00E599]/30 rounded-lg p-4 text-[#00E599] text-sm mb-4">
              Reset link sent! Please check your email inbox.
            </div>
          )}

          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500">Remembered it? </span>
            <Link href="/login" className="text-[#00E599] hover:underline font-medium">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}