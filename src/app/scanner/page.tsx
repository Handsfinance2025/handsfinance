'use client';

import React, { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { Camera, AlertCircle, CheckCircle2, Star, ShieldOff, UploadCloud, XCircle, Loader2 } from 'lucide-react';
// IMPORTANT: You need to install monetag-tg-sdk in your project for this import to work:
// npm install monetag-tg-sdk
// or
// yarn add monetag-tg-sdk
import createAdHandler from 'monetag-tg-sdk'; // Assuming this is the correct import path

// --- KONFIGURASI WARNA ---
const colors = {
  primaryGreen: '#238B45',
  lightGray: '#F0F2F0',
  ashGray: '#B7C1AC',
  darkGreenGray: '#4E6F5C',
  white: '#FFFFFF',
  softBackground: '#E9EEEA',
  errorRed: '#DC2626',
  errorBgRed: '#FEE2E2',
};

// --- KONFIGURASI MONETAG ---
// MONETAG_SDK_URL is no longer needed as monetag-tg-sdk should handle SDK loading.
const MONETAG_REWARDED_INTERSTITIAL_ZONE_ID: number = 9375207; 
// MONETAG_PRELOAD_EVENT_ID and MONETAG_SHOW_AD_EVENT_ID_PREFIX might not be used by the new SDK in the same way.

// --- KONFIGURASI TELEGAIN ---
const TELEGAIN_SDK_URL = "https://inapp.telega.io/sdk/v1/sdk.js";
const TELEGAIN_APP_TOKEN_PLACEHOLDER = "e5af34f5-3ee9-4ae1-877e-788f68a514a0"; 
const TELEGAIN_AD_BLOCK_UUID = "198e26ba-eeb8-4c82-ae07-c71aa2cff893";

const IS_TELEGAIN_TOKEN_EXPLICITLY_SET_IN_ENV =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_TELEGAIN_APP_TOKEN !== undefined);

const TELEGAIN_TOKEN_FOR_SDK_INIT = IS_TELEGAIN_TOKEN_EXPLICITLY_SET_IN_ENV
  ? process.env.NEXT_PUBLIC_TELEGAIN_APP_TOKEN
  : TELEGAIN_APP_TOKEN_PLACEHOLDER;

// --- TelegaIn SDK Interfaces ---
interface TelegaAdInstance {
  ad_show: (options: { adBlockUuid: string }) => void;
}

interface TelegaInAdsController {
  create_miniapp: (options: { token: string }) => TelegaAdInstance | null;
}

// --- Deklarasi Global Terpadu untuk window ---
declare global {
  interface Window {
    TelegaInController?: TelegaInAdsController;
    TelegaIn?: {
      AdsController?: TelegaInAdsController;
    };
    Telegram?: {
      WebApp?: {
        ready: () => void;
      };
    };
    // window.monetag might not be used directly if monetag-tg-sdk abstracts it.
    // However, keeping it for now in case other parts of an app might rely on it,
    // but the primary ad showing mechanism will use createAdHandler.
    monetag?: {
      rewardedInterstitial?: {
        showAd: (zoneId: number, options?: any) => void; // Options type might differ
      };
      [key: string]: any;
    };
     [key: `show_${number}`]: ((options?: any) => Promise<void> | void) | undefined;
  }
}

// --- Custom External Script Loader Component (Only for TelegaIn now) ---
interface ExternalScriptLoaderProps {
  id: string;
  src: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ExternalScriptLoader: React.FC<ExternalScriptLoaderProps> = ({ id, src, onLoad, onError }) => {
  useEffect(() => {
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;

    const handleLoad = () => {
      console.log(`Script ${id} loaded successfully from ${src}`);
      if (onLoad) onLoad();
    };

    const handleError = (event: Event | string) => {
      console.error(`Error loading script ${id} from ${src}:`, event);
      if (onError) onError();
    };

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove === script) {
         document.body.removeChild(scriptToRemove);
      }
    };
  }, [id, src, onLoad, onError]);

  return null;
};


