import TelegramBot from 'node-telegram-bot-api';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ambil token dan API key dari environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Atau model Gemini lainnya

// Inisialisasi bot Telegram (gunakan polling untuk pengembangan lokal jika webhook sulit di-debug)
// Namun, untuk Netlify, kita akan fokus pada webhook.
// Kita tidak perlu inisialisasi bot di sini jika HANYA menggunakan webhook.
// Telegram akan mengirim update ke URL ini.

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      if (message && message.text) {
        const chatId = message.chat.id;
        const userMessage = message.text;

        // Kirim pesan ke Gemini AI
        const chat = model.startChat({
          history: [
            // Contoh history jika diperlukan, bisa dikosongkan
            // { role: "user", parts: "Halo." },
            // { role: "model", parts: "Halo! Ada yang bisa saya bantu?" },
          ],
          generationConfig: {
            maxOutputTokens: 9999, // Sesuaikan sesuai kebutuhan
          },
        });

        const result = await chat.sendMessage(userMessage);
        const geminiResponse = await result.response;
        const textResponse = geminiResponse.text();

        // Kirim balasan dari Gemini ke pengguna Telegram
        // Anda perlu menggunakan instance bot untuk mengirim pesan,
        
        // atau melakukan request POST manual ke API Telegram.
        // Cara paling mudah adalah menggunakan library node-telegram-bot-api
        // untuk mengirim balasan.

        // Untuk mengirim balasan, kita perlu instance bot atau fetch ke API Telegram
        const bot = new TelegramBot(TELEGRAM_BOT_TOKEN); // Inisialisasi di sini hanya untuk mengirim
        await bot.sendMessage(chatId, textResponse);

        // Di dalam handler webhook bot Telegram Anda
        // ... setelah memproses pesan pengguna dan mendapatkan balasan dari Gemini ...

        const monetagDirectLink = "https://otieu.com/4/9375223"; // Ganti dengan Direct Link Anda

        // Kirim balasan Gemini sudah dilakukan di atas
        // await bot.sendMessage(chatId, `🤖 Gemini AI:\n${textResponse}`); // Baris ini duplikat jika textResponse sudah dikirim

        // Kirim pesan terpisah dengan direct link (atau gabungkan dengan bijak)
        // Pertimbangkan untuk membuatnya kontekstual
        if (userMessage.toLowerCase().includes("bantuan") || Math.random() < 0.2) { // Contoh kondisi
            await bot.sendMessage(chatId, `Untuk mendukung layanan kami, kunjungi: ${monetagDirectLink}`);
            // Atau gunakan inline keyboard
            // await bot.sendMessage(chatId, "Dapatkan info lebih lanjut atau dukung kami:", {
            //   reply_markup: {
            //     inline_keyboard: [
            //       [{ text: "Kunjungi Sponsor Kami", url: monetagDirectLink }]
            //     ]
            //   }
            // });
        }

        res.status(200).json({ status: 'success', response: textResponse });
      } else {
        res.status(200).json({ status: 'no message text' });
      }
    } catch (error) {
      console.error('Error processing message:', error);
      // Hindari mengirim error detail ke Telegram jika tidak perlu
      // Kirim respons yang aman
      if (error.response && error.response.data) {
        console.error('Telegram API Error:', error.response.data);
      }
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  } else {
    // Tangani method selain POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}