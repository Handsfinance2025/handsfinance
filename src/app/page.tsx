'use client'; // Pastikan ini ada jika Anda menggunakan hook React seperti useState, useEffect

import Image from 'next/image'; // Contoh import yang mungkin sudah ada
import { useState, useEffect, useCallback, useRef } from 'react'; // Tambahkan useRef jika Anda menggunakan ref untuk kamera


const MONETAG_REWARDED_POPUP_ZONE_ID = 9375207; // <--- GANTI INI

import Card from './ui/Card';

const FeedCard = ({ title, type, text, author, authorAvatar, image }: { title: string, type: string, text: string, author: string, authorAvatar: string, image: string }) => (
  <Card className="my-4 mx-auto">
    <div>
      <img className="rounded-t-xl h-32 w-full object-cover" src={image} alt={title} />
    </div>
    <div className="px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
      <h4 className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">
        {type}
      </h4>
      <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">
        {title}
      </h2>
      <p className="sm:text-sm text-s text-gray-500 mr-1 my-3 dark:text-gray-400">
        {text}
      </p>
      <div className="flex items-center space-x-4">
        <img src={authorAvatar} className="rounded-full w-10 h-10" alt={author} />
        <h3 className="text-gray-500 dark:text-gray-200 m-l-8 text-sm font-medium">
          {author}
        </h3>
      </div>
    </div>
  </Card>
);

export default function HomePage() {

  const [isMonetagSdkReady, setIsMonetagSdkReady] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Untuk pesan ke pengguna

  useEffect(() => {
  
    const checkSdkInterval = setInterval(() => {

      const sdkGlobalObject = window.monetag;
      const sdkSpecificFunction = window[`show_${MONETAG_REWARDED_POPUP_ZONE_ID}` as keyof Window];

      if (sdkGlobalObject || typeof sdkSpecificFunction === 'function') {
        console.log('Monetag SDK is ready on HomePage.');
        setIsMonetagSdkReady(true);
        clearInterval(checkSdkInterval);
      } else {
        console.log('Monetag SDK not yet ready on HomePage, waiting...');
      }
    }, 1000);

    return () => clearInterval(checkSdkInterval);
  }, []);

  const showRewardedPopupAd = useCallback(() => {
    if (!isMonetagSdkReady) {
      console.warn('Monetag SDK not ready. Cannot show popup ad.');
      setFeedbackMessage('SDK Iklan belum siap. Silakan coba lagi sesaat.');
      return;
    }

    console.log('Attempting to show Monetag rewarded popup ad...');
    setFeedbackMessage('Memuat iklan pop-up...');

    const specificZoneFunction = window[`show_${MONETAG_REWARDED_POPUP_ZONE_ID}` as keyof Window] as (() => void) | undefined;
    if (typeof specificZoneFunction === 'function') {
      try {
        specificZoneFunction();
      } catch (error) {
        console.error('Error calling specific Monetag zone function:', error);
        setFeedbackMessage('Gagal menampilkan iklan pop-up (err SF).');
      }
    } 
   
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


  const handleCameraScanSuccess = useCallback(() => {
    console.log('Camera scan successful! Triggering Monetag popup ad.');
    setFeedbackMessage('Pemindaian berhasil! Menampilkan hadiah...');
    showRewardedPopupAd();

  }, [showRewardedPopupAd]);


  const simulateCameraScanAndTriggerAd = () => {
    if (!isMonetagSdkReady) {
      setFeedbackMessage('SDK Iklan belum siap untuk memulai pemindaian.');
      return;
    }
    setFeedbackMessage('Memulai simulasi pemindaian kamera...');
 
    setTimeout(() => { // Simulasi penundaan untuk pemindaian
      console.log('Simulated camera scan successful.');
      handleCameraScanSuccess(); 
    }, 2000); // Anggap pemindaian butuh 2 detik
  };
 

  const [showNotifications, setShowNotifications] = useState(false);

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
