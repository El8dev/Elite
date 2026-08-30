import React, { useState, useEffect } from 'react';

export const FilmGrain: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[9995] opacity-[0.035] overflow-hidden"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/c3pQAAAACHRSTlMAAAAAAAD/AP+F91kAAAC4SURBVDjLxZTRboQgDEVR9h39/y/rFmS04AChH8B8c2+0L9P282Z5eTf/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/M/N79/8z83v3/zPze/f/wF7jP0oU0zMAAAAASUVORK5CYII=")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }}
    />
  );
};

