# 📦 StockMate - Web Dashboard

StockMate adalah sistem manajemen inventaris terintegrasi berbasis web yang dirancang untuk membantu pemilik Usaha Kecil dan Menengah (UKM) dalam mengelola stok produk secara efisien, akurat, dan real-time. 

Sebagai pusat kendali, aplikasi web ini memungkinkan pemilik usaha untuk mengelola stok, memantau pergerakan barang, dan mengambil keputusan proaktif. Sistem ini tersinkronisasi langsung dengan aplikasi mobile staf lapangan melalui REST API terpusat, memastikan data selalu up-to-date.

StockMate bukan sekadar alat pencatat, melainkan asisten bisnis cerdas yang dilengkapi dengan fitur otomatis untuk mencegah risiko kehabisan stok sebelum terjadi.

---

## ✨ Fitur Utama (Web Version)

* 📊 **Dashboard & Visualisasi Data:** Pantau kondisi inventaris melalui laporan komprehensif dan grafik tren stok yang mudah dipahami.
* 🗄️ **Manajemen Master Data:** Kelola data produk, kategori, informasi supplier, dan akun staf lapangan di satu tempat secara terpusat.
* 🧠 **Smart Forecasting & Alerts:** * Deteksi otomatis risiko kehabisan stok.
  * Perkiraan tanggal estimasi stok habis (Stockout ETA).
  * Rekomendasi jumlah pengadaan ulang (restock) berdasarkan riwayat penjualan.
* ⚡ **Real-time Synchronization:** Terhubung langsung dengan aplikasi mobile staf lapangan, memastikan seluruh pencatatan stok masuk/keluar ter-update seketika di layar pemilik usaha.

---

## 🛠️ Tech Stack

Aplikasi web ini dibangun menggunakan teknologi modern untuk memastikan performa, skalabilitas, dan pengalaman UI yang interaktif:

* **Framework:** Next.js (App Router)
* **Language:** JavaScript
* **Styling:** Tailwind CSS
* **UI Components:** shadcn/ui
* **Backend API:** Express.js (Repositori Terpisah)

---

## 🚀 Tutorial Testing Project (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek web StockMate di lingkungan lokal (development).

### Prasyarat
Pastikan Anda sudah menginstal perangkat lunak berikut di mesin Anda:
* Node.js (Versi 18.x atau lebih baru)
* Package Manager (npm / yarn / pnpm)
* Git

### Langkah Instalasi

**1. Kloning Repositori**
git clone https://github.com/BeLieM/stockmate-fe.git
cd stockmate-web

**2. Instalasi Dependensi**
npm install

**3. Konfigurasi Environment Variables**
Buat file bernama `.env.local` di root direktori proyek. Sesuaikan URL dengan endpoint backend REST API Express.js yang sedang berjalan:
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

**4. Jalankan Development Server**
npm run dev

**5. Akses Aplikasi**
Buka browser dan akses http://localhost:3000. Anda akan otomatis diarahkan ke halaman Login karena sistem memblokir akses publik ke dashboard.

---

## 👥 Contributors

StockMate dikembangkan oleh tim yang berkolaborasi untuk mengintegrasikan ekosistem Web, Mobile, dan API:

| Nama | Peran / Fokus | GitHub |
| :--- | :--- | :--- |
| **[Billy Marcello]** | Frontend Web Developer (Next.js) | [@BeLieM](https://github.com/BeLieM) |
| **[Dzakievgnii Imaduizza]** | Backend Engineer (Express.js) | [@username](https://github.com/username) |
| **[Muhammad Daniswara Mahardika]** | Backend Engineer (Express.js) | [@username](https://github.com/username) |
| **[Irham Kurnia Putra]** | Mobile Developer (Flutter) | [@username](https://github.com/username) |
| **[Marcelino Adrian Siring]** | Project Manager | [@username](https://github.com/username) |
| **[Vito Natael Raenhard]** | UI/UX Designer | [@username](https://github.com/username) |
---

## 📄 Lisensi

Proyek ini menggunakan MIT License.