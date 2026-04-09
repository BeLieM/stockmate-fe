"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

// import { useAuth } from '@/hooks/useAuth'; 

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        storeName: '',
        email: '',
        storeAddress: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State menyimpan pesan error
    const [fieldErrors, setFieldErrors] = useState({
        fullName: null, storeName: null, email: null,
        storeAddress: null, password: null, confirmPassword: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // const { register, isLoading: apiLoading, error: apiError } = useAuth();

    const handleInputChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi Berurutan (Top-to-Bottom)
        if (formData.fullName.trim() === '') {
            setFieldErrors({ ...fieldErrors, fullName: "Full name is required!" }); return;
        }
        if (formData.storeName.trim() === '') {
            setFieldErrors({ ...fieldErrors, storeName: "Store name is required!" }); return;
        }

        if (formData.email.trim() === '') {
            setFieldErrors({ ...fieldErrors, email: "Email address is required!" }); return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setFieldErrors({ ...fieldErrors, email: "Please enter a valid email address!" }); return;
        }

        if (formData.storeAddress.trim() === '') {
            setFieldErrors({ ...fieldErrors, storeAddress: "Store address is required!" }); return;
        }

        if (formData.password.trim() === '') {
            setFieldErrors({ ...fieldErrors, password: "Password is required!" }); return;
        }

        if (formData.confirmPassword.trim() === '') {
            setFieldErrors({ ...fieldErrors, confirmPassword: "Confirm password is required!" }); return;
        }
        if (formData.password !== formData.confirmPassword) {
            setFieldErrors({ ...fieldErrors, confirmPassword: "Passwords do not match!" }); return;
        }

        // Lolos Validasi
        setFieldErrors({ fullName: null, storeName: null, email: null, storeAddress: null, password: null, confirmPassword: null });
        setIsLoading(true);
        setError(null);

        setTimeout(() => {
            console.log("Data siap dikirim ke API:", formData);
            setIsLoading(false);
        }, 1500);

        /* await register(formData.fullName, formData.email, formData.password); */
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-lg flex flex-col items-center">

                {/* LOGO SECTION */}
                <div className="flex items-center gap-3 mb-8">
                    <Image src="/stockmate-logo.webp" alt="StockMate Logo" width={32} height={32} priority className="rounded-lg" />
                    <h1 className="text-2xl font-bold tracking-tight">
                        <span className="text-white">Stock</span><span className="text-[#00E599]">Mate</span>
                    </h1>
                </div>

                <div className="bg-zinc-900 w-full rounded-xl p-8 shadow-2xl border border-zinc-800">
                    <div className="mb-6">
                        <h1 className="text-white text-2xl font-semibold mb-1">Create your account</h1>
                        <p className="text-zinc-400 text-sm">Set up StockMate for your store</p>
                    </div>

                    <form noValidate onSubmit={handleSubmit} className="space-y-5">
                        {error && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{error}</div>}

                        <div className="grid grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Full Name</label>
                                <input
                                    type="text" value={formData.fullName} onChange={handleInputChange('fullName')} placeholder="Marcel Adrian"
                                    className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${fieldErrors.fullName ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                                        }`}
                                />
                                {fieldErrors.fullName && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldErrors.fullName}</p>}
                            </div>

                            {/* Store Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Store Name</label>
                                <input
                                    type="text" value={formData.storeName} onChange={handleInputChange('storeName')} placeholder="Toko Berkah Jaya"
                                    className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${fieldErrors.storeName ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                                        }`}
                                />
                                {fieldErrors.storeName && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldErrors.storeName}</p>}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Email Address</label>
                            <input
                                type="email" value={formData.email} onChange={handleInputChange('email')} placeholder="owner@toko.id"
                                className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${fieldErrors.email ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                                    }`}
                            />
                            {fieldErrors.email && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldErrors.email}</p>}
                        </div>

                        {/* Store Address */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Store Address</label>
                            <input
                                type="text" value={formData.storeAddress} onChange={handleInputChange('storeAddress')} placeholder="Jl. Merdeka No. 1, Jakarta"
                                className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all ${fieldErrors.storeAddress ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                                    }`}
                            />
                            {fieldErrors.storeAddress && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldErrors.storeAddress}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange('password')} placeholder="••••••••"
                                        className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all pr-10 ${fieldErrors.password ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                                            }`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {fieldErrors.password && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldErrors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange('confirmPassword')} placeholder="••••••••"
                                        className={`w-full bg-zinc-950 rounded-lg px-4 py-3 text-sm focus:outline-none transition-all pr-10 ${fieldErrors.confirmPassword ? "border-red-500 border text-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-zinc-800 border text-zinc-200 focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599]"
                                            }`}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {fieldErrors.confirmPassword && <p className="text-red-500 text-[11px] font-medium mt-1 pl-1">{fieldErrors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-[#00E599] text-zinc-950 font-semibold rounded-lg py-3 mt-4 hover:bg-[#00c985] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                            {isLoading ? (
                                <><svg className="animate-spin h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating Account...</>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-xs">
                        <span className="text-zinc-500">Already have an account? </span>
                        <Link href="/login" className="text-[#00E599] hover:underline font-medium">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}