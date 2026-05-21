"use client";

import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import { AuthProvider, useAuthContext } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const LayoutContent = ({ children }) => {
  const { isAuthenticated, isChecking } = useAuthContext();
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/register" || pathname === "/forgot-password";

  // 1. KUNCI UTAMA: Jangan render HTML apa pun selama masa pengecekan!
  if (isChecking) {
    return null; 
  }

  // 2. Jika belum login dan mencoba masuk ke dashboard, TAHAN layar tetap kosong
  // sampai router selesai melakukan redirect ke halaman login
  if (!isAuthenticated && !isAuthPage) {
    return null; 
  }

  // 3. Jika sedang di halaman Auth (Login/Register), render halamannya saja
  if (isAuthPage) {
    return <>{children}</>;
  }

  // 4. Jika sudah divalidasi dan aman, baru tampilkan layout penuh
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}