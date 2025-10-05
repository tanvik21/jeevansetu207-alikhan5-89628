
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SymptomCheckerComponent from '@/components/patient/SymptomChecker';
import VoiceToText from '@/components/ui/VoiceToText';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SymptomChecker = () => {
  const [voiceInput, setVoiceInput] = useState('');
  const { t } = useLanguage();

  const handleVoiceInput = (text: string) => {
    setVoiceInput(text);
    console.log('Voice input received:', text);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Symptom Checker</h1>
        
        {/* Voice Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t('voiceToText')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceToText 
              onTextReceived={handleVoiceInput}
              placeholder={t('startRecording')}
            />
            {voiceInput && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Voice Input:</p>
                <p className="text-sm">{voiceInput}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <SymptomCheckerComponent />
      </div>
    </MainLayout>
  );
};

export default SymptomChecker;
