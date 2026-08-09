import { useCallback } from 'react';

export const useCinematicSound = () => {
  // Empty functions to disable all sounds as requested
  const playHoverTick = useCallback(() => {}, []);
  const playSubBassDrop = useCallback(() => {}, []);

  return { playHoverTick, playSubBassDrop };
};
