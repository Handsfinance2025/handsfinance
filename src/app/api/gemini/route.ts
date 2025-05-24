import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const MODEL_NAME = "gemini-2.0-flash";

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found. Please set GEMINI_API_KEY in .env.local' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  // Inisialisasi model dengan konfigurasi dan pengaturan keamanan
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig,
    safetySettings,
  });

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Sekarang generateContent hanya menerima prompt (atau array dari Content objects)
    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();
    return NextResponse.json({ text });

  } catch (error) {
    console.error('Error generating content:', error);
    // Coba berikan detail error yang lebih spesifik jika ada
    let errorMessage = 'Failed to generate content';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}