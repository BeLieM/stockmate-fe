"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Uncomment kalau backend ready
// import { useAuth } from '@/hooks/useAuth'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // State menyimpan pesan error berupa string
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });

  // --- STATE DUMMY BUAT SLICING ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // ---------------------------------

  // Uncomment kalau backend ready
  // const { login, isLoading: apiLoading, error: apiError } = useLogin();

  // --- LOGIKA MEMBACA TEMA DARI HISTORI BROWSER ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("stockmate_theme");
    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Default ke dark mode jika belum ada history, atau jika history-nya 'dark'
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Email
    const isEmailEmpty = email.trim() === '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailInvalid = !emailRegex.test(email);

    // Validasi Password
    const isPasswordEmpty = password.trim() === '';

    // Cek form paling atas (Email) terlebih dahulu
    if (isEmailEmpty) {
      setFieldErrors({ email: "Email address is required!", password: null });
      return;
    }

    // Jika Email terisi, cek apakah formatnya valid
    if (isEmailInvalid) {
      setFieldErrors({ email: "Please enter a valid email address!", password: null });
      return;
    }

    // Jika Email sudah valid, baru cek Password
    if (isPasswordEmpty) {
      setFieldErrors({ email: null, password: "Password is required!" });
      return;
    }

    // Error dihapus jika lolos validasi
    setFieldErrors({ email: null, password: null });

    // --- LOGIKA BUAT SLICING DOANG ---
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      console.log("Data siap dikirim ke API:", { email, password });
      setIsLoading(false);
      router.push("/home")
    }, 1500);
    // ----------------------------------

    // Uncomment kalau backend ready
    /*
    await login(email, password);
    */
  };

  // Helper function untuk membersihkan error saat user mulai mengetik
  const handleInputChange = (setter, field) => (e) => {
    setter(e.target.value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const displayError = error;
  const displayLoading = isLoading;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans transition-colors duration-200">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* LOGO SECTION */}
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

        {/* CARD CONTAINER */}
        <div className="bg-white dark:bg-zinc-900 w-full rounded-xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-colors">
          
          <div className="mb-6 text-center">
            <h1 className="text-zinc-900 dark:text-white text-2xl font-bold mb-1 transition-colors">Welcome back</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm transition-colors">Sign in to your StockMate account</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 rounded-lg text-red-600 dark:text-red-500 text-sm transition-colors">
                {displayError}
              </div>
            )}

            {/* INPUT EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block transition-colors">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleInputChange(setEmail, 'email')}
                placeholder="owner@tokoberkahjaya.id"
                className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${
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

            {/* INPUT PASSWORD */}
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
                  className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all pr-10 ${
                    fieldErrors.password
                      ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-200 dark:border-zinc-800 border text-zinc-900 dark:text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
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

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-[#00c985] dark:text-[#00E599] text-xs hover:underline font-bold cursor-pointer transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={displayLoading}
              className="w-full bg-[#00E599] text-zinc-950 font-bold rounded-lg py-3 mt-2 hover:bg-[#00c985] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer shadow-sm"
            >
              {displayLoading ? (
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

          {/* REGISTER LINK */}
          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 transition-colors">Don't have an account? </span>
            <Link href="/register" className="text-[#00c985] dark:text-[#00E599] hover:underline font-bold transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}