'use client';

import { useState, FormEvent, useRef, useEffect, SVGProps } from 'react';

// Define the color palette for easy reference
const colors = {
  primaryGreen: '#238B45', // Main actions, user messages
  lightGray: '#F0F2F0',    // Page background, light text
  ashGray: '#B7C1AC',      // Borders, secondary elements, bot messages
  darkGreenGray: '#4E6F5C',// Header background, primary text, icons
  white: '#FFFFFF',        // Input area background, bot message text (alternative)
};

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
}

// Send Icon Component
const SendIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </svg>
);

// Loading Spinner Icon Component
const LoadingSpinnerIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Settings Icon Component
const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.257c-.008.379.137.75.43.99l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.333.184-.582.496-.646.87l-.212 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.646-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.257c.008-.379-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.354.133.75.072 1.075-.124.072-.044.146-.087.22-.128.332-.184.582-.496.646-.87l.212-1.281Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

// Close Icon Component
const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // State for settings popup and model selection
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash'); // Default model
  const availableModels = ['gemini-2.0-flash', 'gemini-pro', 'gemini-ultra']; // Example models
  
  const recommendedPrompts = [
    "Buatkan saya cerita pendek tentang petualangan di luar angkasa.",
    "Jelaskan konsep relativitas umum dengan bahasa yang sederhana.",
    "Berikan ide resep masakan untuk makan malam keluarga.",
    "Tuliskan puisi tentang keindahan alam Indonesia.",
    "Apa saja tips untuk belajar bahasa baru secara efektif?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    const loadingBotMessageId = (Date.now() + 1).toString();
    const loadingBotMessage: Message = {
      id: loadingBotMessageId,
      sender: 'bot',
      text: '...',
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingBotMessage]);

    console.log(`Sending prompt with model: ${selectedModel}`); // Log the selected model

    try {
      // NOTE: This fetch call assumes you have a backend API endpoint at /api/gemini
      // If your backend supports model selection, you might need to pass `selectedModel` in the body.
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Example: body: JSON.stringify({ prompt: currentInput, model: selectedModel }),
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response from bot' }));
        throw new Error(errorData.error || 'Failed to get response from bot');
      }

      const data = await response.json();
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: data.text || 'Sorry, I could not process that.',
      };
      setMessages((prev) => prev.map(msg => msg.id === loadingBotMessageId ? botMessage : msg));

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessageText = error instanceof Error ? error.message : 'An unknown error occurred.';
      const errorBotMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Error: ${errorMessageText}`,
      };
      setMessages((prev) => prev.map(msg => msg.id === loadingBotMessageId ? errorBotMessage : msg));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSettingsPopup = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  const handleRecommendedPromptClick = (prompt: string) => {
    setInput(prompt);
    setIsSettingsOpen(false); // Close popup after selecting a prompt
  };


  return (
    <div style={{ backgroundColor: colors.lightGray }} className="flex flex-col h-screen max-w-2xl mx-auto font-sans relative">
      {/* Header */}
      <header
        style={{ backgroundColor: colors.darkGreenGray, color: colors.lightGray }}
        className="p-4 text-lg font-semibold text-center sticky top-0 z-20 shadow-lg flex items-center justify-between"
      >
        <span className="flex-grow text-center">Profile</span> {/* Centered Title */}
        <button
            onClick={toggleSettingsPopup}
            style={{ color: colors.lightGray }}
            className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors duration-150"
            aria-label="Settings"
        >
            <SettingsIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Settings Popup */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30 p-4">
          <div
            style={{ backgroundColor: colors.white, color: colors.darkGreenGray }}
            className="rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold" style={{color: colors.primaryGreen}}>Pengaturan</h2>
              <button
                onClick={toggleSettingsPopup}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close settings"
              >
                <CloseIcon className="w-6 h-6" style={{color: colors.darkGreenGray}}/>
              </button>
            </div>

            {/* Model Selection */}
            <div className="mb-6">
              <label htmlFor="gemini-model" className="block text-sm font-medium mb-2" style={{color: colors.darkGreenGray}}>
                Pilih Model Gemini:
              </label>
              <select
                id="gemini-model"
                value={selectedModel}
                onChange={handleModelChange}
                style={{
                    borderColor: colors.ashGray,
                    backgroundColor: colors.lightGray,
                    color: colors.darkGreenGray
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 
                            focus:ring-[${colors.primaryGreen}] focus:border-[${colors.primaryGreen}] 
                            outline-none transition-all duration-200 ease-in-out`}
              >
                {availableModels.map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Recommended Prompts */}
            <div className="mb-2">
              <h3 className="text-lg font-medium mb-3" style={{color: colors.darkGreenGray}}>Rekomendasi Prompt:</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {recommendedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecommendedPromptClick(prompt)}
                    style={{
                        backgroundColor: colors.lightGray,
                        color: colors.primaryGreen,
                        borderColor: colors.ashGray
                    }}
                    className="w-full text-left p-3 border rounded-lg hover:shadow-md transition-shadow duration-150 text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
