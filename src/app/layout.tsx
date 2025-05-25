// app/layout.tsx
'use client'; // Sesuai permintaan pengguna

import { Inter } from "next/font/google";
import "./globals.css"; // Pastikan file CSS global Anda mengimpor Tailwind
import BottomNav from "./components/navigation"; // Path impor dari kode pengguna

const inter = Inter({ subsets: ["latin"] });

import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const metadata = { // metadata biasanya tidak digunakan di client component layout
  title: 'Aplikasi Saya',
  description: 'Dibangun dengan Next.js, Tailwind, dan Ionic',
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-100`}>
        <div className="container mx-auto max-w-md min-h-screen flex flex-col">
          <main className="flex-grow pt-5 pb-20">{/* Padding untuk header (jika ada) dan bottom nav */}
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}