import { useState, useEffect } from 'react';

export function useReducedMotionPref(): boolean {
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check prefers-reduced-motion media query
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // 2. Check hardware concurrency (< 4 cores is considered low end)
    const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
    
    // 3. Check connection type (2g, 3g, or saveData)
    let slowConnection = false;
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      slowConnection = conn.saveData === true || conn.effectiveType === '2g' || conn.effectiveType === '3g';
    }

    const checkPref = () => {
      // 🔍 DIAGNOSTIC — remove after debugging
      console.log('[ReducedMotion] prefers-reduced-motion:', mql.matches);
      console.log('[ReducedMotion] lowCores (< 4):', lowCores, '| cores:', navigator.hardwareConcurrency);
      console.log('[ReducedMotion] slowConnection:', slowConnection);
      console.log('[ReducedMotion] FINAL result (will block particles if true):', mql.matches || lowCores || slowConnection);
      setReduceMotion(mql.matches || lowCores || slowConnection);
    };

    // Initial check
    checkPref();
    
    // Add listener for media query changes
    if (mql.addEventListener) {
      mql.addEventListener('change', checkPref);
    } else if (mql.addListener) {
      mql.addListener(checkPref);
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', checkPref);
      } else if (mql.removeListener) {
        mql.removeListener(checkPref);
      }
    };
  }, []);

  return reduceMotion;
}
