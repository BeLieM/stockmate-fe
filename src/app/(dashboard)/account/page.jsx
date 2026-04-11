"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
// import Cookies from 'js-cookie'; // Uncomment untuk API Production

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Personal Information
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    storeName: "",
    storeAddress: "",
    role: "Owner",
    initials: "MA",
    joinedDate: "Jan 2026"
  });

  // State untuk Change Password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  /* ==========================================
     KODE API PRODUCTION (GET PROFILE)
     ========================================== */
  /*
  const fetchProfileAPI = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error("Gagal mengambil data profil");
      
      const data = await response.json();
      setProfileData({
        fullName: data.full_name,
        email: data.email,
        storeName: data.store_name,
        storeAddress: data.store_address,
        role: data.role,
        initials: data.initials,
        joinedDate: data.joined_date
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAPI();
  }, []);
  */

  /* ==========================================
     KODE DUMMY (UNTUK SLICING SAAT INI)
     ========================================== */
  useEffect(() => {
    // Simulasi loading data dari database
    setTimeout(() => {
      setProfileData({
        fullName: "Marcel Adrian Siring",
        email: "marcellno@tokoberkahjaya.id",
        storeName: "Toko Berkah Jaya",
        storeAddress: "Jl. Merdeka No. 1, Jakarta",
        role: "Owner",
        initials: "MA",
        joinedDate: "Jan 2026"
      });
      setIsLoading(false);
    }, 500); // delay 0.5 detik
  }, []);

  // Handler untuk form input
  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  /* ==========================================
     LOGIKA SUBMIT (DUMMY & API)
     ========================================== */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    console.log("[SLICING MODE] Saving Profile:", profileData);
    
    /* // KODE API UPDATE PROFILE
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.message);
    }
    */
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }
    console.log("[SLICING MODE] Updating Password...", passwordData);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" }); // Reset form
    
    /* // KODE API UPDATE PASSWORD
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/password`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });
      if (!response.ok) throw new Error("Failed to update password");
      alert("Password updated successfully!");
    } catch (error) {
      alert(error.message);
    }
    */
  };

  const handleSignOut = () => {
    console.log("[SLICING MODE] Signing out...");
    
    /* // KODE API/LOGIC SIGN OUT
    Cookies.remove("stockmate_token");
    window.location.href = "/login"; // Redirect ke halaman login
    */
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center text-zinc-500">Loading profile data...</div>;
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar pb-6 pr-2">
      
      {/* HEADER */}
      <div className="mb-6 shrink-0">
        <h2 className="text-white text-2xl font-bold">Account Settings</h2>
        <p className="text-zinc-500 text-sm">Manage your profile</p>
      </div>

      {/* GRID LAYOUT: 1 Kolom Kiri, 2 Kolom Kanan di layar besar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= KOLOM KIRI ================= */}
        <div className="space-y-6">
          {/* PROFILE CARD */}
          <Card className="bg-zinc-900 border-zinc-800 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#00E599] rounded-full flex items-center justify-center text-zinc-950 font-bold text-3xl mb-4">
              {profileData.initials}
            </div>
            <h3 className="text-white font-bold text-xl mb-1">{profileData.fullName}</h3>
            <p className="text-zinc-500 text-sm mb-4">{profileData.email}</p>
            <div className="border border-[#00E599]/30 text-[#00E599] bg-[#00E599]/10 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
              {profileData.role}
            </div>
          </Card>

          {/* STORE INFO CARD */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3">Store Info</h4>
            <div className="space-y-1 mb-4">
              <p className="text-white font-bold text-sm">{profileData.storeName}</p>
              <p className="text-zinc-400 text-xs">{profileData.storeAddress}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00E599]"></div>
              <p className="text-[#00E599] text-xs font-medium">Active since {profileData.joinedDate}</p>
            </div>
          </Card>
        </div>

        {/* ================= KOLOM KANAN ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PERSONAL INFO FORM */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg">Personal Information</h3>
              <p className="text-zinc-500 text-xs mt-1">Update your account details</p>
            </div>
            
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Full Name</label>
                  <input 
                    name="fullName" value={profileData.fullName} onChange={handleProfileChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Email Address</label>
                  <input 
                    name="email" type="email" value={profileData.email} onChange={handleProfileChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Store Name</label>
                  <input 
                    name="storeName" value={profileData.storeName} onChange={handleProfileChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Store Address</label>
                  <input 
                    name="storeAddress" value={profileData.storeAddress} onChange={handleProfileChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-[#00E599] text-zinc-950 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </Card>

          {/* CHANGE PASSWORD FORM */}
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="mb-6">
              <h3 className="text-white font-bold text-lg">Change Password</h3>
              <p className="text-zinc-500 text-xs mt-1">Ensure your account stays secure</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Current Password</label>
                <input 
                  name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                  placeholder="••••••••" required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">New Password</label>
                  <input 
                    name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                    placeholder="••••••••" required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Confirm New Password</label>
                  <input 
                    name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors" 
                    placeholder="••••••••" required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-[#00E599] text-zinc-950 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors cursor-pointer">
                  Update Password
                </button>
              </div>
            </form>
          </Card>

          {/* DANGER ZONE */}
          <Card className="bg-red-500/5 border-red-500/20 p-6">
            <h3 className="text-red-500 font-bold text-lg mb-1">Danger Zone</h3>
            <p className="text-zinc-400 text-sm mb-5">Sign out from your account. All unsaved changes will be lost.</p>
            <button 
              onClick={handleSignOut}
              className="border border-red-500/30 text-red-500 hover:bg-red-500/10 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </Card>

        </div>
      </div>
    </div>
  );
}