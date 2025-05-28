'use client';

import React, { SVGProps, useState, useEffect } from 'react';

// --- Definisi Warna Baru ---
const newColors = {
  primaryGreen: '#238B45',    // Aksi utama, sorotan, ikon utama
  lightGray: '#F0F2F0',       // Latar belakang input, beberapa area kartu
  ashGray: '#B7C1AC',         // Sempadan, teks sekunder, aksen halus
  darkGreenGray: '#4E6F5C',   // Teks utama, elemen lebih gelap
  white: '#FFFFFF',           // Teks pada latar belakang gelap, latar belakang utama kartu
  softBackground: '#E9EEEA',  // Latar belakang halaman utama
  // Warna tambahan untuk status dan aksen
  accentPositive: '#22C55E', // Hijau lebih cerah untuk gain
  accentNegative: '#EF4444', // Merah untuk loss
  notificationBadge: '#EF4444', // Merah untuk badge notifikasi
};

// --- Komponen Ikon (dari kode pengguna, warna akan disesuaikan) ---
const BellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
);

const ShoppingCartIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

const SlidersHorizontalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/></svg>
);

const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const BotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8V2h8v2h-4v4"/><rect width="16" height="12" x="4" y="10" rx="2"/><path d="M9 18h6"/><path d="M12 14v4"/></svg>
);

const LeafIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c4 0 8-3.58 8-8 0-4.42-3.58-8-8-8s-8 3.58-8 8c0 4.42 3.58 8 8 8z"/><path d="M12 15V6"/><path d="M12 9c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z"/></svg>
);

const OriginalGiftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 0 0 8.625 8.25H15.375A3.375 3.375 0 0 0 12 4.875Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.875v16.5M8.25 12h7.5" />
  </svg>
);

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const UserCircle2Icon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="10" r="3"/><path d="M12 2a10 10 0 0 0-6.32 17.9A10 10 0 0 0 12 22a10 10 0 0 0 6.32-2.1A10 10 0 0 0 12 2Z"/></svg>
);

const ChatBubbleOvalLeftEllipsisIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12 7.612 3.75 12.375 3.75 21 7.444 21 12Z" />
    </svg>
);

const ShareIcon = (props: SVGProps<SVGSVGElement>) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.19.303.217.636.217.962a2.25 2.25 0 0 1-4.5 0c0-.326.027-.66.217-.962m0 2.186L12 17.25m-4.783-4.157L12 8.25m0 0L16.783 13.093m-4.783-4.843L16.783 13.093" />
    </svg>
);

const LightBulbIcon = (props: SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.355a7.5 7.5 0 0 1-3 0m3-12.459A3.375 3.375 0 0 0 12 4.5c-.996 0-1.929.39-2.648 1.031A6.014 6.014 0 0 0 6.75 12.75c0 1.262.313 2.457.862 3.443M17.25 12.75c0-2.018-.996-3.873-2.648-5.031A3.375 3.375 0 0 0 12 4.5c.996 0 1.929.39 2.648 1.031A6.014 6.014 0 0 1 17.25 12.75c0 1.262-.313 2.457-.862 3.443" />
  </svg>
);

// Currency Formatter
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Simplified Bar Chart Component
interface SimpleBarChartProps {
  data: { label: string; value: number; color?: string }[];
  barColor?: string;
  height?: string;
}

