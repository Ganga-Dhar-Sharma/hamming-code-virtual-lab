import React from 'react';

/**
 * GLITCH — Mischievous Bit-Flip Gremlin
 * States: 'idle' | 'sparking' | 'laughing' | 'trapped'
 */
export default function Glitch({ state = 'idle', size = 80, className = '' }) {
  const isSparking = state === 'sparking';
  const isTrapped = state === 'trapped';
  const isLaughing = state === 'laughing';

  return (
    <div
      className={`glitch-avatar ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        animation: isSparking ? 'glitchSpark 0.3s ease infinite' : 'floatBob 2.5s ease-in-out infinite',
      }}
      title={`Glitch (${state})`}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Electric Sparks */}
        {(isSparking || isLaughing) && (
          <g>
            <polygon points="12,18 20,24 16,30 25,26 18,36" fill="#FFDA70" stroke="#FF4D6D" strokeWidth="1" />
            <polygon points="84,18 76,24 80,30 71,26 78,36" fill="#FFDA70" stroke="#FF4D6D" strokeWidth="1" />
          </g>
        )}

        {/* Spiky Ears */}
        <polygon points="24,35 15,12 38,24" fill="#8338EC" stroke="#25264F" strokeWidth="2.5" />
        <polygon points="76,35 85,12 62,24" fill="#8338EC" stroke="#25264F" strokeWidth="2.5" />

        {/* Body */}
        <ellipse cx="50" cy="55" rx="32" ry="28" fill="#8338EC" stroke="#25264F" strokeWidth="3" />

        {/* Belly */}
        <ellipse cx="50" cy="62" rx="18" ry="14" fill="#BBA9FF" opacity="0.7" />

        {/* Glowing Cat Eyes */}
        <ellipse cx="38" cy="48" rx="7" ry="9" fill="#FFDA70" stroke="#25264F" strokeWidth="2" />
        <ellipse cx="62" cy="48" rx="7" ry="9" fill="#FFDA70" stroke="#25264F" strokeWidth="2" />

        {/* Slanted Pupils */}
        <ellipse cx="38" cy="48" rx="2.5" ry="7" fill="#25264F" />
        <ellipse cx="62" cy="48" rx="2.5" ry="7" fill="#25264F" />

        {/* Impish Mouth */}
        {isLaughing ? (
          <path d="M 38 64 Q 50 78 62 64 Z" fill="#FF4D6D" stroke="#25264F" strokeWidth="2.5" />
        ) : (
          <path d="M 40 64 Q 45 61 50 65 Q 55 61 60 64" stroke="#25264F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Cartoon Net when Trapped */}
        {isTrapped && (
          <g style={{ animation: 'netDrop 0.5s ease-out forwards' }}>
            {/* Net dome */}
            <path
              d="M 12 75 Q 50 8 88 75 Z"
              fill="rgba(132, 220, 255, 0.25)"
              stroke="#25264F"
              strokeWidth="2.5"
            />
            {/* Grid lines */}
            <line x1="25" y1="65" x2="75" y2="25" stroke="#25264F" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="25" y1="25" x2="75" y2="65" stroke="#25264F" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="50" y1="15" x2="50" y2="75" stroke="#25264F" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="12" r="5" fill="#FFDA70" stroke="#25264F" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
}
