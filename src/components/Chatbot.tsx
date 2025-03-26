
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Mic, MicOff, Send, X, MessageSquare, Volume2, VolumeX, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Define the ChatMessage type
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Supported languages with their codes
const LANGUAGES = {
  "English": "en-US",
  "Hindi": "hi-IN",
  "Spanish": "es-ES", 
  "French": "fr-FR",
  "German": "de-DE",
  "Chinese": "zh-CN",
  "Japanese": "ja-JP",
  "Arabic": "ar-SA",
  "Bengali": "bn-IN",
  "Tamil": "ta-IN"
};

type LanguageCode = keyof typeof LANGUAGES;

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>("English");
  const [languageCode, setLanguageCode] = useState<string>("en-US");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isMobile = useIsMobile();
  const lastDetectedLanguage = useRef<string>("English");

  // Initialize speech recognition when language changes
  useEffect(() => {
    initializeSpeechRecognition();
    
    // Update welcome message based on language
    if (messages.length === 1 && messages[0].role === "assistant") {
      const welcomeMessages: Record<string, string> = {
        "English": "Hello! I'm your AI assistant. How can I help you today?",
        "Hindi": "नमस्ते! मैं आपका AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
        "Spanish": "¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?",
        "French": "Bonjour! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui?",
        "German": "Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?",
        "Chinese": "你好！我是你的 AI 助手。今天我能帮你什么忙？",
        "Japanese": "こんにちは！私はあなたのAIアシスタントです。今日はどのようにお手伝いできますか？",
        "Arabic": "مرحبًا! أنا مساعدك الذكاء الاصطناعي. كيف يمكنني مساعدتك اليوم؟",
        "Bengali": "হ্যালো! আমি আপনার AI সহকারী। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?",
        "Tamil": "வணக்கம்! நான் உங்கள் AI உதவியாளர். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?"
      };
      
      setMessages([
        { role: "assistant", content: welcomeMessages[currentLanguage] || welcomeMessages["English"] }
      ]);
    }
  }, [currentLanguage, languageCode]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    
    // Feature detection for Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = languageCode;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Submit transcript automatically
        handleSend(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast({
          title: getLocalizedText("Voice recognition error"),
          description: getLocalizedText("Failed to recognize your voice. Please try again or use text input."),
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      toast({
        title: getLocalizedText("Voice feature unavailable"),
        description: getLocalizedText("Your browser doesn't support voice recognition. Please use text input instead."),
        variant: "destructive",
      });
    }
  };

  // Function to get localized text
  const getLocalizedText = (text: string): string => {
    // This is a simple implementation. In a production app, use a proper i18n library
    const localizations: Record<string, Record<string, string>> = {
      "Hindi": {
        "Voice recognition error": "आवाज पहचान त्रुटि",
        "Failed to recognize your voice. Please try again or use text input.": "आपकी आवाज को पहचानने में विफल रहा। कृपया पुनः प्रयास करें या टेक्स्ट इनपुट का उपयोग करें।",
        "Voice feature unavailable": "वॉयस फीचर अनुपलब्ध",
        "Your browser doesn't support voice recognition. Please use text input instead.": "आपका ब्राउज़र वॉयस पहचान का समर्थन नहीं करता है। कृपया टेक्स्ट इनपुट का उपयोग करें।",
        "AI Assistant": "AI सहायक",
        "Type your message...": "अपना संदेश लिखें...",
        "Clear chat": "चैट साफ करें",
        "Enable voice": "वॉयस सक्षम करें",
        "Disable voice": "वॉयस अक्षम करें",
        "Start listening": "सुनना शुरू करें",
        "Stop listening": "सुनना बंद करें",
        "Send message": "संदेश भेजें",
        "Speech synthesis error": "वाक् संश्लेषण त्रुटि",
        "Failed to convert text to speech.": "टेक्स्ट को स्पीच में बदलने में विफल।",
        "Text-to-speech unavailable": "टेक्स्ट-टू-स्पीच अनुपलब्ध",
        "Your browser doesn't support text-to-speech.": "आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता है।",
        "Change Language": "भाषा बदलें"
      },
      // Add more languages as needed
    };
    
    return localizations[currentLanguage]?.[text] || text;
  };
  
  // Auto-scroll to the bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    setLanguageCode(LANGUAGES[language as keyof typeof LANGUAGES]);
    setShowLanguageMenu(false);
  };

  // Attempt to detect language from text
  const detectLanguage = (text: string): string => {
    // Simple language detection based on character sets and common phrases
    // This is a basic implementation - a production app would use a proper language detection library
    
    // Hindi detection (Devanagari script)
    if (/[\u0900-\u097F]/.test(text)) {
      lastDetectedLanguage.current = "Hindi";
      return "Hindi";
    }
    
    // Chinese detection
    if (/[\u4E00-\u9FFF]/.test(text)) {
      lastDetectedLanguage.current = "Chinese";
      return "Chinese";
    }
    
    // Japanese detection (Hiragana, Katakana, Kanji)
    if (/[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text)) {
      lastDetectedLanguage.current = "Japanese";
      return "Japanese";
    }
    
    // Arabic detection
    if (/[\u0600-\u06FF]/.test(text)) {
      lastDetectedLanguage.current = "Arabic";
      return "Arabic";
    }
    
    // Bengali detection
    if (/[\u0980-\u09FF]/.test(text)) {
      lastDetectedLanguage.current = "Bengali";
      return "Bengali";
    }
    
    // Tamil detection
    if (/[\u0B80-\u0BFF]/.test(text)) {
      lastDetectedLanguage.current = "Tamil";
      return "Tamil";
    }
    
    // Spanish detection
    if (/(?:hola|como estas|que tal|buenos dias|gracias|por favor)/.test(text.toLowerCase())) {
      lastDetectedLanguage.current = "Spanish";
      return "Spanish";
    }
    
    // French detection
    if (/(?:bonjour|merci|comment allez-vous|s'il vous plait|au revoir)/.test(text.toLowerCase())) {
      lastDetectedLanguage.current = "French";
      return "French";
    }
    
    // German detection
    if (/(?:guten tag|danke|wie geht es ihnen|bitte|auf wiedersehen)/.test(text.toLowerCase())) {
      lastDetectedLanguage.current = "German";
      return "German";
    }
    
    // If no specific language is detected, return the last detected language or default to English
    return lastDetectedLanguage.current || "English";
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: getLocalizedText("Voice feature unavailable"),
        description: getLocalizedText("Your browser doesn't support voice recognition."),
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
        toast({
          title: getLocalizedText("Voice recognition error"),
          description: getLocalizedText("Failed to start voice recognition. Please try again."),
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;
    
    // Detect language from user input
    const detectedLanguage = detectLanguage(text);
    
    // Update current language if detection is confident
    if (detectedLanguage !== currentLanguage) {
      setCurrentLanguage(detectedLanguage);
      setLanguageCode(LANGUAGES[detectedLanguage as keyof typeof LANGUAGES]);
    }
    
    // Add user message
    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // In a real implementation, you would send this query to your backend/API
    // For demonstration, we'll simulate a structured response
    setTimeout(() => {
      // Generate a structured response based on the query and detected language
      const responseContent = generateStructuredResponse(text, detectedLanguage);
      
      const aiResponse = { 
        role: "assistant" as const, 
        content: responseContent
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      
      // Convert AI response to speech if voice is enabled
      if (voiceEnabled) {
        speakText(aiResponse.content);
      }
    }, 1000);
  };

  // Generate structured responses based on user query and language
  const generateStructuredResponse = (query: string, detectedLanguage: string): string => {
    const lowerQuery = query.toLowerCase();
    
    // Basic response templates for different languages
    const responseTemplates: Record<string, Record<string, string>> = {
      "English": {
        medicine: `### Medicine Information\n\n1. **Donation Process**:\n   - Medicines must be unexpired\n   - Original packaging required\n   - Minimum 3 months before expiry\n\n2. **How to Donate**:\n   - Use our donor portal\n   - Schedule a pickup\n   - Drop at collection centers`,
        ngo: `### NGO Partnerships\n\n1. **Benefits**:\n   - Access to medicine inventory\n   - Distribution infrastructure\n   - Analytics dashboard\n\n2. **Requirements**:\n   - Registered NGO status\n   - Healthcare focus\n   - Operational for at least 1 year`,
        donate: `### Donation Information\n\n1. **What You Can Donate**:\n   - Unopened medications\n   - Medical equipment\n   - Healthcare supplies\n\n2. **Process**:\n   - Register as donor\n   - List available items\n   - Arrange delivery/pickup`,
        recipient: `### Recipient Information\n\n1. **Eligibility**:\n   - Verified individuals\n   - Healthcare facilities\n   - Registered NGOs\n\n2. **Process**:\n   - Submit application\n   - Provide documentation\n   - Receive approval`,
        default: `I'll be happy to help with your query about "${query}". Here's what you might want to know:\n\n1. **MediShare Platform**:\n   - Connects medicine donors with recipients\n   - Ensures safe and compliant transfers\n   - Tracks impact and distribution\n\n2. **How to Get Started**:\n   - Register on our platform\n   - Complete verification\n   - Start donating or requesting medicines`
      },
      "Hindi": {
        medicine: `### दवा जानकारी\n\n1. **दान प्रक्रिया**:\n   - दवाएं अवश्य अनएक्सपायर्ड होनी चाहिए\n   - मूल पैकेजिंग आवश्यक है\n   - समाप्ति से पहले कम से कम 3 महीने\n\n2. **दान कैसे करें**:\n   - हमारे दाता पोर्टल का उपयोग करें\n   - पिकअप शेड्यूल करें\n   - संग्रह केंद्रों पर ड्रॉप करें`,
        ngo: `### NGO साझेदारी\n\n1. **लाभ**:\n   - दवा इन्वेंटरी तक पहुंच\n   - वितरण बुनियादी ढांचा\n   - एनालिटिक्स डैशबोर्ड\n\n2. **आवश्यकताएँ**:\n   - पंजीकृत NGO स्थिति\n   - स्वास्थ्य देखभाल फोकस\n   - कम से कम 1 वर्ष से संचालन`,
        donate: `### दान जानकारी\n\n1. **आप क्या दान कर सकते हैं**:\n   - अनखुली दवाएं\n   - चिकित्सा उपकरण\n   - स्वास्थ्य देखभाल आपूर्ति\n\n2. **प्रक्रिया**:\n   - दाता के रूप में रजिस्टर करें\n   - उपलब्ध वस्तुओं की सूची बनाएं\n   - डिलीवरी/पिकअप की व्यवस्था करें`,
        recipient: `### प्राप्तकर्ता जानकारी\n\n1. **पात्रता**:\n   - सत्यापित व्यक्ति\n   - स्वास्थ्य सुविधाएं\n   - पंजीकृत NGOs\n\n2. **प्रक्रिया**:\n   - आवेदन जमा करें\n   - दस्तावेज प्रदान करें\n   - अनुमोदन प्राप्त करें`,
        default: `मुझे आपके "${query}" के बारे में प्रश्न में मदद करने में ख़ुशी होगी। यहां आपको क्या जानना चाहिए:\n\n1. **मेडिशेयर प्लेटफॉर्म**:\n   - दवा दाताओं को प्राप्तकर्ताओं से जोड़ता है\n   - सुरक्षित और अनुपालन वाले ट्रांसफर सुनिश्चित करता है\n   - प्रभाव और वितरण को ट्रैक करता है\n\n2. **कैसे शुरू करें**:\n   - हमारे प्लेटफॉर्म पर रजिस्टर करें\n   - सत्यापन पूरा करें\n   - दान देना या दवाइयों का अनुरोध करना शुरू करें`
      },
      // You can add more languages and their responses here
    };
    
    // Default to English if the detected language doesn't have templates
    const languageResponses = responseTemplates[detectedLanguage] || responseTemplates["English"];
    
    // Match query to appropriate response template
    if (lowerQuery.includes("medicine") || lowerQuery.includes("medication") || 
        lowerQuery.includes("दवा") || lowerQuery.includes("औषधि")) {
      return languageResponses.medicine;
    } 
    else if (lowerQuery.includes("ngo") || lowerQuery.includes("organization") || 
             lowerQuery.includes("संगठन") || lowerQuery.includes("संस्था")) {
      return languageResponses.ngo;
    }
    else if (lowerQuery.includes("donate") || lowerQuery.includes("donation") || 
             lowerQuery.includes("दान") || lowerQuery.includes("देना")) {
      return languageResponses.donate;
    }
    else if (lowerQuery.includes("recipient") || lowerQuery.includes("receive") || 
             lowerQuery.includes("प्राप्तकर्ता") || lowerQuery.includes("प्राप्त")) {
      return languageResponses.recipient;
    }
    else {
      return languageResponses.default;
    }
  };

  const speakText = (text: string) => {
    // If voice is disabled, don't speak
    if (!voiceEnabled) return;
    
    // Remove markdown formatting for speech
    const cleanText = text.replace(/#{1,6} /g, '').replace(/\*\*/g, '').replace(/\n/g, '. ');
    
    // Use browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = languageCode;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: getLocalizedText("Speech synthesis error"),
          description: getLocalizedText("Failed to convert text to speech."),
          variant: "destructive",
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: getLocalizedText("Text-to-speech unavailable"),
        description: getLocalizedText("Your browser doesn't support text-to-speech."),
        variant: "destructive",
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    // If turning voice off, make sure to stop any ongoing speech
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      { role: "assistant", content: getLocalizedText("Hello! I'm your AI assistant. How can I help you today?") }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to format structured responses
  const formatMessage = (content: string) => {
    // Simple Markdown-like formatting
    if (!content.includes('###')) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    
    // Process structured content with headers and lists
    const sections = content.split('###').filter(Boolean);
    
    return (
      <div className="space-y-3">
        {sections.map((section, index) => {
          const [title, ...contentLines] = section.trim().split('\n').filter(Boolean);
          const contentText = contentLines.join('\n');
          
          return (
            <div key={index} className="space-y-2">
              <h3 className="font-bold text-lg">{title}</h3>
              <div className="whitespace-pre-wrap">{contentText}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{getLocalizedText("AI Assistant")}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)} 
              aria-label={getLocalizedText("Change Language")}
            >
              <Globe className="h-5 w-5" />
            </Button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                {Object.keys(LANGUAGES).map((lang) => (
                  <button
                    key={lang}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => changeLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleVoice} 
            aria-label={voiceEnabled ? getLocalizedText("Disable voice") : getLocalizedText("Enable voice")}
          >
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearChat} 
            aria-label={getLocalizedText("Clear chat")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-medishare-orange text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.role === "assistant" ? formatMessage(message.content) : message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={getLocalizedText("Type your message...")}
            className="resize-none"
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <Button
              onClick={toggleListening}
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className="h-10 w-10"
              aria-label={isListening ? getLocalizedText("Stop listening") : getLocalizedText("Start listening")}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              variant="default"
              size="icon"
              className="bg-medishare-orange hover:bg-medishare-gold h-10 w-10"
              aria-label={getLocalizedText("Send message")}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Different container components based on screen size
  const renderContainer = () => {
    if (isMobile) {
      return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-medishare-orange hover:bg-medishare-gold"
              size="icon"
              aria-label="Open chat"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh]">
            {renderChatInterface()}
          </DrawerContent>
        </Drawer>
      );
    } else {
      return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-medishare-orange hover:bg-medishare-gold"
              size="icon"
              aria-label="Open chat"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[450px] sm:max-w-md p-0">
            <div className="h-screen">
              {renderChatInterface()}
            </div>
          </SheetContent>
        </Sheet>
      );
    }
  };

  return renderContainer();
};

export default Chatbot;
