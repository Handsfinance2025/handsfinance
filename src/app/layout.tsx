// app/layout.tsx
'use client'; // Sesuai permintaan pengguna


import { Poppins } from "next/font/google"; // Import Poppins
import "./globals.css"; // Pastikan file CSS global Anda mengimpor Tailwind
import BottomNav from "@/components/navigation"; // Assuming this path is correct
import Script from 'next/script';

// Configure Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Include desired weights
  variable: "--font-poppins", // CSS variable for Tailwind
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="id" className={`${poppins.variable} font-sans antialiased`}>
      {/* Removed dark class, will be handled by globals.css or specific component styling if needed */}
      <body className="bg-background text-foreground">
        {/* Main container for centering content - can be adjusted */}
        <div className="container mx-auto max-w-md min-h-screen flex flex-col">
          <main className="flex-grow pt-5 pb-20"> {/* Padding for header (if any) and bottom nav */}
            {children}
            {/* TelegaIn SDK script - ensure this is still needed and configured correctly */}
        
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
