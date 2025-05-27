import { NextRequest, NextResponse } from 'next/server';

// Definisikan skema untuk respons yang diharapkan dari Gemini
const newsItemSchema = {
    type: "OBJECT",
    properties: {
        "title": { "type": "STRING", "description": "Judul artikel berita dalam Bahasa Indonesia." },
        "snippet": { "type": "STRING", "description": "Cuplikan singkat dari artikel (2-3 kalimat) dalam Bahasa Indonesia." },
        "link": { "type": "STRING", "description": "URL tautan asli ke artikel berita." },
        "source": { "type": "STRING", "description": "Nama sumber berita (misalnya, Kompas, Detik, Reuters)." },
        "date": { "type": "STRING", "description": "Tanggal publikasi artikel (format YYYY-MM-DD jika memungkinkan, atau teks tanggal seperti '25 Mei 2024')." },
        "category": { "type": "STRING", "description": "Kategori berita (misalnya, Ekonomi, Teknologi, Politik, Olahraga, Pasar Saham)." },
        "imageUrl": { "type": "STRING", "description": "URL gambar yang relevan dengan artikel (opsional, jika tersedia)." },
        "imageAlt": { "type": "STRING", "description": "Teks alternatif untuk gambar (opsional, relevan dengan imageUrl)." }
    },
    required: ["title", "snippet", "link", "source", "category"]
};

const geminiResponseSchema = {
    type: "ARRAY",
    items: newsItemSchema,
    description: "Daftar artikel berita yang ditemukan, dalam Bahasa Indonesia."
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return NextResponse.json({ error: 'Query pencarian tidak valid atau kosong.' }, { status: 400 });
    }

    const userQuery = query.trim();
    const prompt = `Anda adalah agregator berita AI yang sangat canggih dan akurat. Tugas Anda adalah menemukan 5 hingga 7 artikel berita terbaru dan paling relevan dari berbagai sumber berita terpercaya di Indonesia berdasarkan kueri pengguna: "${userQuery}". 
    Prioritaskan berita dari 24-48 jam terakhir jika memungkinkan, namun berita yang lebih lama masih relevan jika topiknya evergreen.
    Pastikan semua output (judul, cuplikan, kategori) dalam Bahasa Indonesia.
    Untuk setiap artikel, berikan informasi dalam format JSON yang ketat sesuai skema yang ditentukan. 
    Jika gambar tidak tersedia secara langsung dari sumber, Anda boleh mencari gambar representatif yang cocok dengan judul atau topik artikel, atau biarkan kosong.
    Fokus pada sumber berita utama dan kredibel di Indonesia.`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = {
      contents: chatHistory,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiResponseSchema,
        // temperature: 0.7, 
      }
    };

    const apiKey = process.env.GEMINI_API_KEY; // Ambil API Key dari environment variable
    if (!apiKey) {
        console.error("GEMINI_API_KEY tidak ditemukan di environment variables.");
        return NextResponse.json({ error: 'Konfigurasi server API Key hilang.' }, { status: 500 });
    }
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    console.log("API Route: Sending request to Gemini API with query:", userQuery);

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const errorBodyText = await geminiResponse.text();
      console.error('Gemini API request failed:', geminiResponse.status, errorBodyText);
      return NextResponse.json({ 
        error: `Gagal mengambil berita dari Gemini API. Status: ${geminiResponse.status} - ${geminiResponse.statusText}`,
        details: errorBodyText.substring(0, 500) // Kirim sebagian detail error
      }, { status: geminiResponse.status });
    }

    const result = await geminiResponse.json();

    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0 &&
        result.candidates[0].content.parts[0].text
        ) {
      const jsonText = result.candidates[0].content.parts[0].text;
      try {
        const newsData = JSON.parse(jsonText);
        console.log("API Route: Successfully fetched and parsed news data from Gemini.");
        return NextResponse.json(newsData);
      } catch (parseError: any) {
        console.error('API Route: Gagal mem-parsing JSON dari Gemini:', parseError, jsonText);
        return NextResponse.json({ 
            error: 'Gagal mem-parsing respons berita dari AI.', 
            details: `Error parsing: ${parseError.message}. Raw text (awal): ${jsonText.substring(0,200)}...` 
        }, { status: 500 });
      }
    } else {
      console.warn('API Route: Respons dari Gemini tidak memiliki format yang diharapkan atau tidak ada kandidat:', JSON.stringify(result, null, 2));
      let errorMessage = 'Gagal mendapatkan format berita yang diharapkan dari AI.';
      if (result.promptFeedback && result.promptFeedback.blockReason) {
        errorMessage += ` Alasan blokir: ${result.promptFeedback.blockReason}`;
        if (result.promptFeedback.blockReasonMessage) {
            errorMessage += ` - Pesan: ${result.promptFeedback.blockReasonMessage}`;
        }
      }
      return NextResponse.json({ error: errorMessage, details: result }, { status: 500 });
    }

  } catch (error: any) {
    console.error('API Route: Kesalahan internal pada server API scraping:', error);
    return NextResponse.json({ 
        error: 'Terjadi kesalahan internal saat memproses permintaan berita.', 
        details: error.message 
    }, { status: 500 });
  }
}

// Menambahkan handler untuk GET hanya untuk tujuan pengujian dasar jika diperlukan
// agar endpoint tidak langsung 404 jika diakses via browser (meskipun frontend menggunakan POST)
export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "API Endpoint untuk scrape berita. Gunakan metode POST dengan query." });
}
