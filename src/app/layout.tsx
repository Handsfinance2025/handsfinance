// app/layout.tsx
'use client'; // Sesuai permintaan pengguna

import "./globals.css"; // Pastikan file CSS global Anda mengimpor Tailwind
import BottomNav from "@/components/navigation"; // Assuming this path is correct
import { useState, useEffect } from 'react'; // Added for splash screen state and useEffect
import SplashScreen from '@/components/SplashScreen'; // Added SplashScreen import
import { useRouter } from 'next/navigation'; 
import { TonConnectUIProvider } from '@tonconnect/ui-react'; // Ditambahkan
import Head from 'next/head'; // Pastikan Head diimpor dari next/head
import { AppRoot } from '@telegram-apps/telegram-ui'; // Import AppRoot

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  
  const manifestUrl = process.env.NEXT_PUBLIC_MANIFEST_URL;
  if (typeof window !== "undefined") {
    setInterval(() => {
      if (typeof window !== "undefined") {
        const isTelegram = (window as any).Telegram?.WebApp;
        if (isTelegram) {
          setShowSplash(false);
        }
      }
    }, 1000);
  }

  const handleSplashFinished = () => {
    setShowSplash(false);
    router.push("/pages/home");
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
