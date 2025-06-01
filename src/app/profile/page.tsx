'use client';

import React from 'react';
import { useRawInitData } from '@telegram-apps/sdk-react';
// Remove unused import since UserCard doesn't exist in telegram-ui package

export default function ProfilePage() {
  const initData = useRawInitData();
  // User data can be null or undefined if not available or not in Telegram environment
  const user = typeof initData === 'string' ? JSON.parse(initData) : initData;

  if (!user) {
    return (
      <div>
        <h1>Profil Pengguna</h1>
        <p>Tidak dapat memuat data pengguna Telegram. Pastikan aplikasi dibuka melalui Telegram.</p>
        <p>Jika Anda sedang dalam mode pengembangan lokal, pastikan mock environment telah diaktifkan dan dikonfigurasi dengan data pengguna.</p>
      </div>
    );
  }

  // Displaying user information
  // You can use UserCard or create your own layout
  return (
    <div>
      <h1>Profil Pengguna</h1>
      <div style={{ marginTop: '20px' }}>
        {/* Using UserCard as an example, you might need to install or adjust it */} 
        {/* <UserCard user={user} /> */} 
        
        <p><strong>ID Pengguna:</strong> {user.id}</p>
        <p><strong>Nama Depan:</strong> {user.firstName}</p>
        {user.lastName && <p><strong>Nama Belakang:</strong> {user.lastName}</p>}
        {user.username && <p><strong>Username:</strong> {user.username}</p>}
        <p><strong>Bahasa:</strong> {user.languageCode}</p>
        {user.isPremium && <p><strong>Status:</strong> Pengguna Premium</p>}
        {/* 
          Other available fields (check Telegram Mini Apps documentation for full list and availability):
          user.photoUrl
          user.allowsWriteToPm
          user.isBot
          user.addedToAttachmentMenu
        */}
      </div>
      {/* You can also display the raw initData for debugging if needed */}
      {/* <pre style={{ marginTop: '20px', fontSize: '12px' }}>
        {JSON.stringify(initData, null, 2)}
      </pre> */}
    </div>
  );
} 