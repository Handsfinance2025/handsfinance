'use client'; // Menandakan ini adalah Client Component karena menggunakan hook (usePathname)

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook untuk mendapatkan path URL saat ini
import { SVGProps } from 'react';

// Define the color palette for easy reference
const colors = {
  primaryGreen: '#238B45', // Aksi utama, sorotan, ikon aktif
  lightGray: '#F0F2F0',    // Latar belakang hover item, aksen halus
  ashGray: '#B7C1AC',      // Sempadan, teks sekunder, ikon tidak aktif
  darkGreenGray: '#4E6F5C',// Teks tidak aktif, ikon tidak aktif alternatif
  white: '#FFFFFF',        // Latar belakang utama navigasi, teks & ikon aktif
};

// --- Definisi Ikon SVG ---
// Ikon kini lebih ringkas dan warnanya akan dikawal oleh className

const IconHome = ({ active, className, ...props }: { active: boolean } & SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill={active ? "currentColor" : "none"} // Diisi jika aktif
    viewBox="0 0 24 24" 
    stroke="currentColor" // Warna stroke diambil dari text color parent
    strokeWidth={active ? 2 : 1.5} 
    className={className}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const IconGlobe = ({ active, className, ...props }: { active: boolean } & SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={active ? 2 : 1.5} 
    stroke="currentColor" 
    className={className}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0 1 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-5.496A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253m0 0A11.978 11.978 0 0 0 12 16.5c2.998 0 5.74 1.1 7.843 2.918M3.284 9.753C3.099 10.467 3 11.222 3 12c0 2.953 1.102 5.698 2.918 7.843" />
  </svg>
);

const IconScan = ({ active, className, ...props }: { active: boolean } & SVGProps<SVGSVGElement>) => ( // Ikon baru untuk Scanner
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke="currentColor" className={className} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375A1.125 1.125 0 0 1 3.75 6.375v-1.5Zm0 9.75c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375a1.125 1.125 0 0 1-1.125-1.125v-1.5Zm9.75-9.75c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375a1.125 1.125 0 0 1-1.125-1.125v-1.5Zm0 9.75c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-.375a1.125 1.125 0 0 1-1.125-1.125v-1.5Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9" />
    </svg>
);

const IconChat = ({ active, className, ...props }: { active: boolean } & SVGProps<SVGSVGElement>) => ( // Menggunakan IconWindow sebagai Chat
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={active ? 2 : 1.5} 
    stroke="currentColor" 
    className={className}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.68-3.091a1.003 1.003 0 0 0-.493-.125H5.25A2.25 2.25 0 0 1 3 15.75V9.75A2.25 2.25 0 0 1 5.25 7.5h6.375c.621 0 1.125.504 1.125 1.125v1.125c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V8.511Z" />
  </svg>
);

const IconUser = ({ active, className, ...props }: { active: boolean } & SVGProps<SVGSVGElement>) => ( // Menggunakan IconList sebagai Profile
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={active ? 2 : 1.5} 
    stroke="currentColor" 
    className={className}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

// Urutan item navigasi
const navItems = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/news", label: "News", icon: IconGlobe }, 
  { href: "/scanner", label: "Scanner", icon: IconScan }, 
  { href: "/chat", label: "Chat", icon: IconChat },
  { href: "/profile", label: "Profile", icon: IconUser },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav 
        style={{ backgroundColor: colors.white, borderColor: colors.ashGray }}
        // Menambah max-w-md dan mx-auto untuk mengehadkan lebar pada skrin besar,
        // sambil mengekalkan left-0 dan right-0 untuk memastikan ia tetap di tengah apabila fixed.
        className="fixed bottom-0 left-0 right-0 mx-auto max-w-md border-t rounded-t-2xl sm:rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(78,111,92,0.2)] z-50" 
    >
      <div className="flex justify-around items-stretch h-16 sm:h-20 px-1"> {/* items-stretch agar Link mengisi tinggi */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center text-xs p-1 sm:p-2 transition-all duration-300 ease-out flex-1 text-center group relative rounded-lg
                ${isActive 
                    ? `bg-[${colors.primaryGreen}] shadow-lg shadow-[${colors.primaryGreen}]/30 transform scale-105 -translate-y-1` 
                    : `hover:bg-[${colors.lightGray}]`
                }`
              }
            >
              <item.icon 
                active={isActive} 
                className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 transition-all duration-200 group-hover:scale-110 
                    ${isActive ? `text-[${colors.white}]` : `text-[${colors.darkGreenGray}] group-hover:text-[${colors.primaryGreen}]`}`
                }
              />
              <span 
                className={`text-[10px] sm:text-xs whitespace-nowrap font-medium transition-colors duration-200 
                    ${isActive ? `text-[${colors.white}]` : `text-[${colors.darkGreenGray}] group-hover:text-[${colors.primaryGreen}]`}`
                }
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
