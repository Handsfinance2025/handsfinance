// app/layout.tsx
'use client'; // Sesuai permintaan pengguna


import { Poppins } from "next/font/google"; // Import Poppins
import "./globals.css"; // Pastikan file CSS global Anda mengimpor Tailwind
import BottomNav from "@/components/navigation"; // Assuming this path is correct

import { useState } from 'react'; // Added for splash screen state
import SplashScreen from '@/components/SplashScreen'; // Added SplashScreen import
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

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
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleSplashFinished = () => {
    setShowSplash(false);
    // Only redirect if not already on a page that should persist (e.g. deep link)
    // Or, always redirect to home if that's the desired UX.
    // For now, let's assume we always want to go to home after the initial splash.
    if (pathname !== "/pages/home") { // Avoid redundant navigation if already on home
      router.push("/pages/home");
    }
  };

  return (
    <html lang="id" className={`${poppins.variable} font-sans antialiased`}>
      {/* Removed dark class, will be handled by globals.css or specific component styling if needed */}
      <body className="bg-background text-foreground">
        {showSplash && <SplashScreen onFinished={handleSplashFinished} />}
        
        {/* Main container for centering content - can be adjusted */}
        {/* We conditionally render the main content wrapper or hide it to prevent interaction during splash */} 
        <div className={`container mx-auto max-w-md min-h-screen flex-col ${showSplash ? 'hidden' : 'flex'}`}>
          <main className="flex-grow pt-5 pb-20"> {/* Padding for header (if any) and bottom nav */}
            {children}
          </main>
          <BottomNav />
        </div>
        
        {/* TelegaIn SDK script - ensure this is still needed and configured correctly */}
        {/* If Script needs to be loaded after splash, additional logic might be needed */}
        {/* For now, assuming it can load with the initial HTML structure */}
      </body>
    </html>
  );
}
