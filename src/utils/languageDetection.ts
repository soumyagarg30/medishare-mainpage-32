
// Supported languages with their codes
export const LANGUAGES = {
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

export type LanguageCode = keyof typeof LANGUAGES;

/**
 * Detects language from text input
 */
export const detectLanguage = (text: string): string => {
  // Simple language detection based on character sets and common phrases
  // This is a basic implementation - a production app would use a proper language detection library
  
  // Hindi detection (Devanagari script)
  if (/[\u0900-\u097F]/.test(text)) {
    return "Hindi";
  }
  
  // Chinese detection
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return "Chinese";
  }
  
  // Japanese detection (Hiragana, Katakana, Kanji)
  if (/[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/.test(text)) {
    return "Japanese";
  }
  
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) {
    return "Arabic";
  }
  
  // Bengali detection
  if (/[\u0980-\u09FF]/.test(text)) {
    return "Bengali";
  }
  
  // Tamil detection
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return "Tamil";
  }
  
  // Spanish detection
  if (/(?:hola|como estas|que tal|buenos dias|gracias|por favor)/.test(text.toLowerCase())) {
    return "Spanish";
  }
  
  // French detection
  if (/(?:bonjour|merci|comment allez-vous|s'il vous plait|au revoir)/.test(text.toLowerCase())) {
    return "French";
  }
  
  // German detection
  if (/(?:guten tag|danke|wie geht es ihnen|bitte|auf wiedersehen)/.test(text.toLowerCase())) {
    return "German";
  }
  
  // If no specific language is detected, default to English
  return "English";
};
