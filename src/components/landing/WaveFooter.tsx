import React from 'react';
import { Mail, Github, Heart } from 'lucide-react';
import JeevanSetuLogo from '@/components/ui/JeevanSetuLogo';
import { useLanguage } from '@/contexts/LanguageContext';

interface WaveFooterProps {
  scrollToSection: (id: string) => void;
}

const WaveFooter: React.FC<WaveFooterProps> = ({ scrollToSection }) => {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated wave overlay */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-24 md:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white dark:fill-slate-50"
          />
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white/50 dark:fill-slate-50/50 animate-wave"
          />
        </svg>
      </div>

      <div className="relative pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand column */}
            <div className="space-y-4">
              <JeevanSetuLogo size="md" />
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('heroSubheadline')}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {t('features')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {t('about')}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('hospice')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Hospice Care
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {t('contact')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-bold text-lg mb-4">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="mailto:contact@jeevansetu.com"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm flex items-center gap-2">
                &copy; {new Date().getFullYear()} JeevanSetu. {t('contactFooter')} <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              </p>
              <div className="flex gap-6 text-sm text-slate-400">
                <button className="hover:text-white transition-colors">Privacy Policy</button>
                <button className="hover:text-white transition-colors">Terms of Service</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background gradient orbs */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
    </footer>
  );
};

export default WaveFooter;
