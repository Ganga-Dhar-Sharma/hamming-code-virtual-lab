import React from 'react';
import BitSlot from './BitSlot.jsx';
import { POSITION_INFO, PARITY_GROUPS } from '../lib/hamming.js';

/**
 * CodewordRow — Renders the 7 positions of a Hamming codeword.
 */
export default function CodewordRow({
  codeword = '0000000',
  corruptedPosition = null, // 1-based (1..7)
  activeGroup = null, // 'P1' | 'P2' | 'P4' | null
  onBitClick = null,
  interactive = false,
  size = 'md',
  showAddresses = true,
}) {
  const bits = String(codeword).split('').map(Number);

  // Group highlights
  const highlightedPositions = activeGroup ? PARITY_GROUPS[activeGroup] || [] : [];
  const groupColors = {
    P1: '#FF777F',
    P2: '#84DCFF',
    P4: '#FFDA70',
  };
  const activeColor = activeGroup ? groupColors[activeGroup] : null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap',
        padding: '12px 0',
      }}
    >
      {POSITION_INFO.map((info, idx) => {
        const pos1Based = idx + 1;
        const bitVal = bits[idx] !== undefined ? bits[idx] : 0;
        const isCorrupted = corruptedPosition === pos1Based;
        const isHighlighted = highlightedPositions.includes(pos1Based);

        return (
          <BitSlot
            key={pos1Based}
            pos={pos1Based}
            role={info.type}
            value={bitVal}
            binaryAddress={showAddresses ? info.binary : null}
            isParity={info.bitRole === 'parity'}
            isCorrupted={isCorrupted}
            isHighlighted={isHighlighted}
            highlightColor={activeColor}
            size={size}
            interactive={interactive}
            onClick={() => onBitClick && onBitClick(pos1Based)}
          />
        );
      })}
    </div>
  );
}
