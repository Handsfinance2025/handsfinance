'use client'; // Pastikan ini ada jika Anda menggunakan hook React seperti useState, useEffect

import Image from 'next/image'; // Contoh import yang mungkin sudah ada
import { useState, useEffect, useCallback, useRef } from 'react'; // Tambahkan useRef jika Anda menggunakan ref untuk kamera

// Jika Anda menggunakan pustaka kamera, import di sini
// import Webcam from 'react-webcam'; // Contoh

// --- AWAL PENAMBAHAN KODE UNTUK MONETAG & PEMINDAIAN --- 

// Sebaiknya deklarasi global ini ada di file .d.ts terpisah (misalnya, monetag.d.ts atau global.d.ts)
// agar tidak perlu diulang di setiap file.
// Contoh: src/types/monetag.d.ts
// declare global {
//   interface Window {
//     monetag?: {
//       rewarded?: {
//         showAd: (zoneId: number) => void;
//         on: (event: string, callback: (...args: any[]) => void) => void;
//         off: (event: string, callback: (...args: any[]) => void) => void;
//       };
//       // Tambahkan definisi lain sesuai kebutuhan SDK Monetag Anda
//     };
//     // Untuk kasus data-sdk='show_ZONEID'
//     [key: `show_${string}`]: (() => void) | undefined;
//   }
// }

// GANTI DENGAN ID ZONA POP-UP REWARD ANDA YANG SEBENARNYA DARI MONETAG
const MONETAG_REWARDED_POPUP_ZONE_ID = 1234567; // <--- GANTI INI

// --- AKHIR PENAMBAHAN KODE UNTUK MONETAG & PEMINDAIAN ---

