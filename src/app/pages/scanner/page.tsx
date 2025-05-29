'use client';

import React, { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { Camera, AlertCircle, CheckCircle2, Star, ShieldOff, UploadCloud, XCircle, Loader2 } from 'lucide-react';

import createAdHandler from 'monetag-tg-sdk'; 

// --- KONFIGURASI WARNA (REMOVED - Styles will come from Tailwind theme) ---
// const colors = {
//   primaryGreen: '#238B45',
//   lightGray: '#F0F2F0',
//   ashGray: '#B7C1AC',
//   darkGreenGray: '#4E6F5C',
//   white: '#FFFFFF',
//   softBackground: '#E9EEEA',
//   errorRed: '#DC2626',
//   errorBgRed: '#FEE2E2',
// };

// --- KONFIGURASI MONETAG ---
const MONETAG_REWARDED_INTERSTITIAL_ZONE_ID: number = 9375207; 

// --- KONFIGURASI TELEGAIN (REMOVED) ---
// const TELEGAIN_SDK_URL = "https://inapp.telega.io/sdk/v1/sdk.js";
// const TELEGAIN_APP_TOKEN_PLACEHOLDER = "e5af34f5-3ee9-4ae1-877e-788f68a514a0"; 
// const TELEGAIN_AD_BLOCK_UUID = "198e26ba-eeb8-4c82-ae07-c71aa2cff893";
// 
// const IS_TELEGAIN_TOKEN_EXPLICITLY_SET_IN_ENV =
//   (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_TELEGAIN_APP_TOKEN !== undefined);
// 
// const TELEGAIN_TOKEN_FOR_SDK_INIT = IS_TELEGAIN_TOKEN_EXPLICITLY_SET_IN_ENV
//   ? process.env.NEXT_PUBLIC_TELEGAIN_APP_TOKEN
//   : TELEGAIN_APP_TOKEN_PLACEHOLDER;


// --- Custom External Script Loader Component (REMOVED as it was only for TelegaIn) ---
// interface ExternalScriptLoaderProps {
//   id: string;
//   src: string;
//   onLoad?: () => void;
//   onError?: () => void;
// }
// 
// const ExternalScriptLoader: React.FC<ExternalScriptLoaderProps> = ({ id, src, onLoad, onError }) => {
//   useEffect(() => {
//     const existingScript = document.getElementById(id);
//     if (existingScript) {
//       existingScript.remove();
//     }
//     const script = document.createElement('script');
//     script.id = id;
//     script.src = src;
//     script.async = true;
//     const handleLoad = () => {
//       console.log(`Script ${id} loaded successfully from ${src}`);
//       if (onLoad) onLoad();
//     };
//     const handleError = (event: Event | string) => {
//       console.error(`Error loading script ${id} from ${src}:`, event);
//       if (onError) onError();
//     };
//     script.addEventListener('load', handleLoad);
//     script.addEventListener('error', handleError);
//     document.body.appendChild(script);
//     return () => {
//       script.removeEventListener('load', handleLoad);
//       script.removeEventListener('error', handleError);
//       const scriptToRemove = document.getElementById(id);
//       if (scriptToRemove === script) {
//          document.body.removeChild(scriptToRemove);
//       }
//     };
//   }, [id, src, onLoad, onError]);
//   return null;
// };

// --- KOMPONEN UTAMA ScannerPage ---
export default function ScannerPage() {
  const [isMonetagAdShowing, setIsMonetagAdShowing] = useState(false);
  const monetagAdHandlerRef = useRef<(() => Promise<void>) | null>(null);

  // --- TelegaIn State (REMOVED) ---
  // const [canLoadTelegaInSdk, setCanLoadTelegaInSdk] = useState(false); // REMOVED
  // const [isTelegaInSdkLoaded, setIsTelegaInSdkLoaded] = useState(false); // REMOVED
  // const [telegaAdsInstance, setTelegaAdsInstance] = useState<any | null>(null); // REMOVED
  // const [isTelegaAdShowing, setIsTelegaAdShowing] = useState(false); // REMOVED
  // const telegaAdTimeoutRef = useRef<NodeJS.Timeout | null>(null); // REMOVED

  const [feedbackMessage, setFeedbackMessage] = useState('Sedang memuat fitur, mohon tunggu...');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info'>('info');
  const [isScanningActive, setIsScanningActive] = useState(false); 
  const [isAdLoading, setIsAdLoading] = useState(false); 

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
      } else {
        console.error('createAdHandler is not a function. Ensure monetag-tg-sdk is correctly installed and imported.');
        setFeedbackMessage('Gagal inisialisasi SDK Iklan Monetag (handler).');
        setFeedbackType('error');
      }
    } catch (error: any) { 
        console.error('Error initializing Monetag ad handler:', error);
        setFeedbackMessage(`Error Monetag: ${error instanceof Error ? error.message : String(error)}`);
        setFeedbackType('error');
    }
  }, []); 

  // --- Check TWA version and decide if TelegaIn SDK can be loaded (REMOVED) ---

  // --- TelegaIn SDK Handlers (REMOVED) ---

  // --- TelegaIn SDK Initialization (REMOVED) ---

  // --- Feedback Siap Pakai ---
  useEffect(() => {
    const monetagServiceReady = !!monetagAdHandlerRef.current;

    if (feedbackMessage.startsWith("GAGAL memuat skrip") || feedbackMessage.includes('KRITIS:')) {
        return; 
    }
    if (monetagServiceReady) {
        if (feedbackMessage.includes('memuat skrip') || 
            feedbackMessage.includes('memuat fitur') || 
            feedbackMessage.includes('Menginisialisasi') ||
            feedbackMessage.includes('Gagal') ||
            (feedbackMessage.includes('Controller SDK') && feedbackMessage.toLowerCase().includes('monetag')) || // Adjusted for monetag if needed
            (feedbackMessage.includes('Token Aplikasi') && feedbackMessage.toLowerCase().includes('monetag')) // Adjusted for monetag if needed
            ) {
            setFeedbackMessage('Fitur siap. Mulai pindai atau unggah gambar.');
            setFeedbackType('success');
        }
    } else if (!monetagServiceReady && !feedbackMessage.toLowerCase().includes('monetag')) { 
        setFeedbackMessage('Sedang memuat layanan iklan Monetag...');
        setFeedbackType('info');
    }
  }, [feedbackMessage]);

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
      // if (telegaAdTimeoutRef.current) clearTimeout(telegaAdTimeoutRef.current); // REMOVED
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
        else reject(new Error('Gagal konversi base64.'));
      };
      reader.onerror = (error) => reject(new Error('Gagal baca file: ' + (error instanceof ProgressEvent ? 'ProgressEvent' : String(error)) ) );
    });
  }, []);

  const performGeminiScanViaBackend = useCallback(async (imageFile: File | null) => {
    if (!imageFile) {
      setFeedbackMessage('Tidak ada gambar untuk analisis.');
      setFeedbackType('error');
      setIsScanningActive(false);
      return;
    }
    setIsScanningActive(true); 
    setFeedbackMessage('Menganalisis gambar dengan AI...');
    setFeedbackType('info');
    const tradingPrompt = `You are a very useful assistant. Help me with determining the analisis day trading content of my market finance. The photo shows market analisis product for a trading. Determine which products are shown in the photo and return them ONLY as a text list, where each list element should contain:
- Market Structure: (e.g., Uptrend, Downtrend, Sideways, Breakout, Support/Resistance levels)
- Candlestick Pattern: (e.g., Doji, Hammer, Engulfing, Morning Star, etc., and its implication)
- Trend Market: (e.g., Strong Bullish, Weak Bullish, Strong Bearish, Weak Bearish, Neutral)
- Signal Type: (e.g., Buy, Sell, Hold, Wait for Confirmation)
- Bandarmology: (Brief analysis of potential institutional activity if discernible, e.g., Accumulation, Distribution, No Clear Sign)
- Rekomendasi Trading:
  - Time Frame: (Choose one or more:15 minute,30 minute,4 hours or 1 Day)
  - Gaya Trading: (Choose one or more: Scalping, Day Trading, Swing Trading, Position Trading)
  - Resiko: (e.g., Low, Medium, High)
  - Rekomendasi Aksi: (e.g., Buy now, Sell now, Wait for pullback to [price], Set stop loss at [price], Target price [price])
- Sentimen Pasar
- Sentimen Media sosial
`;
    try {
      const base64ImageData = await convertFileToBase64(imageFile);
      const response = await fetch('/api/llm/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: tradingPrompt, imageData: base64ImageData, mimeType: imageFile.type }),
      });

      if (!response.ok) {
        let errorResponseMessage = `Error backend (${response.status})`;
        try {
          const errorData = await response.json();
          errorResponseMessage = errorData.error || JSON.stringify(errorData) || `Error backend (${response.status}) - Respons tidak dikenal`;
        } catch (jsonError) {
          // Jika parsing JSON gagal, coba baca sebagai teks
          try {
            const errorText = await response.text();
            errorResponseMessage = `Error backend (${response.status}): ${errorText || 'Tidak ada detail tambahan.'}`;
          } catch (textError) {
            // Jika membaca sebagai teks juga gagal
            errorResponseMessage = `Error backend (${response.status}) - Gagal membaca respons error.`;
          }
        }
        throw new Error(errorResponseMessage); // This is likely where your console error originates
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
    } catch (error: any) { 
      console.error('Error during Gemini scan:', error);
      setFeedbackMessage(`Analisis AI gagal: ${error instanceof Error ? error.message : String(error)}`);
      setFeedbackType('error');
    } finally {
      setIsScanningActive(false); 
    }
  }, [convertFileToBase64]);

  const displayMonetagRewardedAd = useCallback(async (): Promise<boolean> => {
    if (isProMode) {
      console.log("Pro mode: Skipping Monetag ad.");
      return true; 
    }
    if (!monetagAdHandlerRef.current) {
      console.warn('Monetag ad handler not initialized.');
      setFeedbackMessage('Iklan Monetag belum siap.');
      setFeedbackType('error');
      return false; 
    }
    if (isMonetagAdShowing) {
      console.log('Monetag ad already showing.');
      return false; 
    }
    console.log(`Attempting Monetag Rewarded ad (Zone: ${MONETAG_REWARDED_INTERSTITIAL_ZONE_ID})`);
    setFeedbackMessage('Memuat iklan Monetag...');
    setFeedbackType('info');
    setIsMonetagAdShowing(true);
    setIsAdLoading(true);
    
    try {
      await monetagAdHandlerRef.current();
      console.log('Monetag ad watched/closed.');
      setFeedbackMessage('Iklan Monetag selesai.'); 
      setFeedbackType('success');
      return true; 
    } catch (error: any) { 
      console.warn('Monetag ad failed or skipped. Error:', error);
      setFeedbackMessage('Iklan Monetag gagal/dilewati.');
      setFeedbackType('info'); 
      return false; 
    } finally {
      setIsMonetagAdShowing(false);
      setIsAdLoading(false);
    }
  }, [isProMode, isMonetagAdShowing]); 
  
  // --- displayTelegaInAd REMOVED --- 

  const closeCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
    setIsScanningActive(false); 
    setIsAdLoading(false); 
  }, []);

  const openCamera = useCallback(async () => {
    if (isScanningActive || isCameraOpen || isMonetagAdShowing || isAdLoading) return;
    setIsAdLoading(true); 
    setFeedbackMessage('Mengakses kamera...');
    setFeedbackType('info');
    setCameraError(null);
    if (imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl);
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
                setIsAdLoading(false); 
                setFeedbackMessage('Kamera aktif. Arahkan & ambil foto.');
            }).catch(err => { 
                console.error("Error playing video stream:", err);
                const errorMessage = err instanceof Error ? err.message : String(err);
                setCameraError(`Gagal stream video: ${errorMessage}`);
                setFeedbackMessage(`Gagal stream video: ${errorMessage}`);
                setFeedbackType('error');
                stream.getTracks().forEach(track => track.stop()); 
                setIsCameraOpen(false); setIsAdLoading(false); 
            });
          };
        } else {
            stream.getTracks().forEach(track => track.stop()); setIsAdLoading(false);
            setFeedbackMessage('Ref video tidak ada.'); setFeedbackType('error');
        }
      } catch (err: any) { 
        let message = 'Gagal akses kamera.';
        if (err.name === "NotAllowedError") message = 'Akses kamera ditolak.';
        else if (err.name === "NotFoundError") message = 'Kamera tidak ada.';
        else if (err.name === "NotReadableError") message = 'Kamera bermasalah.';
        else message = `Gagal kamera: ${err.name || String(err)}`;
        setCameraError(message); setFeedbackMessage(message); setFeedbackType('error');
        setIsCameraOpen(false); setIsAdLoading(false);
      }
    } else {
      setFeedbackMessage('Fitur kamera tidak didukung.'); setFeedbackType('error');
      setIsCameraOpen(false); setIsAdLoading(false);
    }
  }, [isScanningActive, isCameraOpen, imagePreviewUrl, isMonetagAdShowing, isAdLoading, closeCamera]); 

  const dataURLtoFile = useCallback((dataurl: string, filename: string): File | null => {
    try {
      const arr = dataurl.split(','); if (arr.length < 2 || !arr[0] || !arr[1]) return null;
      const mimeMatch = arr[0].match(/:(.*?);/); if (!mimeMatch || mimeMatch.length < 2 || !mimeMatch[1]) return null;
      const mime = mimeMatch[1]; const bstr = atob(arr[1]); let n = bstr.length;
      const u8arr = new Uint8Array(n); while (n--) { u8arr[n] = bstr.charCodeAt(n); }
      return new File([u8arr], filename, { type: mime });
    } catch (e: any) { console.error("Error converting data URL to file:", e); return null; } 
  }, []);

  const takePhoto = useCallback(() => {
    if (!isCameraOpen || !videoRef.current || !canvasRef.current) {
        setFeedbackMessage('Kamera tidak aktif.'); setFeedbackType('error'); return;
    }
    if (videoRef.current.readyState >= videoRef.current.HAVE_METADATA && videoRef.current.videoWidth > 0) {
      setFeedbackMessage('Mengambil foto...');
      const video = videoRef.current; const canvas = canvasRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9); 
        if (imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(dataUrl); 
        const photoFile = dataURLtoFile(dataUrl, `scan-${Date.now()}.jpg`);
        if (photoFile) {
          setUploadedImage(photoFile); setFeedbackMessage('Foto diambil.'); setFeedbackType('success');
        } else {
          setFeedbackMessage('Gagal proses foto.'); setFeedbackType('error');
          if (imagePreviewUrl === dataUrl) setImagePreviewUrl(null); 
        }
      } else {
        setFeedbackMessage('Gagal konteks canvas.'); setFeedbackType('error');
      }
      closeCamera(); 
    } else {
        setFeedbackMessage('Kamera belum siap.'); setFeedbackType('error');
    }
  }, [isCameraOpen, closeCamera, dataURLtoFile, imagePreviewUrl]); 

  const handleCloseScanResultsPopup = async () => {
    setShowScanResultsPopup(false);
    setFeedbackMessage('Hasil analisis ditutup.');
    setFeedbackType('info');
    
    if (!isProMode) {
      console.log('Attempting to show Monetag ad after closing results popup.');
      setIsMonetagAdShowing(false); 

      const monetagAdSuccessful = await displayMonetagRewardedAd(); 
      
      if (!monetagAdSuccessful) { 
        console.log('Monetag ad not shown or failed/skipped.');
        setIsAdLoading(false); 
      }
    } else {
      console.log('Pro mode: Skipping ads after closing results.');
    }
  };

  const handleMainScanClick = async () => {
    if (isScanningActive || isCameraOpen || isMonetagAdShowing || isAdLoading) return;

    if (uploadedImage) { 
      if (isProMode) { 
        setShowPurchasePopup(true); 
      } else { 
          console.log("Proceeding with scan (Monetag ad will be shown after results if applicable).");
          performGeminiScanViaBackend(uploadedImage);
      }
    } else { 
      openCamera();
    }
  };

  const handleConfirmPurchase = async () => { 
    setShowPurchasePopup(false);
    
    // Akses window.Telegram.WebApp
    // Tipe WebApp harusnya dikenali dari global.d.ts
    // Define WebApp interface for Telegram Mini App
    interface WebApp {
        showInvoice: (params: { payload: string }, callback: (status: string) => void) => void;
    }
    const tgWebApp: WebApp | undefined = window.Telegram?.WebApp;

    if (tgWebApp && typeof tgWebApp.showInvoice === 'function') {
        try {
            setFeedbackMessage("Membuat invoice pembayaran...");
            setFeedbackType("info");
            
            const demoInvoicePayload = "DEMO_INVOICE_PAYLOAD_REPLACE_WITH_REAL_ONE"; 
            if (demoInvoicePayload === "DEMO_INVOICE_PAYLOAD_REPLACE_WITH_REAL_ONE") {
                 console.warn("Using DEMO invoice payload. Replace with real backend integration for Telegram Stars.");
            }
            // Tipe InvoiceStatus dari global.d.ts akan digunakan di sini
            tgWebApp.showInvoice({ payload: demoInvoicePayload }, (status: string) => {
                console.log('Telegram Invoice Status:', status);
                if (status === 'paid') {
                    setFeedbackMessage('Pembayaran berhasil! Mode Pro diaktifkan.');
                    setFeedbackType('success');
                    setIsProMode(true);
                    if (uploadedImage) {
                        performGeminiScanViaBackend(uploadedImage);
                    }
                } else if (status === 'failed') {
                    setFeedbackMessage('Pembayaran gagal. Silakan coba lagi.');
                    setFeedbackType('error');
                } else if (status === 'pending') {
                    setFeedbackMessage('Pembayaran tertunda. Kami akan update setelah konfirmasi.');
                    setFeedbackType('info');
                } else if (status === 'cancelled') {
                    setFeedbackMessage('Pembayaran dibatalkan.');
                    setFeedbackType('info');
                } else {
                     setFeedbackMessage(`Status pembayaran: ${status}.`);
                     setFeedbackType('info');
                }
            });
        } catch (error: any) { 
            console.error("Error during purchase process (before calling showInvoice):", error);
            setFeedbackMessage(`Gagal proses pembelian: ${error?.message || "Error tidak diketahui."}`);
            setFeedbackType("error");
        }
    } else {
        console.warn("Telegram WebApp showInvoice method not available or Telegram.WebApp is undefined. Simulating purchase for non-Telegram env.");
        setFeedbackMessage('Pembelian Pro (simulasi non-TG) berhasil! Mode Pro aktif.');
        setFeedbackType('success');
        setIsProMode(true); 
        if (uploadedImage) {
            performGeminiScanViaBackend(uploadedImage); 
        }
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
      setFeedbackMessage('Gambar diunggah. Klik tombol pindai.');
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
    setFeedbackMessage('Gambar dibuang. Ambil foto atau unggah baru.');
    setFeedbackType('info');
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  // Updated feedback styles to use Tailwind theme classes
  const getFeedbackStyles = () => {
    switch (feedbackType) {
      case 'success': 
        return { 
          borderColorClass: 'border-primary', 
          bgColorClass: 'bg-primary/10', // Subtle background using primary color with low opacity
          textColorClass: 'text-foreground', // Use main foreground for success text on dark bg
          icon: <CheckCircle2 className="h-5 w-5 text-primary" /> 
        };
      case 'error': 
        return { 
          borderColorClass: 'border-red-500', // Keep red for error indication
          bgColorClass: 'bg-red-500/10', 
          textColorClass: 'text-red-400', // Lighter red for text
          icon: <AlertCircle className="h-5 w-5 text-red-500" /> 
        };
      default: // info
        return { 
          borderColorClass: 'border-muted-foreground', 
          bgColorClass: 'bg-muted-foreground/10', 
          textColorClass: 'text-muted-foreground', 
          icon: <AlertCircle className="h-5 w-5 text-muted-foreground" /> 
        };
    }
  };
  const feedbackStyles = getFeedbackStyles();

  const mainButtonText = () => {
    if (isMonetagAdShowing) return 'Memuat Iklan Monetag...';
    if (isAdLoading && !isCameraOpen && !isScanningActive) return isMonetagAdShowing ? 'Memuat Iklan Monetag...' : 'Memuat Kamera/Iklan...';
    if (isScanningActive) return 'Sedang Menganalisis...'; 
    if (isCameraOpen) return 'Kamera Aktif...'; 
    if (uploadedImage) return isProMode ? 'Pindai (Pro)' : 'Pindai (Gratis)';
    return isProMode ? 'Buka Kamera (Pro)' : 'Buka Kamera (Gratis)';
  };
  
  const mainButtonDisabled = isScanningActive || isAdLoading || isCameraOpen || isMonetagAdShowing;

  // --- Helper function to parse scan results ---
  const parseScanResults = (results: string): Array<{ title: string; content: string; isSubItem?: boolean }> => {
    if (!results || typeof results !== 'string') return [{ title: "Error", content: "Hasil analisis tidak valid atau kosong." }];
    const lines = results.split('\n');
    const parsed: Array<{ title: string; content: string; isSubItem?: boolean }> = [];
    let currentTitle = "Informasi Umum"; // Default title for lines before the first proper title
    let currentContent = "";
    let inRekomendasiTrading = false;
    const rekomendasiSubItems = ["Time Frame", "Gaya Trading", "Resiko", "Rekomendasi Aksi"];
  
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
  
      const titleMatch = trimmedLine.match(/^([\w\s-]+):(.*)$/);
  
      if (titleMatch && titleMatch[1]) {
        const newTitle = titleMatch[1].trim();
        const newContent = titleMatch[2] ? titleMatch[2].trim() : "";
  
        if (currentContent) { // Push previous item if content exists
          parsed.push({ title: currentTitle, content: currentContent.trim() });
          currentContent = ""; // Reset content for the new item
        }
        
        currentTitle = newTitle;
        currentContent = newContent; // Start new content with what's on the title line
  
        if (newTitle.toLowerCase() === "rekomendasi trading") {
          inRekomendasiTrading = true;
        } else if (inRekomendasiTrading && !rekomendasiSubItems.some(sub => newTitle.startsWith(sub))) {
          // If we encounter a new main title after Rekomendasi Trading, end the section
          inRekomendasiTrading = false; 
        }
  
      } else if (trimmedLine.startsWith("- ") && currentTitle) { 
        // Handles list items within a section, typically under Rekomendasi Trading
        if (currentContent) currentContent += '\n'; // Add newline if there's existing content for this title
        currentContent += trimmedLine;
      } else if (currentTitle) { // Line is part of the content of the current item
        if (currentContent) currentContent += '\n';
        currentContent += trimmedLine;
      }
    }
  
    // Push the last item
    if (currentTitle && currentContent.trim()) {
      parsed.push({ title: currentTitle, content: currentContent.trim() });
    } else if (currentTitle && !currentContent.trim() && parsed.length > 0 && parsed[parsed.length-1].title === currentTitle){
      // If the last item had a title but no new content line, its content might be in parsed already.
    } else if (currentTitle) {
       // If there was a title but no content followed (e.g. "Rekomendasi Trading:" then sub-items)
       // It might already be handled, or it indicates a section without direct content.
       // For now, we ensure it doesn't create an empty content item if it's the last thing.
    }

    if (parsed.length === 0 && results.trim()) {
      return [{ title: "Analisis Detail", content: results.trim() }];
    }
    if (parsed.length === 0 && !results.trim()) {
        return [{ title: "Info", content: "Tidak ada hasil untuk ditampilkan." }];
    }
  
    // Post-process to group Rekomendasi Trading sub-items
    const finalParsed: Array<{ title: string; content: string; isSubItem?: boolean }> = [];
    let rekomendasiBuffer: { title: string; content: string; isSubItem?: boolean } | null = null;
  
    for (const item of parsed) {
      if (item.title.toLowerCase() === "rekomendasi trading") {
        if (rekomendasiBuffer) finalParsed.push(rekomendasiBuffer); // Push previous if any
        rekomendasiBuffer = { title: "Rekomendasi Trading", content: item.content, isSubItem: false };
      } else if (rekomendasiBuffer && rekomendasiSubItems.some(sub => item.title.startsWith(sub))) {
        rekomendasiBuffer.content += `\n\n**${item.title}:**\n${item.content}`;
      } else {
        if (rekomendasiBuffer) {
          finalParsed.push(rekomendasiBuffer);
          rekomendasiBuffer = null;
        }
        finalParsed.push(item);
      }
    }
    if (rekomendasiBuffer) finalParsed.push(rekomendasiBuffer);
  
    return finalParsed.length > 0 ? finalParsed : [{ title: "Analisis", content: "Tidak ada detail analisis." }];
  };

  return (
    <>
      {/* TelegaIn ExternalScriptLoader REMOVED */}
      <main className="flex min-h-screen flex-col items-center justify-center p-4 font-sans relative">
        {showPurchasePopup && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md text-center">
              <Star className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-foreground">Aktivasi Mode Pro</h2>
              <p className="text-sm mb-6 text-muted-foreground">Nikmati pemindaian tanpa iklan dan fitur eksklusif dengan Telegram Stars!</p>
              <div className="space-y-3">
                <button 
                  onClick={handleConfirmPurchase} 
                  className="w-full font-semibold py-3 px-6 rounded-lg text-base transition-opacity hover:opacity-90 flex items-center justify-center bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path d="M11.208 2.062a2.25 2.25 0 013.584 0l1.316 1.487 2.226-.055a2.25 2.25 0 012.253 2.253l-.055 2.225 1.488 1.316a2.25 2.25 0 010 3.584l-1.488 1.316.055 2.226a2.25 2.25 0 01-2.253 2.253l-2.226-.055-1.316 1.488a2.25 2.25 0 01-3.584 0l-1.316-1.488-2.226.055a2.25 2.25 0 01-2.253-2.253l.055-2.226-1.488-1.316a2.25 2.25 0 010-3.584l1.488-1.316-.055-2.226a2.25 2.25 0 012.253-2.253l2.226.055 1.316-1.487zM12 7.5a.75.75 0 00-.75.75v3a.75.75 0 00.75.75h3a.75.75 0 00.75-.75V9a.75.75 0 00-.75-.75h-3z" />
                    <path fillRule="evenodd" d="M6.112 5.342c.2-.2.487-.28.773-.28s.573.08.773.28l1.316 1.316-.05.004-2.226.055-.055 2.226.004-.05 1.316 1.316a.75.75 0 001.06 0l1.316-1.316.005.05.055 2.226.055-2.226.005-.05 1.316-1.316a.75.75 0 000-1.06l-1.316-1.316-.005.05L8.97 3.75H6.744l-.05.005 1.316 1.316a.75.75 0 000 1.06L6.744 7.4V5.175l-.005.05-1.316-1.316a.75.75 0 00-1.06 0L3.05 5.175l.005-.05L3 7.4h2.226l.05-.005-1.316-1.316a.75.75 0 00-1.06-1.06l-1.316 1.316-.05-.005L3 8.97V6.744l.005.05 1.316-1.316zm10.582 6.242c.2-.2.487-.28.773-.28s.573.08.773.28l1.316 1.316-.05.004-2.226.055-.055 2.226.004-.05 1.316 1.316a.75.75 0 001.06 0l1.316-1.316.005.05.055 2.226.055-2.226.005-.05 1.316-1.316a.75.75 0 000-1.06l-1.316-1.316-.005.05L20.25 15H18.02l-.05.005 1.316 1.316a.75.75 0 000 1.06l-1.316 1.316.05.005.055-2.226.055 2.226.005.05-1.316 1.316a.75.75 0 00-1.06 0l-1.316-1.316-.005-.05-2.226-.055-2.226.055-.005.05-1.316 1.316a.75.75 0 00-1.06 0l-1.316-1.316.05-.005.055 2.226.055-2.226.005-.05 1.316-1.316a.75.75 0 000-1.06l-1.316-1.316-.005.05L8.97 15H6.744l-.05.005 1.316 1.316a.75.75 0 000 1.06L6.744 18.6V16.38l-.005.05-1.316-1.316a.75.75 0 00-1.06 0l-1.316 1.316.05-.005L3 18.6h2.226l.05-.005-1.316-1.316a.75.75 0 00-1.06-1.06l-1.316 1.316-.05-.005L3 20.25V18.02l.005.05 1.316-1.316z" clipRule="evenodd" />
                  </svg>
                  Beli dengan Stars
                </button>
                <button onClick={() => setShowPurchasePopup(false)} className="w-full font-semibold py-3 px-6 rounded-lg text-base border border-border text-muted-foreground transition-colors hover:bg-neutral-700/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card">Batal</button>
              </div>
            </div>
          </div>
        )}

        {showScanResultsPopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-md transition-opacity duration-300 ease-in-out">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100 opacity-100">
              <div className="p-6 text-center border-b border-border">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
                <h2 className="text-2xl font-semibold text-foreground">Hasil Analisis AI Trading</h2>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5 custom-scrollbar-dark">
                {parseScanResults(scanResults).map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${result.isSubItem ? 'ml-4 border-neutral-700 bg-neutral-800/30' : 'border-border bg-background/50 shadow-sm'}`}>
                    <h3 className={`font-semibold text-lg mb-2 ${result.isSubItem ? 'text-primary/90' : 'text-primary'}`}>{result.title}</h3>
                    <div className="whitespace-pre-wrap break-words text-sm text-muted-foreground leading-relaxed">
                      {result.content.split('\n').map((line, lineIndex) => {
                        const boldMatch = line.match(/\*\*(.*?)\*\*/);
                        if (boldMatch && boldMatch[1]) {
                          const parts = line.split(/\*\*(.*?)\*\*/);
                          return (
                            <React.Fragment key={lineIndex}>
                              {parts.map((part, i) => 
                                i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
                              )}
                              <br/>
                            </React.Fragment>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return (
                            <span key={lineIndex} className="flex items-start">
                              <span className="mr-2 mt-1 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"></span>
                              <span>{line.substring(2)}</span>
                              <br/>
                            </span>
                          );
                        }
                        return <React.Fragment key={lineIndex}>{line}<br/></React.Fragment>;
                      })}
                    </div>
                  </div>
                ))}
                {parseScanResults(scanResults).length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Tidak ada hasil analisis untuk ditampilkan.</p>
                )}
              </div>

              <div className="p-6 border-t border-border">
                <button 
                  onClick={handleCloseScanResultsPopup} 
                  className="w-full font-semibold py-3 px-6 rounded-lg text-base transition-opacity hover:opacity-90 bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card"
                >
                  Tutup & Lanjutkan
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-neutral-800/70">
          <div className="bg-neutral-800/50 p-5 sm:p-6 text-center border-b border-border">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Pemindai Analisis Trading</h1>
            <p className="text-xs sm:text-sm mt-1 text-muted-foreground">Gunakan kamera atau unggah gambar chart untuk analisis AI.</p>
          </div>

          <div className="p-4 sm:p-5 bg-card">
            <div className="flex items-center justify-center space-x-2 bg-background p-1 rounded-lg shadow-inner border border-border">
              <button 
                onClick={() => setIsProMode(false)} 
                className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center justify-center space-x-1.5 
                            ${!isProMode ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-neutral-700/60'}`}>
                <ShieldOff className={`w-4 h-4 ${!isProMode ? 'text-primary-foreground' : 'text-primary'}`} />
                <span>free & ads</span>
              </button>
              <button 
                onClick={() => setIsProMode(true)} 
                className={`flex-1 py-2 px-3 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ease-out flex items-center justify-center space-x-1.5 
                            ${isProMode ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-neutral-700/60'}`}>
                <Star className={`w-4 h-4 ${isProMode ? 'text-primary' : 'text-primary'}`} />
                <span>Pro & No ads</span>
              </button>
            </div>
          </div>
          
          <div className="p-5 sm:p-6 bg-card">
            <div
              className={`relative mx-auto w-full aspect-[4/3] sm:aspect-square max-w-[320px] sm:max-w-[280px] rounded-xl overflow-hidden border-2 flex items-center justify-center transition-all duration-300 bg-background 
              ${(isScanningActive || isAdLoading || isMonetagAdShowing) && !isCameraOpen ? 'border-primary shadow-xl shadow-primary/20' : 'border-border'} 
              ${isCameraOpen ? 'border-primary border-solid' : 'border-dashed'} 
              ${isProMode && !isScanningActive && !isAdLoading && !imagePreviewUrl && !isCameraOpen && !isMonetagAdShowing ? 'border-primary border-solid shadow-lg shadow-primary/10' : ''} 
              ${imagePreviewUrl ? 'border-solid border-primary' : (isCameraOpen ? 'border-solid border-primary' : 'border-dashed border-border')}`}
            >
              {isCameraOpen ? (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover rounded-xl" playsInline muted autoPlay />
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                      <button 
                        onClick={takePhoto} 
                        disabled={!videoRef.current?.srcObject || !videoRef.current?.videoWidth || videoRef.current.readyState < videoRef.current.HAVE_METADATA}
                        className="font-semibold py-2.5 px-5 rounded-full text-sm shadow-md flex items-center backdrop-blur-sm bg-primary/80 text-primary-foreground hover:bg-primary/90 border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed">
                        <Camera className="w-5 h-5 mr-2" />Ambil Foto
                      </button>
                      <button 
                        onClick={closeCamera} 
                        className="font-semibold p-2.5 rounded-full text-sm shadow-md flex items-center backdrop-blur-sm bg-black/50 text-white hover:bg-black/70 border-2 border-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Tutup Kamera">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </>
              ) : imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Pratinjau Unggahan" className="w-full h-full object-contain rounded-xl" />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Camera className={`h-16 w-16 sm:h-20 sm:w-20 transition-opacity duration-300 mb-3 ${(isScanningActive || isAdLoading || isMonetagAdShowing) ? 'text-primary opacity-40' : 'text-muted-foreground opacity-70'}`} />
                  <p className="text-sm text-muted-foreground">Klik "{mainButtonText()}"<br/>atau unggah gambar.</p>
                </div>
              )}
              {!isCameraOpen && !imagePreviewUrl && !isScanningActive && !isAdLoading && !isMonetagAdShowing && (
                  <>
                    <div className={`absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-l-[3px] rounded-tl-lg ${isProMode ? 'border-primary' : 'border-border'}`}></div>
                    <div className={`absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-t-[3px] border-r-[3px] rounded-tr-lg ${isProMode ? 'border-primary' : 'border-border'}`}></div>
                    <div className={`absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-l-[3px] rounded-bl-lg ${isProMode ? 'border-primary' : 'border-border'}`}></div>
                    <div className={`absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 border-b-[3px] border-r-[3px] rounded-br-lg ${isProMode ? 'border-primary' : 'border-border'}`}></div>
                  </>
              )}
              {imagePreviewUrl && !isScanningActive && !isAdLoading && !isCameraOpen && !isMonetagAdShowing && (
                <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-primary" aria-label="Buang gambar"><XCircle className="w-5 h-5 sm:w-6 sm:h-6" /></button>
              )}
              {(isMonetagAdShowing || (isScanningActive && !isCameraOpen) || (isAdLoading && !isCameraOpen) ) && (
                  <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl bg-black/30 flex items-center justify-center z-10 backdrop-blur-sm"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
              )}
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          </div>
          
          <div className="px-5 sm:px-6 pb-3 sm:pb-4 space-y-3 bg-card">
            <button 
                onClick={handleMainScanClick} 
                disabled={mainButtonDisabled}
                className={`w-full font-semibold py-3 px-6 rounded-xl text-base sm:text-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center 
                            ${mainButtonDisabled ? 'bg-neutral-700 text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg focus:ring-primary/50'}`}>
              { (isAdLoading || isMonetagAdShowing || (isScanningActive && !isCameraOpen && !mainButtonText().includes("Menganalisis")) ) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {mainButtonText()}
            </button>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef} id="imageUploadInputScannerPage" />
            <button 
                onClick={() => { if (isCameraOpen) closeCamera(); fileInputRef.current?.click(); }} 
                disabled={mainButtonDisabled}
                className={`w-full font-semibold py-2.5 px-6 rounded-xl text-sm sm:text-base transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center space-x-2 
                            ${mainButtonDisabled ? 'bg-neutral-800 text-muted-foreground cursor-not-allowed' : 'bg-neutral-700 text-foreground hover:bg-neutral-600 hover:shadow-md focus:ring-neutral-500'}`}>
              <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" /><span>{imagePreviewUrl ? 'Ganti Gambar' : (isCameraOpen ? 'Tutup Kamera & Unggah' : 'Unggah Gambar Chart')}</span>
            </button>
          </div>

          {/* Feedback Message Section - Themed */}
          {feedbackMessage && (
            <div className={`mx-5 sm:mx-6 mb-5 sm:mb-6 p-3.5 sm:p-4 border-l-4 rounded-md shadow-md flex items-start space-x-3 ${feedbackStyles.bgColorClass} ${feedbackStyles.borderColorClass}`}>
              <div className="flex-shrink-0 pt-0.5">{feedbackStyles.icon}</div>
              <p className={`text-sm ${feedbackStyles.textColorClass}`}>{feedbackMessage}{cameraError && <span className="block mt-1 text-xs">{cameraError}</span>}</p>
            </div>
          )}
        </div>
        
        <footer className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">{isProMode ? "Anda menggunakan Mode Pro." : "Mode Gratis mungkin menampilkan iklan setelah hasil analisis."}</p>
        </footer>

        <style jsx global>{`
          .custom-scrollbar-dark::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-track {
            background: var(--color-card, #1E1E1E); /* Fallback */
            border-radius: 10px;
          }
          .custom-scrollbar-dark::-webkit-scrollbar-thumb {
            background-color: var(--color-muted-foreground, #A0A0A0); /* Fallback */
            border-radius: 10px;
            border: 2px solid var(--color-card, #1E1E1E); /* Fallback */
          }
          .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
            background-color: var(--color-primary, #FFFFFF); /* Fallback */
          }
          @keyframes scan-line-animation {0% { transform: translateY(-10%); opacity: 0.6; } 50% { transform: translateY(calc(100% + 5px)); opacity: 1; } 100% { transform: translateY(-10%); opacity: 0.6;}}
        `}</style>
      </main>
    </>
  );
}
