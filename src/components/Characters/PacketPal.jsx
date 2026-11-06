import React from 'react';

/**
 * PACKET PALS — Cute Bouncy 0 and 1 Data Citizens
 * Values: 0 | 1
 * States: 'normal' | 'shielded' | 'celebrating' | 'flipped'
 */
export default function PacketPal({ value = 0, state = 'normal', size = 48, className = '' }) {
  const isOne = Number(value) === 1;
  const isShielded = state === 'shielded';
  const isFlipped = state === 'flipped';

  return (
    <div
      className={`packet-pal ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        animation: state === 'celebrating' ? 'bounceHop 0.8s ease infinite' : 'none',
      }}
      title={`Packet Pal ${value}`}
    >
      <svg viewBox="0 0 60 60" width="100%" height="100%">
        {/* Shield Bubble if shielded */}
        {isShielded && (
          <ellipse
            cx="30"
            cy="30"
            rx="28"
            ry="28"
            fill="rgba(132, 220, 255, 0.25)"
            stroke="#84DCFF"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
        )}

        {/* Bean Body */}
        <ellipse
          cx="30"
          cy="32"
          rx="18"
          ry="20"
          fill={isFlipped ? '#FF4D6D' : isOne ? '#A8EBCB' : '#FFDA70'}
          stroke="#25264F"
          strokeWidth="2.5"
        />

        {/* Eyes */}
        <circle cx="23" cy="27" r="3" fill="#25264F" />
        <circle cx="37" cy="27" r="3" fill="#25264F" />
        <circle cx="22" cy="26" r="1" fill="#FFFFFF" />
        <circle cx="36" cy="26" r="1" fill="#FFFFFF" />

        {/* Cute Mouth */}
        {state === 'celebrating' ? (
          <path d="M 26 35 Q 30 40 34 35" stroke="#25264F" strokeWidth="2" fill="#FF777F" />
        ) : (
          <path d="M 27 35 Q 30 38 33 35" stroke="#25264F" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Little Feet */}
        <ellipse cx="23" cy="51" rx="4" ry="2.5" fill="#25264F" />
        <ellipse cx="37" cy="51" rx="4" ry="2.5" fill="#25264F" />

        {/* Digit Badge on belly */}
        <text
          x="30"
          y="45"
          textAnchor="middle"
          fontSize="11"
          fontWeight="900"
          fontFamily="'JetBrains Mono', monospace"
          fill="#25264F"
        >
          {value}
        </text>
      </svg>
    </div>
  );
}
