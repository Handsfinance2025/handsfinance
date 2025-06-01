'use client';

import React, { SVGProps, useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRawInitData } from '@telegram-apps/sdk-react';
import { isTMA } from '@telegram-apps/bridge';

// --- TypeScript Interfaces ---
interface TelegramUser {
  id: number;
  first_name?: string; // Matched to common Telegram initData structure
  last_name?: string;  // Matched to common Telegram initData structure
  username?: string;
  language_code?: string; // Matched to common Telegram initData structure
  is_bot?: boolean;       // Matched to common Telegram initData structure
  is_premium?: boolean;
  photo_url?: string;     // Matched to common Telegram initData structure
  // Add other properties as needed based on the actual structure of initData.user
}

// Interface for the whole initData object if initDataRaw is already an object
interface InitDataObject {
  user?: TelegramUser;
  auth_date?: number;
  // Add other properties from initData as needed
}

// Interface for parsed initData if it's a string that needs parsing (e.g. URLSearchParams or direct JSON)
interface ParsedInitData {
  user?: TelegramUser;
  auth_date?: number;
  // Add other properties from initData as needed
}

// --- SVG Icon Components ---
const Cog6ToothIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.905 1.525a1.586 1.586 0 0 1-.319.919c-.07.086-.16.156-.249.221a1.586 1.586 0 0 1-.445.379.603.603 0 0 1-.283.119A1.586 1.586 0 0 1 7 5.033H5.25a1.586 1.586 0 0 1-1.558-.953.604.604 0 0 1-.198-.287A1.586 1.586 0 0 1 3.002 3h-.368a.75.75 0 0 0-.722.534l-.488 1.463a.75.75 0 0 0 .293.701l.875.583a1.586 1.586 0 0 1 .38.92l-.026.283a.603.603 0 0 1-.052.282 1.586 1.586 0 0 1-.953 1.558H3a1.586 1.586 0 0 1-1.525.445.603.603 0 0 1-.283-.119 1.586 1.586 0 0 1-.919-.319c-.086-.07-.156-.16-.221-.249a1.586 1.586 0 0 1-.379-.445.603.603 0 0 1-.119-.283A1.586 1.586 0 0 1 5.033 7V5.25a1.586 1.586 0 0 1 .953-1.558.604.604 0 0 1 .287-.198A1.586 1.586 0 0 1 7 3.002h.368a.75.75 0 0 0 .722-.534l.488-1.463a.75.75 0 0 0-.293-.701l-.875-.583a1.586 1.586 0 0 1-.38-.92l.026-.283a.603.603 0 0 1 .052-.282A1.586 1.586 0 0 1 3 7.033V8.75c0 .917.663 1.699 1.525 1.905a1.586 1.586 0 0 1 .919.319c.086.07.156.16.221.249a1.586 1.586 0 0 1 .445.379.603.603 0 0 1 .119.283A1.586 1.586 0 0 1 7.033 13H8.75c.917 0 1.699-.663 1.905-1.525a1.586 1.586 0 0 1 .319-.919c.07-.086.16-.156.249-.221a1.586 1.586 0 0 1 .445-.379.603.603 0 0 1 .283-.119A1.586 1.586 0 0 1 13 11.033V9.25a1.586 1.586 0 0 1 1.558.953.604.604 0 0 1 .198.287A1.586 1.586 0 0 1 15.248 11h.368a.75.75 0 0 0 .722-.534l.488-1.463a.75.75 0 0 0-.293-.701l-.875-.583a1.586 1.586 0 0 1-.38-.92l.026-.283a.603.603 0 0 1 .052-.282A1.586 1.586 0 0 1 17 7.033V5.25c0-.917-.663-1.699-1.525-1.905a1.586 1.586 0 0 1-.919-.319c-.086-.07-.156-.16-.221-.249a1.586 1.586 0 0 1-.445-.379.603.603 0 0 1-.119-.283A1.586 1.586 0 0 1 11.033 3H9.25a1.586 1.586 0 0 1-1.558.953.604.604 0 0 1-.198.287A1.586 1.586 0 0 1 7 5.002h-.368a.75.75 0 0 0-.722.534l-.488 1.463a.75.75 0 0 0 .293.701l.875.583a1.586 1.586 0 0 1 .38.92l-.026.283a.603.603 0 0 1-.052.282A1.586 1.586 0 0 1 5.002 11V12.75a1.586 1.586 0 0 1-.953 1.558.604.604 0 0 1-.287.198A1.586 1.586 0 0 1 3.002 15h-.368a.75.75 0 0 0-.722.534l-.488 1.463a.75.75 0 0 0 .293.701l.875.583a1.586 1.586 0 0 1 .38.92l-.026.283a.603.603 0 0 1-.052.282A1.586 1.586 0 0 1 3 18.967V20.75c0 .917.663 1.699 1.525 1.905a1.586 1.586 0 0 1 .919.319c.086.07.156.16.221.249a1.586 1.586 0 0 1 .445.379.603.603 0 0 1 .119.283A1.586 1.586 0 0 1 7.033 21H8.75c.917 0 1.699-.663 1.905-1.525a1.586 1.586 0 0 1 .319-.919c.07-.086.16-.156.249-.221a1.586 1.586 0 0 1 .445-.379.603.603 0 0 1 .283-.119A1.586 1.586 0 0 1 13 18.967V17.25a1.586 1.586 0 0 1 1.558-.953.604.604 0 0 1 .198-.287A1.586 1.586 0 0 1 15.248 17H15.75a.75.75 0 0 0 .722-.534l.488-1.463a.75.75 0 0 0-.293-.701l-.875-.583a1.586 1.586 0 0 1-.38-.92l.026-.283a.603.603 0 0 1 .052-.282A1.586 1.586 0 0 1 17 11.033V9.25c0-.917.663-1.699-1.525-1.905a1.586 1.586 0 0 1-.919-.319c.086-.07.156-.16.221-.249a1.586 1.586 0 0 1 .445-.379.603.603 0 0 1 .119-.283A1.586 1.586 0 0 1 21.998 7V5.25a1.586 1.586 0 0 1-.953 1.558.604.604 0 0 1-.287.198A1.586 1.586 0 0 1 19.998 7h-.368a.75.75 0 0 0-.722.534l-.488 1.463a.75.75 0 0 0 .293.701l.875.583a1.586 1.586 0 0 1 .38.92l-.026.283a.603.603 0 0 1-.052.282A1.586 1.586 0 0 1 19 12.967V11.25a1.586 1.586 0 0 1 .953-1.558.604.604 0 0 1 .287-.198A1.586 1.586 0 0 1 21.998 11h.368a.75.75 0 0 0 .722-.534l.488-1.463a.75.75 0 0 0-.293-.701l-.875-.583a1.586 1.586 0 0 1-.38-.92l.026-.283a.603.603 0 0 1 .052-.282A1.586 1.586 0 0 1 21.998 3Z" clipRule="evenodd" />
  </svg>
);

const PencilSquareIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
  </svg>
);

const ScaleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52M6.272 5.05A48.416 48.416 0 0 1 12 4.5c2.291 0 4.545.16 6.75.47m0 0c-.98.132-1.98.296-3 .479M12 9.75V14.25m0-4.5c0-1.483.673-2.857 1.757-3.753M12 9.75c-1.084 0-1.757.87-1.757 2.25S10.916 14.25 12 14.25m-8.25 4.5a4.5 4.5 0 0 1-1.887-8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887 8.456 4.5 4.5 0 0 1-8.456 1.887m11.25-8.456a4.5 4.5 0 0 1-1.887 8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887-8.456 4.5 4.5 0 0 1-8.456 1.887m11.25-8.456a4.5 4.5 0 0 1-1.887 8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887-8.456 4.5 4.5 0 0 1-8.456 1.887m11.25-8.456a4.5 4.5 0 0 1-1.887 8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887-8.456 4.5 4.5 0 0 1-8.456 1.887m11.25-8.456a4.5 4.5 0 0 1-1.887 8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887-8.456 4.5 4.5 0 0 1-8.456 1.887" />
  </svg>
);

const ShieldCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.956 11.956 0 0 1 12 2.25c1.121 0 2.206.135 3.22.393m0 0a9 9 0 0 1 3.042 2.22 9.967 9.967 0 0 1 0 12.225 9 9 0 0 1-3.042 2.22m0 0A11.956 11.956 0 0 1 12 21.75c-1.121 0-2.206-.135-3.22-.393m0 0a9 9 0 0 1-3.042-2.22 9.967 9.967 0 0 1 0-12.225 9 9 0 0 1 3.042-2.22m0 0A11.956 11.956 0 0 1 12 2.25c1.121 0 2.206.135 3.22.393" />
  </svg>
);

const GiftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 2.25-2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 12H9" />
  </svg>
);

