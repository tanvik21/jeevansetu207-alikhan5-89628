import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Neural network pattern */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* AI pulse waves */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-96 h-96 border border-primary/10 rounded-full animate-ping-slow" />
        <div className="absolute w-80 h-80 border border-secondary/10 rounded-full animate-ping-slow animation-delay-1000" />
        <div className="absolute w-64 h-64 border border-primary/10 rounded-full animate-ping-slow animation-delay-2000" />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float animation-delay-2000" />
    </div>
  );
};

export default AnimatedBackground;
