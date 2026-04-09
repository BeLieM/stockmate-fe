import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";

export const metadata = {
  title: "Dashboard - StockMate",
  description: "Overview of your inventory",
};

export default function DashboardLayout({ children }) {
  return (
    // Menggunakan h-screen dan overflow-hidden agar layout utama tidak bergeser, 
    // hanya area konten (children) yang bisa di-scroll
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden font-sans">
      
      {/* Sidebar Kiri */}
      <Sidebar />

      {/* Area Utama Kanan */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Navbar Atas */}
        <Navbar />

        {/* Area Konten Dinamis */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>

      </div>
    </div>
  );
}