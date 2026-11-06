import React, { useState } from 'react';

/**
 * Top App Header with XP, Stars, Level, Badges modal, Audio toggles, and Help desk.
 */
export default function Header({
  progress,
  onResetProgress,
  onOpenTour,
  onOpenHelp,
  onToggleSound,
  onToggleSpeech,
}) {
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const unlockedCount = progress.badges.filter((b) => b.unlocked).length;

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '2.5px solid #25264F',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(37, 38, 79, 0.06)',
      }}
    >
      {/* Brand & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: '#FFDA70',
            border: '2px solid #25264F',
            boxShadow: '0 3px 0 #25264F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 900,
          }}
        >
          ⚡
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1
              style={{
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#25264F',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              BIT BUSTERS 2.0
            </h1>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                backgroundColor: '#A8EBCB',
                color: '#25264F',
                padding: '2px 6px',
                borderRadius: 4,
                border: '1px solid #25264F',
              }}
            >
              BEGINNER-FIRST
            </span>
          </div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#56587A',
            }}
          >
            Catch the error. Crack the code. Save the signal!
          </span>
        </div>
      </div>

      {/* Stats Pills & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* XP Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 9999,
            backgroundColor: '#FFF8DF',
            border: '2px solid #25264F',
            boxShadow: '0 2px 0 #25264F',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#25264F',
          }}
        >
          <span>⚡</span>
          <span>{progress.xp} XP</span>
        </div>

        {/* Stars Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 9999,
            backgroundColor: '#E7F8FF',
            border: '2px solid #25264F',
            boxShadow: '0 2px 0 #25264F',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#25264F',
          }}
        >
          <span>⭐</span>
          <span>{progress.stars} Stars</span>
        </div>

        {/* Level Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 9999,
            backgroundColor: '#ECE7FF',
            border: '2px solid #25264F',
            boxShadow: '0 2px 0 #25264F',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#25264F',
          }}
        >
          <span>🛡️</span>
          <span>Level {progress.level}</span>
        </div>

        {/* Badges Button */}
        <button
          type="button"
          onClick={() => setShowBadgesModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            border: '2px solid #25264F',
            boxShadow: '0 2px 0 #25264F',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#25264F',
            cursor: 'pointer',
          }}
        >
          <span>🏅</span>
          <span>
            {unlockedCount}/{progress.badges.length}
          </span>
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          title={progress.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          aria-label={progress.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: '2px solid #25264F',
            boxShadow: '0 2px 0 #25264F',
            backgroundColor: progress.soundEnabled ? '#A8EBCB' : '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {progress.soundEnabled ? '🔊' : '🔇'}
        </button>

        {/* Speech / Narration Toggle */}
        <button
          type="button"
          onClick={onToggleSpeech}
          title={progress.speechEnabled ? 'Mute Character Voice' : 'Enable Character Voice'}
          aria-label={progress.speechEnabled ? 'Mute Character Voice' : 'Enable Character Voice'}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: '2px solid #25264F',
            boxShadow: '0 2px 0 #25264F',
            backgroundColor: progress.speechEnabled ? '#84DCFF' : '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {progress.speechEnabled ? '🗣️' : '🤫'}
        </button>

        {/* Persistent Help Desk (?) Button */}
        <button
          type="button"
          onClick={onOpenHelp}
          title="Open Professor Parity's Help Desk"
          aria-label="Help desk"
          style={{
            padding: '6px 14px',
            height: 38,
            borderRadius: 10,
            border: '2.5px solid #25264F',
            boxShadow: '0 3px 0 #25264F',
            backgroundColor: '#FFDA70',
            fontWeight: 900,
            fontSize: '0.92rem',
            color: '#25264F',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <span>❓</span>
          <span>HELP</span>
        </button>
      </div>

      {/* Badges Modal */}
      {showBadgesModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37, 38, 79, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 600,
            padding: 16,
          }}
          onClick={() => setShowBadgesModal(false)}
        >
          <div
            className="card-cartoon"
            style={{
              maxWidth: 580,
              width: '100%',
              backgroundColor: '#FFF8EB',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#25264F' }}>
                🏅 Signal Engineer Badges
              </h2>
              <button
                type="button"
                onClick={() => setShowBadgesModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '2px solid #25264F',
                  backgroundColor: '#FFF',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {progress.badges.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: b.unlocked ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    border: '2px solid #25264F',
                    boxShadow: b.unlocked ? '0 3px 0 #25264F' : 'none',
                    opacity: b.unlocked ? 1 : 0.6,
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{b.unlocked ? b.icon : '🔒'}</span>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#25264F' }}>
                      {b.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#56587A' }}>{b.desc}</p>
                  </div>
                  {b.unlocked && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        backgroundColor: '#A8EBCB',
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid #25264F',
                      }}
                    >
                      UNLOCKED
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Reset Progress Button */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: '2px dashed #25264F',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowBadgesModal(false);
                  onOpenTour();
                }}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#34449A',
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #25264F',
                  backgroundColor: '#ECE7FF',
                  cursor: 'pointer',
                }}
              >
                Replay 3-Step Tour 🚀
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all progress, XP, and badges?')) {
                    onResetProgress();
                    setShowBadgesModal(false);
                  }
                }}
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#FF4D6D',
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #FF4D6D',
                  backgroundColor: '#FFF',
                  cursor: 'pointer',
                }}
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