const SimpleBarChart = ({ data, barColor = newColors.primaryGreen, height = "h-[200px]" }: SimpleBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className={`w-full ${height} p-3 flex items-end justify-around space-x-2`}>
      {data.map((item, index) => {
        const barHeightPercentage = maxValue > 0 ? (item.value / maxValue) * 90 : 0; 
        const itemBarColor = item.color || barColor;
        return (
          <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
            <div
              className="absolute -top-7 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                         bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-10">
              {item.label}: {item.value}
            </div>
            <div
              className="w-3/4 sm:w-2/3 rounded-t-md transition-all duration-300 ease-out group-hover:opacity-80"
              style={{ height: `${barHeightPercentage}%`, backgroundColor: itemBarColor }}
            />
            <div
              style={{ color: newColors.darkGreenGray }}
              className="mt-1.5 text-[10px] sm:text-xs text-center truncate w-full px-0.5"
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default function ModernGreenApp() {
  const [userData, setUserData] = useState({
    name: "Tegar",
    profileType: "Trading Pemula",
    avatarUrl: "https://placehold.co/100x100/E9EEEA/4E6F5C?text=BV", // Placeholder avatar
    totalInvestment: 147000000,
    investmentChange: 7000000,
    investmentChangePercent: 5,
    notificationsCount: 2,
    cartItemsCount: 1,
  });

  const newMenuItems = [
    { name: "education", icon: BotIcon, action: () => console.log("Education") },
    { name: "jurnal", icon: LeafIcon, action: () => console.log("jurnal") },
    { name: "Airdrop", icon: OriginalGiftIcon, action: () => console.log("Airdrop") },
  ];

  const [marketTrendData, setMarketTrendData] = useState([
    { label: "Jan", value: 65 }, { label: "Feb", value: 59 },
    { label: "Mar", value: 80 }, { label: "Apr", value: 81 },
    { label: "Mei", value: 56 }, { label: "Jun", value: 70 },
    { label: "Jul", value: 40 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTrendData(prevData =>
        prevData.map(item => ({
          ...item,
          value: Math.max(10, Math.min(100, item.value + Math.floor(Math.random() * 21) - 10))
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const analysisFeatures = [
    {
      title: "Analisis Sentimen Pasar",
      description: "Dapatkan wawasan dari berita dan sumber finansial untuk memahami sentimen pasar secara *real-time*.",
      icon: ChatBubbleOvalLeftEllipsisIcon,
      buttonText: "Lihat Analisis",
      action: () => console.log("Lihat Analisis Sentimen Pasar"),
    },
    {
      title: "Sentimen Media Sosial",
      description: "Pantau tren dan diskusi di media sosial untuk mengukur sentimen publik terhadap aset tertentu.",
      icon: ShareIcon,
      buttonText: "Jelajahi Sentimen",
      action: () => console.log("Jelajahi Sentimen Media Sosial"),
    },
    {
      title: "Notifikasi Cerdas",
      description: "Atur notifikasi khusus untuk pergerakan harga signifikan atau berita penting aset pilihan Anda.",
      icon: LightBulbIcon,
      buttonText: "Atur Notifikasi",
      action: () => console.log("Atur Notifikasi Cerdas"),
      buttonStyle: "secondary", 
    },
  ];


  return (
    <div style={{ backgroundColor: newColors.softBackground }} className="min-h-screen flex flex-col font-sans">
      {/* Header Section */}
      <header 
        className="relative text-white pt-6 pb-24 sm:pb-28 px-4 sm:px-6"
        style={{ backgroundColor: newColors.primaryGreen }}
      >
        {/* Decorative wave/gradient background (optional, can be adjusted) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 25%, ${newColors.darkGreenGray} 0%, transparent 50%),
              radial-gradient(circle at 85% 35%, ${newColors.darkGreenGray} 0%, transparent 60%)
            `,
            backgroundSize: '100% 100%', // Simpler background
          }}
        />
        <div className="container mx-auto relative z-10 max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              {userData.avatarUrl ? (
                <img src={userData.avatarUrl} alt={userData.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2" style={{borderColor: newColors.white}} />
              ) : (
                <UserCircle2Icon className="w-10 h-10 sm:w-12 sm:h-12" style={{color: newColors.white, opacity: 0.8}} />
              )}
              <div>
                <h1 className="text-lg sm:text-xl font-semibold leading-tight" style={{color: newColors.white}}>Hi, {userData.name}</h1>
                <p className="text-xs sm:text-sm" style={{color: newColors.ashGray}}>{userData.profileType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button className="relative p-1.5 rounded-full hover:bg-white/20 transition-colors">
                <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{color: newColors.white}}/>
                {userData.notificationsCount > 0 && (
                  <span style={{backgroundColor: newColors.notificationBadge}} className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full text-white font-bold">
                    {userData.notificationsCount}
                  </span>
                )}
              </button>
            
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center space-x-1.5 mb-1">
              <p className="text-sm sm:text-base" style={{color: newColors.lightGray, opacity: 0.9}}>Total Trading</p>
              <div className="relative group">
                <InfoIcon className="w-4 h-4 cursor-pointer" style={{color: newColors.ashGray}} />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Informasi Total Trading Jurnal anda
                </div>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold mb-0.5" style={{color: newColors.white}}>
              {currencyFormatter.format(userData.totalInvestment)}
            </p>
            <p className="text-sm sm:text-base font-medium" style={{ color: userData.investmentChange >= 0 ? newColors.accentPositive : newColors.accentNegative }}>
              {userData.investmentChange >= 0 ? '+' : ''}
              {currencyFormatter.format(userData.investmentChange)} ({userData.investmentChange >= 0 ? '+' : ''}{userData.investmentChangePercent}%)
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow -mt-16 sm:-mt-20 pb-8 px-3 sm:px-4 relative z-20">
        <div
          style={{ backgroundColor: newColors.white }}
          className="container mx-auto p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl flex flex-col space-y-6 sm:space-y-8 max-w-4xl"
        >
          {/* Search Bar */}
          <div className="relative">
            <input
              type="search"
              placeholder="Cari menu aplikasi jurnal,edu..."
              style={{ backgroundColor: newColors.lightGray, borderColor: newColors.ashGray, color: newColors.darkGreenGray }}
              className={`w-full p-3 sm:p-3.5 pl-10 sm:pl-12 rounded-lg border text-sm sm:text-base focus:ring-2 focus:border-transparent outline-none transition-shadow focus:ring-[${newColors.primaryGreen}]`}
            />
            <SearchIcon style={{ color: newColors.darkGreenGray, opacity: 0.7 }} className="w-5 h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* New Menu Items */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
            {newMenuItems.map((item) => (
              <button 
                key={item.name} 
                onClick={item.action} 
                className={`flex flex-col items-center justify-start p-2 sm:p-3 rounded-lg hover:bg-[${newColors.lightGray}] transition-colors group`}
              >
                <div 
                  style={{ backgroundColor: `${newColors.primaryGreen}20`}} // Opacity 20% untuk primaryGreen
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-2 group-hover:opacity-90 transition-opacity"
                >
                  <item.icon style={{ color: newColors.primaryGreen }} className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <p style={{ color: newColors.darkGreenGray }} className="text-xs sm:text-sm font-medium leading-tight">
                  {item.name}
                </p>
              </button>
            ))}
          </div>

          {/* Grafik Tren Pasar Terkini Section */}
          <section>
            <h2 style={{ color: newColors.darkGreenGray }} className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Grafik Tren Pasar Terkini
            </h2>
            <div
              style={{ borderColor: newColors.ashGray, backgroundColor: `${newColors.primaryGreen}0D` }} // Slight bg tint
              className="rounded-lg border p-2 sm:p-3"
            >
              <SimpleBarChart data={marketTrendData} barColor={newColors.primaryGreen} />
            </div>
          </section>

          {/* Analisis & Fitur Lainnya Section */}
          <section>
            <h2 style={{ color: newColors.darkGreenGray }} className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Analisis & Fitur Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {analysisFeatures.map((feature) => (
                <div
                  key={feature.title}
                  style={{ borderColor: newColors.ashGray, backgroundColor: newColors.white }}
                  className="rounded-lg border p-4 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="flex items-center mb-2.5">
                    <div
                      style={{ backgroundColor: `${newColors.primaryGreen}20` }}
                      className="w-9 h-9 rounded-full flex items-center justify-center mr-3"
                    >
                      <feature.icon style={{ color: newColors.primaryGreen }} className="w-5 h-5" />
                    </div>
                    <h3 style={{ color: newColors.darkGreenGray }} className="text-base font-semibold leading-tight">
                      {feature.title}
                    </h3>
                  </div>
                  <p style={{ color: newColors.ashGray }} className="text-xs sm:text-sm mb-3 flex-grow">
                    {feature.description}
                  </p>
                  <button
                    onClick={feature.action}
                    style={{
                      backgroundColor: feature.buttonStyle === 'secondary' ? newColors.lightGray : newColors.primaryGreen,
                      color: feature.buttonStyle === 'secondary' ? newColors.primaryGreen : newColors.white,
                      borderColor: feature.buttonStyle === 'secondary' ? newColors.primaryGreen : 'transparent',
                    }}
                    className={`text-xs sm:text-sm font-medium py-2.5 px-3.5 rounded-md shadow-sm hover:opacity-90 transition-opacity mt-auto w-full border ${feature.buttonStyle === 'secondary' ? 'border-current' : ''}`}
                  >
                    {feature.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
