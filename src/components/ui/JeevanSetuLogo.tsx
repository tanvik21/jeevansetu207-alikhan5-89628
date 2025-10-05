
import React from 'react';
import { Stethoscope, Shield, Heart } from 'lucide-react';

interface JeevanSetuLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const JeevanSetuLogo: React.FC<JeevanSetuLogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: { container: 'h-8 w-8', icon: 'h-3 w-3', text: 'text-lg' },
    md: { container: 'h-12 w-12', icon: 'h-4 w-4', text: 'text-xl' },
    lg: { container: 'h-20 w-20', icon: 'h-6 w-6', text: 'text-3xl' }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size].container} relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-lg overflow-hidden`}>
        {/* Professional background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-xl"></div>
        
        {/* Main icon container */}
        <div className="relative z-10 flex items-center justify-center h-full w-full">
          <div className="relative">
            {/* Stethoscope as main medical symbol */}
            <Stethoscope className={`${sizeClasses[size].icon} text-white`} />
            {/* Shield for protection/security */}
            <Shield className={`${sizeClasses[size].icon} text-white/80 absolute -top-1 -right-1 scale-75`} />
          </div>
        </div>
        
        {/* Heart pulse indicator */}
        <div className="absolute top-1 right-1">
          <Heart className="h-2 w-2 text-red-300 animate-pulse" />
        </div>
        
        {/* Professional corner accent */}
        <div className="absolute bottom-0 right-0 h-4 w-4 bg-gradient-to-tl from-white/20 to-transparent rounded-tl-full"></div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeClasses[size].text} font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight`}>
            JeevanSetu
          </span>
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Healthcare Bridge
          </span>
        </div>
      )}
    </div>
  );
};

export default JeevanSetuLogo;
