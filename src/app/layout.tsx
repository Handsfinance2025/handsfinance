// app/layout.tsx
'use client'; // Sesuai permintaan pengguna

import "./globals.css"; // Pastikan file CSS global Anda mengimpor Tailwind
import BottomNav from "@/components/navigation"; // Assuming this path is correct
import { useState, useEffect } from 'react'; // Added for splash screen state and useEffect
import SplashScreen from '@/components/SplashScreen'; // Added SplashScreen import
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import { TonConnectUIProvider } from '@tonconnect/ui-react'; // Ditambahkan
import Head from 'next/head'; // Pastikan Head diimpor dari next/head
import { AppRoot } from '@telegram-apps/telegram-ui'; // Import AppRoot

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  const manifestUrl = process.env.NODE_ENV === 'production' 
   ? 'https://https://handsfinance.my.id/public/tonconnect-manifest.json' 
   : 'http://localhost:3000/tonconnect-manifest.json';

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready(); // Memberitahu Telegram bahwa aplikasi sudah siap
      // window.Telegram.WebApp.expand(); // Contoh: Memperluas Mini App
    }
  }, []);

  const handleSplashFinished = () => {
    setShowSplash(false);

    if (pathname !== "/pages/home") {
      router.push("/pages/home");
    }
  };
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <Head>
        <link rel="icon" href="/image/logo.png" type="image/png" />
      </Head>
      <body>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <AppRoot>
            {showSplash && <SplashScreen onFinished={handleSplashFinished} />}
            <div className={`container mx-auto max-w-md min-h-screen flex-col ${showSplash ? 'hidden' : 'flex'}`}>
              <main className="flex-grow pt-5 pb-20">
                {children}
              </main>
              <BottomNav />
            </div>
          </AppRoot>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
