import React, { useState, useEffect } from 'react';
import ProfessorParity from './Characters/ProfessorParity.jsx';
import { audioSystem } from '../lib/audio.js';

/**
 * Persistent Contextual Help Modal for Beginners with Voice Diagnostic Test
 */
export default function HelpModal({ isOpen, onClose, activeTab = 'missions' }) {
  const [helpTab, setHelpTab] = useState('guide');
  const [diagnosticStatus, setDiagnosticStatus] = useState('Voice ready');
  const [lastError, setLastError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const unsub = audioSystem.subscribe((state) => {
      setDiagnosticStatus(state.diagnosticStatus);
      setLastError(state.lastError);
    });
    return unsub;
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpeakTip = (text) => {
    audioSystem.speak(text, 'professor', null, true);
  };

  const handleRunDiagnosticTest = () => {
    const exactSentence =
      "Hello! I am Professor Parity. Welcome to Bit Busters. Let's learn Hamming Code together.";
    audioSystem.speak(exactSentence, 'professor', null, true);
  };

  const getStatusBadge = () => {
    let bg = '#A8EBCB';
    if (diagnosticStatus === 'Speaking') bg = '#2EC4B6';
    if (diagnosticStatus === 'Paused') bg = '#FFDA70';
    if (diagnosticStatus === 'Finished') bg = '#84DCFF';
    if (diagnosticStatus === 'Speech error') bg = '#FF4D6D';

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: bg,
          color: '#25264F',
          fontWeight: 900,
          padding: '4px 10px',
          borderRadius: 8,
          border: '1.5px solid #25264F',
          fontSize: '0.82rem',
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>●</span>
        {diagnosticStatus}
      </span>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(37, 38, 79, 0.7)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card-cartoon"
        style={{
          maxWidth: 640,
          width: '100%',
          backgroundColor: '#FFF8EB',
          border: '3px solid #25264F',
          boxShadow: '0 8px 0 #25264F',
          padding: 24,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ProfessorParity state="neutral" size={54} />
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#25264F' }}>
                Professor Parity's Help Desk
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#56587A', fontWeight: 700 }}>
                Beginner Guidance & Voice Diagnostics
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close help"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '2px solid #25264F',
              backgroundColor: '#FFF',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {[
            { id: 'guide', label: '📖 What Should I Do?' },
            { id: 'basics', label: '💡 Hamming in 60s' },
            { id: 'voice', label: '🗣️ Voice Diagnostics' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setHelpTab(t.id)}
              style={{
                flex: 1,
                padding: '8px 10px',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: 800,
                backgroundColor: helpTab === t.id ? '#25264F' : '#FFF',
                color: helpTab === t.id ? '#FFF' : '#25264F',
                border: '1.5px solid #25264F',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Guide */}
        {helpTab === 'guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #25264F',
                borderRadius: 12,
                padding: 16,
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34449A', marginBottom: 6 }}>
                Teacher's Advice for {activeTab.toUpperCase()} Tab:
              </h4>
              <p style={{ fontSize: '0.95rem', color: '#25264F', lineHeight: 1.5 }}>
                {activeTab === 'missions' &&
                  "In the MISSIONS tab, start with Lesson 1 to learn what a bit is. Work through the 7 simple lessons in order. Don't worry about memorizing formulas—I will guide you step by step with spoken explanations!"}
                {activeTab === 'lab' &&
                  "In the LAB tab, use Guided Mode! Click 'Next Step' to see each phase of Hamming Code: entering 4 bits, adding 3 parity shields, corrupting a bit, and calculating the syndrome."}
                {activeTab === 'play' &&
                  "In the PLAY tab, start with 'Learning Mode' in any game! You have unlimited retries, hints, and no timer. Read the instruction card first."}
                {activeTab === 'library' &&
                  "In the LIBRARY tab, toggle 'Quick Revision' for easy exam summaries or click any glossary term to see a simple definition."}
              </p>

              <div style={{ marginTop: 14 }}>
                <button
                  type="button"
                  className="btn-cartoon btn-mint"
                  onClick={() =>
                    handleSpeakTip(
                      "Don't worry, Junior Engineer! Take it one step at a time. A bit is just a 0 or 1. Parity simply counts how many ones there are. And Hamming code places parity bits at positions 1, 2, and 4 to catch errors!"
                    )
                  }
                  style={{ fontSize: '0.85rem', padding: '6px 14px' }}
                >
                  🔊 Hear Professor Parity Explain This
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Basics */}
        {helpTab === 'basics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ backgroundColor: '#FFF', border: '2px solid #25264F', borderRadius: 10, padding: 12 }}>
              <strong>1. What is a Bit?</strong>
              <p style={{ fontSize: '0.9rem', color: '#56587A', marginTop: 4 }}>
                A bit is either a 0 or a 1. When sending data, noise on the wire can glitch and change a 0 to 1 or 1 to 0 (a bit flip).
              </p>
            </div>
            <div style={{ backgroundColor: '#FFF', border: '2px solid #25264F', borderRadius: 10, padding: 12 }}>
              <strong>2. What is Even Parity?</strong>
              <p style={{ fontSize: '0.9rem', color: '#56587A', marginTop: 4 }}>
                Count the 1s! If you have three 1s, you add a parity bit of 1 to make the total four 1s (an EVEN number).
              </p>
            </div>
            <div style={{ backgroundColor: '#FFF', border: '2px solid #25264F', borderRadius: 10, padding: 12 }}>
              <strong>3. The Magic of Hamming (7,4):</strong>
              <p style={{ fontSize: '0.9rem', color: '#56587A', marginTop: 4 }}>
                We put 3 parity bits at positions 1, 2, and 4. We put 4 data bits at positions 3, 5, 6, 7. When an error happens, reading checks as S4 S2 S1 gives the exact position number in binary!
              </p>
            </div>
          </div>
        )}

        {/* Tab: Voice Diagnostics */}
        {helpTab === 'voice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #25264F',
                borderRadius: 14,
                padding: 18,
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
                🎙️ Character Voice Diagnostic Test
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#56587A', lineHeight: 1.4, marginBottom: 14 }}>
                Test your browser's Web Speech API directly! Click the button below to test character speech:
              </p>

              <div
                style={{
                  backgroundColor: '#FFF8EB',
                  border: '1.5px solid #25264F',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 14,
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34449A' }}>
                  EXACT TEST SENTENCE:
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#25264F', marginTop: 4 }}>
                  "Hello! I am Professor Parity. Welcome to Bit Busters. Let's learn Hamming Code together."
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <button
                  type="button"
                  className="btn-cartoon btn-primary"
                  onClick={handleRunDiagnosticTest}
                  style={{ fontSize: '0.95rem', padding: '10px 20px' }}
                >
                  🗣️ Test Voice Now
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#56587A' }}>
                    Engine Status:
                  </span>
                  {getStatusBadge()}
                </div>
              </div>

              {lastError && (
                <div style={{ marginTop: 10, color: '#FF4D6D', fontWeight: 800, fontSize: '0.85rem' }}>
                  ⚠️ Diagnostic Error: {lastError}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#E8FAF1', border: '1.5px solid #2EC4B6', borderRadius: 10, padding: 12 }}>
              <strong style={{ fontSize: '0.9rem', color: '#25264F' }}>✅ How Voice Controls Work:</strong>
              <p style={{ fontSize: '0.85rem', color: '#25264F', marginTop: 4, lineHeight: 1.4 }}>
                • Every speech bubble has a <strong>"🔊 Listen to Teacher"</strong> button that speaks immediately.<br />
                • The bottom dock lets you pause, resume, stop, change speed (0.8x, 1x, 1.2x), and switch voices.<br />
                • Speech is user-initiated to respect browser autoplay policies.
              </p>
            </div>
          </div>
        )}

        <div style={{ marginTop: 18, textAlign: 'right' }}>
          <button
            type="button"
            className="btn-cartoon btn-primary"
            onClick={onClose}
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            Close Help Desk 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
