
import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface VoiceToTextProps {
  onTextReceived: (text: string) => void;
  placeholder?: string;
  className?: string;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ 
  onTextReceived, 
  placeholder = "Click to start voice input...",
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { t, language } = useLanguage();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Language mapping for speech recognition
  const speechLanguageMap: Record<string, string> = {
    'en': 'en-US',
    'kn': 'kn-IN',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN'
  };

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguageMap[language] || 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success(t('listening'));
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = finalTranscript || interimTranscript;
      setTranscript(fullTranscript);
      
      if (finalTranscript) {
        onTextReceived(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Voice recognition error occurred');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [language, onTextReceived, t]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={toggleListening}
        className="flex items-center gap-2"
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4" />
            {t('stopRecording')}
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            {t('startRecording')}
          </>
        )}
      </Button>
      
      {isListening && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4 animate-pulse text-red-500" />
          <span>{t('listening')}</span>
        </div>
      )}
      
      {transcript && (
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground truncate bg-muted/50 px-2 py-1 rounded">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceToText;
