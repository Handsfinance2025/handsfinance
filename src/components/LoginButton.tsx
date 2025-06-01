'use client';

import { TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react'; // Ditambahkan useState di sini
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase client di luar komponen agar tidak dibuat ulang setiap render
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL atau Anon Key tidak ditemukan. Pastikan variabel lingkungan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diatur.");
}

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function LoginButton() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const [userSubscription, setUserSubscription] = useState<string | null>(null); // State untuk status langganan

  useEffect(() => {
    if (wallet) {
      console.log('Wallet connected:', wallet);
      handleSupabaseLogin(wallet);
    }
  }, [wallet]);

  const fetchUserSubscription = async (userId: string) => {
    if (!supabase) return null;
    // Contoh: Ambil status langganan dari tabel 'subscriptions'
    const { data, error } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId) // Asumsi Anda memiliki user_id yang terkait dengan wallet_address
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    return data ? data.status : 'free_with_ads'; // Default ke free jika tidak ada data
  };

  const handleSupabaseLogin = async (connectedWallet: any) => {
    if (!supabase) {
      console.error("Supabase client tidak terinisialisasi.");
      return;
    }

    const userFriendlyAddress = connectedWallet.account.address;
    const chain = connectedWallet.account.chain;

    try {
      const { data: userData, error: upsertError } = await supabase
        .from('users')
        .upsert(
          {
            wallet_address: userFriendlyAddress,
            last_login_at: new Date(),
            network_chain: chain,
          },
          {
            onConflict: 'wallet_address',
          }
        )
        .select('id') // Ambil ID pengguna setelah upsert
        .single(); // Asumsi wallet_address unik dan kita mendapatkan satu user

      if (upsertError) {
        console.error('Supabase upsert error:', upsertError);
        alert(`Error Supabase: ${upsertError.message}`);
        return;
      }

      console.log('Supabase user data:', userData);
      alert(`Login berhasil dengan wallet: ${userFriendlyAddress}`);

      if (userData && userData.id) {
        // Ambil status langganan pengguna
        const subscriptionStatus = await fetchUserSubscription(userData.id);
        setUserSubscription(subscriptionStatus);
        console.log('User subscription status:', subscriptionStatus);

        if (subscriptionStatus === 'free_with_ads') {
          // TODO: Tampilkan logika untuk iklan
          console.log('User is on free plan with ads. Show ads.');
        } else if (subscriptionStatus === 'pro') {
          // TODO: Aktifkan fitur pro
          console.log('User is on pro plan. Unlock pro features.');
        }
      }

    } catch (e) {
      console.error('Error during Supabase login:', e);
      alert('Terjadi kesalahan saat login ke Supabase.');
    }
  };

  return (
    <div>
      <TonConnectButton />
      {wallet && (
        <div>
          <p>Connected Wallet: {wallet.account.address}</p>
          <p>Chain: {wallet.account.chain}</p>
          {userSubscription && <p>Subscription: {userSubscription}</p>}
        </div>
      )}
      {/* Contoh bagaimana Anda bisa menampilkan konten berdasarkan langganan */}
      {userSubscription === 'free_with_ads' && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded">
          Anda menggunakan versi gratis dengan iklan.
          {/* TODO: Tempatkan komponen iklan di sini */}
        </div>
      )}
    </div>
  );
}