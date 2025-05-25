'use client';

import { SVGProps } from 'react';

// Define the color palette for easy reference
const colors = {
  primaryGreen: '#238B45', // Main actions, highlights, tags
  lightGray: '#F0F2F0',    // Page background, card backgrounds
  ashGray: '#B7C1AC',      // Borders, secondary text, subtle accents
  darkGreenGray: '#4E6F5C',// Primary text, darker elements
  white: '#FFFFFF',        // Text on dark backgrounds, card content background
  softBackground: '#E9EEEA', // Slightly off-white for main content area
};

// Placeholder Icons
const CalendarDaysIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const TagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

interface NewsArticle {
  id: string;
  title: string;
  snippet: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  date: string;
  source: string;
  link: string;
}

const mockNewsData: NewsArticle[] = [
  {
    id: '1',
    title: "Analisis Mendalam Pasar Saham Global Minggu Ini",
    snippet: "Pasar saham global menunjukkan volatilitas minggu ini di tengah berita suku bunga dan inflasi. Investor disarankan untuk tetap waspada dan melakukan diversifikasi portofolio.",
    imageUrl: "https://placehold.co/600x400/4E6F5C/F0F2F0?text=Pasar+Saham&font=inter",
    imageAlt: "Grafik pasar saham",
    category: "Analisis Pasar",
    date: "25 Mei 2025",
    source: "Reuters Finance",
    link: "#"
  },
  {
    id: '2',
    title: "Teknologi Blockchain Merevolusi Sektor Keuangan Tradisional",
    snippet: "Inovasi blockchain terus mendorong perubahan signifikan dalam layanan keuangan, mulai dari pembayaran lintas batas hingga manajemen aset digital.",
    imageUrl: "https://placehold.co/600x400/238B45/FFFFFF?text=Blockchain&font=inter",
    imageAlt: "Ilustrasi Blockchain",
    category: "Teknologi Finansial",
    date: "24 Mei 2025",
    source: "CoinDesk",
    link: "#"
  },
  {
    id: '3',
    title: "Tips Investasi Jangka Panjang untuk Generasi Milenial",
    snippet: "Bagaimana generasi milenial dapat membangun kekayaan melalui strategi investasi jangka panjang yang cerdas dan terukur di tengah ketidakpastian ekonomi.",
    imageUrl: "https://placehold.co/600x400/B7C1AC/4E6F5C?text=Investasi+Milenial&font=inter",
    imageAlt: "Anak muda sedang berinvestasi",
    category: "Investasi",
    date: "23 Mei 2025",
    source: "Investopedia",
    link: "#"
  },
   {
    id: '4',
    title: "Bank Sentral Pertimbangkan Kenaikan Suku Bunga Lanjutan",
    snippet: "Beberapa bank sentral utama dunia mengisyaratkan kemungkinan kenaikan suku bunga lebih lanjut untuk menekan laju inflasi yang masih tinggi.",
    imageUrl: "https://placehold.co/600x400/4E6F5C/FFFFFF?text=Suku+Bunga&font=inter",
    imageAlt: "Gedung bank sentral",
    category: "Ekonomi Makro",
    date: "22 Mei 2025",
    source: "Bloomberg",
    link: "#"
  },
  {
    id: '5',
    title: "Perkembangan Terbaru Regulasi Aset Kripto di Asia Tenggara",
    snippet: "Negara-negara di Asia Tenggara terus berupaya merumuskan kerangka regulasi yang komprehensif untuk pasar aset kripto yang berkembang pesat.",
    imageUrl: "https://placehold.co/600x400/238B45/F0F2F0?text=Regulasi+Kripto&font=inter",
    imageAlt: "Simbol regulasi dan kripto",
    category: "Regulasi",
    date: "21 Mei 2025",
    source: "CryptoNews",
    link: "#"
  },
];

