"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

// Uncomment kalau backend ready
// import { useLogin } from '@/hooks/useLogin'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // State menyimpan pesan error berupa string
  const [fieldErrors, setFieldErrors] = useState({ email: null, password: null });
  
  // --- STATE DUMMY BUAT SLICING ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // ---------------------------------

  // Uncomment kalau backend ready
  // const { login, isLoading: apiLoading, error: apiError } = useLogin();

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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#00E599] rounded flex items-center justify-center text-zinc-950 font-bold text-lg">
            S
          </div>
          <span className="text-white font-semibold text-xl tracking-wide">StockMate</span>
        </div>

        <div className="bg-zinc-900 w-full rounded-xl p-8 shadow-2xl border border-zinc-800">
          <div className="mb-6">
            <h1 className="text-white text-2xl font-semibold mb-1">Welcome back</h1>
            <p className="text-zinc-400 text-sm">Sign in to your StockMate account</p>
          </div>

          <form noValidate onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
                {displayError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleInputChange(setEmail, 'email')}
                placeholder="owner@tokoberkahjaya.id"
                className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${
                  fieldErrors.email 
                    ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                    : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange(setPassword, 'password')}
                  placeholder="••••••••"
                  className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all pr-10 ${
                    fieldErrors.password 
                      ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" 
                      : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                  }`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-[#00E599] text-xs hover:underline font-medium cursor-pointer">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={displayLoading}
              className="w-full bg-[#00E599] text-zinc-950 font-semibold rounded-lg py-3 mt-2 hover:bg-[#00c985] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
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

          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500">Don't have an account? </span>
            <Link href="/register" className="text-[#00E599] hover:underline font-medium">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}