'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    monetag?: {
      rewarded?: {
        showAd: (zoneId: number, options?: Record<string, unknown>) => void; // Perubahan: any -> Record<string, unknown>
        callbacks?: {
          [key: number]: {
            onReward?: () => void;
            onAdFailed?: () => void;
            onAdClosed?: () => void;
          };
        };
      };
      rewardedPopup?: {
        show?: (zoneId: number, options?: Record<string, unknown>) => void; // Perubahan: any -> Record<string, unknown>
        on?: (event: string, zoneId: number, callback: () => void) => void;
        off?: (event: string, zoneId: number, callback: () => void) => void;
      };
      setAdEventHandler?: (handler: (eventType: string, eventData: { zoneId: number; [key: string]: unknown }) => void) => void; // Perubahan: any -> unknown
    };
    show_9375207?: (options?: Record<string, unknown>) => Promise<void>; // Perubahan: any -> Record<string, unknown>
  }
}

export default function RewardsPage() {
  const [isMonetagSdkReady, setIsMonetagSdkReady] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');

  const MONETAG_REWARDED_INTERSTITIAL_ZONE_ID = 9375207;
  const MONETAG_REWARDED_POPUP_ZONE_ID = 9375207;
  const MONETAG_SDK_URL = "//libtl.com/sdk.js";

  const handleSdkLoad = useCallback(() => {
    console.log('Monetag SDK loaded.');
    setIsMonetagSdkReady(true);
  }, []);

  const handleSdkError = useCallback(() => {
    console.error('Failed to load Monetag SDK');
    setRewardMessage('Gagal memuat SDK iklan.');
    setIsMonetagSdkReady(false);
  }, []);

  const showInterstitialVideo = () => {
    if (window.monetag?.rewarded) {
      window.monetag.rewarded.showAd(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID, {
        onReward: () => setRewardMessage('Selamat! Anda mendapatkan hadiah.'),
        onAdFailed: () => setRewardMessage('Maaf, iklan gagal dimuat.'),
        onAdClosed: () => setRewardMessage('Iklan ditutup.')
      });
    } else {
      setRewardMessage('SDK belum siap. Coba lagi nanti.');
    }
  };

  const showRewardedPopup = () => {
    if (window.monetag?.rewardedPopup?.show) {
      window.monetag.rewardedPopup.show(MONETAG_REWARDED_POPUP_ZONE_ID, {
        onReward: () => setRewardMessage('Selamat! Anda mendapatkan hadiah.'),
        onAdFailed: () => setRewardMessage('Maaf, iklan gagal dimuat.'),
        onAdClosed: () => setRewardMessage('Iklan ditutup.')
      });
    } else {
      setRewardMessage('SDK belum siap. Coba lagi nanti.');
    }
  };

  return (
    <>
      <Script
        id="monetag-sdk"
        src={MONETAG_SDK_URL}
        strategy="afterInteractive"
        onLoad={handleSdkLoad}
        onError={handleSdkError}
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