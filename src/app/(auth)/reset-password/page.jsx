"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Mengambil token dari session storage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("reset_token");
    if (!savedToken) {
      // Jika mencoba akses langsung tanpa OTP, tendang ke awal
      router.replace("/forgot-password");
    } else {
      setToken(savedToken);
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.password) newErrors.password = "New password is required!";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters!";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(`${API_URL}/api/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resetToken: token, 
          newPassword: formData.password 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to reset password.");
      }

      // Hapus data sesi karena sudah selesai digunakan
      sessionStorage.removeItem("reset_email");
      sessionStorage.removeItem("reset_token");
      
      setIsSuccess(true);
      
      // Auto-redirect ke halaman login setelah beberapa detik
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (err) {
      setApiError(err.message);
      setIsLoading(false);
    }
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

          <div className="text-4xl mb-4">🔄</div>

          <div className="mb-6">
            <h1 className="text-zinc-900 dark:text-white text-2xl font-bold mb-1 transition-colors">Create New Password</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm transition-colors">Enter your new password below.</p>
          </div>

          {!isSuccess ? (
            <form noValidate onSubmit={handleSubmit} className="space-y-4 text-left">
              {apiError && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-500 text-sm transition-colors">
                  {apiError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block transition-colors">New Password</label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all disabled:opacity-50 ${errors.password
                      ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 border text-zinc-900 dark:text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                    }`}
                />
                {errors.password && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1 transition-colors">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block transition-colors">Confirm Password</label>
                <input
                  type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all disabled:opacity-50 ${errors.confirmPassword
                      ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 border text-zinc-900 dark:text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                    }`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1 transition-colors">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#00E599] text-zinc-950 font-bold rounded-lg py-3 mt-2 hover:bg-[#00c985] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm">
                {isLoading ? (
                  <><span className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin"></span> Resetting...</>
                ) : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="bg-[#00c985]/10 dark:bg-[#00E599]/10 border border-[#00c985]/30 dark:border-[#00E599]/30 rounded-lg p-5 text-center transition-colors">
              <h3 className="text-[#00c985] dark:text-[#00E599] font-bold text-lg mb-1">Success!</h3>
              <p className="text-[#00c985] dark:text-[#00E599] text-sm">Your password has been changed. Redirecting to login...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}