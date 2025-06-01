// app/layout.tsx
'use client'; // Sesuai permintaan pengguna


import { Poppins } from "next/font/google"; // Import Poppins
import "./globals.css"; // Pastikan file CSS global Anda mengimpor Tailwind
import BottomNav from "@/components/navigation"; // Assuming this path is correct

import { useState } from 'react'; // Added for splash screen state
import SplashScreen from '@/components/SplashScreen'; // Added SplashScreen import
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import { TonConnectUIProvider } from '@tonconnect/ui-react'; // Ditambahkan
import { useEffect } from 'react'; // Ditambahkan
import Head from 'next/head'; // Pastikan Head diimpor dari next/head

// Configure Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Include desired weights
  variable: "--font-poppins", // CSS variable for Tailwind
});

import type { Metadata } from 'next'


interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  

  // Gunakan URL absolut ke manifest Anda.
  // Pastikan file tonconnect-manifest.json ada di folder public.
  // Ganti 'https://yourdomain.com' dengan domain Anda jika sudah di-deploy.
  // Untuk development, jika app berjalan di localhost:3000, maka '/tonconnect-manifest.json' akan resolve ke sana.
  const manifestUrl = '/tonconnect-manifest.json'; 
  // Atau jika Anda ingin lebih eksplisit untuk development:
  // const manifestUrl = process.env.NODE_ENV === 'production' 
  //  ? 'https://yourdomain.com/tonconnect-manifest.json' 
  //  : 'http://localhost:3000/tonconnect-manifest.json';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready(); // Memberitahu Telegram bahwa aplikasi sudah siap
      // window.Telegram.WebApp.expand(); // Contoh: Memperluas Mini App
    }
  }, []);

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
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        {/* Ganti href dengan path ke logo baru Anda di folder public */}
        <link rel="icon" href="/image/logo.png" type="image/png" />
        {/* Anda juga bisa menambahkan ukuran lain jika perlu */}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/image/logo-32x32.png"> */}
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/image/logo-16x16.png"> */}
      </Head>
      <body>
        <TonConnectUIProvider manifestUrl={manifestUrl}>

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
       
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
