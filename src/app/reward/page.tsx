import { useCallback, useEffect, useState } from "react";

// --- KOMPONEN RewardsPage (Tidak diubah signifikan, hanya memastikan konsistensi) ---
export function RewardsPage() { 
  const [isMonetagSdkReadyRewards, setIsMonetagSdkReadyRewards] = useState(false); 
  const [rewardMessageRewards, setRewardMessageRewards] = useState('');

  const MONETAG_REWARDED_INTERSTITIAL_ZONE_ID_RP = 9375207; 
  const MONETAG_REWARDED_POPUP_ZONE_ID_RP = 9375207;

  const checkSdkFunctionsAvailabilityRewards = useCallback(() => {
    const sdkGlobalObject = window.monetag;
    const specificZoneFunction = window[`show_${MONETAG_REWARDED_POPUP_ZONE_ID_RP}`];
    const generalApiFunctionsReady = sdkGlobalObject && 
                                     (typeof sdkGlobalObject.rewarded?.showAd === 'function' || 
                                      typeof sdkGlobalObject.rewardedPopup?.show === 'function');

    if (specificZoneFunction || generalApiFunctionsReady) {
      console.log('Monetag SDK functions are available on RewardsPage.');
      setIsMonetagSdkReadyRewards(true); 
      return true;
    }
    return false;
  }, [setIsMonetagSdkReadyRewards]);

  const handleSdkLoadRewards = useCallback(() => {
    console.log('Monetag SDK script loaded on RewardsPage. Verifying function availability...');
    let attempts = 0;
    const maxAttempts = 15; 
    let sdkFunctionsVerified = false; 

    const intervalId = setInterval(() => {
      attempts++;
      console.log(`RewardsPage: Checking Monetag API readiness, attempt ${attempts}`);
      if (checkSdkFunctionsAvailabilityRewards()) { 
        sdkFunctionsVerified = true;
        clearInterval(intervalId);
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        if (!sdkFunctionsVerified) { 
          console.error('Monetag SDK functions (RewardsPage) did not become available after multiple attempts.');
          setRewardMessageRewards('Gagal memverifikasi API iklan sepenuhnya di Halaman Hadiah. Coba segarkan halaman.');
          setIsMonetagSdkReadyRewards(false); 
        }
      }
    }, 1000);
    return () => clearInterval(intervalId); 
  }, [checkSdkFunctionsAvailabilityRewards]); 

  useEffect(() => {
    if (isMonetagSdkReadyRewards) {
        if (rewardMessageRewards === '' || rewardMessageRewards.includes('memuat') || rewardMessageRewards.includes('memverifikasi')) { 
            setRewardMessageRewards('SDK Iklan siap digunakan di Halaman Hadiah.');
        }
    }
  }, [isMonetagSdkReadyRewards, rewardMessageRewards]); 


  const handleSdkErrorRewards = useCallback(() => {
    console.error('Failed to load Monetag SDK on RewardsPage');
    setRewardMessageRewards('Gagal memuat SDK iklan untuk Halaman Hadiah.');
    setIsMonetagSdkReadyRewards(false);
  }, []);

  const createAdOptionsRewards = (type: string): MonetagAdOptions => ({ 
      onReward: () => setRewardMessageRewards(`Selamat! Anda mendapatkan hadiah dari ${type} (Halaman Hadiah).`),
      onAdFailed: (error?: any) => {
        console.error(`Monetag: Ad failed to load for ${type} (RewardsPage).`, error);
        setRewardMessageRewards(`Maaf, ${type} gagal dimuat (Halaman Hadiah).`);
      },
      onAdClosed: () => {
        if (rewardMessageRewards.includes('Memuat Iklan')) { 
            setRewardMessageRewards(`${type} ditutup (Halaman Hadiah).`);
        }
      }
  });

  const showInterstitialVideoRewards = () => {
    if (isMonetagSdkReadyRewards && window.monetag?.rewarded?.showAd) {
      setRewardMessageRewards('Memuat Iklan Interstitial (Halaman Hadiah)...');
      window.monetag.rewarded.showAd(MONETAG_REWARDED_INTERSTITIAL_ZONE_ID_RP, createAdOptionsRewards('Iklan Interstitial'));
    } else {
      setRewardMessageRewards('SDK belum siap di Halaman Hadiah. Coba lagi nanti.');
    }
  };

  const showRewardedPopupRewards = () => {
    if (!isMonetagSdkReadyRewards) {
        setRewardMessageRewards('SDK belum siap di Halaman Hadiah. Coba lagi nanti.');
        return;
    }
    const specificZoneFunction = window[`show_${MONETAG_REWARDED_POPUP_ZONE_ID_RP}`];
    const adOptions = createAdOptionsRewards('Iklan Popup');

    setRewardMessageRewards('Memuat Iklan Popup (Halaman Hadiah)...');
    try {
      if (typeof specificZoneFunction === 'function') {
          specificZoneFunction(adOptions);
      } else if (window.monetag?.rewardedPopup?.show) {
        window.monetag.rewardedPopup.show(MONETAG_REWARDED_POPUP_ZONE_ID_RP, adOptions);
      } else if (window.monetag?.rewarded?.showAd) { 
        window.monetag.rewarded.showAd(MONETAG_REWARDED_POPUP_ZONE_ID_RP, adOptions);
      } else {
        setRewardMessageRewards('Fungsi Popup tidak ada di SDK (Halaman Hadiah).');
      }
    } catch (error) {
        console.error('Error calling Monetag ad function for RewardsPage popup:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setRewardMessageRewards(`Gagal menampilkan Iklan Popup: ${errorMessage}`);
    }
  };

  return (
    <>
      <Script
        id="monetag-sdk-rewards-page" 
        src={MONETAG_SDK_URL} 
        strategy="afterInteractive"
        onLoad={handleSdkLoadRewards}
        onError={handleSdkErrorRewards}
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Halaman Hadiah Monetag</h1>
          
          <button
            onClick={showInterstitialVideoRewards}
            disabled={!isMonetagSdkReadyRewards}
            className={`w-full px-6 py-3.5 mb-4 font-semibold rounded-lg text-white transition-all duration-300 ease-in-out transform hover:scale-105
                        ${isMonetagSdkReadyRewards ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
          >
            {isMonetagSdkReadyRewards ? 'Tonton Iklan Interstitial' : 'Memuat Iklan...'}
          </button>

          <button
            onClick={showRewardedPopupRewards}
            disabled={!isMonetagSdkReadyRewards}
            className={`w-full px-6 py-3.5 font-semibold rounded-lg text-white transition-all duration-300 ease-in-out transform hover:scale-105
                        ${isMonetagSdkReadyRewards ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
          >
            {isMonetagSdkReadyRewards ? 'Tampilkan Iklan Popup & Dapatkan Hadiah!' : 'Memuat Iklan...'}
          </button>

          {rewardMessageRewards && (
            <p className={`mt-8 text-lg font-medium p-3 rounded-md
                         ${rewardMessageRewards.startsWith('Maaf') || rewardMessageRewards.startsWith('Gagal') ? 'text-red-700 bg-red-100 border border-red-300' : 
                           rewardMessageRewards.startsWith('Selamat!') ? 'text-green-700 bg-green-100 border border-green-300' : 
                           'text-gray-600 bg-gray-100 border border-gray-300'}`}>
              {rewardMessageRewards}
            </p>
          )}

          {!isMonetagSdkReadyRewards && !rewardMessageRewards.includes("Gagal") && (
            <p className="mt-6 text-sm text-gray-500 animate-pulse">
              SDK iklan sedang dimuat dan diverifikasi untuk Halaman Hadiah. Mohon tunggu...
            </p>
          )}
        </div>
      </div>
    </>
  );
}
