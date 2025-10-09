import React from 'react';
import { Users, Brain, Heart } from 'lucide-react';

const AIHandshakeIllustration = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background gradient circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-80 h-80 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-2xl animate-pulse-subtle" />
        <div className="absolute w-64 h-64 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-2xl animate-pulse-subtle animation-delay-1000" />
      </div>

      {/* Human + AI handshake visualization */}
      <div className="relative z-10 flex items-center justify-center gap-8">
        {/* Human silhouette */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-2xl animate-float">
            <Users className="h-16 w-16 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Heart className="h-6 w-6 text-white animate-pulse" />
          </div>
        </div>

        {/* Connection lines */}
        <div className="relative flex items-center">
          <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer-glow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-bounce-slow">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* AI brain silhouette */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-2xl animate-float animation-delay-1000">
            <Brain className="h-16 w-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg animate-spin-slow">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Surrounding particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AIHandshakeIllustration;
