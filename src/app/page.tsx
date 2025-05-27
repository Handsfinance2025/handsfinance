'use client';

import { SVGProps, useState, useEffect } from 'react';

// Define the color palette for easy reference
const colors = {
  primaryGreen: '#238B45', // Main actions, highlights, icons
  lightGray: '#F0F2F0',    // Page background, card backgrounds
  ashGray: '#B7C1AC',      // Borders, secondary text, subtle accents
  darkGreenGray: '#4E6F5C',// Primary text, darker elements, header background
  white: '#FFFFFF',        // Text on dark backgrounds, card content background
  softBackground: '#E9EEEA', // Slightly off-white for main content area
  chartBarColor: '#34D399', // A vibrant green for chart bars (example)
  chartBarAccent: '#10B981', // A darker accent for 3D effect
};

// Placeholder Icons (Ideally, use a library like Lucide React or Heroicons)
const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const BookOpenIcon = (props: SVGProps<SVGSVGElement>) => ( // Edukasi
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const ChartBarIcon = (props: SVGProps<SVGSVGElement>) => ( // Candlestik / Grafik
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const LightBulbIcon = (props: SVGProps<SVGSVGElement>) => ( // Metode
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.355a7.5 7.5 0 0 1-3 0m3-12.459A3.375 3.375 0 0 0 12 4.5c-.996 0-1.929.39-2.648 1.031A6.014 6.014 0 0 0 6.75 12.75c0 1.262.313 2.457.862 3.443M17.25 12.75c0-2.018-.996-3.873-2.648-5.031A3.375 3.375 0 0 0 12 4.5c.996 0 1.929.39 2.648 1.031A6.014 6.014 0 0 1 17.25 12.75c0 1.262-.313 2.457-.862 3.443" />
  </svg>
);

const GiftIcon = (props: SVGProps<SVGSVGElement>) => ( // Reward
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 0 0 8.625 8.25H15.375A3.375 3.375 0 0 0 12 4.875Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.875v16.5M8.25 12h7.5" />
  </svg>
);

const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

// Icon for Sentiment Analysis
const ChatBubbleOvalLeftEllipsisIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-3.862 8.25-8.625 8.25S3.75 16.556 3.75 12 7.612 3.75 12.375 3.75 21 7.444 21 12Z" />
    </svg>
);

// Icon for Social Media
const ShareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.19.303.217.636.217.962a2.25 2.25 0 0 1-4.5 0c0-.326.027-.66.217-.962m0 2.186L12 17.25m-4.783-4.157L12 8.25m0 0L16.783 13.093m-4.783-4.843L16.783 13.093" />
    </svg>
);

// Modern 3D-like Bar Chart Component
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  barColor?: string;
  barAccentColor?: string;
}