// --- Dynamically import LoginButton ---
// Using the path from your first snippet as the base
const LoginButton = dynamic(() => import('../../../components/LoginButton'), {
  ssr: false,
  // loading: () => <p>Loading button...</p> // Optional loading state
});


// --- Komponen Utama FinanceProfilePage ---
export default function FinanceProfilePage() {
  const initDataRaw = useRawInitData();
  const [profileData, setProfileData] = useState({
    name: 'Guest',
    username: 'N/A',
    email: 'N/A', // Email is not typically available directly from initData.user
    memberSince: 'N/A',
    avatarUrl: '/placeholder-user.jpg', // Default placeholder
    recentActivity: [], // Placeholder for recent activity
    accountLinks: [
      { name: "Keamanan Akun", icon: ShieldCheckIcon, action: () => console.log("Security Clicked") },
      { name: "Klaim Airdrop", icon: GiftIcon, action: () => console.log("Airdrop Clicked") },
      { name: "Informasi Legal", icon: ScaleIcon, action: () => console.log("Legal Info Clicked") },
    ]
  });
  const [isTelegramEnvironment, setIsTelegramEnvironment] = useState(false);
  const [isLoadingEnvironment, setIsLoadingEnvironment] = useState(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true); // For user data specific loading

  // Effect to check Telegram environment
  useEffect(() => {
    const checkTelegramEnv = async () => {
      setIsLoadingEnvironment(true);
      try {
        const tmaEnv = await isTMA();
        setIsTelegramEnvironment(tmaEnv);
      } catch (error) {
        console.error('Error checking Telegram environment:', error);
        setIsTelegramEnvironment(false);
      }
      setIsLoadingEnvironment(false);
    };

    checkTelegramEnv();
  }, []);

  // Effect to process initDataRaw once environment check is done
  useEffect(() => {
    if (isLoadingEnvironment) {
      // Still checking environment, wait before processing initData
      return;
    }

    setIsUserDataLoading(true); // Start user data loading

    if (!isTelegramEnvironment) {
      console.log('Not in Telegram Mini App environment or launch params unavailable.');
      setProfileData(prev => ({
        ...prev,
        name: 'Not in Telegram',
        username: 'N/A',
        memberSince: 'N/A',
        avatarUrl: '/placeholder-user.jpg',
      }));
      setIsUserDataLoading(false);
      return;
    }

    let telegramUser: TelegramUser | null = null;
    let authDate: number | undefined = undefined;

    if (typeof initDataRaw === 'string' && initDataRaw.length > 0) {
      try {
        // Attempt to parse as URLSearchParams (common for web apps)
        const params = new URLSearchParams(initDataRaw);
        const userParam = params.get('user');
        if (userParam) {
          const parsedUser = JSON.parse(userParam) as TelegramUser;
          // Telegram's user object is nested, ensure to map fields correctly
          telegramUser = {
            id: parsedUser.id,
            first_name: parsedUser.first_name,
            last_name: parsedUser.last_name,
            username: parsedUser.username,
            language_code: parsedUser.language_code,
            is_premium: parsedUser.is_premium,
            photo_url: parsedUser.photo_url,
          };
        }
        const authDateParam = params.get('auth_date');
        if (authDateParam) authDate = parseInt(authDateParam, 10);

      } catch (e) {
        console.error('Failed to parse initDataRaw from URLSearchParams:', e);
        // Fallback: try parsing as a direct JSON string of the whole initData object
        try {
          const parsedData = JSON.parse(initDataRaw) as ParsedInitData; // Use ParsedInitData
          telegramUser = parsedData.user || null;
          authDate = parsedData.auth_date;
        } catch (e2) {
          console.error('Failed to parse initDataRaw as direct JSON:', e2);
        }
      }
    } else if (typeof initDataRaw === 'object' && initDataRaw !== null) {
      // If initDataRaw is already an object (e.g., from some SDK versions or mockups)
      const dataObject = initDataRaw as InitDataObject; // Use InitDataObject
      telegramUser = dataObject.user || null;
      authDate = dataObject.auth_date;
    }

    if (telegramUser) {
      const userFullName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ');
      let memberSinceDate = 'Today'; // Default
      if (authDate) {
          try {
            memberSinceDate = new Date(authDate * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'});
          } catch (dateError) {
            console.error("Error formatting auth_date", dateError);
            memberSinceDate = 'N/A'; // Fallback if date is invalid
          }
      }


      setProfileData(prev => ({
        ...prev, // Keep existing accountLinks etc.
        name: userFullName || telegramUser?.username || 'Telegram User',
        username: telegramUser?.username ? `@${telegramUser.username}` : 'N/A',
        avatarUrl: telegramUser?.photo_url || '/placeholder-user.jpg',
        memberSince: memberSinceDate,
        // email is not typically provided, keep as N/A or fetch from elsewhere
      }));
    } else {
      // If not loading environment and no telegramUser, set to a guest/unavailable state
      setProfileData(prev => ({
        ...prev,
        name: 'Guest (Data Unavailable)',
        username: 'N/A',
        memberSince: 'N/A',
        avatarUrl: '/placeholder-user.jpg',
      }));
    }
    setIsUserDataLoading(false); // Finish user data loading
  }, [initDataRaw, isTelegramEnvironment, isLoadingEnvironment]);


  // --- Loading States ---
  if (isLoadingEnvironment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <p className="text-gray-700 dark:text-gray-300">Loading environment information...</p>
      </div>
    );
  }

  if (isUserDataLoading && isTelegramEnvironment) { // Show user data loading only if in TMA
     return (
      <div className="min-h-screen flex items-center justify-center font-sans bg-background text-foreground p-4">
        <p>Memuat data pengguna Telegram...</p>
      </div>
    );
  }


  // --- Render Profile Page ---
  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* Header */}
      <header className="py-6 sm:py-8 px-4 sm:px-6 bg-card shadow-md sticky top-0 z-20 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col items-center sm:flex-row sm:items-center mb-4 sm:mb-0">
              <Image
                src={profileData.avatarUrl || `https://placehold.co/128x128/1E1E1E/E0E0E0?text=${profileData.name.substring(0, 2).toUpperCase()}`}
                alt={profileData.name || "User Avatar"}
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary object-cover mb-3 sm:mb-0 sm:mr-4"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/128x128/121212/E0E0E0?text=${profileData.name.substring(0, 2).toUpperCase() || 'GU'}`;
                  target.alt = "Gagal memuat gambar";
                }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-primary">{profileData.name}</h1>
                {profileData.username !== 'N/A' && (
                    <p className="text-sm text-muted-foreground opacity-90">{profileData.username}</p>
                )}
                <p className="text-xs md:text-sm text-muted-foreground opacity-80">{profileData.email}</p> {/* Email might be N/A */}
                <p className="text-xs mt-0.5 text-muted-foreground opacity-70">Anggota sejak: {profileData.memberSince}</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0 items-center">
              <LoginButton /> {/* LoginButton component */}
              <button className="p-2 rounded-lg hover:bg-neutral-700/60 transition-colors text-primary focus:outline-none focus:ring-1 focus:ring-primary" title="Edit Profil">
                <PencilSquareIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-700/60 transition-colors text-primary focus:outline-none focus:ring-1 focus:ring-primary" title="Pengaturan">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-3xl p-4 sm:p-6 relative z-10">
        <div className="space-y-6">
          <section className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b border-border pb-3 text-foreground">Account</h2>
            <ul className="space-y-2">
              {profileData.accountLinks.map(link => (
                <li key={link.name}>
                  <button
                    onClick={link.action}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-primary group"
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors"/>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Example "Others" section - can be customized or removed */}
          {/* <section className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b border-border pb-3 text-foreground">Others</h2>
            <ul className="space-y-2">
              {profileData.accountLinks.map(link => ( // Example: reusing accountLinks, replace with actual data
                <li key={link.name}>
                  <button 
                    onClick={link.action} 
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-primary group"
                  >
                    <link.icon className="w-5 h-5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors"/>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          */}
        </div>
      </main>

      {/* Custom scrollbar styles (optional) */}
      <style jsx global>{`
        :root {
          /* Define color variables for Tailwind, if not already defined in global.css or layout */
          /* These are examples, adjust to your actual Tailwind theme variables */
          --color-background: #0F0F0F; /* Example dark background */
          --color-foreground: #E0E0E0; /* Example light foreground */
          --color-muted-foreground: #A0A0A0; /* Example muted foreground */
          --color-card: #1E1E1E; /* Example card background */
          --color-primary: #3B82F6; /* Example primary color */
          --color-border: #2f2f2f; /* Example border color */
        }
        /* Apply these to body or a specific scrollable container if needed */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-card); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-muted-foreground); 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary); 
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--color-muted-foreground) var(--color-card);
        }
        body { /* Apply to body if you want global scrollbar styling */
           /* Add custom-scrollbar class to body in your layout or _app.tsx if you want this globally */
        }
      `}</style>
    </div>
  );
}
