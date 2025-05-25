'use client'; // Menandakan ini adalah Client Component karena menggunakan hook (usePathname)

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook untuk mendapatkan path URL saat ini

// Definisi Ikon SVG
const IconGlobe = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke={active ? "currentColor" : "gray"} className={`w-7 h-7 transition-all duration-200 ${active ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0 1 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-5.496A8.959 8.959 0 0 0 3 12c0 .778.099 1.533.284 2.253m0 0A11.978 11.978 0 0 0 12 16.5c2.998 0 5.74 1.1 7.843 2.918M3.284 9.753C3.099 10.467 3 11.222 3 12c0 2.953 1.102 5.698 2.918 7.843" />
  </svg>
);

const IconHome = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={active ? 0 : 1.5} stroke={active ? "currentColor" : "gray"} className={`w-7 h-7 transition-all duration-200 ${active ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const IconWindow = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke={active ? "currentColor" : "gray"} className={`w-7 h-7 transition-all duration-200 ${active ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
  </svg>
);

const IconList = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={active ? 2 : 1.5} stroke={active ? "currentColor" : "gray"} className={`w-7 h-7 transition-all duration-200 ${active ? 'text-indigo-600 scale-110' : 'text-gray-500'}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Urutan item navigasi sesuai permintaan pengguna
const navItems = [
  { href: "/", label: "home", icon: IconHome },
  { href: "/news", label: "news", icon: IconGlobe }, // Menggunakan IconGlobe untuk news
  { href: "/scanner", label: "scanner", icon: IconHome }, // Scanner menggunakan IconHome (sesuai permintaan)
  { href: "/chat", label: "chat", icon: IconWindow },
  { href: "/profile", label: "profile", icon: IconList },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-top-nav z-50 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center text-xs hover:bg-indigo-50 p-1 rounded-lg transition-all duration-200 flex-1 text-center group"
            >
              <item.icon active={isActive} />
              <span className={`mt-1 whitespace-nowrap ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-600 group-hover:text-indigo-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}