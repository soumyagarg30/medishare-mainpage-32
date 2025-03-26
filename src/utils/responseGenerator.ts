
import { toast } from "@/hooks/use-toast";

// Generate structured responses based on user query and language
export const generateStructuredResponse = (query: string, detectedLanguage: string): string => {
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
    // Add more languages as needed
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

export const getLocalizedText = (text: string, currentLanguage: string): string => {
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
      "Change Language": "भाषा बदलें",
      "Hello! I'm your AI assistant. How can I help you today?": "नमस्ते! मैं आपका AI सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?"
    },
    // Add more languages as needed
  };
  
  return localizations[currentLanguage]?.[text] || text;
};

// Get welcome message based on language
export const getWelcomeMessage = (language: string): string => {
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
  
  return welcomeMessages[language] || welcomeMessages["English"];
};
