import React from 'react';

/**
 * PROFESSOR PARITY — Eccentric Scientist with Counting Machine
 * States: 'neutral' | 'calculating' | 'celebrating' | 'puzzled'
 */
export default function ProfessorParity({ state = 'neutral', size = 85, className = '' }) {
  return (
    <div
      className={`professor-avatar ${className}`}
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        animation: 'floatBob 3.5s ease-in-out infinite',
      }}
      title={`Professor Parity (${state})`}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Wild Scientist Hair */}
        <path
          d="M 18 42 Q 10 25 25 20 Q 35 10 50 12 Q 65 10 75 20 Q 90 25 82 42"
          fill="#ECE7FF"
          stroke="#25264F"
          strokeWidth="3"
        />

        {/* Head */}
        <circle cx="50" cy="46" r="28" fill="#FFF8EB" stroke="#25264F" strokeWidth="3" />

        {/* Oversized Spiral Glasses */}
        <g>
          {/* Bridge */}
          <line x1="45" y1="44" x2="55" y2="44" stroke="#25264F" strokeWidth="3.5" />

          {/* Left Lens */}
          <circle cx="36" cy="44" r="13" fill="#84DCFF" stroke="#25264F" strokeWidth="3" opacity="0.85" />
          <path d="M 36 39 A 5 5 0 0 1 36 49 A 3 3 0 0 1 36 41" stroke="#25264F" strokeWidth="2" fill="none" />

          {/* Right Lens */}
          <circle cx="64" cy="44" r="13" fill="#84DCFF" stroke="#25264F" strokeWidth="3" opacity="0.85" />
          <path d="M 64 39 A 5 5 0 0 1 64 49 A 3 3 0 0 1 64 41" stroke="#25264F" strokeWidth="2" fill="none" />
        </g>

        {/* Big White Lab Coat */}
        <path d="M 22 74 L 34 100 L 66 100 L 78 74 Z" fill="#FFFFFF" stroke="#25264F" strokeWidth="3" />
        <line x1="50" y1="74" x2="50" y2="100" stroke="#25264F" strokeWidth="2.5" />

        {/* Red Bowtie */}
        <polygon points="44,74 56,74 50,78" fill="#FF777F" stroke="#25264F" strokeWidth="2" />
        <polygon points="44,78 56,78 50,74" fill="#FF777F" stroke="#25264F" strokeWidth="2" />

        {/* Mouth */}
        {state === 'celebrating' ? (
          <path d="M 42 62 Q 50 72 58 62 Z" fill="#FF777F" stroke="#25264F" strokeWidth="2" />
        ) : state === 'puzzled' ? (
          <line x1="44" y1="64" x2="56" y2="61" stroke="#25264F" strokeWidth="2.5" strokeLinecap="round" />
        ) : (
          <path d="M 43 62 Q 50 67 57 62" stroke="#25264F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
}
