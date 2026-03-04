import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'StockMate - Login',
  description: 'Sistem manajemen inventaris modern.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-zinc-950 text-zinc-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}