const Modern3DBarChart = ({ data, barColor = colors.chartBarColor, barAccentColor = colors.chartBarAccent }: BarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value), 0); // Ensure maxValue is at least 0

  // Perspective effect for the container
  return (
    <div className="w-full h-full p-4 sm:p-6 flex flex-col items-center justify-around [perspective:1000px]">
      <div className="flex justify-around items-end w-full h-[250px] sm:h-[300px] space-x-2 sm:space-x-3 md:space-x-4">
        {data.map((item, index) => {
          const barHeightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const itemBarColor = item.color || barColor;
          // Calculate a slightly darker shade for the 3D effect
          // This is a simple way; a proper library might handle this better or you could use CSS filters
          const itemAccentColor = barAccentColor;


          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              {/* Value Tooltip */}
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                           bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-10">
                {item.label}: {item.value}
              </div>
              {/* 3D Bar */}
              <div
                className="w-full rounded-t-md relative transition-all duration-500 ease-out group-hover:shadow-2xl"
                style={{ height: `${barHeightPercentage}%` }}
              >
                {/* Main face of the bar */}
                <div
                  className="absolute inset-0 rounded-t-md"
                  style={{ backgroundColor: itemBarColor, transform: 'translateZ(10px)' }} // Pulls the main face forward
                />
                {/* Top face of the bar - creates depth */}
                <div
                  className="absolute -top-2 left-0 w-full h-2 rounded-t-sm" // Adjusted for better visual
                  style={{ backgroundColor: itemAccentColor, transform: 'skewX(-30deg) translateX(3px) translateY(-1px)' }} // Skew and position for 3D top
                />
                {/* Side face of the bar - creates depth */}
                <div
                  className="absolute top-0 -right-2 w-2 h-full rounded-tr-sm" // Adjusted for better visual
                  style={{ backgroundColor: itemAccentColor, transform: 'skewY(-30deg) translateY(3px) translateX(1px)' }} // Skew and position for 3D side
                />
              </div>
              {/* Label */}
              <div
                style={{ color: colors.darkGreenGray }}
                className="mt-2 text-xs sm:text-sm text-center truncate w-full px-1 group-hover:font-semibold"
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm mr-2" style={{backgroundColor: barColor}}></div>
          <span className="text-xs" style={{color: colors.darkGreenGray}}>Data Series 1</span>
        </div>
        {/* Add more legend items if needed */}
      </div>
    </div>
  );
};


export default function HomePage() {
  const menuItems = [
    { name: "Edukasi", icon: BookOpenIcon, description: "Pelajari dasar-dasar dan strategi lanjutan." },
    { name: "Candlestik", icon: ChartBarIcon, description: "Pahami pola untuk analisis teknikal." },
    { name: "Metode", icon: LightBulbIcon, description: "Temukan berbagai metode trading." },
    { name: "Reward", icon: GiftIcon, description: "Dapatkan hadiah dan insentif menarik." },
  ];

  // Sample data for the chart
  const [marketTrendData, setMarketTrendData] = useState([
    { label: "Jan", value: 65, color: '#4CAF50' },
    { label: "Feb", value: 59, color: '#8BC34A' },
    { label: "Mar", value: 80, color: '#CDDC39' },
    { label: "Apr", value: 81, color: '#FFEB3B' },
    { label: "Mei", value: 56, color: '#FFC107' },
    { label: "Jun", value: 70, color: '#FF9800' },
    { label: "Jul", value: 40, color: '#F44336' },
  ]);

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: "Pengguna Demo",
    portfolioJournal: "Jurnal Trading A",
    tradingRisk: "Medium",
    tradingType: "Swing Trader"
  });


  // Simulate data update for dynamic effect (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketTrendData(prevData =>
        prevData.map(item => ({
          ...item,
          value: Math.max(10, Math.min(100, item.value + Math.floor(Math.random() * 21) - 10)) // Random walk between 10-100
        }))
      );
    }, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);


  return (
    <div style={{ backgroundColor: colors.lightGray }} className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header style={{ backgroundColor: colors.darkGreenGray }} className="p-4 sm:p-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 style={{ color: colors.lightGray }} className="text-2xl sm:text-3xl font-bold tracking-tight">
            Hands
          </h1>
          {/* Placeholder for other header elements if needed, e.g., user avatar, notifications */}
        </div>
      </header>

      {/* Konten Utama */}
      <main style={{ backgroundColor: colors.softBackground }} className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          {/* User Info Section */}
          <section className="mb-6 p-4 rounded-xl shadow-md" style={{backgroundColor: colors.white, borderColor: colors.ashGray}}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-semibold" style={{color: colors.darkGreenGray}}>Nama: </span>
                <span style={{color: colors.primaryGreen}}>{userDetails.name}</span>
              </div>
              <div>
                <span className="font-semibold" style={{color: colors.darkGreenGray}}>Portofolio (Jurnal): </span>
                <span style={{color: colors.primaryGreen}}>{userDetails.portfolioJournal}</span>
              </div>
              <div>
                <span className="font-semibold" style={{color: colors.darkGreenGray}}>Resiko Trading: </span>
                <span style={{color: colors.primaryGreen}}>{userDetails.tradingRisk}</span>
              </div>
              <div>
                <span className="font-semibold" style={{color: colors.darkGreenGray}}>Tipe Trading: </span>
                <span style={{color: colors.primaryGreen}}>{userDetails.tradingType}</span>
              </div>
            </div>
          </section>

          {/* Search Bar Section */}
          <section className="mb-8 sm:mb-12">
            <div className="relative w-full md:w-2/3 lg:w-1/2 mx-auto">
              <input
                type="search"
                placeholder="Cari fitur, materi, atau pasar..."
                style={{
                  backgroundColor: colors.white, // Changed to white for better contrast on softBackground
                  borderColor: colors.ashGray,
                  color: colors.darkGreenGray,
                }}
                className={`w-full p-3 pl-10 rounded-lg border text-sm focus:ring-2 focus:ring-[${colors.primaryGreen}] focus:border-[${colors.primaryGreen}] outline-none transition-shadow shadow-sm`}
              />
              <SearchIcon style={{ color: colors.primaryGreen }} className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </section>


          {/* Bagian Menu Utama */}
          <section className="mb-8 sm:mb-12">
            <h2 style={{ color: colors.darkGreenGray }} className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Menu Utama
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  style={{ backgroundColor: colors.white, borderColor: colors.ashGray }}
                  className="rounded-xl border p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <item.icon style={{ color: colors.primaryGreen }} className="w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110" />
                    <ChevronRightIcon style={{color: colors.ashGray}} className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[${colors.primaryGreen}]`} />
                  </div>
                  <h3 style={{ color: colors.darkGreenGray }} className={`text-md sm:text-lg font-semibold mb-1 group-hover:text-[${colors.primaryGreen}] transition-colors`}>
                    {item.name}
                  </h3>
                  <p style={{ color: colors.darkGreenGray }} className="text-xs sm:text-sm text-opacity-70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Bagian Grafik Tren Pasar */}
          <section className="mb-8 sm:mb-12">
            <h2 style={{ color: colors.darkGreenGray }} className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Grafik Tren Pasar Terkini
            </h2>
            <div
              style={{ backgroundColor: colors.white, borderColor: colors.ashGray }}
              className="rounded-xl border p-2 sm:p-4 shadow-lg min-h-[350px] sm:min-h-[450px] flex flex-col justify-center items-center overflow-hidden"
            >
              <Modern3DBarChart data={marketTrendData} barColor={colors.primaryGreen} barAccentColor={colors.darkGreenGray} />
            </div>
          </section>

          {/* Bagian Analisis & Fitur Lainnya */}
          <section>
            <h2 style={{ color: colors.darkGreenGray }} className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
              Analisis & Fitur Lainnya
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Kartu Analisis Sentimen Pasar */}
              <div style={{ backgroundColor: colors.white, borderColor: colors.ashGray }} className="rounded-xl border p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="flex items-center mb-3">
                    <ChatBubbleOvalLeftEllipsisIcon style={{color: colors.primaryGreen}} className="w-7 h-7 mr-3"/>
                    <h3 style={{ color: colors.darkGreenGray }} className="text-md sm:text-lg font-semibold">Analisis Sentimen Pasar</h3>
                </div>
                <p style={{ color: colors.darkGreenGray }} className="text-xs sm:text-sm text-opacity-70 mb-3 flex-grow">
                  Dapatkan wawasan dari berita dan sumber finansial untuk memahami sentimen pasar secara *real-time*.
                </p>
                <button
                  style={{ backgroundColor: colors.primaryGreen, color: colors.white}}
                  className="text-xs sm:text-sm font-medium py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity mt-auto w-full sm:w-auto"
                >
                  Lihat Analisis
                </button>
              </div>

              {/* Kartu Analisis Sentimen Media Sosial */}
              <div style={{ backgroundColor: colors.white, borderColor: colors.ashGray }} className="rounded-xl border p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="flex items-center mb-3">
                    <ShareIcon style={{color: colors.primaryGreen}} className="w-7 h-7 mr-3"/>
                    <h3 style={{ color: colors.darkGreenGray }} className="text-md sm:text-lg font-semibold">Sentimen Media Sosial</h3>
                </div>
                <p style={{ color: colors.darkGreenGray }} className="text-xs sm:text-sm text-opacity-70 mb-3 flex-grow">
                  Pantau tren dan diskusi di media sosial untuk mengukur sentimen publik terhadap aset tertentu.
                </p>
                  <button
                  style={{ backgroundColor: colors.primaryGreen, color: colors.white}}
                  className="text-xs sm:text-sm font-medium py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity mt-auto w-full sm:w-auto"
                >
                  Jelajahi Sentimen
                </button>
              </div>

              {/* Kartu Notifikasi Harga Cerdas */}
              <div style={{ backgroundColor: colors.white, borderColor: colors.ashGray }} className="rounded-xl border p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                  <div className="flex items-center mb-3">
                    <LightBulbIcon style={{color: colors.primaryGreen}} className="w-7 h-7 mr-3"/> {/* Menggunakan ikon Metode sebagai placeholder */}
                    <h3 style={{ color: colors.darkGreenGray }} className="text-md sm:text-lg font-semibold">Notifikasi Cerdas</h3>
                </div>
                <p style={{ color: colors.darkGreenGray }} className="text-xs sm:text-sm text-opacity-70 mb-3 flex-grow">
                  Atur notifikasi khusus untuk pergerakan harga signifikan atau berita penting aset pilihan Anda.
                </p>
                  <button
                  style={{ backgroundColor: colors.ashGray, color: colors.darkGreenGray}}
                  className="text-xs sm:text-sm font-medium py-2 px-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity mt-auto w-full sm:w-auto"
                >
                  Atur Notifikasi
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
