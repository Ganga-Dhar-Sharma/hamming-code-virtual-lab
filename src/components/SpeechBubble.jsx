import React, { useState, useEffect } from 'react';
import Byte from './Characters/Byte.jsx';
import Glitch from './Characters/Glitch.jsx';
import ProfessorParity from './Characters/ProfessorParity.jsx';
import PacketPal from './Characters/PacketPal.jsx';
import { audioSystem } from '../lib/audio.js';

/**
 * Enhanced SpeechBubble with Play, Pause, Resume, Stop, and Character Roles
 */
export default function SpeechBubble({
  text = '',
  character = 'professor', // 'professor' | 'byte' | 'glitch' | 'pal'
  expression = 'happy',
  onFinishTyping = null,
  autoSpeak = false,
  actionButton = null,
  roleBadge = null,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [speechState, setSpeechState] = useState('idle'); // 'idle' | 'playing' | 'paused'

  useEffect(() => {
    const unsub = audioSystem.subscribe((state) => {
      const match =
        state.currentText && text && state.currentText.trim() === text.trim();
      if (match) {
        setSpeechState(state.speakingState);
      } else {
        setSpeechState('idle');
      }
    });
    return unsub;
  }, [text]);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    if (autoSpeak) {
      audioSystem.speak(text, character, null, true);
    }

    const timer = setInterval(() => {
      index += 2;
      if (index >= text.length) {
        setDisplayedText(text);
        setIsTyping(false);
        clearInterval(timer);
        if (onFinishTyping) onFinishTyping();
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, 18);

    return () => clearInterval(timer);
  }, [text, character, autoSpeak]);

  const handleSkip = () => {
    setDisplayedText(text);
    setIsTyping(false);
    if (onFinishTyping) onFinishTyping();
  };

  const handlePlayVoice = () => {
    if (speechState === 'playing') {
      audioSystem.pauseSpeech();
    } else if (speechState === 'paused') {
      audioSystem.resumeSpeech();
    } else {
      // Force unmute = true so explicit user click ALWAYS plays speech
      audioSystem.speak(text, character, null, true);
    }
  };

  const handleStopVoice = () => {
    audioSystem.stopSpeech();
  };

  const renderAvatar = () => {
    switch ((character || '').toLowerCase()) {
      case 'byte':
        return <Byte expression={expression} size={70} />;
      case 'glitch':
        return <Glitch state="idle" size={70} />;
      case 'pal':
        return <PacketPal value={1} size={70} />;
      case 'professor':
      case 'professor parity':
      default:
        return <ProfessorParity state="neutral" size={70} />;
    }
  };

  const getCharacterMeta = () => {
    switch ((character || '').toLowerCase()) {
      case 'byte':
        return {
          name: 'Byte',
          role: roleBadge || 'Friendly Assistant',
          badgeColor: '#84DCFF',
        };
      case 'glitch':
        return {
          name: 'Glitch',
          role: roleBadge || 'Bit-Flip Gremlin',
          badgeColor: '#FF777F',
        };
      case 'pal':
        return {
          name: 'Packet Pal',
          role: roleBadge || 'Data Citizen',
          badgeColor: '#FFDA70',
        };
      case 'professor':
      case 'professor parity':
      default:
        return {
          name: 'Professor Parity',
          role: roleBadge || 'Your Personal Teacher',
          badgeColor: '#ECE7FF',
        };
    }
  };

  const meta = getCharacterMeta();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #25264F',
        borderRadius: 20,
        padding: '16px 20px',
        boxShadow: '0 4px 0 #25264F',
        maxWidth: 840,
        margin: '12px auto',
        position: 'relative',
      }}
    >
      <div style={{ flexShrink: 0 }}>{renderAvatar()}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name, Role Badge, and Voice Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontWeight: 900,
                fontSize: '1.05rem',
                color: '#25264F',
              }}
            >
              {meta.name}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                backgroundColor: meta.badgeColor,
                color: '#25264F',
                padding: '2px 8px',
                borderRadius: 6,
                border: '1px solid #25264F',
              }}
            >
              {meta.role}
            </span>
          </div>

          {/* Voice Controls inside speech bubble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn-cartoon"
              onClick={handlePlayVoice}
              title="Listen to character speak this explanation"
              style={{
                fontSize: '0.8rem',
                padding: '4px 10px',
                minHeight: 32,
                backgroundColor: speechState === 'playing' ? '#FFDA70' : '#A8EBCB',
                color: '#25264F',
                cursor: 'pointer',
              }}
            >
              {speechState === 'playing'
                ? '⏸ Pause Voice'
                : speechState === 'paused'
                ? '▶ Resume Voice'
                : '🔊 Listen to Teacher'}
            </button>

            {speechState !== 'idle' && (
              <button
                type="button"
                className="btn-cartoon"
                onClick={handleStopVoice}
                style={{
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  minHeight: 32,
                  backgroundColor: '#FFE5E9',
                  cursor: 'pointer',
                }}
                title="Stop speaking"
              >
                ⏹ Stop
              </button>
            )}

            {isTyping && (
              <button
                type="button"
                onClick={handleSkip}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#25264F',
                  padding: '4px 8px',
                  borderRadius: 6,
                  backgroundColor: '#ECE7FF',
                  border: '1.5px solid #25264F',
                  cursor: 'pointer',
                }}
              >
                Skip ⏭
              </button>
            )}
          </div>
        </div>

        {/* Bubble Text */}
        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.55,
            color: '#25264F',
            fontWeight: 600,
          }}
        >
          {displayedText}
          {isTyping && <span style={{ opacity: 0.6, fontWeight: 900 }}>|</span>}
        </p>

        {actionButton && !isTyping && (
          <div style={{ marginTop: 14 }}>{actionButton}</div>
        )}
      </div>
    </div>
  );
}
