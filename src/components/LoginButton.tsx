import { supabase } from '@/lib/supabaseClient';
import {
  useTonConnectUI,
  useTonWallet,
  Wallet, 
  TonConnectButton 
} from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';

export default function LoginButton() {
  const [/* tonConnectUI */, /* setOptions */] = useTonConnectUI(); 
  const wallet = useTonWallet(); // 'wallet' didefinisikan di sini
  const [userSubscription, setUserSubscription] = useState<string | null>(null); 

  const fetchUserSubscription = useCallback(async (userId: string) => {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    return data ? data.status : 'free_with_ads';
  }, []);

  const handleSupabaseLogin = useCallback(async (connectedWallet: Wallet) => { // 'connectedWallet' adalah parameter di sini
    if (!supabase) {
      console.error("Supabase client tidak terinisialisasi.");
      return;
    }

    // Pastikan kita menggunakan 'connectedWallet' dari parameter fungsi ini
    const userFriendlyAddress = connectedWallet.account.address;
    const chain = connectedWallet.account.chain;

    try {
      const { data: userData, error: upsertError } = await supabase
        .from('users') 
        .upsert({
          wallet_address: userFriendlyAddress,
          chain: chain, // Menggunakan 'chain' dari 'connectedWallet'
          last_login_at: new Date(), // Menambahkan last_login_at seperti di versi duplikat
        })
        .select('id, subscription_status') 
        .single();

      if (upsertError) throw upsertError;

      if (userData) {
        console.log('User logged in/updated:', userData);
        // Menggunakan userData.id untuk fetchUserSubscription
        const subscription = await fetchUserSubscription(userData.id);
        setUserSubscription(subscription);
        console.log('User subscription status:', subscription);

        if (subscription === 'free_with_ads') {
          console.log('User is on free plan with ads. Show ads.');
        } else if (subscription === 'pro') {
          console.log('User is on pro plan. Unlock pro features.');
        }
      }
    } catch (error) {
      console.error('Error during Supabase login/upsert:', error);
      alert('Terjadi kesalahan saat login ke Supabase.'); // Memberikan feedback ke user
    }
  }, [fetchUserSubscription, setUserSubscription]);

  useEffect(() => {
    if (wallet) { // 'wallet' dari useTonWallet() digunakan di sini
      console.log('Wallet connected:', wallet);
      handleSupabaseLogin(wallet); // Meneruskan 'wallet' sebagai 'connectedWallet' ke handleSupabaseLogin
    }
  }, [wallet, handleSupabaseLogin]);

  // Bagian kode yang menyebabkan error karena 'connectedWallet' tidak terdefinisi di scope ini telah dihapus
  // bersama dengan fungsi duplikat 'handleSupabaseLogin'.
  // Baris seperti 'const userFriendlyAddress = connectedWallet.account.address;' akan error jika di luar fungsi
  // yang menerima 'connectedWallet' sebagai parameter.

  return (
    <div>
      <TonConnectButton />
      {wallet && ( // 'wallet' dari useTonWallet() digunakan di sini
        <div>
          <p>Connected Wallet: {wallet.account.address}</p>
          <p>Chain: {wallet.account.chain}</p>
          {userSubscription && <p>Subscription: {userSubscription}</p>}
        </div>
      )}
      {userSubscription === 'free_with_ads' && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded">
          Anda menggunakan versi gratis dengan iklan.
        </div>
      )}
    </div>
  );
}