
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'kn' as Language, name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'bn' as Language, name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te' as Language, name: 'Telugu', nativeName: 'తెలుగు' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-36 bg-background/60 backdrop-blur-sm border-white/40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-md border-white/40">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span className="text-sm">{lang.nativeName}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
