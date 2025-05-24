'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    monetag?: {
      rewarded?: {
        showAd: (zoneId: number, options?: any) => void;
        callbacks?: {
          [key: number]: {
            onReward?: () => void;
            onAdFailed?: () => void;
            onAdClosed?: () => void;
          };
        };
      };
      rewardedPopup?: {
        show?: (zoneId: number, options?: any) => void; // Atau showAd, periksa dokumentasi Monetag
        on?: (event: string, zoneId: number, callback: () => void) => void;
        off?: (event: string, zoneId: number, callback: () => void) => void;
      };
      setAdEventHandler?: (handler: (eventType: string, eventData: { zoneId: number; [key: string]: any }) => void) => void;
    };
    show_9375207?: (options?: any) => Promise<void>;
  }
}

export default function RewardsPage() {
  const [isMonetagSdkReady, setIsMonetagSdkReady] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  const MONETAG_REWARDED_INTERSTITIAL_ZONE_ID = 12345; // << GANTI INI (Interstitial)
  const MONETAG_REWARDED_POPUP_ZONE_ID = 67890;      // << GANTI INI (Popup)
  const MONETAG_SDK_URL = "//libtl.com/sdk.js"; // << GANTI INI

 

  const handleSdkLoad = useCallback(() => {
    console.log('Monetag SDK loaded.');
    setIsMonetagSdkReady(true);
  }, []);

  const grantInterstitialReward = useCallback(() => {
    console.log('Reward (from Interstitial) granted!');
    setRewardMessage('Selamat! Anda mendapatkan +100 Koin dari Interstitial!');
    // TODO: Logika reward interstitial
  }, []);

  const grantPopupReward = useCallback(() => {
    console.log('Reward (from Popup) granted!');
    setRewardMessage('Selamat! Anda mendapatkan +50 Poin dari Popup!');
    // TODO: Logika reward popup
  }, []);

  const handleAdFailed = useCallback((zoneId: number | undefined, adType: string) => {
    console.error(`Rewarded ${adType} ad failed for zone: ${zoneId || 'N/A'}.`);
    setRewardMessage(`Maaf, iklan ${adType} gagal dimuat. Coba lagi nanti.`);
  }, []);

  const handleAdClosed = useCallback((zoneId: number | undefined, adType: string) => {
    console.log(`Rewarded ${adType} ad closed by user for zone: ${zoneId || 'N/A'}.`);
  }, []);

  const setupInterstitialEventListeners = useCallback(() => {
    if (window.monetag?.rewarded?.callbacks) {
      window.monetag.rewarded.callbacks[MONETAG_REWARDED_INTERSTITIAL_ZONE_ID] = {
        onReward: grantInterstitialReward,
        onAdFailed: () => handleAdFailed(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID, 'interstitial'),
        onAdClosed: () => handleAdClosed(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID, 'interstitial'),
      };
      console.log('Monetag Interstitial callbacks configured.');
    }
  }, [grantInterstitialReward, handleAdFailed, handleAdClosed, MONETAG_REWARDED_INTERSTITIAL_ZONE_ID]);

  const setupPopupEventListeners = useCallback(() => {
    if (window.monetag?.rewardedPopup?.on) {
      window.monetag.rewardedPopup.on('reward', MONETAG_REWARDED_POPUP_ZONE_ID, grantPopupReward);
      window.monetag.rewardedPopup.on('adFailed', MONETAG_REWARDED_POPUP_ZONE_ID, () => handleAdFailed(MONETAG_REWARDED_POPUP_ZONE_ID, 'popup'));
      window.monetag.rewardedPopup.on('adClosed', MONETAG_REWARDED_POPUP_ZONE_ID, () => handleAdClosed(MONETAG_REWARDED_POPUP_ZONE_ID, 'popup'));
      console.log('Monetag Rewarded Popup event listeners configured (hipotetis via .on).');
    } else if (isMonetagSdkReady) {
      console.warn('Monetag SDK ready, but Rewarded Popup event setup method not found as expected.');
    }
  }, [isMonetagSdkReady, grantPopupReward, handleAdFailed, handleAdClosed, MONETAG_REWARDED_POPUP_ZONE_ID]);

  useEffect(() => {
    if (isMonetagSdkReady) {
      setupInterstitialEventListeners();
      setupPopupEventListeners();
    }
    // Cleanup (jika SDK menyediakan cara)
    // return () => { ... };
  }, [isMonetagSdkReady, setupInterstitialEventListeners, setupPopupEventListeners]);

  const showInterstitialVideo = () => {
    setRewardMessage('');
    if (!isMonetagSdkReady || !window.monetag?.rewarded?.showAd) {
      setRewardMessage('SDK Iklan (Interstitial) belum siap.');
      return;
    }
    try {
      window.monetag.rewarded.showAd(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID);
    } catch (error) {
      handleAdFailed(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID, 'interstitial');
    }
  };

  const showRewardedPopup = () => {
    setRewardMessage('');
    // Periksa nama fungsi yang benar: `show` atau `showAd` atau lainnya dari dokumentasi Monetag
    if (!isMonetagSdkReady || !window.monetag?.rewardedPopup?.show) { 
      console.error('Monetag SDK not ready or rewardedPopup.show function not available.');
      setRewardMessage('SDK Iklan (Popup) belum siap atau fungsi show tidak tersedia.');
      return;
    }
    try {
      console.log(`Attempting to show Rewarded Popup for zone: ${MONETAG_REWARDED_POPUP_ZONE_ID}`);
      window.monetag.rewardedPopup.show(MONETAG_REWARDED_POPUP_ZONE_ID, {
        // Opsi tambahan jika ada
      });
    } catch (error) {
      console.error("Error trying to show Monetag Rewarded Popup:", error);
      handleAdFailed(MONETAG_REWARDED_POPUP_ZONE_ID, 'popup');
    }
  };

  return (
    <>
      <Script
        id="monetag-sdk"
        src={MONETAG_SDK_URL}
        strategy="afterInteractive"
        onLoad={handleSdkLoad}
        onError={() => {
          console.error('Failed to load Monetag SDK');
          setRewardMessage('Gagal memuat SDK iklan.');
          setIsMonetagSdkReady(false);
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Halaman Hadiah Monetag</h1>
          
          {/* Tombol untuk Interstitial Ad */}
          <button
            onClick={showInterstitialVideo}
            disabled={!isMonetagSdkReady}
            className={`w-full px-6 py-3 mb-4 font-semibold rounded-lg text-white transition-colors
                        ${isMonetagSdkReady ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {isMonetagSdkReady ? 'Tonton Iklan Interstitial' : 'Memuat Iklan...'}
          </button>

          {/* Tombol untuk Rewarded Popup Ad */}
          <button
            onClick={showRewardedPopup}
            disabled={!isMonetagSdkReady}
            className={`w-full px-6 py-3 font-semibold rounded-lg text-white transition-colors
                        ${isMonetagSdkReady ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {isMonetagSdkReady ? 'Tampilkan Iklan Popup & Dapatkan Hadiah!' : 'Memuat Iklan...'}
          </button>

          {rewardMessage && (
            <p className={`mt-6 text-lg font-medium ${rewardMessage.startsWith('Maaf') || rewardMessage.startsWith('Gagal') ? 'text-red-500' : 'text-green-600'}`}>
              {rewardMessage}
            </p>
          )}

          {!isMonetagSdkReady && (
            <p className="mt-4 text-sm text-gray-500">
              SDK sedang dimuat. Jika tombol tidak aktif dalam beberapa saat, coba segarkan halaman.
            </p>
          )}
        </div>
      </div>
    </>
  );
}