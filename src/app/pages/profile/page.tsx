'use client';

import React, { SVGProps, useState } from 'react';
import Image from 'next/image';

// --- Definisi Warna (REMOVED - Using Tailwind theme) ---
// const newColors = { ... };

// --- Komponen Ikon (Will use currentColor or direct Tailwind classes) ---
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52M6.272 5.05A48.416 48.416 0 0 1 12 4.5c2.291 0 4.545.16 6.75.47m0 0c-.98.132-1.98.296-3 .479M12 9.75V14.25m0-4.5c0-1.483.673-2.857 1.757-3.753M12 9.75c-1.084 0-1.757.87-1.757 2.25S10.916 14.25 12 14.25m-8.25 4.5a4.5 4.5 0 0 1-1.887-8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887 8.456 4.5 4.5 0 0 1-8.456 1.887m11.25-8.456a4.5 4.5 0 0 1-1.887 8.456 4.5 4.5 0 0 1 8.456-1.887m0-1.887a4.5 4.5 0 0 1 1.887-8.456 4.5 4.5 0 0 1-8.456 1.887" />
  </svg>
);

const ShieldCheckIcon = (props: SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.956 11.956 0 0 1 12 2.25c1.121 0 2.206.135 3.22.393m0 0a9 9 0 0 1 3.042 2.22 9.967 9.967 0 0 1 0 12.225 9 9 0 0 1-3.042 2.22m0 0A11.956 11.956 0 0 1 12 21.75c-1.121 0-2.206-.135-3.22-.393m0 0a9 9 0 0 1-3.042-2.22 9.967 9.967 0 0 1 0-12.225 9 9 0 0 1 3.042-2.22m0 0A11.956 11.956 0 0 1 12 2.25c1.121 0 2.206.135 3.22.393" />
  </svg>
);

// Ikon baru untuk Airdrop
const GiftIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 2.25-2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 12H9" />
    </svg>
);

// --- Komponen Utama FinanceProfilePage ---
export default function FinanceProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [profileData, setProfileData] = useState({
    name: "Rina Wulandari",
    email: "rina.wulandari@example.com",
    memberSince: "Januari 2022",
    avatarUrl: "", // Placeholder, will be generated by onError or set dynamically
    recentActivity: [
      { id: 'act1', type: "Deposit", description: "Gaji Bulanan", amount: 15000000, date: "25 Mei 2024", status: "Berhasil" },
      { id: 'act2', type: "Penarikan", description: "Pembayaran Tagihan", amount: -2500000, date: "20 Mei 2024", status: "Berhasil" },
      { id: 'act3', type: "Investasi", description: "Saham BBCA", amount: -10000000, date: "15 Mei 2024", status: "Dalam Proses" },
      { id: 'act4', type: "Dividen", description: "Dividen TLKM", amount: 750000, date: "12 Mei 2024", status: "Berhasil" },
    ],
    accountLinks: [
        { name: "Keamanan Akun", icon: ShieldCheckIcon, action: () => console.log("Security Clicked") },
        { name: "Klaim Airdrop", icon: GiftIcon, action: () => console.log("Airdrop Clicked") },
        { name: "Informasi Legal", icon: ScaleIcon, action: () => console.log("Legal Info Clicked") },
    ]
  });

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* Header - Themed with bg-card or a dark neutral, text-primary for main elements */}
      <header className="py-6 sm:py-8 px-4 sm:px-6 bg-card shadow-md sticky top-0 z-20 border-b border-border">
        <div className="container mx-auto max-w-3xl"> 
          <div className="flex flex-col items-center text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col items-center sm:flex-row sm:items-center mb-4 sm:mb-0">
              <Image 
                src={profileData.avatarUrl || `https://placehold.co/128x128/1E1E1E/E0E0E0?text=${profileData.name.substring(0,2).toUpperCase()}`} 
                alt={profileData.name} 
                width={80}
                height={80}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary object-cover mb-3 sm:mb-0 sm:mr-4"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/128x128/121212/E0E0E0?text=${profileData.name.substring(0,2).toUpperCase()}`;
                  target.alt = "Gagal memuat gambar";
                }}
              />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-primary">{profileData.name}</h1>
                <p className="text-xs md:text-sm text-muted-foreground opacity-80">{profileData.email}</p>
                <p className="text-xs mt-0.5 text-muted-foreground opacity-70">Anggota sejak: {profileData.memberSince}</p>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0">
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

      {/* Main Content - Themed with bg-background, cards with bg-card */}
      <main className="container mx-auto max-w-3xl p-4 sm:p-6 relative z-10"> 
        <div className="space-y-6"> 
          <section className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b border-border pb-3 text-foreground">Account</h2>
              <ul className="space-y-2">
                {profileData.accountLinks.map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={link.action} 
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <link.icon className="w-5 h-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground"/>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>

           {/* Kept the 'Others' section as it was in original, assuming it may serve a different purpose or be populated differently */}
            <section className="bg-card p-5 sm:p-6 rounded-xl shadow-lg border border-border">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 border-b border-border pb-3 text-foreground">Others</h2>
              <ul className="space-y-2">
                {profileData.accountLinks.map(link => (
                  <li key={link.name}>
                    <button 
                      onClick={link.action} 
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors text-left focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <link.icon className="w-5 h-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground"/>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary">{link.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
        </div>
      </main>
       {/* Custom scrollbar styles adapted for dark theme */}
       <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-background); /* Use Tailwind CSS variable */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-muted-foreground); /* Use Tailwind CSS variable */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-foreground); /* Use Tailwind CSS variable */
        }
      `}</style>
    </div>
  );
}
