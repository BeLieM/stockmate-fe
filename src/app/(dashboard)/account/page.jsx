"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAccount } from "@/hooks/useAccount";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";

export default function AccountPage() {
  const { profile, isLoading: isProfileLoading, fetchProfile, updateProfile, updatePassword } = useAccount();
  const { storeData, isLoading: isStoreLoading, updateStore } = useStore();
  const { logout } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    storeName: "Loading...",
    storeAddress: "-",
    role: "User",
    initials: "XX",
    joinedDate: "-"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile || storeData.name !== "Loading...") {
      const name = profile?.name || profile?.full_name || profileData.fullName || "Unknown";
      const initial = name.charAt(0).toUpperCase();

      let joined = profileData.joinedDate;
      const rawDate = profile?.created_at || storeData?.created_at;
      
      if (rawDate) {
        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
          joined = dateObj.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
        }
      }

      setProfileData({
        fullName: name,
        email: profile?.email || profileData.email || "",
        storeName: storeData.name !== "Loading..." ? storeData.name : profileData.storeName,
        storeAddress: storeData.address !== "-" ? storeData.address : profileData.storeAddress,
        role: profile?.role || "User",
        initials: initial,
        joinedDate: joined
      });
    }
  }, [profile, storeData]);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    let isSuccess = true;

    const profilePayload = {
      name: profileData.fullName,
      email: profileData.email
    };
    
    const profileSuccess = await updateProfile(profilePayload);
    if (!profileSuccess) isSuccess = false;

    if (storeData && storeData.id) {
      const storePayload = {
        name: profileData.storeName,
        address: profileData.storeAddress
      };
      const storeSuccess = await updateStore(storeData.id, storePayload);
      if (!storeSuccess) isSuccess = false;
    }

    if (isSuccess) {
      alert("Profil dan Toko berhasil diperbarui!");
    } else {
      alert("Ada kesalahan saat memperbarui sebagian data. Periksa koneksi Anda.");
    }

    setIsSavingProfile(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    setIsSavingPassword(true);

    const payload = {
      password_hash: passwordData.newPassword
    };

    const success = await updatePassword(payload);

    if (success) {
      alert("Password berhasil diperbarui!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      alert("Gagal memperbarui password.");
    }

    setIsSavingPassword(false);
  };

  const handleSignOut = () => {
    if (logout) {
      logout();
    }
  };

  if ((isProfileLoading && !profile) || (isStoreLoading && storeData.name === "Loading...")) {
    return <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">Loading profile data...</div>;
  }

  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar pb-6 pr-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="space-y-6">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center text-center transition-colors shadow-sm">
            <div className="w-24 h-24 bg-[#00c985] dark:bg-[#00E599] rounded-full flex items-center justify-center text-white dark:text-zinc-950 font-bold text-3xl mb-4 transition-colors">
              {profileData.initials}
            </div>
            <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-1 transition-colors">{profileData.fullName}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4 transition-colors">{profileData.email}</p>
            <div className="border border-[#00c985]/30 dark:border-[#00E599]/30 text-[#00c985] dark:text-[#00E599] bg-[#00c985]/10 dark:bg-[#00E599]/10 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-colors">
              {profileData.role}
            </div>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 transition-colors shadow-sm">
            <h4 className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors">Store Info</h4>
            <div className="space-y-1 mb-4">
              <p className="text-zinc-900 dark:text-white font-bold text-sm transition-colors">{profileData.storeName}</p>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs transition-colors">{profileData.storeAddress}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00c985] dark:bg-[#00E599] transition-colors"></div>
              <p className="text-[#00c985] dark:text-[#00E599] text-xs font-medium transition-colors">Active since {profileData.joinedDate}</p>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 transition-colors shadow-sm">
            <div className="mb-6">
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg transition-colors">Personal Information</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">Update your account details</p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Full Name</label>
                  <input
                    name="fullName" value={profileData.fullName} onChange={handleProfileChange} disabled={isSavingProfile}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Email Address</label>
                  <input
                    name="email" type="email" value={profileData.email} onChange={handleProfileChange} disabled={isSavingProfile}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Store Name</label>
                  <input
                    name="storeName" value={profileData.storeName} onChange={handleProfileChange} disabled={isSavingProfile}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Store Address</label>
                  <input
                    name="storeAddress" value={profileData.storeAddress} onChange={handleProfileChange} disabled={isSavingProfile}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isSavingProfile} className="bg-[#00E599] text-zinc-950 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm disabled:opacity-70 flex items-center gap-2">
                  {isSavingProfile ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 p-6 transition-colors shadow-sm">
            <div className="mb-6">
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg transition-colors">Change Password</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">Ensure your account stays secure</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Current Password</label>
                <input
                  name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} disabled={isSavingPassword}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                  placeholder="••••••••" required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">New Password</label>
                  <input
                    name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} disabled={isSavingPassword}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                    placeholder="••••••••" required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Confirm New Password</label>
                  <input
                    name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} disabled={isSavingPassword}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-[#00E599] transition-colors disabled:opacity-50"
                    placeholder="••••••••" required
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={isSavingPassword} className="bg-[#00E599] text-zinc-950 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm disabled:opacity-70 flex items-center gap-2">
                  {isSavingPassword ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                  {isSavingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </Card>

          <Card className="bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 p-6 transition-colors shadow-sm">
            <h3 className="text-red-600 dark:text-red-500 font-bold text-lg mb-1 transition-colors">Danger Zone</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-5 transition-colors">Sign out from your account. All unsaved changes will be lost.</p>
            <button
              onClick={handleSignOut}
              className="border border-red-300 dark:border-red-500/30 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 px-6 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </Card>

        </div>
      </div>
    </div>
  );
}