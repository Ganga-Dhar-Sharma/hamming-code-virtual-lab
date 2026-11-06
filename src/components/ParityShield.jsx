import React from 'react';

/**
 * Animated SVG Parity Shield that visually protects parity bits.
 */
export default function ParityShield({ color = '#FF777F', size = 28, className = '' }) {
  return (
    <div
      className={`parity-shield ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'shieldPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      title="Protective Parity Shield"
    >
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        {/* Shield outline & fill */}
        <path
          d="M 16 3 L 28 8 C 28 20 16 28 16 28 C 16 28 4 20 4 8 Z"
          fill={color}
          stroke="#25264F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner emblem */}
        <path
          d="M 16 7 L 24 11 C 24 19 16 24 16 24 C 16 24 8 19 8 11 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.75"
        />
        {/* Keyhole / star in center */}
        <circle cx="16" cy="14" r="2.5" fill="#FFFFFF" />
        <polygon points="15,15 17,15 18,20 14,20" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
