import React, { useEffect, useState, useRef } from 'react';

export interface TerminalTextProps {
  /** The command string to type out, e.g. "$ elite --vision" */
  command: string;
  /** Optional output lines shown after typing completes */
  output?: string[];
  /** Characters per second (default: 40) */
  speed?: number;
  /** Delay before starting in ms (default: 0) */
  delay?: number;
  /** Additional className for the outer wrapper */
  className?: string;
}

/**
 * TerminalText
 * ────────────
 * Renders a typewriter animation for a terminal command string,
 * then fades in optional "output" lines one by one.
 *
 * Purely driven by `useState` + `setInterval` — no external deps.
 * GPU-accelerated: only `opacity` transitions used.
 * ARIA: `role="status"` so screen readers announce completion.
 */
const TerminalText: React.FC<TerminalTextProps> = ({
  command,
  output = [],
  speed = 40,
  delay = 0,
  className = '',
}) => {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [started, setStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    intervalRef.current = setInterval(() => {
      setDisplayedChars((prev) => {
        if (prev >= command.length) {
          clearInterval(intervalRef.current!);
          // Show output lines after a short pause
          setTimeout(() => setShowOutput(true), 180);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, command, speed]);

  const isTyping = displayedChars < command.length;

  return (
    <div
      className={`terminal-panel terminal-scanline px-5 py-4 text-sm ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Terminal output"
    >
      {/* ── Terminal Header ── */}
      <div className="mb-3 flex items-center">
        <span className="font-jetbrains text-xs md:text-sm text-white/30 tracking-wider">
          elite-dev ~ bash
        </span>
      </div>

      {/* ── Typed command line ── */}
      <div className="flex items-center gap-2">
        <span className="font-jetbrains text-[hsl(var(--neon-emerald))] text-xs select-none">
          ➜
        </span>
        <span className="font-jetbrains text-[hsl(var(--neon-cyan))] text-xs">
          {command.slice(0, displayedChars)}
        </span>
        {/* Blinking cursor */}
        {isTyping && (
          <span
            className="inline-block h-[1em] w-[2px] bg-[hsl(var(--neon-cyan))] animate-pulse ml-0.5"
            aria-hidden="true"
          />
        )}
      </div>

      {/* ── Output lines ── */}
      {showOutput && output.map((line, i) => (
        <div
          key={i}
          className="mt-1 font-jetbrains text-sm text-white/50 transition-opacity duration-300"
          style={{
            opacity: 0,
            animation: `count-up-reveal 0.35s ease-out ${i * 0.12}s forwards`,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

export default TerminalText;