// --- KOMPONEN UTAMA ScannerPage ---
export default function ScannerPage() {
  // State Monetag - isMonetagSdkLoaded, isMonetagApiReady, isMonetagAdPreloaded are removed
  // as their roles are likely handled by monetag-tg-sdk.
  const [isMonetagAdShowing, setIsMonetagAdShowing] = useState(false);
  const monetagAdHandlerRef = useRef<(() => Promise<void>) | null>(null); // To store the handler from createAdHandler
  const monetagAdTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  // State TelegaIn
  const [isTelegaInSdkLoaded, setIsTelegaInSdkLoaded] = useState(false);
  const [telegaAdsInstance, setTelegaAdsInstance] = useState<TelegaAdInstance | null>(null);
  const [isTelegaAdShowing, setIsTelegaAdShowing] = useState(false);
  const telegaAdTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [feedbackMessage, setFeedbackMessage] = useState('Sedang memuat fitur, mohon tunggu...');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isScanning, setIsScanning] = useState(false);
  const [isProMode, setIsProMode] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [showScanResultsPopup, setShowScanResultsPopup] = useState(false);
  const [scanResults, setScanResults] = useState('');

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevImagePreviewUrlBlobRef = useRef<string | null>(null);

  // Initialize Monetag Ad Handler
  useEffect(() => {
    try {
      if (typeof createAdHandler === 'function') {
        monetagAdHandlerRef.current = createAdHandler(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID);
        console.log('Monetag ad handler created for Zone ID:', MONETAG_REWARDED_INTERSTITIAL_ZONE_ID);
        // Assuming the handler is ready to be used once created.
        // If createAdHandler itself is async or has a callback for readiness, this would need adjustment.
      } else {
        console.error('createAdHandler is not a function. Ensure monetag-tg-sdk is correctly installed and imported.');
        setFeedbackMessage('Gagal menginisialisasi SDK Iklan Monetag (handler tidak tersedia).');
        setFeedbackType('error');
      }
    } catch (error) {
        console.error('Error initializing Monetag ad handler:', error);
        setFeedbackMessage(`Error Monetag: ${error instanceof Error ? error.message : String(error)}`);
        setFeedbackType('error');
    }
  }, []); // Initialize once on mount

  
  // --- TelegaIn SDK Handlers ---
  const handleTelegaInScriptLoad = useCallback(() => {
    console.log('TelegaIn SDK script has loaded from:', TELEGAIN_SDK_URL);
    setIsTelegaInSdkLoaded(true);
     if (!(feedbackMessage.startsWith('GAGAL memuat skrip TelegaIn') || feedbackMessage.includes('Token Aplikasi TelegaIn'))) {
        setFeedbackMessage('Skrip TelegaIn dimuat. Inisialisasi...');
        setFeedbackType('info');
    }
  }, [feedbackMessage]);

  const handleTelegaInScriptError = useCallback(() => {
    console.error(`Failed to load TelegaIn SDK script from: ${TELEGAIN_SDK_URL}. Check ad blockers, network, and SDK URL.`);
    setFeedbackMessage(`GAGAL memuat skrip TelegaIn dari ${TELEGAIN_SDK_URL}. Nonaktifkan Ad Blocker & periksa koneksi.`);
    setFeedbackType('error');
    setIsTelegaInSdkLoaded(false);
  }, []); 

  // --- TelegaIn SDK Initialization ---
  useEffect(() => {
    if (isTelegaInSdkLoaded && !telegaAdsInstance && !feedbackMessage.startsWith('GAGAL memuat skrip TelegaIn')) {
        if (!IS_TELEGAIN_TOKEN_EXPLICITLY_SET_IN_ENV) {
            console.error('TelegaIn App Token (NEXT_PUBLIC_TELEGAIN_APP_TOKEN) was not found in environment variables.');
            setFeedbackMessage('KRITIS: Token Aplikasi TelegaIn (NEXT_PUBLIC_TELEGAIN_APP_TOKEN) tidak ditemukan di environment.');
            setFeedbackType('error');
            return; 
        }
        
        const telegaInApi = window.TelegaInController || window.TelegaIn?.AdsController;
        if (telegaInApi?.create_miniapp) {
            console.log('TelegaIn API found, attempting to create miniapp instance with token from env:', TELEGAIN_TOKEN_FOR_SDK_INIT);
            try {
                const tokenForApi = TELEGAIN_TOKEN_FOR_SDK_INIT as string; 
                const instance = telegaInApi.create_miniapp({ token: tokenForApi });
                if (instance) {
                    setTelegaAdsInstance(instance);
                    console.log('TelegaIn miniapp instance created successfully.');
                    if(feedbackMessage.includes('Token Aplikasi TelegaIn') || feedbackMessage.includes('KRITIS')) {
                        setFeedbackMessage('Sedang memuat fitur, mohon tunggu...'); 
                        setFeedbackType('info');
                    }
                } else {
                    console.error('Failed to create TelegaIn miniapp instance (returned null). Token:', TELEGAIN_TOKEN_FOR_SDK_INIT);
                    if (!feedbackMessage.startsWith('GAGAL memuat skrip TelegaIn')) {
                        setFeedbackMessage('Gagal membuat instance iklan TelegaIn. Periksa token/konfigurasi SDK.');
                        setFeedbackType('error');
                    }
                }
            } catch (error) {
                console.error('Error creating TelegaIn miniapp instance:', error);
                if (!feedbackMessage.startsWith('GAGAL memuat skrip TelegaIn')) {
                    setFeedbackMessage(`Inisialisasi TelegaIn gagal: ${error instanceof Error ? error.message : String(error)}`);
                    setFeedbackType('error');
                }
            }
        } else {
            if (!feedbackMessage.startsWith('GAGAL memuat skrip TelegaIn')) {
                console.warn('TelegaIn API (create_miniapp) not available.');
                setFeedbackMessage('Controller SDK TelegaIn tidak ditemukan atau struktur API berbeda.');
                setFeedbackType('error');
            }
        }
    }
}, [isTelegaInSdkLoaded, telegaAdsInstance, feedbackMessage]);


  // --- Feedback Siap Pakai ---
  useEffect(() => {
    // Monetag readiness is now based on monetagAdHandlerRef.current being available.
    const monetagServiceReady = !!monetagAdHandlerRef.current;
    
    const telegaScriptOk = isTelegaInSdkLoaded;
    const telegaFullyReady = telegaScriptOk && !!telegaAdsInstance;

    if (feedbackMessage.startsWith("GAGAL memuat skrip") || 
        feedbackMessage.includes('KRITIS: Token Aplikasi TelegaIn')) {
        return; 
    }
    
    // If Monetag handler is ready OR TelegaIn is fully ready
    if (monetagServiceReady || telegaFullyReady) {
        if (feedbackMessage.includes('memuat skrip') || 
            feedbackMessage.includes('memuat fitur') || 
            feedbackMessage.includes('Menginisialisasi') ||
            feedbackMessage.includes('Gagal memverifikasi') || 
            feedbackMessage.includes('Gagal membuat instance') || 
            feedbackMessage.includes('Controller SDK') ||
            feedbackMessage.includes('Gagal menginisialisasi SDK Iklan Monetag') || // Clear Monetag init error
            feedbackMessage.includes('PERHATIAN: Token Aplikasi TelegaIn') 
            ) {
            setFeedbackMessage('Fitur siap. Anda bisa memulai pemindaian atau unggah gambar.');
            setFeedbackType('success');
        }
    } 
    // This else if might need adjustment based on how monetagServiceReady behaves if createAdHandler fails.
    // For now, it assumes if monetagServiceReady is false, it's an issue.
    else if ((!monetagServiceReady && typeof createAdHandler === 'function') && telegaScriptOk && !telegaFullyReady) {
        if (!feedbackMessage.startsWith("GAGAL") && !feedbackMessage.includes('KRITIS:')) { 
            setFeedbackMessage('Gagal menginisialisasi layanan iklan setelah skrip dimuat. Periksa konsol.');
            setFeedbackType('error');
        }
    }
  }, [telegaAdsInstance, isTelegaInSdkLoaded, feedbackMessage]); // monetagAdHandlerRef.current is stable after init


  // --- Cleanup Blob URL & Timeouts ---
  useEffect(() => {
    const previousBlobUrl = prevImagePreviewUrlBlobRef.current;
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      prevImagePreviewUrlBlobRef.current = imagePreviewUrl;
    } else {
      prevImagePreviewUrlBlobRef.current = null;
    }
    return () => {
      if (previousBlobUrl && previousBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previousBlobUrl);
      }
    };
  }, [imagePreviewUrl]); 

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (telegaAdTimeoutRef.current) clearTimeout(telegaAdTimeoutRef.current);
      if (monetagAdTimeoutRef.current) clearTimeout(monetagAdTimeoutRef.current);
      if (prevImagePreviewUrlBlobRef.current?.startsWith('blob:')) {
        URL.revokeObjectURL(prevImagePreviewUrlBlobRef.current);
      }
    };
  }, []); 

  const convertFileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64ImageData = reader.result?.toString().split(',')[1];
        if (base64ImageData) resolve(base64ImageData);
        else reject(new Error('Gagal mengkonversi gambar ke base64.'));
      };
      reader.onerror = (error) => reject(new Error('Gagal membaca file gambar.'));
    });
  }, []);

  const performGeminiScanViaBackend = useCallback(async (imageFile: File | null) => {
    if (!imageFile) {
      setFeedbackMessage('Tidak ada gambar untuk dianalisis.');
      setFeedbackType('error');
      return;
    }
    setIsScanning(true); // Keep this for AI scan itself
    setFeedbackMessage('Menganalisis gambar dengan AI...');
    setFeedbackType('info');
    const tradingPrompt = `You are a very useful assistant. Help me with determining the analisis day trading content of my market finance. The photo shows market analisis product for a trading. Determine which products are shown in the photo and return them ONLY as a text list, where each list element should contain:
- Market Structure: (e.g., Uptrend, Downtrend, Sideways, Breakout, Support/Resistance levels)
- Candlestick Pattern: (e.g., Doji, Hammer, Engulfing, Morning Star, etc., and its implication)
- Trend Market: (e.g., Strong Bullish, Weak Bullish, Strong Bearish, Weak Bearish, Neutral)
- Signal Type: (e.g., Buy, Sell, Hold, Wait for Confirmation)
- Bandarmology: (Brief analysis of potential institutional activity if discernible, e.g., Accumulation, Distribution, No Clear Sign)
- Rekomendasi Trading:
  - Time Frame: 1 Day
  - Gaya Trading: (Choose one or more: Scalping, Day Trading, Swing Trading, Position Trading)
  - Resiko: (e.g., Low, Medium, High)
  - Rekomendasi Aksi: (e.g., Buy now, Sell now, Wait for pullback to [price], Set stop loss at [price], Target price [price])
`;
    try {
      const base64ImageData = await convertFileToBase64(imageFile);
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: tradingPrompt, imageData: base64ImageData, mimeType: imageFile.type }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Gagal parsing error dari backend" }));
        throw new Error(errorData.error || `Error dari backend (${response.status})`);
      }
      const result = await response.json();
      if (result.text) {
        setScanResults(result.text);
        setShowScanResultsPopup(true);
        setFeedbackMessage('Analisis AI berhasil!');
        setFeedbackType('success');
      } else {
        throw new Error('Respon backend tidak valid.');
      }
    } catch (error) {
      console.error('Error during Gemini scan:', error);
      setFeedbackMessage(`Analisis AI gagal: ${error instanceof Error ? error.message : String(error)}`);
      setFeedbackType('error');
    } finally {
      setIsScanning(false); // Reset scanning state for AI scan
    }
  }, [convertFileToBase64]);

  // --- Display Monetag Ad using monetag-tg-sdk ---
  const displayMonetagRewardedAd = useCallback(async (): Promise<boolean> => {
    if (isProMode) {
      console.log("Pro mode: Skipping Monetag ad.");
      return Promise.resolve(true); // Simulate ad success for Pro mode to allow flow continuation
    }
    if (!monetagAdHandlerRef.current) {
      console.warn('Monetag ad handler not initialized. Skipping Monetag ad.');
      setFeedbackMessage('Iklan Monetag belum siap. Coba lagi nanti.');
      setFeedbackType('error');
      return Promise.resolve(false); // Ad cannot be shown
    }
    if (isMonetagAdShowing) {
      console.log('Monetag ad already requested/showing. Skipping.');
      return Promise.resolve(false); // Indicate ad was already showing, don't re-trigger flow
    }

    console.log(`Attempting to show Monetag Rewarded ad using monetag-tg-sdk for Zone ID: ${MONETAG_REWARDED_INTERSTITIAL_ZONE_ID}`);
    setFeedbackMessage('Memuat iklan Monetag...');
    setFeedbackType('info');
    setIsMonetagAdShowing(true);

    if (monetagAdTimeoutRef.current) clearTimeout(monetagAdTimeoutRef.current);
    
    try {
      await monetagAdHandlerRef.current();
      // Promise resolved: User watched the ad or closed it as per SDK's "success" definition
      console.log('Monetag ad handler promise resolved (User watched/closed ad).');
      setFeedbackMessage('Iklan Monetag selesai.'); 
      setFeedbackType('success'); // Or 'info'
      setIsMonetagAdShowing(false);
      if (monetagAdTimeoutRef.current) clearTimeout(monetagAdTimeoutRef.current);
      return true; // Ad interaction was successful
    } catch (error) {
      // Promise rejected: Ad failed or was skipped by user
      console.warn('Monetag ad handler promise rejected (Ad failed or was skipped). Error:', error);
      setFeedbackMessage('Iklan Monetag gagal dimuat atau dilewati.');
      setFeedbackType('info'); // Or 'error' depending on how critical a skip is
      setIsMonetagAdShowing(false);
      if (monetagAdTimeoutRef.current) clearTimeout(monetagAdTimeoutRef.current);
      return false; // Ad interaction failed or was skipped
    } finally {
        // Ensure isMonetagAdShowing is reset if not already by callbacks
        // This might be redundant if try/catch always resets it.
        // setIsMonetagAdShowing(false); 
    }
  }, [isProMode, isMonetagAdShowing, feedbackMessage]); // feedbackMessage removed to avoid loops if it contains error
  
  // --- Display TelegaIn Ad ---
  const displayTelegaInAd = useCallback(() => {
    if (isProMode) return false; 
    if (!telegaAdsInstance) {
      console.warn('TelegaIn Ads instance not available. Skipping TelegaIn ad.');
      if (isTelegaInSdkLoaded && !feedbackMessage.includes('KRITIS:')) {
          // Potentially set a less intrusive info message
      }
      return false; 
    }
    if (isTelegaAdShowing) {
      console.log('TelegaIn ad already requested/showing. Skipping.');
      return true; 
    }

    console.log(`Attempting to show TelegaIn ad with UUID: ${TELEGAIN_AD_BLOCK_UUID}`);
    setFeedbackMessage('Memuat iklan TelegaIn...');
    setFeedbackType('info');
    setIsTelegaAdShowing(true);

    if (telegaAdTimeoutRef.current) clearTimeout(telegaAdTimeoutRef.current);

    try {
      telegaAdsInstance.ad_show({ adBlockUuid: TELEGAIN_AD_BLOCK_UUID });
      console.log('TelegaIn ad_show called.');
      telegaAdTimeoutRef.current = setTimeout(() => {
        if (isTelegaAdShowing) { 
          console.log('TelegaIn ad timeout.');
          setIsTelegaAdShowing(false);
          setFeedbackMessage(prev => prev === 'Memuat iklan TelegaIn...' ? 'Iklan TelegaIn selesai.' : prev);
        }
      }, 15000); 
      return true; 
    } catch (error) {
      console.error('Failed to show TelegaIn ad:', error);
      setIsTelegaAdShowing(false);
      if (telegaAdTimeoutRef.current) clearTimeout(telegaAdTimeoutRef.current);
      setFeedbackMessage(`Gagal menampilkan iklan TelegaIn: ${error instanceof Error ? error.message : String(error)}.`);
      setFeedbackType('error');
      return false; 
    }
  }, [isProMode, telegaAdsInstance, isTelegaAdShowing, isTelegaInSdkLoaded, feedbackMessage]);


  const closeCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
    setIsScanning(false); 
  }, []);

  const openCamera = useCallback(async () => {
    if (isScanning || isCameraOpen || isMonetagAdShowing || isTelegaAdShowing) return;
    
    setIsScanning(true); 
    setFeedbackMessage('Mengakses kamera...');
    setFeedbackType('info');
    setCameraError(null);

    if (imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null); 
    setUploadedImage(null); 

    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
                setIsCameraOpen(true);
                setIsScanning(false); 
                setFeedbackMessage('Kamera aktif. Arahkan ke chart dan ambil foto.');
            }).catch(err => {
                console.error("Error playing video stream:", err);
                setCameraError(`Gagal memulai stream video: ${err.message}`);
                setFeedbackMessage(`Gagal memulai stream video: ${err.message}`);
                setFeedbackType('error');
                stream.getTracks().forEach(track => track.stop()); 
                setIsCameraOpen(false); 
                setIsScanning(false); 
            });
          };
        } else {
            stream.getTracks().forEach(track => track.stop());
            setIsScanning(false);
            setFeedbackMessage('Referensi video tidak ditemukan.');
            setFeedbackType('error');
        }
      } catch (err: any) {
        let message = 'Gagal mengakses kamera.';
        if (err.name === "NotAllowedError") message = 'Akses kamera ditolak.';
        else if (err.name === "NotFoundError") message = 'Kamera tidak ditemukan.';
        else if (err.name === "NotReadableError") message = 'Kamera bermasalah.';
        else message = `Gagal akses kamera: ${err.name}`;
        setCameraError(message);
        setFeedbackMessage(message);
        setFeedbackType('error');
        setIsCameraOpen(false);
        setIsScanning(false);
      }
    } else {
      setFeedbackMessage('Fitur kamera tidak didukung.');
      setFeedbackType('error');
      setIsCameraOpen(false);
      setIsScanning(false);
    }
  }, [isScanning, isCameraOpen, imagePreviewUrl, isMonetagAdShowing, isTelegaAdShowing, closeCamera]); 

  const dataURLtoFile = useCallback((dataurl: string, filename: string): File | null => {
    try {
      const arr = dataurl.split(',');
      if (arr.length < 2 || !arr[0] || !arr[1]) { 
        return null;
      }
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch || mimeMatch.length < 2 || !mimeMatch[1]) {
        return null;
      }
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]); 
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) { u8arr[n] = bstr.charCodeAt(n); }
      return new File([u8arr], filename, { type: mime });
    } catch (e: unknown) { 
      return null; 
    }
  }, []);

  const takePhoto = useCallback(() => {
    if (!isCameraOpen || !videoRef.current || !canvasRef.current) {
        setFeedbackMessage('Kamera tidak aktif.');
        setFeedbackType('error');
        return;
    }
    if (videoRef.current.readyState >= videoRef.current.HAVE_METADATA && videoRef.current.videoWidth > 0) {
      setFeedbackMessage('Mengambil foto...');
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9); 
        if (imagePreviewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImagePreviewUrl(dataUrl); 
        const photoFile = dataURLtoFile(dataUrl, `scan-${Date.now()}.jpg`);
        if (photoFile) {
          setUploadedImage(photoFile); 
          setFeedbackMessage('Foto berhasil diambil.');
          setFeedbackType('success');
        } else {
          setFeedbackMessage('Gagal memproses foto.');
          setFeedbackType('error');
          if (imagePreviewUrl === dataUrl) setImagePreviewUrl(null); 
        }
      } else {
        setFeedbackMessage('Gagal mendapatkan konteks canvas.');
        setFeedbackType('error');
      }
      closeCamera(); 
    } else {
        setFeedbackMessage('Kamera belum siap.');
        setFeedbackType('error');
    }
  }, [isCameraOpen, closeCamera, dataURLtoFile, imagePreviewUrl]); 

  const handleCloseScanResultsPopup = async () => {
    setShowScanResultsPopup(false);
    setFeedbackMessage('Hasil analisis ditutup.');
    setFeedbackType('info');
    
    if (!isProMode) {
      console.log('Attempting to show ad after closing results popup.');
      setIsMonetagAdShowing(false); 
      setIsTelegaAdShowing(false);

      const monetagAdSuccessful = await displayMonetagRewardedAd(); // Wait for Monetag ad
      if (!monetagAdSuccessful) { // If Monetag ad was not successful (failed, skipped, or handler not ready)
        console.log('Monetag ad not shown or failed/skipped, trying TelegaIn ad after results.');
        displayTelegaInAd();
      }
    } else {
      console.log('Pro mode: Skipping ads after closing results.');
    }
  };

  const handleMainScanClick = async () => {
    if (isScanning || isCameraOpen || isMonetagAdShowing || isTelegaAdShowing) return;

    if (uploadedImage) { 
      if (isProMode) { 
        setShowPurchasePopup(true); 
      } else { 
        // Show Monetag ad BEFORE scanning for free users with an image
        setIsScanning(true); // Indicate general "activity" starting (ad loading then potentially scan)
        const adSuccessful = await displayMonetagRewardedAd();
        setIsScanning(false); // Reset general "activity" state after ad attempt

        if (adSuccessful) {
          performGeminiScanViaBackend(uploadedImage);
        } else {
          // Feedback message for ad failure/skip is handled by displayMonetagRewardedAd
          console.log("Monetag ad was not successful, scan will not proceed.");
          // Optionally, set a specific feedback message here if needed, e.g.,
          // setFeedbackMessage("Pemindaian dibatalkan karena iklan tidak selesai.");
          // setFeedbackType('info');
        }
      }
    } else { 
      openCamera();
    }
  };

  const handleConfirmPurchase = () => {
    setShowPurchasePopup(false);
    if (uploadedImage) {
      setFeedbackMessage('Pembelian Pro berhasil (simulasi)!');
      setFeedbackType('success');
      performGeminiScanViaBackend(uploadedImage); 
    } else {
      setFeedbackMessage('Mode Pro: Tidak ada gambar.');
      setFeedbackType('info');
    }
  };
  
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (isCameraOpen) closeCamera(); 
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFeedbackMessage('Format file tidak disokong.');
        setFeedbackType('error');
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }
      setUploadedImage(file);
      if (imagePreviewUrl?.startsWith('blob:')) {
         URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(URL.createObjectURL(file));
      setFeedbackMessage('Gambar diunggah.');
      setFeedbackType('info'); 
    }
  };

  const handleRemoveImage = () => {
    if (isCameraOpen) closeCamera(); 
    if (imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
    }
    setUploadedImage(null);
    setImagePreviewUrl(null);
    setFeedbackMessage('Gambar dibuang.');
    setFeedbackType('info');
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const getFeedbackStyles = () => {
    switch (feedbackType) {
      case 'success': return { borderColor: colors.primaryGreen, bgColor: 'bg-green-500/10', textColor: `text-[${colors.primaryGreen}]`, icon: <CheckCircle2 className={`h-5 w-5 text-[${colors.primaryGreen}]`} /> };
      case 'error': return { borderColor: colors.errorRed, bgColor: 'bg-red-500/10', textColor: `text-[${colors.errorRed}]`, icon: <AlertCircle className={`h-5 w-5 text-[${colors.errorRed}]`} /> };
      default: return { borderColor: colors.darkGreenGray, bgColor: 'bg-gray-500/10', textColor: `text-[${colors.darkGreenGray}]`, icon: <AlertCircle className={`h-5 w-5 text-[${colors.darkGreenGray}]`} /> };
    }
  };
  const feedbackStyles = getFeedbackStyles();

  const mainButtonText = () => {
    if (isScanning && !isCameraOpen && !uploadedImage && !isMonetagAdShowing) return 'Mengakses Kamera...'; 
    if (isScanning && uploadedImage && !isMonetagAdShowing) return 'Sedang Menganalisis...'; 
    if (isCameraOpen) return 'Kamera Aktif...'; 
    if (isMonetagAdShowing || isTelegaAdShowing) return 'Memuat Iklan...';
    // If isScanning is true because an ad is loading before AI scan
    if (isScanning && (isMonetagAdShowing || isTelegaAdShowing)) return 'Memuat Iklan...';
    if (isScanning && uploadedImage) return 'Sedang Menganalisis...'; // Catch-all for AI scan

    if (uploadedImage) return isProMode ? 'Pindai Gambar (Pro)' : 'Pindai Gambar (Gratis)';
    return isProMode ? 'Gunakan Kamera (Pro)' : 'Gunakan Kamera (Gratis)';
  };
  
  const mainButtonDisabled = 
        (isScanning) || // General scanning/activity state (covers ad loading before scan, and AI scan)
        isMonetagAdShowing || 
        isTelegaAdShowing ||
        isCameraOpen; 


  return (
    <>
      {/* Monetag ExternalScriptLoader is removed, assuming monetag-tg-sdk handles its own loading */}
      <ExternalScriptLoader
        id="telega-sdk-script"
        src={TELEGAIN_SDK_URL}
        onLoad={handleTelegaInScriptLoad}
        onError={handleTelegaInScriptError}
      />
      <main style={{ backgroundColor: colors.softBackground }} className="flex min-h-screen flex-col items-center justify-center p-4 font-sans relative">
        {showPurchasePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div style={{ backgroundColor: colors.white, borderColor: colors.ashGray }} className="rounded-xl shadow-2xl p-6 w-full max-w-md text-center">
              <Star className={`w-16 h-16 text-[${colors.primaryGreen}] mx-auto mb-4`} />
              <h2 style={{ color: colors.darkGreenGray }} className="text-2xl font-bold mb-3">Aktivasi Mode Pro</h2>
              <p style={{ color: colors.darkGreenGray }} className="text-sm mb-6">Nikmati pemindaian tanpa iklan dan fitur eksklusif.</p>
              <div className="space-y-3">
                <button onClick={handleConfirmPurchase} style={{ backgroundColor: colors.primaryGreen, color: colors.white }} className="w-full font-semibold py-3 px-6 rounded-lg text-base transition-opacity hover:opacity-90">Beli Mode Pro (Simulasi)</button>
                <button onClick={() => setShowPurchasePopup(false)} style={{ backgroundColor: colors.lightGray, color: colors.darkGreenGray, borderColor: colors.ashGray }} className="w-full font-semibold py-3 px-6 rounded-lg text-base border transition-colors hover:bg-opacity-70">Batal</button>
              </div>
            </div>
          </div>
        )}

        {showScanResultsPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div style={{ backgroundColor: colors.white, borderColor: colors.ashGray }} className="rounded-xl shadow-2xl p-6 w-full max-w-md">
              <CheckCircle2 className={`w-12 h-12 text-[${colors.primaryGreen}] mx-auto mb-4`} />
              <h2 style={{ color: colors.darkGreenGray }} className="text-xl font-bold mb-3 text-center">Hasil Analisis AI Trading</h2>
              <div style={{ backgroundColor: colors.lightGray, color: colors.darkGreenGray }} className="p-3 rounded-md text-sm max-h-60 overflow-y-auto mb-6 whitespace-pre-wrap break-words">{scanResults}</div>
              <button onClick={handleCloseScanResultsPopup} style={{ backgroundColor: colors.primaryGreen, color: colors.white }} className="w-full font-semibold py-3 px-6 rounded-lg text-base transition-opacity hover:opacity-90">Tutup & Lanjutkan</button>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: colors.white, borderColor: colors.ashGray }} className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border transform transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(78,111,92,0.3)]">
          <div style={{ backgroundColor: colors.darkGreenGray }} className="p-5 sm:p-6 text-center">
            <h1 style={{ color: colors.lightGray }} className="text-2xl sm:text-3xl font-bold tracking-tight">Pemindai Analisis Trading</h1>
            <p style={{ color: colors.ashGray }} className="text-xs sm:text-sm mt-1">Gunakan kamera atau unggah gambar chart untuk analisis AI.</p>
          </div>

          <div className="p-4 sm:p-5" style={{backgroundColor: colors.lightGray}}>
            <div className="flex items-center justify-center space-x-2 bg-white p-1 rounded-lg shadow-inner" style={{borderColor: colors.ashGray}}>
              <button onClick={() => setIsProMode(false)} className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center justify-center space-x-1.5 ${!isProMode ? `bg-[${colors.primaryGreen}] text-white shadow-md` : `text-[${colors.darkGreenGray}] hover:bg-opacity-50 hover:bg-[${colors.ashGray}]`}`}>
                <ShieldOff className={`w-4 h-4 ${!isProMode ? 'text-white' : `text-[${colors.primaryGreen}]`}`} /><span>Gratis (Iklan)</span>
              </button>
              <button onClick={() => setIsProMode(true)} className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center justify-center space-x-1.5 ${isProMode ? `bg-[${colors.primaryGreen}] text-white shadow-md` : `text-[${colors.darkGreenGray}] hover:bg-opacity-50 hover:bg-[${colors.ashGray}]`}`}>
                <Star className={`w-4 h-4 ${isProMode ? 'text-yellow-300' : `text-[${colors.primaryGreen}]`}`} /><span>Pro (Tanpa Iklan)</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 sm:p-6">
            <div
              className={`relative mx-auto w-full aspect-[4/3] sm:aspect-square max-w-[320px] sm:max-w-[280px] rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all duration-300 
              ${(isScanning && !!uploadedImage) || (isMonetagAdShowing || isTelegaAdShowing) && !isCameraOpen ? `border-[${colors.primaryGreen}] shadow-xl shadow-green-500/20` : ''} 
              ${isCameraOpen ? `border-[${colors.primaryGreen}] border-solid` : `border-[${colors.ashGray}]`} 
              ${isProMode && !isScanning && !imagePreviewUrl && !isCameraOpen && !isMonetagAdShowing && !isTelegaAdShowing ? `border-[${colors.primaryGreen}] border-solid shadow-lg shadow-green-500/10` : ''} 
              ${imagePreviewUrl ? 'border-solid border-dashed' : (isCameraOpen ? 'border-solid' : 'border-dashed')}`}
              style={{ backgroundColor: colors.lightGray, borderColor: imagePreviewUrl ? colors.primaryGreen : (isCameraOpen || (isScanning && !!uploadedImage) || isMonetagAdShowing || isTelegaAdShowing ? colors.primaryGreen : (isProMode && !isScanning && !isCameraOpen ? colors.primaryGreen : colors.ashGray)) }}
            >
              {isCameraOpen ? (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover rounded-xl" playsInline muted autoPlay />
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                      <button 
                        onClick={takePhoto} 
                        disabled={!videoRef.current?.srcObject || !videoRef.current?.videoWidth || videoRef.current.readyState < videoRef.current.HAVE_METADATA}
                        style={{ backgroundColor: 'rgba(35,139,69,0.8)', color: colors.white, borderColor: colors.primaryGreen }} 
                        className="font-semibold py-2.5 px-5 rounded-full text-sm shadow-md hover:bg-opacity-90 border-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center backdrop-blur-sm">
                        <Camera className="w-5 h-5 mr-2" />Ambil Foto
                      </button>
                      <button onClick={closeCamera} style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: colors.white, borderColor: colors.ashGray }} className="font-semibold p-2.5 rounded-full text-sm shadow-md hover:bg-opacity-70 border-2 flex items-center backdrop-blur-sm" aria-label="Tutup Kamera"><XCircle className="w-5 h-5" /></button>
                    </div>
                  </>
              ) : imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Pratinjau Unggahan" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Camera className={`h-16 w-16 sm:h-20 sm:w-20 transition-opacity duration-300 mb-3 ${isScanning || isMonetagAdShowing || isTelegaAdShowing ? `text-[${colors.primaryGreen}] opacity-40` : `text-[${colors.ashGray}] opacity-70`}`} />
                  <p style={{color: colors.darkGreenGray}} className="text-sm">Klik "{mainButtonText()}"<br/>atau unggah gambar.</p>
                </div>
              )}
              {!isCameraOpen && !imagePreviewUrl && !isScanning && !isMonetagAdShowing && !isTelegaAdShowing && (
                  <>
                    <div className={`absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-l-[3px] rounded-tl-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                    <div className={`absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-r-[3px] rounded-tr-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                    <div className={`absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-l-[3px] rounded-bl-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                    <div className={`absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-r-[3px] rounded-br-lg ${isProMode ? `border-[${colors.primaryGreen}]` : `border-[${colors.ashGray}]`}`}></div>
                  </>
              )}
              {imagePreviewUrl && !isScanning && !isCameraOpen && !isMonetagAdShowing && !isTelegaAdShowing && (
                <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors z-20" aria-label="Buang gambar"><XCircle className="w-5 h-5 sm:w-6 sm:h-6" /></button>
              )}
              {((isScanning && !!uploadedImage && !isMonetagAdShowing) || (isScanning && !isCameraOpen && !uploadedImage && !isMonetagAdShowing) || isMonetagAdShowing || isTelegaAdShowing) && !isCameraOpen && (
                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl bg-black bg-opacity-20 flex items-center justify-center z-10 backdrop-blur-sm"><Loader2 className={`h-16 w-16 animate-spin text-[${colors.primaryGreen}]`} /></div>
              )}
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          </div>
          
          <div className="px-5 sm:px-6 pb-3 sm:pb-4 space-y-3">
            <button 
                onClick={handleMainScanClick} 
                disabled={mainButtonDisabled}
                style={{ backgroundColor: mainButtonDisabled ? colors.ashGray : colors.primaryGreen, color: colors.white }} 
                className={`w-full text-white font-semibold py-3 px-6 rounded-xl text-base sm:text-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center ${mainButtonDisabled ? 'opacity-60 cursor-not-allowed' : `hover:opacity-90 hover:shadow-lg focus:ring-[${colors.primaryGreen}]`}`}>
              { (isMonetagAdShowing || isTelegaAdShowing || (isScanning && !isCameraOpen && !uploadedImage && !mainButtonText().includes("Menganalisis")) ) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {mainButtonText()}
            </button>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} id="imageUploadInputScannerPage" />
            <button 
                onClick={() => { if (isCameraOpen) closeCamera(); fileInputRef.current?.click(); }} 
                disabled={isScanning || isMonetagAdShowing || isTelegaAdShowing || isCameraOpen}
                style={{ backgroundColor: (isScanning || isMonetagAdShowing || isTelegaAdShowing || isCameraOpen) ? colors.ashGray : colors.darkGreenGray, color: colors.white, }} 
                className={`w-full text-white font-semibold py-2.5 px-6 rounded-xl text-sm sm:text-base transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center space-x-2 ${(isScanning || isMonetagAdShowing || isTelegaAdShowing || isCameraOpen) ? 'opacity-60 cursor-not-allowed' : `hover:opacity-90 hover:shadow-md focus:ring-[${colors.darkGreenGray}]`}`}>
              <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" /><span>{imagePreviewUrl ? 'Ganti Gambar' : (isCameraOpen ? 'Tutup Kamera & Unggah' : 'Unggah Gambar Chart')}</span>
            </button>
          </div>

          {feedbackMessage && (
            <div className={`mx-5 sm:mx-6 mb-5 sm:mb-6 p-3.5 sm:p-4 border-l-4 rounded-md shadow-md flex items-start space-x-3 ${feedbackStyles.bgColor}`} style={{borderColor: feedbackStyles.borderColor}}>
              <div className="flex-shrink-0 pt-0.5">{feedbackStyles.icon}</div>
              <p className={`text-sm ${feedbackStyles.textColor}`}>{feedbackMessage}{cameraError && <span className="block mt-1 text-xs">{cameraError}</span>}</p>
            </div>
          )}
        </div>
        
        <footer className="mt-6 text-center">
          <p style={{color: colors.ashGray}} className="text-xs">{isProMode ? "Anda menggunakan Mode Pro." : "Mode Gratis mungkin menampilkan iklan setelah hasil analisis."}</p>
        </footer>

        <style jsx global>{`
          @keyframes scan-line-animation {0% { transform: translateY(-10%); opacity: 0.6; } 50% { transform: translateY(calc(100% + 5px)); opacity: 1; } 100% { transform: translateY(-10%); opacity: 0.6;}}
        `}</style>
      </main>
    </>
  );
}
