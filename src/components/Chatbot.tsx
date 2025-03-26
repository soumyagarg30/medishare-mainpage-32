
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircle, Mic, MicOff, Send, Speaker, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Chatbot = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initialize speech recognition when available
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  
  if (recognition) {
    recognition.continuous = false;
    recognition.lang = 'en-US'; // Default language
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast({
        title: "Error",
        description: "Failed to recognize speech. Please try again.",
        variant: "destructive",
      });
    };
  }
  
  // Text-to-speech functionality
  const speak = (text: string) => {
    if (!isSpeaking) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsAwaitingResponse(true);
    
    try {
      // If you have an ElevenLabs API key, use it for better TTS, otherwise use browser's built-in TTS
      // This is a placeholder for the actual API implementation
      setTimeout(() => {
        const botResponse = { 
          text: "Thanks for your message. We're setting up the chatbot backend. How can I assist with MediShare today?", 
          isUser: false 
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsAwaitingResponse(false);
        
        speak(botResponse.text);
      }, 1000);
      
      // Here you would implement actual API call to a language model like GPT or your custom backend
    } catch (error) {
      console.error('Error sending message:', error);
      setIsAwaitingResponse(false);
      toast({
        title: "Error",
        description: "Failed to get response from the assistant.",
        variant: "destructive",
      });
    }
  };
  
  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setInput("");
    }
  };
  
  // Toggle text-to-speech
  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
  };
  
  // Save ElevenLabs API key (in a real app, this would be handled more securely)
  const saveApiKey = () => {
    // This is just for demonstration - in production, you'd use a more secure method
    localStorage.setItem('elevenlabs_api_key', apiKey);
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for this session.",
    });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-medishare-orange hover:bg-medishare-gold"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-center">MediShare Assistant</DrawerTitle>
        </DrawerHeader>
        
        <div className="flex flex-col h-full px-4 overflow-hidden">
          <div className="flex-grow overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>👋 Hi there! How can I help you with MediShare today?</p>
                <p className="mt-2 text-sm">You can type or use voice input to ask questions.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? "bg-medishare-orange text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isAwaitingResponse && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          
          <div className="p-4 border-t">
            <div className="flex items-center mb-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={`mr-2 ${isListening ? "bg-red-100" : ""}`}
              >
                {isListening ? <MicOff /> : <Mic />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSpeaking}
                className="mr-2"
              >
                {isSpeaking ? <Volume2 /> : <VolumeX />}
              </Button>
              {isListening && <span className="text-sm text-red-500 animate-pulse">Listening...</span>}
            </div>
            
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-grow"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!input.trim() || isAwaitingResponse}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                  Configure Voice Assistant
                </summary>
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-xs text-gray-500 mb-2">
                    For better voice quality, add your ElevenLabs API key (optional):
                  </p>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter ElevenLabs API key"
                      className="flex-grow text-xs p-2 border rounded-md"
                    />
                    <Button size="sm" onClick={saveApiKey} variant="outline">
                      Save
                    </Button>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Chatbot;
