'use client';

import React, { useState, useEffect, useCallback, useRef, SVGProps, ChangeEvent } from 'react';
import { Camera, AlertCircle, CheckCircle2, Star, ShieldOff, UploadCloud, XCircle } from 'lucide-react'; // Menambah UploadCloud dan XCircle

// --- KONFIGURASI WARNA ---
const colors = {
  primaryGreen: '#238B45', // Aksi utama, sorotan, ikon
  lightGray: '#F0F2F0',    // Latar belakang kad, input
  ashGray: '#B7C1AC',      // Sempadan, teks sekunder, aksen halus
  darkGreenGray: '#4E6F5C',// Teks utama, elemen lebih gelap, latar belakang header kad
  white: '#FFFFFF',        // Teks pada latar belakang gelap, latar belakang utama kad
  softBackground: '#E9EEEA', // Latar belakang halaman utama yang sedikit putih pudar
  errorRed: '#DC2626', 
  errorBgRed: '#FEE2E2', 
};

// --- KONFIGURASI MONETAG ---
const MONETAG_REWARDED_POPUP_ZONE_ID = 9375207;

// --- KOMPONEN UTAMA ---
export default function ScannerPage() {
  const [isMonetagSdkReady, setIsMonetagSdkReady] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isScanning, setIsScanning] = useState(false);
  const [isProMode, setIsProMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Efek untuk memeriksa kesiapan Monetag SDK
  useEffect(() => {
    console.log('ScannerPage: useEffect for Monetag SDK check triggered.');
    const checkSdkInterval = setInterval(() => {
      const sdkGlobalObject = (window as any).monetag;
      const sdkSpecificFunction = (window as any)[`show_${MONETAG_REWARDED_POPUP_ZONE_ID}`];

      if (sdkGlobalObject || typeof sdkSpecificFunction === 'function') {
        console.log('Monetag SDK is ready on ScannerPage.');
        setIsMonetagSdkReady(true);
        setFeedbackMessage('Fitur siap. Anda bisa memulai pemindaian atau unggah gambar.');
        setFeedbackType('success');
        clearInterval(checkSdkInterval);
      } else {
        console.log('Monetag SDK not yet ready on ScannerPage, waiting...');
        setFeedbackMessage('Sedang memuat fitur, mohon tunggu...');
        setFeedbackType('info');
      }
    }, 1000);

    return () => {
      console.log('ScannerPage: Cleaning up Monetag SDK check interval.');
      clearInterval(checkSdkInterval);
      // Membersihkan object URL ketika komponen unmount
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependensi kosong agar hanya berjalan sekali saat mount

  // Fungsi untuk menampilkan iklan popup berhadiah
  const showRewardedPopupAd = useCallback(() => {
    if (!isMonetagSdkReady) {
      console.warn('Monetag SDK not ready. Cannot show popup ad.');
      setFeedbackMessage('SDK Iklan belum siap. Silakan coba lagi sesaat.');
      setFeedbackType('error');
      setIsScanning(false);
      return;
    }

    console.log('Attempting to show Monetag rewarded popup ad...');
    setFeedbackMessage('Memuat iklan hadiah...');
    setFeedbackType('info');

    const specificZoneFunction = (window as any)[`show_${MONETAG_REWARDED_POPUP_ZONE_ID}`] as (() => void) | undefined;
    
    if (typeof specificZoneFunction === 'function') {
      try {
        specificZoneFunction();
        setTimeout(() => {
          setFeedbackMessage('Iklan selesai. Terima kasih! Pemindaian berhasil.');
          setFeedbackType('success');
        }, 3000); 
      } catch (error) {
        console.error('Error calling specific Monetag zone function:', error);
        setFeedbackMessage('Gagal menampilkan iklan (Zona Spesifik).');
        setFeedbackType('error');
      }
    } else if ((window as any).monetag && (window as any).monetag.rewarded && typeof (window as any).monetag.rewarded.showAd === 'function') {
      try {
        (window as any).monetag.rewarded.showAd(MONETAG_REWARDED_POPUP_ZONE_ID);
         setTimeout(() => {
          setFeedbackMessage('Iklan selesai. Terima kasih! Pemindaian berhasil.');
          setFeedbackType('success');
        }, 3000); 
      } catch (error) {
        console.error('Error calling Monetag.rewarded.showAd:', error);
        setFeedbackMessage('Gagal menampilkan iklan (API Umum).');
        setFeedbackType('error');
      }
    } else {
      console.error('Monetag SDK function to show popup ad is not available.');
      setFeedbackMessage('Fungsi untuk menampilkan iklan tidak ditemukan.');
      setFeedbackType('error');
    }
    setIsScanning(false);
  }, [isMonetagSdkReady]);

  // Callback setelah pemindaian (simulasi) berhasil
  const handleScanSuccess = useCallback(() => {
    const scanType = uploadedImage ? "Gambar" : "Kamera";
    if (isProMode) {
      console.log(`${scanType} scan successful! (Pro Mode)`);
      setFeedbackMessage(`Pemindaian ${scanType} berhasil! (Mode Pro)`);
      setFeedbackType('success');
      setIsScanning(false);
    } else {
      console.log(`${scanType} scan successful! Triggering Monetag popup ad (Free Mode).`);
      setFeedbackMessage(`Pemindaian ${scanType} berhasil! Menampilkan hadiah...`);
      setFeedbackType('success');
      showRewardedPopupAd();
    }
  }, [isProMode, showRewardedPopupAd, uploadedImage]);

  // Fungsi untuk mensimulasikan pemindaian dan memicu iklan
  const simulateScanAndTriggerAd = () => {
    if (!isMonetagSdkReady && !isProMode) {
      setFeedbackMessage('SDK Iklan belum siap untuk memulai pemindaian.');
      setFeedbackType('error');
      return;
    }
    if (isScanning) return;

    console.log('Starting scan simulation...');
    setFeedbackMessage(`Memulai pemindaian ${uploadedImage ? 'gambar' : 'kamera'}...`);
    setFeedbackType('info');
    setIsScanning(true);

    setTimeout(() => {
      console.log('Simulated scan successful.');
      handleScanSuccess();
    }, 2500); 
  };
  
  // Handler untuk muat naik imej
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFeedbackMessage('Format fail tidak disokong. Sila unggah imej (PNG, JPG, GIF).');
        setFeedbackType('error');
        setUploadedImage(null);
        setImagePreviewUrl(null);
        return;
      }
      setUploadedImage(file);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl); // Bersihkan URL objek lama
      }
      setImagePreviewUrl(URL.createObjectURL(file));
      setFeedbackMessage('Imej berjaya diunggah. Sedia untuk dipindai.');
      setFeedbackType('info');
      setIsScanning(false); // Pastikan tidak dalam mode pemindaian setelah unggah
    }
  };

  // Handler untuk membuang imej yang diunggah
  const handleRemoveImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setUploadedImage(null);
    setImagePreviewUrl(null);
    setFeedbackMessage('Imej telah dibuang.');
    setFeedbackType('info');
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset input fail
    }
  };

  // Fungsi untuk mendapatkan warna dan ikon berdasarkan tipe feedback
  const getFeedbackStyles = () => {
    switch (feedbackType) {
      case 'success':
        return {
          borderColor: colors.primaryGreen,
          bgColor: 'bg-opacity-10 bg-green-500',
          textColor: `text-[${colors.primaryGreen}]`,
          icon: <CheckCircle2 className={`h-5 w-5 text-[${colors.primaryGreen}]`} />
        };
      case 'error':
        return {
          borderColor: colors.errorRed,
          bgColor: 'bg-opacity-10 bg-red-600',
          textColor: `text-[${colors.errorRed}]`,
          icon: <AlertCircle className={`h-5 w-5 text-[${colors.errorRed}]`} />
        };
      case 'info':
      default:
        return {
          borderColor: colors.darkGreenGray,
          bgColor: 'bg-opacity-10 bg-gray-500',
          textColor: `text-[${colors.darkGreenGray}]`,
          icon: <AlertCircle className={`h-5 w-5 text-[${colors.darkGreenGray}]`} />
        };
    }
  };
  const feedbackStyles = getFeedbackStyles();


  return (
    <main style={{ backgroundColor: colors.softBackground }} className="flex min-h-screen flex-col items-center justify-center p-4 font-sans">
      <div 
        style={{ backgroundColor: colors.white, borderColor: colors.ashGray }}
        className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border transform transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(78,111,92,0.3)]"
      >
        {/* Header Kartu */}
        <div style={{ backgroundColor: colors.darkGreenGray }} className="p-5 sm:p-6 text-center">
          <h1 style={{ color: colors.lightGray }} className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pemindai Cerdas
          </h1>
          <p style={{ color: colors.ashGray }} className="text-xs sm:text-sm mt-1">
            Pindai atau unggah kode untuk akses atau hadiah instan.
          </p>
        </div>

        {/* Toggle Pro/Free Mode */}
        <div className="p-4 sm:p-5" style={{backgroundColor: colors.lightGray}}>
          <div className="flex items-center justify-center space-x-2 bg-white p-1 rounded-lg shadow-inner" style={{borderColor: colors.ashGray}}>
            <button
              onClick={() => setIsProMode(false)}
              className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center justify-center space-x-1.5
                ${!isProMode ? `bg-[${colors.primaryGreen}] text-white shadow-md` : `text-[${colors.darkGreenGray}] hover:bg-opacity-50 hover:bg-[${colors.ashGray}]`}`}
            >
              <ShieldOff className={`w-4 h-4 ${!isProMode ? 'text-white' : `text-[${colors.primaryGreen}]`}`} />
              <span>Gratis</span>
            </button>
            <button
              onClick={() => setIsProMode(true)}
              className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center justify-center space-x-1.5
                ${isProMode ? `bg-[${colors.primaryGreen}] text-white shadow-md` : `text-[${colors.darkGreenGray}] hover:bg-opacity-50 hover:bg-[${colors.ashGray}]`}`}
            >
              <Star className={`w-4 h-4 ${isProMode ? 'text-yellow-300' : `text-[${colors.primaryGreen}]`}`} />
              <span>Pro</span>
            </button>
          </div>
        </div>

        {/* Area Pemindai atau Pratonton Imej */}
        <div className="p-5 sm:p-6">
          <div 
            className={`relative mx-auto w-full aspect-square max-w-[280px] rounded-xl overflow-hidden border-2 border-dashed flex items-center justify-center transition-all duration-300
              ${isScanning ? `border-[${colors.primaryGreen}] shadow-xl shadow-green-500/20` : `border-[${colors.ashGray}]`}
              ${isProMode && !isScanning && !imagePreviewUrl ? `border-[${colors.primaryGreen}] border-solid shadow-lg shadow-green-500/10` : ''}
              ${imagePreviewUrl ? 'border-solid' : 'opacity-80'} 
            `}
            style={{backgroundColor: colors.lightGray, borderColor: imagePreviewUrl ? colors.primaryGreen : (isScanning ? colors.primaryGreen : (isProMode && !isScanning ? colors.primaryGreen : colors.ashGray))}}
          >
            {imagePreviewUrl ? (
              <img src={imagePreviewUrl} alt="Pratonton Unggahan" className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Camera className={`h-20 w-20 sm:h-24 sm:w-24 transition-opacity duration-300 
                ${isScanning ? `text-[${colors.primaryGreen}] opacity-40` : `text-[${colors.ashGray}] opacity-70`}
              `} />
            )}

            {isScanning && (
              <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl">
                <div 
                    className="absolute top-0 left-0 w-full h-1.5 animate-scan-line shadow-[0_0_15px_3px_rgba(35,139,69,0.6)]"
                    style={{backgroundColor: colors.primaryGreen}} 
                ></div>
              </div>
            )}
            {/* Sudut-sudut penanda hanya jika tidak ada imej pratonton dan tidak memindai */}
            {!imagePreviewUrl && !isScanning && (
              <>
                <div className={`absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-l-[3px] rounded-tl-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                <div className={`absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-r-[3px] rounded-tr-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                <div className={`absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-l-[3px] rounded-bl-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                <div className={`absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-r-[3px] rounded-br-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
              </>
            )}
            {/* Tombol buang imej */}
            {imagePreviewUrl && !isScanning && (
                <button 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-black bg-opacity-40 rounded-full text-white hover:bg-opacity-60 transition-colors"
                    aria-label="Buang imej"
                >
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            )}
          </div>
        </div>
        
        {/* Tombol Aksi & Unggah */}
        <div className="px-5 sm:px-6 pb-3 sm:pb-4 space-y-3">
          <button
            onClick={simulateScanAndTriggerAd}
            disabled={(!isMonetagSdkReady && !isProMode) || isScanning || (!imagePreviewUrl && !isProMode && !isMonetagSdkReady)} // Tambah kondisi disable jika tidak ada imej dan bukan pro mode dan sdk belum siap
            style={{
                backgroundColor: isScanning || (!isMonetagSdkReady && !isProMode && !imagePreviewUrl) ? colors.ashGray : colors.primaryGreen,
                color: colors.white
            }}
            className={`w-full text-white font-semibold py-3 px-6 rounded-xl text-base sm:text-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${isScanning || (!isMonetagSdkReady && !isProMode && !imagePreviewUrl) ? 'opacity-60 cursor-not-allowed' : `hover:opacity-90 hover:shadow-lg focus:ring-[${colors.primaryGreen}]`}
            `}
          >
            {isScanning 
              ? 'Sedang Memindai...' 
              : ((!isMonetagSdkReady && !isProMode && !imagePreviewUrl) ? 'Memuat Fitur...' : (imagePreviewUrl ? 'Pindai Imej Ini' : 'Mulai Pindai Kamera'))}
          </button>

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
            ref={fileInputRef} 
            id="imageUploadInput"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            style={{
                backgroundColor: isScanning ? colors.ashGray : colors.darkGreenGray,
                color: colors.white,
            }}
            className={`w-full text-white font-semibold py-2.5 px-6 rounded-xl text-sm sm:text-base transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center space-x-2
              ${isScanning ? 'opacity-60 cursor-not-allowed' : `hover:opacity-90 hover:shadow-md focus:ring-[${colors.darkGreenGray}]`}
            `}
          >
            <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Unggah Gambar Kode QR</span>
          </button>
        </div>

        {/* Pesan Feedback */}
        {feedbackMessage && (
          <div className={`mx-5 sm:mx-6 mb-5 sm:mb-6 p-3.5 sm:p-4 border-l-4 rounded-md shadow-md flex items-start space-x-3 ${feedbackStyles.bgColor}`}
            style={{borderColor: feedbackStyles.borderColor}}
          >
            <div className="flex-shrink-0 pt-0.5">
              {feedbackStyles.icon}
            </div>
            <p className={`text-sm ${feedbackStyles.textColor}`}>
              {feedbackMessage}
            </p>
          </div>
        )}
      </div>
      
      <footer className="mt-6 text-center">
        <p style={{color: colors.ashGray}} className="text-xs">
          {isProMode ? "Anda menggunakan Mode Pro." : "Mode Gratis mungkin menampilkan iklan."}
        </p>
      </footer>

      <style jsx global>{`
        @keyframes scan-line-animation {
          0% { transform: translateY(-10%); opacity: 0.6; }
          50% { transform: translateY(calc(100% + 5px)); opacity: 1; }
          100% { transform: translateY(-10%); opacity: 0.6;}
        }
        .animate-scan-line {
          animation: scan-line-animation 2.2s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }
      `}</style>
    </main>
  );
}
