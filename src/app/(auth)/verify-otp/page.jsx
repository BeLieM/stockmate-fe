"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Mengambil email dari session storage saat halaman dimuat
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("reset_email");
    if (!savedEmail) {
      // Jika tidak ada email, tendang kembali ke forgot password
      router.replace("/forgot-password");
    } else {
      setEmail(savedEmail);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim() === '') {
      setFieldError("OTP is required!"); return;
    }

    setFieldError(null);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp: otp.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Invalid or expired OTP.");
      }

      // Simpan token reset sementara (asumsi backend mengirim 'token' di responsnya)
      sessionStorage.setItem("reset_token", data.token);
      
      // Arahkan ke halaman Reset Password
      router.push("/reset-password");

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setOtp(e.target.value);
    if (fieldError) setFieldError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors duration-200">
      <div className="w-full max-w-md flex flex-col items-center">

        <div className="flex items-center gap-3 mb-8">
          <Image src="/stockmate-logo.webp" alt="StockMate Logo" width={32} height={32} priority className="rounded-lg shadow-sm" />
          <h1 className="text-2xl font-bold tracking-tight transition-colors">
            <span className="text-zinc-900 dark:text-white">Stock</span><span className="text-[#00c985] dark:text-[#00E599]">Mate</span>
          </h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 w-full rounded-xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center transition-colors">

          <div className="text-4xl mb-4">✉️</div>

          <div className="mb-6">
            <h1 className="text-zinc-900 dark:text-white text-2xl font-bold mb-1 transition-colors">Verify OTP</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm transition-colors">
              We've sent an OTP code to <br/><span className="font-bold text-zinc-900 dark:text-zinc-200">{email}</span>
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5 text-left">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-500 text-sm transition-colors">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block transition-colors">Enter OTP Code</label>
              <input
                type="text" value={otp} onChange={handleInputChange} placeholder="e.g. 123456"
                disabled={isLoading}
                className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all tracking-widest disabled:opacity-50 ${fieldError
                    ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-zinc-200 dark:border-zinc-800 border text-zinc-900 dark:text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                  }`}
              />
              {fieldError && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1 transition-colors">{fieldError}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#00E599] text-zinc-950 font-bold rounded-lg py-3 mt-4 hover:bg-[#00c985] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm">
              {isLoading ? (
                <><span className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></span> Verifying...</>
              ) : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs">
            <Link href="/forgot-password" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors underline">Change email address</Link>
          </div>
        </div>
      </div>
    </div>
  );
}