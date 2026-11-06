import React, { useState, useEffect } from 'react';
import { audioSystem } from '../lib/audio.js';
import Byte from './Characters/Byte.jsx';
import Glitch from './Characters/Glitch.jsx';
import ProfessorParity from './Characters/ProfessorParity.jsx';
import PacketPal from './Characters/PacketPal.jsx';

/**
 * Universal Audio Captions Dock & Voice Controller with Diagnostic Status
 */
export default function AudioCaptionsDock() {
  const [audioState, setAudioState] = useState({
    speakingState: 'idle',
    diagnosticStatus: 'Voice ready',
    lastError: '',
    currentCharacter: 'professor',
    currentText: "Hello! I am Professor Parity. Welcome to Bit Busters. Let's learn Hamming Code together.",
    speechRate: 1.0,
    speechEnabled: true,
    soundEnabled: true,
    availableVoices: [],
    selectedVoiceURI: null,
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const unsub = audioSystem.subscribe((state) => {
      setAudioState((prev) => ({ ...prev, ...state }));
    });
    const unsubCap = audioSystem.subscribeCaptions((text, char) => {
      setAudioState((prev) => ({
        ...prev,
        currentText: text,
        currentCharacter: char,
      }));
    });

    return () => {
      unsub();
      unsubCap();
    };
  }, []);

  const handlePlayPause = () => {
    if (audioState.speakingState === 'playing') {
      audioSystem.pauseSpeech();
    } else if (audioState.speakingState === 'paused') {
      audioSystem.resumeSpeech();
    } else {
      audioSystem.speak(audioState.currentText, audioState.currentCharacter, null, true);
    }
  };

  const handleStop = () => {
    audioSystem.stopSpeech();
  };

  const handleToggleRate = () => {
    const rates = [0.8, 1.0, 1.2];
    const currIdx = rates.indexOf(audioState.speechRate);
    const nextRate = rates[(currIdx + 1) % rates.length];
    audioSystem.setSpeechRate(nextRate);
  };

  const handleRunDiagnosticTest = () => {
    const exactSentence =
      "Hello! I am Professor Parity. Welcome to Bit Busters. Let's learn Hamming Code together.";
    audioSystem.speak(exactSentence, 'professor', null, true);
  };

  const renderAvatar = (char, size = 38) => {
    switch ((char || '').toLowerCase()) {
      case 'byte':
        return <Byte expression="happy" size={size} />;
      case 'glitch':
        return <Glitch state="idle" size={size} />;
      case 'pal':
        return <PacketPal value={1} size={size} />;
      case 'professor':
      case 'professor parity':
      default:
        return <ProfessorParity state="neutral" size={size} />;
    }
  };

  const charDisplayName =
    audioState.currentCharacter === 'byte'
      ? 'Byte (Assistant)'
      : audioState.currentCharacter === 'glitch'
      ? 'Glitch (Gremlin)'
      : audioState.currentCharacter === 'pal'
      ? 'Packet Pal'
      : 'Professor Parity (Teacher)';

  const getStatusColor = (status) => {
    switch (status) {
      case 'Speaking':
        return '#2EC4B6';
      case 'Paused':
        return '#FFDA70';
      case 'Finished':
        return '#84DCFF';
      case 'Speech error':
        return '#FF4D6D';
      case 'Voice ready':
      default:
        return '#A8EBCB';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150,
        width: 'calc(100% - 32px)',
        maxWidth: 960,
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #25264F',
        borderRadius: 16,
        boxShadow: '0 6px 0 #25264F',
        padding: isMinimized ? '8px 16px' : '10px 18px',
        transition: 'all 0.2s ease',
      }}
      aria-label="Character narration and captions"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        {/* Left: Speaker Avatar & Live Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ flexShrink: 0 }}>
            {renderAvatar(audioState.currentCharacter, isMinimized ? 28 : 40)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 900,
                  color: '#34449A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {charDisplayName}
              </span>

              {/* Diagnostic Voice Status Pill */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  backgroundColor: getStatusColor(audioState.diagnosticStatus),
                  color: '#25264F',
                  padding: '1px 7px',
                  borderRadius: 6,
                  border: '1px solid #25264F',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#25264F',
                  }}
                />
                Status: {audioState.diagnosticStatus}
              </span>

              {audioState.lastError && (
                <span style={{ fontSize: '0.68rem', color: '#FF4D6D', fontWeight: 800 }}>
                  ({audioState.lastError})
                </span>
              )}
            </div>

            {!isMinimized && (
              <p
                style={{
                  fontSize: '0.88rem',
                  color: '#25264F',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  margin: '2px 0 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {audioState.currentText || "Click 'Listen to Teacher' or 'Test Voice' to hear character speech."}
              </p>
            )}
          </div>
        </div>

        {/* Right: Audio Playback Controls & Diagnostic Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
          {/* Diagnostic Test Voice Button */}
          <button
            type="button"
            className="btn-cartoon"
            onClick={handleRunDiagnosticTest}
            style={{
              padding: '6px 12px',
              minHeight: 34,
              fontSize: '0.8rem',
              backgroundColor: '#A8EBCB',
              color: '#25264F',
              fontWeight: 900,
            }}
            title="Speak diagnostic test sentence"
          >
            🗣️ Test Voice
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            className="btn-cartoon"
            onClick={handlePlayPause}
            style={{
              padding: '6px 12px',
              minHeight: 34,
              fontSize: '0.8rem',
              backgroundColor: audioState.speakingState === 'playing' ? '#FFDA70' : '#84DCFF',
            }}
            title={audioState.speakingState === 'playing' ? 'Pause speech' : 'Play speech'}
          >
            {audioState.speakingState === 'playing'
              ? '⏸ Pause'
              : audioState.speakingState === 'paused'
              ? '▶ Resume'
              : '🔊 Listen'}
          </button>

          {/* Stop Button */}
          {audioState.speakingState !== 'idle' && (
            <button
              type="button"
              className="btn-cartoon"
              onClick={handleStop}
              style={{
                padding: '6px 10px',
                minHeight: 34,
                fontSize: '0.8rem',
                backgroundColor: '#FFE5E9',
              }}
              title="Stop speech"
            >
              ⏹ Stop
            </button>
          )}

          {/* Speed Toggle */}
          <button
            type="button"
            className="btn-cartoon"
            onClick={handleToggleRate}
            style={{
              padding: '6px 10px',
              minHeight: 34,
              fontSize: '0.78rem',
              backgroundColor: '#ECE7FF',
            }}
            title="Adjust speech speed (0.8x, 1.0x, 1.2x)"
          >
            {audioState.speechRate}x
          </button>

          {/* Voice Settings Gear Button */}
          <button
            type="button"
            className="btn-cartoon"
            onClick={() => setShowSettings(!showSettings)}
            style={{
              padding: '6px 10px',
              minHeight: 34,
              fontSize: '0.8rem',
              backgroundColor: showSettings ? '#FFDA70' : '#FFFFFF',
            }}
            title="Voice selection"
          >
            ⚙️ Voice
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 900,
              padding: '4px',
              color: '#56587A',
            }}
            title={isMinimized ? 'Expand captions dock' : 'Minimize captions dock'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Voice Selection Settings Panel */}
      {showSettings && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1.5px dashed #25264F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#25264F' }}>
              Browser Voice:
            </span>
            <select
              value={audioState.selectedVoiceURI || ''}
              onChange={(e) => audioSystem.setSelectedVoiceURI(e.target.value)}
              style={{
                flex: 1,
                padding: '4px 8px',
                borderRadius: 8,
                border: '1.5px solid #25264F',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                backgroundColor: '#FFF8EB',
              }}
            >
              <option value="">Default Best-Match Natural English Voice</option>
              {audioState.availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn-cartoon btn-mint"
              onClick={handleRunDiagnosticTest}
              style={{
                padding: '4px 12px',
                minHeight: 30,
                fontSize: '0.78rem',
              }}
            >
              🗣️ Test Sentence
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              style={{
                padding: '4px 8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#56587A',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