export default function HomePage() {
  // ... state dan logika yang sudah ada di HomePage Anda ...
  // Contoh: const [someExistingState, setSomeExistingState] = useState('');

  // --- AWAL PENAMBAHAN STATE DAN FUNGSI UNTUK FITUR BARU ---
  const [isMonetagSdkReady, setIsMonetagSdkReady] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Untuk pesan ke pengguna

  // Ref untuk komponen kamera jika diperlukan
  // const webcamRef = useRef<Webcam>(null); // Contoh jika menggunakan react-webcam

  useEffect(() => {
    // Memeriksa apakah SDK Monetag sudah siap
    const checkSdkInterval = setInterval(() => {
      // Cek berdasarkan cara SDK Anda diekspos: window.monetag atau window.show_ZONEID
      const sdkGlobalObject = window.monetag;
      const sdkSpecificFunction = window[`show_${MONETAG_REWARDED_POPUP_ZONE_ID}` as keyof Window];

      if (sdkGlobalObject || typeof sdkSpecificFunction === 'function') {
        console.log('Monetag SDK is ready on HomePage.');
        setIsMonetagSdkReady(true);
        clearInterval(checkSdkInterval); // Hentikan pengecekan jika sudah siap
      } else {
        console.log('Monetag SDK not yet ready on HomePage, waiting...');
      }
    }, 1000); // Cek setiap 1 detik

    return () => clearInterval(checkSdkInterval); // Cleanup interval saat komponen unmount
  }, []);

  const showRewardedPopupAd = useCallback(() => {
    if (!isMonetagSdkReady) {
      console.warn('Monetag SDK not ready. Cannot show popup ad.');
      setFeedbackMessage('SDK Iklan belum siap. Silakan coba lagi sesaat.');
      return;
    }

    console.log('Attempting to show Monetag rewarded popup ad...');
    setFeedbackMessage('Memuat iklan pop-up...');

    // Panggil fungsi iklan Monetag sesuai dokumentasi Anda
    // Opsi 1: Menggunakan fungsi global spesifik zona (jika ada dari data-sdk)
    const specificZoneFunction = window[`show_${MONETAG_REWARDED_POPUP_ZONE_ID}` as keyof Window] as (() => void) | undefined;
    if (typeof specificZoneFunction === 'function') {
      try {
        specificZoneFunction();
      } catch (error) {
        console.error('Error calling specific Monetag zone function:', error);
        setFeedbackMessage('Gagal menampilkan iklan pop-up (err SF).');
      }
    } 
    // Opsi 2: Menggunakan objek monetag global
    else if (window.monetag && window.monetag.rewarded && typeof window.monetag.rewarded.showAd === 'function') {
      try {
        window.monetag.rewarded.showAd(MONETAG_REWARDED_POPUP_ZONE_ID);
      } catch (error) {
        console.error('Error calling Monetag.rewarded.showAd:', error);
        setFeedbackMessage('Gagal menampilkan iklan pop-up (err GA).');
      }
    } else {
      console.error('Monetag SDK function to show popup ad is not available.');
      setFeedbackMessage('Fungsi untuk menampilkan iklan pop-up tidak ditemukan.');
    }
  }, [isMonetagSdkReady]);

  // Fungsi ini akan Anda panggil dari logika pemindaian kamera Anda
  const handleCameraScanSuccess = useCallback(() => {
    console.log('Camera scan successful! Triggering Monetag popup ad.');
    setFeedbackMessage('Pemindaian berhasil! Menampilkan hadiah...');
    showRewardedPopupAd();
    // Di sini Anda juga bisa menambahkan logika untuk memberikan reward aktual kepada pengguna
    // setelah mereka berinteraksi dengan iklan (membutuhkan event listener Monetag)
  }, [showRewardedPopupAd]);

  // --- IMPLEMENTASIKAN LOGIKA PEMINDAIAN KAMERA ANDA DI SINI ---
  // Contoh simulasi sederhana:
  const simulateCameraScanAndTriggerAd = () => {
    if (!isMonetagSdkReady) {
      setFeedbackMessage('SDK Iklan belum siap untuk memulai pemindaian.');
      return;
    }
    setFeedbackMessage('Memulai simulasi pemindaian kamera...');
    // TODO: Ganti ini dengan logika pemindaian kamera Anda yang sebenarnya.
    // Misalnya, aktifkan kamera, tunggu pengguna memindai sesuatu.
    // Setelah pemindaian berhasil:
    setTimeout(() => { // Simulasi penundaan untuk pemindaian
      console.log('Simulated camera scan successful.');
      handleCameraScanSuccess(); 
    }, 2000); // Anggap pemindaian butuh 2 detik
  };
  // --- AKHIR IMPLEMENTASI LOGIKA PEMINDAIAN KAMERA ---

  // --- AKHIR PENAMBAHAN STATE DAN FUNGSI UNTUK FITUR BARU ---

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* ... JSX Anda yang sudah ada di sini ... */}
      {/* Contoh: <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">...</div> */}

      {/* --- AWAL PENAMBAHAN JSX UNTUK FITUR BARU --- */}
      <div className="my-10 p-6 bg-gray-800 rounded-lg shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-sky-400">Pindai dengan Kamera & Dapatkan Reward!</h2>
        
        {/* Tempatkan komponen kamera Anda di sini jika perlu ditampilkan */}
        {/* Contoh: <Webcam ref={webcamRef} className="w-full rounded mb-4" /> */}

        <button
          onClick={simulateCameraScanAndTriggerAd} // Ganti dengan fungsi yang memulai proses pemindaian kamera Anda
          disabled={!isMonetagSdkReady} // Tombol dinonaktifkan jika SDK belum siap
          className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMonetagSdkReady ? 'Mulai Pindai & Tampilkan Iklan Pop-up' : 'Memuat Fitur Iklan...'}
        </button>

        {feedbackMessage && (
          <p className="mt-4 text-sm text-yellow-300 bg-gray-700 p-2 rounded">
            {feedbackMessage}
          </p>
        )}
      </div>
      {/* --- AKHIR PENAMBAHAN JSX UNTUK FITUR BARU --- */}

      {/* ... Sisa JSX Anda yang sudah ada di sini ... */}
    </main>
  );
}
