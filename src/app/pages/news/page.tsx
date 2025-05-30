'use client';

import React, { SVGProps, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Image from 'next/image';

// --- KONFIGURASI WARNA (REMOVED - Using Tailwind theme) ---
// const colors = { ... };

// --- IKON (Will use currentColor or direct Tailwind classes) ---
const CalendarDaysIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

const ArrowRightIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
);

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const LoaderIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="animate-spin" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
);

const AlertTriangleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
  </svg>
);

// --- INTERFACE ARTIKEL BERITA ---
interface NewsArticle {
  id: string; // Akan digenerate di client
  title: string;
  snippet: string;
  imageUrl?: string; // Opsional karena Gemini mungkin tidak selalu memberikannya
  imageAlt?: string; // Opsional
  category: string;
  date?: string; // Opsional, format bisa bervariasi
  source: string;
  link: string;
}

const ALL_CATEGORIES = "Semua";
const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 jam dalam milidetik

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("berita keuangan dan teknologi terkini di Indonesia");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([ALL_CATEGORIES]);
  const [activeFilter, setActiveFilter] = useState<string>(ALL_CATEGORIES);
  const [lastFetchedQuery, setLastFetchedQuery] = useState<string>(searchQuery); // Menyimpan query terakhir yang berhasil di-fetch

  // Ref untuk interval agar bisa di-clear dengan benar
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fungsi untuk mengambil berita
  const fetchNews = useCallback(async (currentQuery: string, isAutoRefresh = false) => {
    if (!currentQuery.trim()) {
      if (!isAutoRefresh) { // Hanya set error jika bukan auto-refresh yang gagal karena query kosong
        setError("Masukkan topik berita yang ingin Anda cari.");
      }
      setNewsArticles([]);
      return;
    }
    
    if (!isAutoRefresh) {
        setIsLoading(true);
    } else {
        console.log(`Auto-refreshing news for query: ${currentQuery} at ${new Date().toLocaleTimeString()}`);
    }
    setError(null);
    if (!isAutoRefresh) {
        setNewsArticles([]);
    }
    setActiveFilter(ALL_CATEGORIES); 

    try {
      console.log(`Fetching news for query: ${currentQuery}`);
      const response = await fetch('/api/llm/gemini/new_scraping', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentQuery }),
      });

      if (!response.ok) {
        // Baca body sebagai teks terlebih dahulu, karena body hanya bisa dibaca sekali
        const errorText = await response.text();
        let errorPayload;
        try {
          // Coba parse teks tersebut sebagai JSON
          errorPayload = JSON.parse(errorText);
        } catch {
          // Jika parsing JSON gagal, berarti respons error bukan JSON
          console.error("API Error Response (Non-JSON):", response.status, errorText);
          errorPayload = { 
            error: `Server mengembalikan respons non-JSON (Status: ${response.status}). Isi respons: ${errorText.substring(0, 200)}${errorText.length > 200 ? '...' : ''}`, 
            details: errorText 
          };
        }
        console.error("API Error Response Object:", errorPayload); // Potential source
        const message = errorPayload?.error || `Gagal mengambil berita. Status: ${response.status}`;
        throw new Error(message);
      }

      // Jika response.ok, kita bisa langsung mem-parse sebagai JSON
      const data: Omit<NewsArticle, 'id'>[] = await response.json();
      
      if (!Array.isArray(data)) {
        console.error("Data from API is not an array:", data); // Potential source
        throw new Error("Format data berita tidak sesuai dari API.");
      }
      console.log("News data received from API:", data);

      const articlesWithIds: NewsArticle[] = data.map(article => ({
        ...article,
        id: crypto.randomUUID(), 
        imageAlt: article.imageAlt || article.title, 
        imageUrl: article.imageUrl || undefined,
        date: article.date || undefined,
      }));

      setNewsArticles(articlesWithIds); 
      setLastFetchedQuery(currentQuery); 

      const categories = new Set<string>([ALL_CATEGORIES]);
      articlesWithIds.forEach(article => {
        if (article.category && typeof article.category === 'string') {
            categories.add(article.category);
        }
      });
      setAvailableCategories(Array.from(categories).sort());

    } catch (err: unknown) {
      console.error("Error fetching news in component:", err);
      const message = err instanceof Error ? err.message : String(err);
      if (!isAutoRefresh) { 
          setError(message || "Terjadi kesalahan saat mengambil berita.");
      } else {
          console.warn("Auto-refresh failed silently:", message);
      }
      if (!isAutoRefresh) {
          setNewsArticles([]);
      }
    } finally {
      if (!isAutoRefresh) {
          setIsLoading(false);
      }
    }
  }, []);

  // Fetch berita saat komponen pertama kali dimuat
  useEffect(() => {
    fetchNews(searchQuery);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Hanya sekali saat mount

  // useEffect untuk auto-refresh setiap 6 jam
  useEffect(() => {
    const autoRefreshNews = () => {
      console.log("Attempting auto-refresh using last fetched query:", lastFetchedQuery);
      if (lastFetchedQuery.trim()) { 
        fetchNews(lastFetchedQuery, true); 
      } else {
        console.log("Skipping auto-refresh: No valid last fetched query.");
      }
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(autoRefreshNews, REFRESH_INTERVAL);
    console.log(`News auto-refresh interval set for every ${REFRESH_INTERVAL / (60*1000)} minutes.`);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("News auto-refresh interval cleared.");
      }
    };
  }, [fetchNews, lastFetchedQuery]); 

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchNews(searchQuery); 
  };

  const filteredNews = useMemo(() => {
    if (activeFilter === ALL_CATEGORIES) {
      return newsArticles;
    }
    return newsArticles.filter(article => article.category === activeFilter);
  }, [newsArticles, activeFilter]);

  return (
    <div className="min-h-screen p-4 pt-8 sm:p-6 lg:p-8 font-sans bg-background text-foreground">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight text-foreground">
            Berita Keuangan & Teknologi Terkini <span className="text-primary">by Gemini AI</span>
          </h1>
          <p className="text-md sm:text-lg text-muted-foreground opacity-80">
            Dapatkan wawasan terbaru dari dunia finansial dan inovasi teknologi, ditenagai oleh AI.
          </p>
        </header>

        <form onSubmit={handleSearchSubmit} className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center border border-border rounded-lg shadow-sm overflow-hidden bg-card">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik berita (mis: 'saham teknologi Indonesia')..."
              className="w-full p-3 text-sm sm:text-base text-foreground bg-transparent focus:outline-none placeholder-muted-foreground"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-medium transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground hover:opacity-90`}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderIcon className="w-5 h-5" />
              ) : (
                <SearchIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {newsArticles.length > 0 && !isLoading && (
            <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
                {availableCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary 
                                    ${activeFilter === category ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:bg-neutral-700/60'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
        )}

        {isLoading && ( 
          <div className="text-center py-10">
            <LoaderIcon className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="text-lg text-muted-foreground">Sedang mengambil berita terbaru...</p>
          </div>
        )}

        {error && !isLoading && ( 
          <div 
            className="max-w-xl mx-auto p-4 rounded-lg border flex items-center space-x-3 bg-red-900/30 border-red-500 text-red-400"
          >
            <AlertTriangleIcon className="w-8 h-8 flex-shrink-0"/>
            <div>
                <p className="font-semibold">Oops, terjadi kesalahan!</p>
                <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isLoading && !error && filteredNews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="bg-card border-border rounded-xl border overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col group"
              >
                <div className="relative w-full h-48 sm:h-56 overflow-hidden">
                  {news.imageUrl && (
                    <div className="relative w-full h-48 sm:h-56">
                      <Image 
                        src={news.imageUrl} 
                        alt={news.imageAlt || news.title} 
                        layout="fill" 
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  {news.category && (
                    <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-primary/80 backdrop-blur-sm"
                    >
                        <p className="text-xs font-semibold text-primary-foreground">{news.category}</p>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <h2 className="text-lg sm:text-xl font-semibold mb-2 leading-tight text-foreground">
                    {news.title}
                  </h2>
                  <p className="text-sm text-muted-foreground opacity-80 mb-4 flex-grow">
                    {news.snippet}
                  </p>

                  <div className="flex items-center justify-between text-xs sm:text-sm mb-4 text-muted-foreground">
                      <div className="flex items-center">
                          <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                          <span>{news.date || "Tanggal tidak tersedia"}</span>
                      </div>
                      <span className="font-medium truncate max-w-[100px] sm:max-w-[150px] text-muted-foreground/70" title={news.source}>{news.source}</span>
                  </div>

                  <a
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center w-full sm:w-auto self-start px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all duration-200 group bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background`}
                  >
                    Baca Selengkapnya
                    <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
        
        {!isLoading && !error && newsArticles.length === 0 && lastFetchedQuery && (
             <div className="text-center py-10">
                <SearchIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-foreground">
                    Tidak ada berita yang ditemukan untuk &quot;<span className="font-semibold">{lastFetchedQuery}</span>&quot;.
                </p>
                <p className="text-sm mt-1 text-muted-foreground">
                    Coba gunakan kata kunci lain atau topik yang lebih umum.
                </p>
            </div>
        )}
        
        {!isLoading && !error && newsArticles.length === 0 && !lastFetchedQuery.trim() && !searchQuery.trim() && (
             <div className="text-center py-10">
                <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <p className="text-lg text-foreground">
                    Silakan masukkan topik berita untuk memulai pencarian.
                </p>
            </div>
        )}

        {filteredNews.length > 0 && (
            <div className="mt-10 sm:mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-neutral-700/60 transition-colors disabled:opacity-50`} disabled>
                    Sebelumnya
                </button>
                <button aria-current="page" className={`relative z-10 inline-flex items-center px-4 py-2 border border-primary bg-primary/20 text-sm font-medium text-primary`}>
                    1
                </button>
                <button className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-neutral-700/60 transition-colors disabled:opacity-50`} disabled>
                    Berikutnya
                </button>
            </nav>
            </div>
        )}
      </div>
    </div>
  );
}
