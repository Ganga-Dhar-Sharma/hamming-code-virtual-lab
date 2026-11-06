import React from 'react';

/**
 * BYTE — Friendly Robot Guide & Teacher
 * Expressions: 'happy' | 'thinking' | 'surprised' | 'celebrating' | 'worried' | 'winking'
 */
export default function Byte({ expression = 'happy', size = 80, className = '' }) {
  // Eye shapes and mouth paths based on expression
  let eyeLeft = <circle cx="34" cy="45" r="5" fill="#84DCFF" />;
  let eyeRight = <circle cx="66" cy="45" r="5" fill="#84DCFF" />;
  let mouth = <path d="M 40 60 Q 50 68 60 60" stroke="#25264F" strokeWidth="3" fill="none" strokeLinecap="round" />;
  let accessories = null;

  switch (expression) {
    case 'thinking':
      eyeLeft = <circle cx="34" cy="43" r="5" fill="#84DCFF" />;
      eyeRight = <line x1="62" y1="43" x2="70" y2="43" stroke="#84DCFF" strokeWidth="3" strokeLinecap="round" />;
      mouth = <line x1="43" y1="62" x2="57" y2="62" stroke="#25264F" strokeWidth="3" strokeLinecap="round" />;
      accessories = (
        <g transform="translate(68, 8) scale(0.6)">
          <circle cx="20" cy="20" r="10" fill="#FFDA70" stroke="#25264F" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M 20 14 L 20 20 L 25 20" stroke="#25264F" strokeWidth="2" fill="none" />
        </g>
      );
      break;

    case 'surprised':
      eyeLeft = <circle cx="34" cy="44" r="7" fill="#84DCFF" stroke="#25264F" strokeWidth="2" />;
      eyeRight = <circle cx="66" cy="44" r="7" fill="#84DCFF" stroke="#25264F" strokeWidth="2" />;
      mouth = <ellipse cx="50" cy="62" rx="6" ry="8" fill="#FF777F" stroke="#25264F" strokeWidth="2" />;
      break;

    case 'celebrating':
      eyeLeft = <path d="M 29 46 Q 34 38 39 46" stroke="#84DCFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
      eyeRight = <path d="M 61 46 Q 66 38 71 46" stroke="#84DCFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
      mouth = <path d="M 38 58 Q 50 72 62 58 Z" fill="#FF777F" stroke="#25264F" strokeWidth="2.5" />;
      accessories = (
        // Party Hat
        <g transform="translate(32, -6)">
          <polygon points="18,0 36,32 0,32" fill="#FF777F" stroke="#25264F" strokeWidth="2.5" />
          <circle cx="18" cy="0" r="4" fill="#FFDA70" stroke="#25264F" strokeWidth="1.5" />
        </g>
      );
      break;

    case 'worried':
      eyeLeft = <ellipse cx="34" cy="46" rx="5" ry="4" fill="#84DCFF" />;
      eyeRight = <ellipse cx="66" cy="46" rx="5" ry="4" fill="#84DCFF" />;
      mouth = <path d="M 40 65 Q 50 56 60 65" stroke="#25264F" strokeWidth="3" fill="none" strokeLinecap="round" />;
      break;

    case 'winking':
      eyeLeft = <path d="M 28 45 Q 34 50 40 45" stroke="#84DCFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
      eyeRight = <circle cx="66" cy="45" r="5" fill="#84DCFF" />;
      mouth = <path d="M 42 60 Q 52 68 58 59" stroke="#25264F" strokeWidth="3" fill="none" strokeLinecap="round" />;
      break;

    default: // happy
      eyeLeft = <circle cx="34" cy="45" r="5" fill="#84DCFF" />;
      eyeRight = <circle cx="66" cy="45" r="5" fill="#84DCFF" />;
      mouth = <path d="M 40 59 Q 50 68 60 59" stroke="#25264F" strokeWidth="3" fill="none" strokeLinecap="round" />;
      break;
  }

  return (
    <div
      className={`byte-avatar ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        animation: 'floatBob 3s ease-in-out infinite',
      }}
      title={`Byte (${expression})`}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="#25264F" strokeWidth="3" />
        <circle cx="50" cy="7" r="5" fill="#FFDA70" stroke="#25264F" strokeWidth="2" />

        {/* Ears */}
        <rect x="10" y="38" width="8" height="18" rx="4" fill="#BBA9FF" stroke="#25264F" strokeWidth="2.5" />
        <rect x="82" y="38" width="8" height="18" rx="4" fill="#BBA9FF" stroke="#25264F" strokeWidth="2.5" />

        {/* Head / Body */}
        <rect x="16" y="20" width="68" height="64" rx="20" fill="#FFFFFF" stroke="#25264F" strokeWidth="3.5" />

        {/* Screen Bezel */}
        <rect x="24" y="30" width="52" height="30" rx="10" fill="#25264F" />

        {/* Glow behind eyes */}
        <ellipse cx="50" cy="45" rx="22" ry="10" fill="rgba(132, 220, 255, 0.2)" />

        {/* Dynamic Eyes */}
        {eyeLeft}
        {eyeRight}

        {/* Dynamic Mouth */}
        {mouth}

        {/* Cute Cheek Blushes */}
        <circle cx="26" cy="62" r="4" fill="#FF777F" opacity="0.6" />
        <circle cx="74" cy="62" r="4" fill="#FF777F" opacity="0.6" />

        {/* Accessories */}
        {accessories}
      </svg>
    </div>
  );
}
