import React, { useState, useEffect } from 'react';

export const SplashIntro: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('hasPlayedSplashIntro') !== 'true';
  });

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem('hasPlayedSplashIntro', 'true');
      
      // Optionally add the is-splashing class to body if needed
      document.body.classList.add('is-splashing');
      
      const timer = setTimeout(() => {
        setShowSplash(false);
        document.body.classList.remove('is-splashing');
      }, 4500); // Wait for the 4.4s CSS animation to complete
      
      return () => {
        clearTimeout(timer);
        document.body.classList.remove('is-splashing');
      };
    }
  }, [showSplash]);

  if (!showSplash) return null;

  return (
    <div aria-hidden="true" className="splash" id="splash">
      <div className="splash__stage">
        <img 
          alt="" 
          className="splash__hand splash__hand--top" 
          decoding="sync" 
          height="191" 
          loading="eager" 
          src="/hand_top.webp" 
          width="455" 
        />
        <div className="splash__wordmark">
          <span className="splash__glow"></span>
          <span className="splash__letters">
            <span className="splash__letter">E</span>
            <span className="splash__letter">L</span>
            <span className="splash__letter">I</span>
            <span className="splash__letter">T</span>
            <span className="splash__letter">E</span>
            <span className="splash__dot">.</span>
          </span>
          <svg aria-hidden="true" className="splash__flourish" viewBox="0 0 220 20">
            <defs>
              <linearGradient id="splashFlourishGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#5B3564"></stop>
                <stop offset="100%" stopColor="#BA68CB"></stop>
              </linearGradient>
            </defs>
            <path d="M6 11 C 50 3, 100 18, 140 9 S 200 2, 214 10"></path>
          </svg>
        </div>
        <img 
          alt="" 
          className="splash__hand splash__hand--bottom" 
          decoding="sync" 
          height="199" 
          loading="eager" 
          src="/hand_bottom.webp" 
          width="520" 
        />
      </div>
    </div>
  );
};
