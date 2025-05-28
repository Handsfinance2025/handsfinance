// pages/user/auth.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// Pastikan tipe 'WebAppUser' dan interface 'WebApp' (termasuk 'CloudStorage?' jika ada)
// didefinisikan dalam file global.d.ts Anda dan file tersebut dikenali oleh TypeScript.

const AuthPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<string>('Initializing...');
  const [error, setError] = useState<string | null>(null);
  // Menggunakan tipe WebAppUser dari global.d.ts
  const [telegramUser, setTelegramUser] = useState<{
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  } | null>(null);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        window.Telegram.WebApp.ready();
        setIsTelegramReady(true);
        console.log('Telegram WebApp is ready.');
      } catch (e) {
        console.error("Error calling Telegram.WebApp.ready(): ", e);
        setStatus("Error initializing Telegram WebApp.");
        setError("Could not initialize Telegram WebApp integration.");
      }
    } else {
      setStatus("Waiting for Telegram WebApp SDK...");
      console.warn("Telegram WebApp SDK not found immediately. This might be normal if script is loading.");
      
      const checkTelegramInterval = setInterval(() => {
        if (window.Telegram && window.Telegram.WebApp) {
          clearInterval(checkTelegramInterval);
          try {
            window.Telegram.WebApp.ready();
            setIsTelegramReady(true);
            console.log('Telegram WebApp became ready after polling.');
          } catch (e) {
            console.error("Error calling Telegram.WebApp.ready() after polling: ", e);
            setStatus("Error initializing Telegram WebApp.");
            setError("Could not initialize Telegram WebApp integration after polling.");
          }
        }
      }, 500); 

      const timeoutId = setTimeout(() => {
        clearInterval(checkTelegramInterval);
        if (!isTelegramReady && !(window.Telegram && window.Telegram.WebApp)) {
            console.error("Telegram WebApp SDK did not load after timeout.");
            setStatus("Telegram WebApp SDK failed to load.");
            setError("Please ensure you are opening this app within Telegram.");
        }
      }, 10000); 

      return () => { 
        clearInterval(checkTelegramInterval);
        clearTimeout(timeoutId);
      };
    }
  }, []); 


  useEffect(() => {
    if (!isTelegramReady) {
      console.log("Auth effect: Telegram not ready yet.");
      return;
    }

    const tg = window.Telegram?.WebApp;

    if (!tg) {
        setStatus('Telegram SDK not available.');
        setError('Cannot access Telegram WebApp. Please open this app through Telegram.');
        console.error("Auth effect: window.Telegram.WebApp is not available even though isTelegramReady is true.");
        return;
    }
    
    // --- PENAMBAHAN KODE UNTUK CLOUDSTORAGE ---
    // Cek apakah CloudStorage didukung. 
    // Untuk keamanan tipe penuh, 'CloudStorage' sebaiknya ditambahkan ke interface WebApp di global.d.ts
    if (tg && typeof (tg as any).CloudStorage === 'object' && (tg as any).CloudStorage !== null) {
        console.log('[AuthPage] CloudStorage API seems to be available. Attempting to use setItem...');
        // Menggunakan (tg as any) untuk menghindari error TypeScript jika CloudStorage belum ada di definisi tipe WebApp
        ((tg as any).CloudStorage).setItem('myKeyAuthPage', 'myValueFromAuthPage', (err?: string | null, stored?: boolean) => {
            if (err) {
              console.error('[AuthPage] CloudStorage setItem error:', err);
              // Tangani error, misalnya, informasikan pengguna atau gunakan fallback
              return;
            }
            if (stored) {
              console.log('[AuthPage] Data "myValueFromAuthPage" successfully stored in CloudStorage.');
            } else {
              // Kasus ini bisa berarti kunci tidak tersimpan, atau operasi selesai tapi tidak ada yang disimpan secara efektif.
              // Callback setItem memiliki signature (error, boolean_sukses)
              console.warn('[AuthPage] CloudStorage.setItem reported success (no error), but "stored" is false or undefined. Key may not have been set as expected.');
            }
        });
    } else {
        console.warn('[AuthPage] CloudStorage is not supported on this client or not available on the `tg` object.');
        // Implementasikan fallback jika perlu, misalnya menggunakan localStorage
        // localStorage.setItem('myKeyAuthPage_fallback', 'myValueFromAuthPage_fallback');
        // console.log('[AuthPage] Used localStorage as fallback for CloudStorage.');
    }
    // --- AKHIR PENAMBAHAN KODE UNTUK CLOUDSTORAGE ---
    
    if (tg.initDataUnsafe && tg.initDataUnsafe.hash && tg.initData) {
      setStatus('Telegram data found. Authenticating...');
      setTelegramUser(tg.initDataUnsafe.user || null);
      console.log('Telegram User Data:', tg.initDataUnsafe.user);

      const authenticate = async () => {
        try {
          console.log('Sending initData for authentication:', tg.initData);
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData: tg.initData }), 
          });

          const data = await response.json();
          console.log('Authentication response:', data);

          if (response.ok) {
            setStatus(`Authenticated successfully as ${data.user?.username || data.user?.firstName || 'user'}. Redirecting...`);
            
            const targetPath = (router.query.redirect as string) || '/user/dashboard';
            console.log('Redirecting to:', targetPath);
            router.push(targetPath);
          } else {
            setError(data.message || 'Authentication failed.');
            setStatus('Authentication failed.');
            console.error('Authentication failed response:', data);
          }
        } catch (err) {
          console.error('Authentication request error:', err);
          setError(`An error occurred during authentication: ${err instanceof Error ? err.message : String(err)}`);
          setStatus('Authentication error.');
        }
      };

      authenticate();
    } else {
      setStatus('No valid Telegram data found. Please open this app through Telegram.');
      setError('Telegram initialization data is missing or invalid. This app must be run inside Telegram.');
      console.warn('Missing initDataUnsafe, hash, or initData:', { 
        hasInitDataUnsafe: !!tg.initDataUnsafe,
        hasHash: !!tg.initDataUnsafe?.hash,
        hasInitData: !!tg.initData
      });
    }
  }, [isTelegramReady, router]); 
}
export default AuthPage;