export default function NewsPage() {
  return (
    <div style={{ backgroundColor: colors.softBackground }} className="min-h-screen p-4 pt-8 sm:p-6 lg:p-8 font-sans">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 style={{ color: colors.darkGreenGray }} className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            Berita Keuangan & Teknologi Terkini
          </h1>
          <p style={{ color: colors.darkGreenGray }} className="text-md sm:text-lg text-opacity-80">
            Dapatkan wawasan terbaru dari dunia finansial dan inovasi teknologi.
          </p>
        </header>

        {/* Filter Section (Optional - Placeholder) */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
            {["Semua", "Analisis Pasar", "Teknologi Finansial", "Investasi", "Ekonomi Makro", "Regulasi"].map(filter => (
                <button 
                    key={filter}
                    style={{
                        backgroundColor: filter === "Semua" ? colors.primaryGreen : colors.white,
                        color: filter === "Semua" ? colors.white : colors.darkGreenGray,
                        borderColor: filter === "Semua" ? colors.primaryGreen : colors.ashGray,
                    }}
                    className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[${colors.primaryGreen}]"
                >
                    {filter}
                </button>
            ))}
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {mockNewsData.map((news) => (
            <article
              key={news.id}
              style={{ backgroundColor: colors.white, borderColor: colors.ashGray }}
              className="rounded-xl border overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                <img
                  src={news.imageUrl}
                  alt={news.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/969696?text=Image+Error&font=inter")}
                />
                <div 
                    style={{backgroundColor: `rgba(35, 139, 69, 0.85)`, backdropFilter: 'blur(2px)'}} // primaryGreen with opacity
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-md"
                >
                    <p className="text-xs font-semibold text-white">{news.category}</p>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col flex-grow">
                <h2 style={{ color: colors.darkGreenGray }} className="text-lg sm:text-xl font-semibold mb-2 leading-tight">
                  {news.title}
                </h2>
                <p style={{ color: colors.darkGreenGray }} className="text-sm text-opacity-80 mb-4 flex-grow">
                  {news.snippet}
                </p>

                <div className="flex items-center justify-between text-xs sm:text-sm mb-4" style={{color: colors.ashGray}}>
                    <div className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                        <span>{news.date}</span>
                    </div>
                    <span className="font-medium" style={{color: colors.darkGreenGray, opacity: 0.7}}>{news.source}</span>
                </div>

                <a
                  href={news.link}
                  style={{ backgroundColor: colors.primaryGreen, color: colors.white }}
                  className="inline-flex items-center justify-center w-full sm:w-auto self-start px-5 py-2.5 rounded-lg text-sm font-medium shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primaryGreen}] transition-all duration-200 group"
                >
                  Baca Selengkapnya
                  <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
         {/* Pagination (Placeholder) */}
        <div className="mt-10 sm:mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-[${colors.ashGray}] bg-white text-sm font-medium text-[${colors.darkGreenGray}] hover:bg-[${colors.lightGray}] transition-colors">
                    Sebelumnya
                </a>
                <a href="#" aria-current="page" className="relative z-10 inline-flex items-center px-4 py-2 border border-[${colors.primaryGreen}] bg-[${colors.softBackground}] text-sm font-medium text-[${colors.primaryGreen}]">
                    1
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-[${colors.ashGray}] bg-white text-sm font-medium text-[${colors.darkGreenGray}] hover:bg-[${colors.lightGray}] transition-colors">
                    2
                </a>
                <a href="#" className="relative hidden md:inline-flex items-center px-4 py-2 border border-[${colors.ashGray}] bg-white text-sm font-medium text-[${colors.darkGreenGray}] hover:bg-[${colors.lightGray}] transition-colors">
                    3
                </a>
                <span className="relative inline-flex items-center px-4 py-2 border border-[${colors.ashGray}] bg-white text-sm font-medium text-gray-700">
                    ...
                </span>
                <a href="#" className="relative hidden md:inline-flex items-center px-4 py-2 border border-[${colors.ashGray}] bg-white text-sm font-medium text-[${colors.darkGreenGray}] hover:bg-[${colors.lightGray}] transition-colors">
                    8
                </a>
                <a href="#" className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-[${colors.ashGray}] bg-white text-sm font-medium text-[${colors.darkGreenGray}] hover:bg-[${colors.lightGray}] transition-colors">
                    Berikutnya
                </a>
            </nav>
        </div>
      </div>
    </div>
  );
}
