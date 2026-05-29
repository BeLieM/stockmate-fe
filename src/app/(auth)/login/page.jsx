"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });

  const [attempts, setAttempts] = useState(0);
  const [cooldownTime, setCooldownTime] = useState(0);

  const MAX_ATTEMPTS = 5; // Batas toleransi gagal
  const COOLDOWN_SECONDS = 60; // Waktu hukuman (60 detik)

  const { login, isLoading, error, setError } = useAuth();

  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem('stockmate_login_attempts') || '0', 10);
    const lockoutTimestamp = parseInt(localStorage.getItem('stockmate_lockout_until') || '0', 10);

    setAttempts(storedAttempts);

    if (lockoutTimestamp > Date.now()) {
      const remaining = Math.ceil((lockoutTimestamp - Date.now()) / 1000);
      setCooldownTime(remaining);
    } else if (lockoutTimestamp !== 0 && lockoutTimestamp <= Date.now()) {
      localStorage.removeItem('stockmate_login_attempts');
      localStorage.removeItem('stockmate_lockout_until');
      setAttempts(0);
    }
  }, []);

  // LOGIKA PENGHITUNG MUNDUR (TIMER)
  useEffect(() => {
    let timer;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            localStorage.removeItem('stockmate_login_attempts');
            localStorage.removeItem('stockmate_lockout_until');
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Blokir fungsi jika sedang masa hukuman
    if (cooldownTime > 0) return;

    const isEmailEmpty = email.trim() === '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailInvalid = !emailRegex.test(email);
    const isPasswordEmpty = password.trim() === '';

    if (isEmailEmpty) {
      setFieldErrors({ email: "Email address is required!", password: null });
      return;
    }

    if (isEmailInvalid) {
      setFieldErrors({ email: "Please enter a valid email address!", password: null });
      return;
    }

    if (isPasswordEmpty) {
      setFieldErrors({ email: null, password: "Password is required!" });
      return;
    }

    setFieldErrors({ email: null, password: null });

    const success = await login(email, password);

    if (!success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('stockmate_login_attempts', newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + (COOLDOWN_SECONDS * 1000);
        localStorage.setItem('stockmate_lockout_until', lockUntil);
        setCooldownTime(COOLDOWN_SECONDS);
      }
    } else {
      localStorage.removeItem('stockmate_login_attempts');
      localStorage.removeItem('stockmate_lockout_until');
    }
  };

  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (error) setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors duration-200">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/stockmate-logo.webp"
            alt="StockMate Logo"
            width={40}
            height={40}
            priority
            className="rounded-lg shadow-sm"
          />
          <h1 className="text-2xl font-bold tracking-tight transition-colors">
            <span className="text-zinc-900 dark:text-white">Stock</span><span className="text-[#00c985] dark:text-[#00E599]">Mate</span>
          </h1>
        </div>

        <div className="bg-white dark:bg-zinc-900 w-full rounded-xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
          
          <div className="mb-6 text-center">
            <h1 className="text-zinc-900 dark:text-white text-2xl font-bold mb-1 transition-colors">Welcome back</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm transition-colors">Sign in to your StockMate account</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {error && cooldownTime === 0 && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-500 text-sm transition-colors">
                {error}
                {attempts > 0 && attempts < MAX_ATTEMPTS && (
                  <span className="block text-[11px] mt-1 font-semibold">
                    Warning: {MAX_ATTEMPTS - attempts} attempt(s) remaining.
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block transition-colors">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleInputChange(setEmail, 'email')}
                placeholder="owner@tokoberkahjaya.id"
                disabled={cooldownTime > 0 || isLoading}
                className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all disabled:opacity-50 ${
                  fieldErrors.email
                    ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-zinc-200 dark:border-zinc-800 border text-zinc-900 dark:text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-[11px] font-medium mt-1 pl-1 transition-colors">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange(setPassword, 'password')}
                  placeholder="••••••••"
                  disabled={cooldownTime > 0 || isLoading}
                  className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all pr-10 disabled:opacity-50 ${
                    fieldErrors.password
                      ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 border text-zinc-900 dark:text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={cooldownTime > 0 || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-[11px] font-medium mt-1 pl-1 transition-colors">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className={`text-[#00c985] dark:text-[#00E599] text-xs font-bold transition-colors ${cooldownTime > 0 ? "opacity-50 pointer-events-none" : "hover:underline cursor-pointer"}`}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || cooldownTime > 0}
              className={`w-full font-bold rounded-lg py-3 mt-2 transition-colors flex justify-center items-center gap-2 shadow-sm ${
                cooldownTime > 0 
                  ? "bg-red-500/10 text-red-500 border border-red-500/50 cursor-not-allowed" 
                  : "bg-[#00E599] text-zinc-950 hover:bg-[#00c985] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              }`}
            >
              {cooldownTime > 0 ? (
                <>
                  <Lock size={16} strokeWidth={2.5} />
                  Try again in {cooldownTime}s
                </>
              ) : isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 transition-colors">Don't have an account? </span>
            <Link href="/register" className={`text-[#00c985] dark:text-[#00E599] font-bold transition-colors ${cooldownTime > 0 ? "opacity-50 pointer-events-none" : "hover:underline"}`}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}