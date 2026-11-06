import React from 'react';
import ParityShield from './ParityShield.jsx';

/**
 * Tactical cartoon bit slot with role colors, parity shields, and glitch sparks.
 */
export default function BitSlot({
  value = 0,
  pos = null, // 1-based position (1..7)
  role = 'D', // 'P1', 'P2', 'P4', 'D1', 'D2', etc.
  binaryAddress = null, // '001', '010', etc.
  isParity = false,
  isCorrupted = false,
  isHighlighted = false,
  highlightColor = null,
  onClick = null,
  interactive = false,
  disabled = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  sublabel = null,
}) {
  // Determine role color
  let baseColor = '#A8EBCB'; // Data mint
  let shieldColor = '#A8EBCB';

  if (role === 'P1') {
    baseColor = '#FF777F'; // Coral
    shieldColor = '#FF777F';
  } else if (role === 'P2') {
    baseColor = '#84DCFF'; // Sky Blue
    shieldColor = '#84DCFF';
  } else if (role === 'P4') {
    baseColor = '#FFDA70'; // Yellow
    shieldColor = '#FFDA70';
  }

  // Dimensions
  const dimMap = {
    sm: { width: 44, height: 56, fontSize: '1.2rem', badgeSize: 20 },
    md: { width: 62, height: 78, fontSize: '1.6rem', badgeSize: 24 },
    lg: { width: 78, height: 96, fontSize: '2.1rem', badgeSize: 28 },
  };
  const dims = dimMap[size] || dimMap.md;

  const handleClick = () => {
    if (interactive && !disabled && onClick) {
      onClick();
    }
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        userSelect: 'none',
      }}
    >
      {/* Position Header (1-based) */}
      {pos !== null && (
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#25264F',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>Pos {pos}</span>
          {isParity && <ParityShield color={shieldColor} size={16} />}
        </div>
      )}

      {/* Main Bit Card / Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!interactive || disabled}
        aria-label={`${role || 'Bit'} at position ${pos || ''}, value ${value}${isCorrupted ? ', corrupted' : ''}`}
        style={{
          width: dims.width,
          height: dims.height,
          backgroundColor: isCorrupted ? '#FFE5E9' : '#FFFFFF',
          border: isCorrupted
            ? '3px solid #FF4D6D'
            : isHighlighted
            ? `3px solid ${highlightColor || '#8338EC'}`
            : '2.5px solid #25264F',
          borderRadius: 14,
          boxShadow: isCorrupted
            ? '0 0 16px rgba(255, 77, 109, 0.7), 0 4px 0 #FF4D6D'
            : isHighlighted
            ? `0 0 12px ${highlightColor || '#8338EC'}, 0 4px 0 #25264F`
            : '0 4px 0 #25264F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: interactive && !disabled ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          animation: isCorrupted ? 'glitchSpark 0.4s ease infinite' : 'none',
        }}
      >
        {/* Role Tag (e.g. P1, D2) */}
        <span
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            fontSize: '0.65rem',
            fontWeight: 900,
            padding: '1px 5px',
            borderRadius: 6,
            backgroundColor: baseColor,
            color: role === 'P1' ? '#fff' : '#25264F',
            border: '1px solid #25264F',
          }}
        >
          {role}
        </span>

        {/* Glitch Indicator Spark if corrupted */}
        {isCorrupted && (
          <span
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#FF4D6D',
              color: '#fff',
              borderRadius: '50%',
              width: 20,
              height: 20,
              fontSize: '0.7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              border: '1.5px solid #25264F',
            }}
          >
            !
          </span>
        )}

        {/* Binary Bit Value */}
        <span
          className="binary-text"
          style={{
            fontSize: dims.fontSize,
            color: isCorrupted ? '#FF4D6D' : '#25264F',
            marginTop: 10,
          }}
        >
          {value}
        </span>
      </button>

      {/* Binary Address or Sublabel */}
      {(binaryAddress || sublabel) && (
        <span
          className="binary-text"
          style={{
            fontSize: '0.72rem',
            color: '#56587A',
            fontWeight: 700,
          }}
        >
          {binaryAddress || sublabel}
        </span>
      )}
    </div>
  );
}
