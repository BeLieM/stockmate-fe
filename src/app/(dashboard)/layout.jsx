import Sidebar from "@/components/shared/Sidebar"; // Sesuaikan path-mu
import Navbar from "@/components/shared/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
      
      {/* Sidebar Kiri */}
      <Sidebar />

      {/* Area Kanan (Navbar & Konten) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}