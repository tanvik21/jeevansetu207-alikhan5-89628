
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="bg-background/60 backdrop-blur-sm border-white/40 hover:bg-background/80"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4 mr-2" />
          {t('dark')}
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-2" />
          {t('light')}
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
