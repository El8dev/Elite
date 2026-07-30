import React from 'react';

/**
 * Elite Logo — restored version
 * Uses the official multi-path SVG shape.
 *
 * Usage: <EliteLogo className="w-7 h-7" fill="#8B5CF6" />
 */
export const EliteLogo: React.FC<{ className?: string; fill?: string }> = ({
  className = 'w-7 h-7',
  fill = '#8B5CF6',
}) => (
  <svg
    viewBox="0 0 170 155"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="ELITE Logo"
  >
    <path
      d="M 65 15 L 130 15 C 135 15 138 18 138 23 L 138 33 C 138 38 135 41 130 41 L 65 41 C 60 41 57 38 57 33 L 57 23 C 57 18 60 15 65 15 Z"
      fill={fill}
    />
    <path
      d="M 25 55 L 90 55 C 95 55 98 58 100 63 L 115 88 C 117 93 114 98 109 98 L 68 98 C 63 98 60 101 62 106 L 77 131 C 79 136 82 139 87 139 L 145 139 C 150 139 153 136 153 131 L 153 123 C 153 118 150 115 145 115 L 98 115 C 93 115 90 112 88 107 L 73 82 C 71 77 74 72 79 72 L 120 72 C 125 72 128 69 128 64 L 128 56 C 128 51 125 48 120 48 L 60 48 C 55 48 52 51 50 56 L 35 81 C 33 86 30 89 25 89 L 20 89 C 15 89 12 86 12 81 L 12 63 C 12 58 15 55 20 55 L 25 55 Z"
      fill={fill}
    />
  </svg>
);
