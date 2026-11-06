import React from 'react';

/**
 * SignalCityScene — Animated SVG City Skyline with progressive lighting
 * progressionLevel: 0 (blackout) | 1 (tower 1) | 2 (kingdom) | 3 (shields) | 4 (full restore)
 */
export default function SignalCityScene({ progressionLevel = 0, height = 220, className = '' }) {
  const isL1 = progressionLevel >= 1;
  const isL2 = progressionLevel >= 2;
  const isL3 = progressionLevel >= 3;
  const isL4 = progressionLevel >= 4;

  const skyGradId = `skyGrad_${progressionLevel}`;

  return (
    <div
      className={`signal-city-scene ${className}`}
      style={{
        width: '100%',
        height,
        borderRadius: 16,
        overflow: 'hidden',
        border: '2.5px solid #25264F',
        boxShadow: '0 4px 0 #25264F',
        position: 'relative',
        backgroundColor: '#1E1E38',
      }}
      title={`Signal City — State Level ${progressionLevel}/4`}
    >
      <svg viewBox="0 0 800 300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={skyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isL4 ? '#25264F' : '#0F1026'} />
            <stop offset="60%" stopColor={isL4 ? '#34449A' : '#1E1E38'} />
            <stop offset="100%" stopColor={isL4 ? '#FF777F' : isL1 ? '#2D2854' : '#14142B'} />
          </linearGradient>
        </defs>

        {/* Night Sky */}
        <rect width="800" height="300" fill={`url(#${skyGradId})`} />

        {/* Stars */}
        <circle cx="90" cy="40" r="1.5" fill="#FFF" opacity="0.8" />
        <circle cx="210" cy="65" r="2" fill="#84DCFF" opacity="0.9" />
        <circle cx="360" cy="30" r="1.5" fill="#FFF" opacity="0.7" />
        <circle cx="510" cy="55" r="2" fill="#FFDA70" opacity="0.8" />
        <circle cx="680" cy="35" r="1.5" fill="#FFF" opacity="0.9" />
        <circle cx="760" cy="70" r="2" fill="#84DCFF" opacity="0.7" />

        {/* Distant Mountains / Clouds */}
        <path d="M 0 240 Q 200 170 400 230 Q 600 180 800 240 L 800 300 L 0 300 Z" fill="#14142B" opacity="0.6" />

        {/* Buildings Skyline */}
        {/* Building 1 (Far Left) */}
        <rect x="40" y="140" width="70" height="160" fill="#25264F" stroke="#1E1E38" strokeWidth="2" />
        {/* Building Windows */}
        {[160, 190, 220, 250].map((y) => (
          <g key={y}>
            <rect x="52" y={y} width="16" height="12" rx="2" fill={isL4 ? '#FFDA70' : '#34449A'} opacity={isL4 ? 0.9 : 0.3} />
            <rect x="80" y={y} width="16" height="12" rx="2" fill={isL4 ? '#FFDA70' : '#34449A'} opacity={isL4 ? 0.9 : 0.3} />
          </g>
        ))}

        {/* Tower 1 (Sector 1 - Activated at Level 1) */}
        <g>
          {/* Tower Pylon */}
          <line x1="160" y1="280" x2="190" y2="70" stroke="#25264F" strokeWidth="4" />
          <line x1="220" y1="280" x2="190" y2="70" stroke="#25264F" strokeWidth="4" />
          <line x1="170" y1="180" x2="210" y2="180" stroke="#25264F" strokeWidth="3" />
          <line x1="178" y1="130" x2="202" y2="130" stroke="#25264F" strokeWidth="3" />
          {/* Transmitter Orb */}
          <circle
            cx="190"
            cy="70"
            r="10"
            fill={isL1 ? '#FF777F' : '#34449A'}
            stroke="#25264F"
            strokeWidth="3"
            style={{ animation: isL1 ? 'pulseGlow 2s infinite' : 'none' }}
          />
          {/* Signal Rings if active */}
          {isL1 && (
            <g opacity="0.8">
              <circle cx="190" cy="70" r="22" fill="none" stroke="#FF777F" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="190" cy="70" r="36" fill="none" stroke="#FF777F" strokeWidth="1.5" strokeDasharray="6 6" />
            </g>
          )}
        </g>

        {/* Central Building (Parity Kingdom - Level 2) */}
        <rect x="250" y="110" width="130" height="190" rx="8" fill="#25264F" stroke="#1E1E38" strokeWidth="2" />
        {/* Parity Kingdom Dome */}
        <path d="M 275 110 Q 315 60 355 110 Z" fill={isL2 ? '#84DCFF' : '#34449A'} stroke="#25264F" strokeWidth="3" />
        {/* Grid Windows */}
        {[130, 165, 200, 235].map((y) => (
          <g key={y}>
            <rect x="268" y={y} width="20" height="15" rx="3" fill={isL2 ? '#84DCFF' : '#34449A'} opacity={isL2 ? 0.85 : 0.3} />
            <rect x="305" y={y} width="20" height="15" rx="3" fill={isL2 ? '#FFDA70' : '#34449A'} opacity={isL2 ? 0.85 : 0.3} />
            <rect x="342" y={y} width="20" height="15" rx="3" fill={isL2 ? '#84DCFF' : '#34449A'} opacity={isL2 ? 0.85 : 0.3} />
          </g>
        ))}

        {/* Defense Shield Grid (Level 3) */}
        {isL3 && (
          <path
            d="M 50 160 Q 400 40 750 160"
            fill="none"
            stroke="#A8EBCB"
            strokeWidth="4"
            strokeDasharray="12 6"
            opacity="0.85"
            style={{ animation: 'beamTravel 3s linear infinite' }}
          />
        )}

        {/* Tower 2 (Right - Sector 3/4) */}
        <g>
          <line x1="430" y1="280" x2="455" y2="85" stroke="#25264F" strokeWidth="3.5" />
          <line x1="480" y1="280" x2="455" y2="85" stroke="#25264F" strokeWidth="3.5" />
          <circle
            cx="455"
            cy="85"
            r="8"
            fill={isL3 ? '#A8EBCB' : '#34449A'}
            stroke="#25264F"
            strokeWidth="2.5"
          />
        </g>

        {/* Building 3 (Right) */}
        <rect x="520" y="130" width="100" height="170" fill="#25264F" />
        {[150, 185, 220, 255].map((y) => (
          <g key={y}>
            <rect x="536" y={y} width="18" height="14" rx="2" fill={isL4 ? '#A8EBCB' : '#34449A'} opacity={isL4 ? 0.9 : 0.3} />
            <rect x="568" y={y} width="18" height="14" rx="2" fill={isL4 ? '#FFDA70' : '#34449A'} opacity={isL4 ? 0.9 : 0.3} />
            <rect x="590" y={y} width="18" height="14" rx="2" fill={isL4 ? '#A8EBCB' : '#34449A'} opacity={isL4 ? 0.9 : 0.3} />
          </g>
        ))}

        {/* Master Signal Beacon (Level 4 - Fireworks & Spire) */}
        <g>
          <rect x="670" y="100" width="85" height="200" fill="#25264F" />
          <line x1="712" y1="100" x2="712" y2="40" stroke="#FFDA70" strokeWidth="4" />
          <circle
            cx="712"
            cy="40"
            r="12"
            fill={isL4 ? '#FFDA70' : '#34449A'}
            stroke="#25264F"
            strokeWidth="3"
            style={{ animation: isL4 ? 'pulseGlow 1.5s infinite' : 'none' }}
          />
          {isL4 && (
            <g>
              <line x1="712" y1="40" x2="680" y2="10" stroke="#FF777F" strokeWidth="2.5" />
              <line x1="712" y1="40" x2="744" y2="10" stroke="#84DCFF" strokeWidth="2.5" />
              <line x1="712" y1="40" x2="712" y2="12" stroke="#A8EBCB" strokeWidth="2.5" />
            </g>
          )}
        </g>

        {/* Transmission Cable Highway Across Bottom */}
        <path
          d="M 0 270 Q 200 260 400 270 Q 600 280 800 270"
          fill="none"
          stroke={isL1 ? '#84DCFF' : '#34449A'}
          strokeWidth="6"
        />

        {/* Traveling Binary Pulses on the cable */}
        {isL1 && (
          <circle cx="280" cy="265" r="5" fill="#FFDA70" stroke="#25264F" strokeWidth="1.5" />
        )}
        {isL2 && (
          <circle cx="480" cy="275" r="5" fill="#FF777F" stroke="#25264F" strokeWidth="1.5" />
        )}
      </svg>

      {/* Floating Status Banner */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 14,
          backgroundColor: 'rgba(37, 38, 79, 0.85)',
          padding: '4px 12px',
          borderRadius: 8,
          border: '1.5px solid #84DCFF',
          color: '#FFF',
          fontSize: '0.8rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ color: isL4 ? '#A8EBCB' : isL1 ? '#FFDA70' : '#FF4D6D' }}>●</span>
        <span>
          Signal Grid:{' '}
          {isL4
            ? 'Fully Restored (100%)'
            : isL3
            ? 'Shield Grid Online (75%)'
            : isL2
            ? 'Parity Kingdom Firing (50%)'
            : isL1
            ? 'Tower 1 Active (25%)'
            : 'Blackout (0%)'}
        </span>
      </div>
    </div>
  );
}
