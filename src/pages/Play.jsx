import React, { useState } from 'react';
import Quiz from '../components/Quiz.jsx';
import CodewordRow from '../components/CodewordRow.jsx';
import BitSlot from '../components/BitSlot.jsx';
import SpeechBubble from '../components/SpeechBubble.jsx';
import Confetti from '../components/Confetti.jsx';
import ProfessorParity from '../components/Characters/ProfessorParity.jsx';
import Byte from '../components/Characters/Byte.jsx';
import Glitch from '../components/Characters/Glitch.jsx';
import { QUIZ_BANK } from '../data/quizzes.js';
import { encode, syndrome, correct, flipBitAt, PARITY_GROUPS } from '../lib/hamming.js';
import { audioSystem } from '../lib/audio.js';

/**
 * BIT BUSTERS 2.0 — Redesigned Beginner-First Games
 * 5 Dedicated Games:
 * Game A: Catch the Bit Flip
 * Game B: Feed the Parity Machine
 * Game C: Build the Codeword
 * Game D: Stop Glitch
 * Game E: Syndrome Detective
 * + Quiz Arena
 *
 * Each Game Features:
 * - Dedicated Instruction Screen (Objective, What to click, How it works, Worked example)
 * - 3 Modes: Learning Mode (Tutorial), Practice Mode, Challenge Mode
 * - Spoken instructions
 * - Unlimited retries, hints, explanations
 * - Clear Restart Game button
 */
export default function Play({ onAwardXP, onAwardStars, onAwardBadge }) {
  const [activeGame, setActiveGame] = useState('menu'); // 'menu' | 'gameA' | 'gameB' | 'gameC' | 'gameD' | 'gameE' | 'quiz_arena'
  const [gameMode, setGameMode] = useState('learning'); // 'learning' | 'practice' | 'challenge'
  const [inInstructionScreen, setInInstructionScreen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // -------------------------------------------------------------
  // GAME A: CATCH THE BIT FLIP STATE
  // -------------------------------------------------------------
  const [gameASent, setGameASent] = useState(['1', '0', '1', '1']);
  const [gameAReceived, setGameAReceived] = useState(['1', '1', '1', '1']); // bit index 1 flipped
  const [gameAFlipPos, setGameAFlipPos] = useState(2); // 1-based pos 2
  const [gameASolved, setGameASolved] = useState(false);
  const [gameAScore, setGameAScore] = useState(0);

  const initGameA = (mode = gameMode) => {
    const is7Bits = mode === 'challenge';
    const len = is7Bits ? 7 : 4;
    const sent = Array.from({ length: len }, () => (Math.random() > 0.5 ? '1' : '0'));
    const flipIdx = Math.floor(Math.random() * len);
    const rec = [...sent];
    rec[flipIdx] = rec[flipIdx] === '1' ? '0' : '1';

    setGameASent(sent);
    setGameAReceived(rec);
    setGameAFlipPos(flipIdx + 1);
    setGameASolved(false);
  };

  // -------------------------------------------------------------
  // GAME B: FEED THE PARITY MACHINE STATE
  // -------------------------------------------------------------
  const [gameBData, setGameBData] = useState(['1', '0', '1', '1']);
  const [gameBParityRule, setGameBParityRule] = useState('even'); // 'even' | 'odd'
  const [gameBSelected, setGameBSelected] = useState(null);
  const [gameBFeedback, setGameBFeedback] = useState(null);

  const initGameB = (mode = gameMode) => {
    const len = mode === 'challenge' ? 6 : 4;
    const data = Array.from({ length: len }, () => (Math.random() > 0.5 ? '1' : '0'));
    const rule = mode === 'learning' ? 'even' : Math.random() > 0.5 ? 'even' : 'odd';
    setGameBData(data);
    setGameBParityRule(rule);
    setGameBSelected(null);
    setGameBFeedback(null);
  };

  // -------------------------------------------------------------
  // GAME C: BUILD THE CODEWORD STATE
  // -------------------------------------------------------------
  const [gameCData, setGameCData] = useState(['1', '0', '1', '1']);
  const [gameCUserP1, setGameCUserP1] = useState(null);
  const [gameCUserP2, setGameCUserP2] = useState(null);
  const [gameCUserP4, setGameCUserP4] = useState(null);
  const [gameCStage, setGameCStage] = useState('p1'); // 'p1' | 'p2' | 'p4' | 'complete'

  const initGameC = () => {
    const d = Array.from({ length: 4 }, () => (Math.random() > 0.5 ? '1' : '0'));
    setGameCData(d);
    setGameCUserP1(null);
    setGameCUserP2(null);
    setGameCUserP4(null);
    setGameCStage('p1');
  };

  // -------------------------------------------------------------
  // GAME D: STOP GLITCH STATE
  // -------------------------------------------------------------
  const [gameDOriginal, setGameDOriginal] = useState('0110011');
  const [gameDCorrupted, setGameDCorrupted] = useState('0110001');
  const [gameDErrorPos, setGameDErrorPos] = useState(6);
  const [gameDFixed, setGameDFixed] = useState(false);

  const initGameD = () => {
    const rndData = Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
    const enc = encode(rndData, 'even');
    const errPos = Math.floor(Math.random() * 7) + 1;
    const corrupted = flipBitAt(enc.codeword, errPos);

    setGameDOriginal(enc.codeword);
    setGameDCorrupted(corrupted);
    setGameDErrorPos(errPos);
    setGameDFixed(false);
  };

  // -------------------------------------------------------------
  // GAME E: SYNDROME DETECTIVE STATE
  // -------------------------------------------------------------
  const [gameEWord, setGameEWord] = useState('0110001');
  const [gameEChecks, setGameEChecks] = useState({ s1: null, s2: null, s4: null });
  const [gameEStep, setGameEStep] = useState('s1'); // 's1' -> 's2' -> 's4' -> 'solve'
  const [gameESolved, setGameESolved] = useState(false);

  const initGameE = () => {
    const rndData = Math.floor(Math.random() * 16).toString(2).padStart(4, '0');
    const enc = encode(rndData, 'even');
    const errPos = Math.floor(Math.random() * 7) + 1;
    const corrupted = flipBitAt(enc.codeword, errPos);

    setGameEWord(corrupted);
    setGameEChecks({ s1: null, s2: null, s4: null });
    setGameEStep('s1');
    setGameESolved(false);
  };

  // Quiz Arena state
  const [arenaQuestions, setArenaQuestions] = useState([]);
  const startQuizArena = () => {
    const shuffled = [...QUIZ_BANK].sort(() => 0.5 - Math.random()).slice(0, 5);
    setArenaQuestions(shuffled);
    setActiveGame('quiz_arena');
  };

  // Navigation into a game
  const openGame = (gameId) => {
    audioSystem.playClick();
    setActiveGame(gameId);
    setInInstructionScreen(true);
    setGameMode('learning');

    if (gameId === 'gameA') initGameA('learning');
    if (gameId === 'gameB') initGameB('learning');
    if (gameId === 'gameC') initGameC();
    if (gameId === 'gameD') initGameD();
    if (gameId === 'gameE') initGameE();
  };

  // =============================================================
  // GAME INSTRUCTION CONFIGURATIONS
  // =============================================================
  const gameInstructions = {
    gameA: {
      title: 'Game A: Catch the Bit Flip',
      objective: 'Spot the single damaged bit that Glitch changed during transmission.',
      whatToClick: 'Click on the single bit in the received message that does NOT match the sent message.',
      howItWorks: 'A message travels through the cable. Glitch zaps one of the bits from 0 to 1 or 1 to 0.',
      success: 'Clicking the flipped bit restores it, catches Glitch in a net, and rewards XP!',
      workedExample: 'Sent: [1, 0, 1, 1]. Received: [1, 1, 1, 1]. The 2nd bit changed from 0 to 1. Click Bit 2!',
      teacherVoice:
        "Welcome to Catch the Bit Flip! Your objective is to spot the single bit that changed on the wire. Compare the sent message with the received message, and click the bit that looks different!",
    },
    gameB: {
      title: 'Game B: Feed the Parity Machine',
      objective: 'Count the 1s and supply the correct Even or Odd parity bit.',
      whatToClick: 'Click either Parity Bit 0 or Parity Bit 1 to balance the counting machine.',
      howItWorks:
        'With Even Parity, the total number of 1s must be EVEN (0, 2, 4, 6). With Odd Parity, the total must be ODD (1, 3, 5).',
      success: 'Matching the parity rule satisfies Professor Parity and lights up his machine!',
      workedExample:
        'Data: [1, 0, 1, 1] has three 1s. For Even Parity, we need an even total, so click Parity Bit = 1 (making 4 ones!).',
      teacherVoice:
        "Welcome to Feed the Parity Machine! Count how many 1s appear in the data. If we need Even parity, make sure the total count of 1s is an even number!",
    },
    gameC: {
      title: 'Game C: Build the Codeword',
      objective: 'Place 4 data bits and calculate the 3 parity shield bits at positions 1, 2, and 4.',
      whatToClick: 'Click on the correct 0 or 1 choice for each parity bit step by step.',
      howItWorks:
        'P1 checks positions {1,3,5,7}. P2 checks {2,3,6,7}. P4 checks {4,5,6,7}. We calculate each using Even Parity.',
      success: 'All 7 positions are assembled into a valid Hamming (7,4) codeword!',
      workedExample: 'Data 1011 produces P1=0, P2=1, P4=0. The assembled codeword is 0110011.',
      teacherVoice:
        "Let's build a complete 7-bit Hamming codeword together! Positions 1, 2, and 4 are parity shields. I will guide you to calculate each one!",
    },
    gameD: {
      title: 'Game D: Stop Glitch',
      objective: 'Transmit a codeword through noise, spot the corrupted bit, and correct it back.',
      whatToClick: 'Click on the corrupted bit to restore the original message.',
      howItWorks: 'A 7-bit codeword travels through Signal City. Glitch inverts one bit. You must find and fix it.',
      success: 'The damaged bit is repaired, and the original 4 data bits are successfully recovered!',
      workedExample: 'Received: 0110001. Bit 6 was corrupted. Click Bit 6 to flip it back to 1!',
      teacherVoice:
        "Red alert! Glitch just attacked a live transmission. Inspect the codeword, find the damaged bit, and flip it back to save Signal City!",
    },
    gameE: {
      title: 'Game E: Syndrome Detective',
      objective: 'Work with detectives S1, S2, and S4 to calculate the syndrome and locate the error.',
      whatToClick: 'Solve each detective check one by one, then read S4 S2 S1 to identify the error position.',
      howItWorks: 'Each check XORs its group. If even, check is 0. If odd, check is 1. S4 S2 S1 in binary gives the exact position.',
      success: 'Converting binary syndrome S4 S2 S1 to decimal reveals the exact corrupted bit index!',
      workedExample: 'If S4=1, S2=1, S1=0 -> binary 110 = decimal 6! Position 6 is corrupted.',
      teacherVoice:
        "Meet the three Parity Detectives: S1, S2, and S4. Let's solve their checks one by one and read the syndrome to crack the case!",
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* ============================================================= */}
      {/* 1. MAIN GAME MENU */}
      {/* ============================================================= */}
      {activeGame === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card-cartoon" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <ProfessorParity state="neutral" size={60} />
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#25264F' }}>
                  🎮 Beginner-Friendly Learning Games
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#56587A' }}>
                  Professor Parity's game room teaches you step by step. Every game starts with a full explanation, hints, and no timers!
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { id: 'gameA', title: 'Game A: Catch the Bit Flip', icon: '🎯', desc: 'Spot the single changed bit moving through a cable.', color: '#A8EBCB' },
              { id: 'gameB', title: 'Game B: Feed the Parity Machine', icon: '⚖️', desc: 'Count 1s and supply the correct Even or Odd parity bit.', color: '#FFDA70' },
              { id: 'gameC', title: 'Game C: Build the Codeword', icon: '🛡️', desc: 'Place data bits and calculate P1, P2, P4 step by step.', color: '#84DCFF' },
              { id: 'gameD', title: 'Game D: Stop Glitch', icon: '⚡', desc: 'Detect and correct corrupted bits in live transmissions.', color: '#FF777F' },
              { id: 'gameE', title: 'Game E: Syndrome Detective', icon: '🔍', desc: 'Solve S1, S2, S4 checks and convert binary to decimal.', color: '#ECE7FF' },
              { id: 'quiz_arena', title: 'Quiz Arena', icon: '🧠', desc: '5-question casual quiz with hints and friendly feedback.', color: '#FFF8DF', isArena: true },
            ].map((g) => (
              <div
                key={g.id}
                className="card-cartoon interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 22,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '2.4rem' }}>{g.icon}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        backgroundColor: '#FFF',
                        padding: '3px 8px',
                        borderRadius: 6,
                        border: '1.5px solid #25264F',
                      }}
                    >
                      BEGINNER FRIENDLY
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
                    {g.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#56587A', lineHeight: 1.5, marginBottom: 16 }}>
                    {g.desc}
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-cartoon"
                  onClick={() => (g.isArena ? startQuizArena() : openGame(g.id))}
                  style={{
                    backgroundColor: g.color,
                    color: '#25264F',
                    width: '100%',
                    padding: '10px 16px',
                  }}
                >
                  Learn & Play ➔
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 2. DEDICATED INSTRUCTION SCREEN BEFORE ANY GAME */}
      {/* ============================================================= */}
      {activeGame !== 'menu' && activeGame !== 'quiz_arena' && inInstructionScreen && (
        <div className="card-cartoon" style={{ padding: 26 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button
              type="button"
              className="btn-cartoon"
              onClick={() => setActiveGame('menu')}
              style={{ backgroundColor: '#FFF', fontSize: '0.85rem' }}
            >
              ◀ Back to All Games
            </button>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 900,
                backgroundColor: '#ECE7FF',
                padding: '4px 10px',
                borderRadius: 8,
                border: '1.5px solid #25264F',
                color: '#34449A',
              }}
            >
              STEP 1 OF 2: GAME INSTRUCTIONS
            </span>
          </div>

          <SpeechBubble
            character="professor"
            text={gameInstructions[activeGame]?.teacherVoice || 'Welcome to the game!'}
            expression="celebrating"
            roleBadge="Main Teacher"
          />

          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#25264F', margin: '14px 0 10px' }}>
            {gameInstructions[activeGame]?.title}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, margin: '18px 0' }}>
            <div style={{ backgroundColor: '#FFF8EB', border: '2px solid #25264F', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#34449A' }}>🎯 Objective:</strong>
              <p style={{ fontSize: '0.95rem', color: '#25264F', marginTop: 4 }}>
                {gameInstructions[activeGame]?.objective}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFF8EB', border: '2px solid #25264F', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#2EC4B6' }}>👉 What should I click?</strong>
              <p style={{ fontSize: '0.95rem', color: '#25264F', marginTop: 4 }}>
                {gameInstructions[activeGame]?.whatToClick}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFF8EB', border: '2px solid #25264F', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#8338EC' }}>⚙️ How does it work?</strong>
              <p style={{ fontSize: '0.95rem', color: '#25264F', marginTop: 4 }}>
                {gameInstructions[activeGame]?.howItWorks}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFF8EB', border: '2px solid #25264F', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#FF777F' }}>🏆 What does success look like?</strong>
              <p style={{ fontSize: '0.95rem', color: '#25264F', marginTop: 4 }}>
                {gameInstructions[activeGame]?.success}
              </p>
            </div>
          </div>

          {/* Worked Example */}
          <div
            style={{
              backgroundColor: '#E8FAF1',
              border: '2px solid #2EC4B6',
              borderRadius: 12,
              padding: '14px 18px',
              marginBottom: 20,
            }}
          >
            <strong style={{ fontSize: '1rem', color: '#25264F' }}>💡 Small Worked Example:</strong>
            <p style={{ fontSize: '0.95rem', color: '#25264F', marginTop: 4 }}>
              {gameInstructions[activeGame]?.workedExample}
            </p>
          </div>

          {/* Choose Difficulty Mode */}
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#56587A', textTransform: 'uppercase' }}>
              Select Difficulty Mode:
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              {[
                { id: 'learning', label: '1. Learning Mode (Tutorial & Hints)', color: '#A8EBCB' },
                { id: 'practice', label: '2. Practice Mode (Self-Guided)', color: '#FFDA70' },
                { id: 'challenge', label: '3. Challenge Mode (Score Points)', color: '#FF777F' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setGameMode(m.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    backgroundColor: gameMode === m.id ? m.color : '#FFF',
                    border: '2px solid #25264F',
                    boxShadow: gameMode === m.id ? '0 3px 0 #25264F' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              className="btn-cartoon btn-primary"
              onClick={() => {
                audioSystem.playClick();
                setInInstructionScreen(false);
              }}
              style={{ padding: '12px 32px', fontSize: '1.15rem' }}
            >
              Start Game Now ➔
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 3. ACTIVE GAME PLAY SCREENS (WITH RESTART BUTTON) */}
      {/* ============================================================= */}
      {activeGame !== 'menu' && activeGame !== 'quiz_arena' && !inInstructionScreen && (
        <div className="card-cartoon" style={{ padding: 24 }}>
          {/* Universal Game Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              borderBottom: '2px dashed #25264F',
              paddingBottom: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  backgroundColor: '#FFF8DF',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #25264F',
                  color: '#25264F',
                  marginRight: 8,
                }}
              >
                MODE: {gameMode.toUpperCase()}
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#25264F' }}>
                {gameInstructions[activeGame]?.title}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {/* Clear Restart Button */}
              <button
                type="button"
                className="btn-cartoon"
                onClick={() => {
                  audioSystem.playClick();
                  if (activeGame === 'gameA') initGameA();
                  if (activeGame === 'gameB') initGameB();
                  if (activeGame === 'gameC') initGameC();
                  if (activeGame === 'gameD') initGameD();
                  if (activeGame === 'gameE') initGameE();
                }}
                style={{ backgroundColor: '#FFF', fontSize: '0.82rem', padding: '6px 12px' }}
              >
                🔄 Restart Game
              </button>

              <button
                type="button"
                className="btn-cartoon"
                onClick={() => setInInstructionScreen(true)}
                style={{ backgroundColor: '#ECE7FF', fontSize: '0.82rem', padding: '6px 12px' }}
              >
                📖 How to Play
              </button>

              <button
                type="button"
                className="btn-cartoon"
                onClick={() => setActiveGame('menu')}
                style={{ backgroundColor: '#FFF', fontSize: '0.82rem', padding: '6px 12px' }}
              >
                Exit
              </button>
            </div>
          </div>

          {/* ---------------- GAME A: CATCH THE BIT FLIP ---------------- */}
          {activeGame === 'gameA' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '1.05rem', color: '#25264F', marginBottom: 16 }}>
                Glitch struck the wire! Compare the sent message with the received message below. Click the damaged bit!
              </p>

              <div style={{ display: 'inline-block', backgroundColor: '#FFF8EB', border: '2px solid #25264F', borderRadius: 12, padding: '12px 20px', marginBottom: 16 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2EC4B6' }}>ORIGINAL SENT MESSAGE:</span>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 6 }}>
                  {gameASent.map((b, i) => (
                    <BitSlot key={i} role={`B${i + 1}`} value={Number(b)} size="md" />
                  ))}
                </div>
              </div>

              <div style={{ margin: '14px 0' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FF4D6D' }}>
                  RECEIVED ON WIRE (Tap the incorrect bit to catch Glitch!):
                </span>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 8 }}>
                  {gameAReceived.map((b, i) => (
                    <BitSlot
                      key={i}
                      role={`B${i + 1}`}
                      value={Number(b)}
                      isCorrupted={i + 1 === gameAFlipPos && gameASolved}
                      interactive
                      size="lg"
                      onClick={() => {
                        if (i + 1 === gameAFlipPos) {
                          audioSystem.playCorrect();
                          setGameASolved(true);
                          setGameAScore((s) => s + 10);
                          onAwardXP(25);
                        } else {
                          audioSystem.playIncorrect();
                          alert(`Bit ${i + 1} matches the sent message! Keep looking!`);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {gameASolved && (
                <div style={{ backgroundColor: '#E8FAF1', border: '2px solid #2EC4B6', borderRadius: 12, padding: 14, maxWidth: 500, margin: '16px auto' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎉</span>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#25264F', margin: '4px 0' }}>
                    You caught Glitch! Bit {gameAFlipPos} was the corrupted bit!
                  </div>
                  <button
                    type="button"
                    className="btn-cartoon btn-primary"
                    onClick={() => initGameA()}
                    style={{ marginTop: 10 }}
                  >
                    Play Next Round ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---------------- GAME B: FEED THE PARITY MACHINE ---------------- */}
          {activeGame === 'gameB' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '1.05rem', color: '#25264F', marginBottom: 14 }}>
                Professor Parity's machine requires <strong>{gameBParityRule.toUpperCase()} PARITY</strong>!
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '14px 0' }}>
                {gameBData.map((b, i) => (
                  <BitSlot key={i} role={`D${i + 1}`} value={Number(b)} size="lg" />
                ))}
              </div>

              {/* Counting guidance in learning mode */}
              <div style={{ backgroundColor: '#FFF8DF', border: '1.5px solid #FFDA70', borderRadius: 10, padding: 10, maxWidth: 440, margin: '0 auto 16px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#25264F' }}>
                  Count the 1s: Total of {gameBData.filter((b) => b === '1').length} ones in the data!
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                {[0, 1].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className="btn-cartoon"
                    onClick={() => {
                      const count = gameBData.filter((b) => b === '1').length;
                      const correctVal = gameBParityRule === 'even' ? count % 2 : count % 2 === 0 ? 1 : 0;

                      if (val === correctVal) {
                        audioSystem.playCorrect();
                        setGameBSelected(val);
                        setGameBFeedback({ success: true, text: `Correct! ${count} + ${val} = ${count + val} ones, satisfying ${gameBParityRule.toUpperCase()} parity!` });
                        onAwardXP(25);
                      } else {
                        audioSystem.playIncorrect();
                        setGameBFeedback({ success: false, text: `Try again! ${count} + ${val} = ${count + val} ones, which does NOT meet ${gameBParityRule.toUpperCase()} parity.` });
                      }
                    }}
                    style={{
                      backgroundColor: val === 1 ? '#FFDA70' : '#84DCFF',
                      fontSize: '1.1rem',
                      padding: '12px 28px',
                      fontWeight: 900,
                    }}
                  >
                    Parity Bit = {val}
                  </button>
                ))}
              </div>

              {gameBFeedback && (
                <div
                  style={{
                    backgroundColor: gameBFeedback.success ? '#E8FAF1' : '#FFF0F2',
                    border: `2px solid ${gameBFeedback.success ? '#2EC4B6' : '#FF4D6D'}`,
                    borderRadius: 12,
                    padding: 14,
                    maxWidth: 500,
                    margin: '16px auto',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#25264F' }}>
                    {gameBFeedback.text}
                  </div>
                  {gameBFeedback.success && (
                    <button
                      type="button"
                      className="btn-cartoon btn-primary"
                      onClick={() => initGameB()}
                      style={{ marginTop: 10 }}
                    >
                      Next Parity Challenge ➔
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ---------------- GAME C: BUILD THE CODEWORD ---------------- */}
          {activeGame === 'gameC' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '1.05rem', color: '#25264F', marginBottom: 14 }}>
                Data Bits to encode: D1={gameCData[0]}, D2={gameCData[1]}, D3={gameCData[2]}, D4={gameCData[3]}
              </p>

              {/* 7 positions display */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                <BitSlot pos={1} role="P1" value={gameCUserP1 !== null ? gameCUserP1 : '?'} isParity isHighlighted={gameCStage === 'p1'} size="md" />
                <BitSlot pos={2} role="P2" value={gameCUserP2 !== null ? gameCUserP2 : '?'} isParity isHighlighted={gameCStage === 'p2'} size="md" />
                <BitSlot pos={3} role="D1" value={Number(gameCData[0])} size="md" />
                <BitSlot pos={4} role="P4" value={gameCUserP4 !== null ? gameCUserP4 : '?'} isParity isHighlighted={gameCStage === 'p4'} size="md" />
                <BitSlot pos={5} role="D2" value={Number(gameCData[1])} size="md" />
                <BitSlot pos={6} role="D3" value={Number(gameCData[2])} size="md" />
                <BitSlot pos={7} role="D4" value={Number(gameCData[3])} size="md" />
              </div>

              {/* Step Prompt */}
              {gameCStage === 'p1' && (
                <div style={{ backgroundColor: '#FFE8E9', border: '2px solid #FF777F', borderRadius: 12, padding: 14, maxWidth: 500, margin: '0 auto' }}>
                  <h4 style={{ fontWeight: 900, color: '#25264F', marginBottom: 4 }}>
                    Step 1: Calculate P1 (covers positions 1, 3, 5, 7)
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#56587A', marginBottom: 10 }}>
                    Checked bits: D1({gameCData[0]}), D2({gameCData[1]}), D4({gameCData[3]}). What should P1 be for Even Parity?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    {[0, 1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className="btn-cartoon btn-coral"
                        onClick={() => {
                          const expectedP1 = (Number(gameCData[0]) ^ Number(gameCData[1]) ^ Number(gameCData[3]));
                          if (val === expectedP1) {
                            audioSystem.playCorrect();
                            setGameCUserP1(val);
                            setGameCStage('p2');
                          } else {
                            audioSystem.playIncorrect();
                            alert("Not quite! Count the 1s in D1, D2, and D4.");
                          }
                        }}
                      >
                        P1 = {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gameCStage === 'p2' && (
                <div style={{ backgroundColor: '#E7F8FF', border: '2px solid #84DCFF', borderRadius: 12, padding: 14, maxWidth: 500, margin: '0 auto' }}>
                  <h4 style={{ fontWeight: 900, color: '#25264F', marginBottom: 4 }}>
                    Step 2: Calculate P2 (covers positions 2, 3, 6, 7)
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#56587A', marginBottom: 10 }}>
                    Checked bits: D1({gameCData[0]}), D3({gameCData[2]}), D4({gameCData[3]}). What should P2 be for Even Parity?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    {[0, 1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className="btn-cartoon btn-sky"
                        onClick={() => {
                          const expectedP2 = (Number(gameCData[0]) ^ Number(gameCData[2]) ^ Number(gameCData[3]));
                          if (val === expectedP2) {
                            audioSystem.playCorrect();
                            setGameCUserP2(val);
                            setGameCStage('p4');
                          } else {
                            audioSystem.playIncorrect();
                            alert("Count the 1s in D1, D3, and D4.");
                          }
                        }}
                      >
                        P2 = {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gameCStage === 'p4' && (
                <div style={{ backgroundColor: '#FFF8DF', border: '2px solid #FFDA70', borderRadius: 12, padding: 14, maxWidth: 500, margin: '0 auto' }}>
                  <h4 style={{ fontWeight: 900, color: '#25264F', marginBottom: 4 }}>
                    Step 3: Calculate P4 (covers positions 4, 5, 6, 7)
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: '#56587A', marginBottom: 10 }}>
                    Checked bits: D2({gameCData[1]}), D3({gameCData[2]}), D4({gameCData[3]}). What should P4 be for Even Parity?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    {[0, 1].map((val) => (
                      <button
                        key={val}
                        type="button"
                        className="btn-cartoon btn-yellow"
                        onClick={() => {
                          const expectedP4 = (Number(gameCData[1]) ^ Number(gameCData[2]) ^ Number(gameCData[3]));
                          if (val === expectedP4) {
                            audioSystem.playCorrect();
                            setGameCUserP4(val);
                            setGameCStage('complete');
                            onAwardXP(35);
                          } else {
                            audioSystem.playIncorrect();
                          }
                        }}
                      >
                        P4 = {val}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gameCStage === 'complete' && (
                <div style={{ backgroundColor: '#E8FAF1', border: '2px solid #2EC4B6', borderRadius: 12, padding: 14, maxWidth: 500, margin: '0 auto' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎉</span>
                  <div style={{ fontWeight: 900, color: '#25264F', margin: '4px 0' }}>
                    Brilliant! You assembled the complete 7-bit codeword!
                  </div>
                  <button
                    type="button"
                    className="btn-cartoon btn-primary"
                    onClick={() => initGameC()}
                    style={{ marginTop: 10 }}
                  >
                    Build Another Codeword ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---------------- GAME D: STOP GLITCH ---------------- */}
          {activeGame === 'gameD' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '1.05rem', color: '#25264F', marginBottom: 14 }}>
                Glitch sparked a single bit on this codeword! Find the damaged bit and click it to flip it back:
              </p>

              <CodewordRow
                codeword={gameDCorrupted}
                corruptedPosition={gameDFixed ? null : gameDErrorPos}
                interactive
                onBitClick={(pos) => {
                  if (pos === gameDErrorPos) {
                    audioSystem.playCorrect();
                    setGameDCorrupted(gameDOriginal);
                    setGameDFixed(true);
                    onAwardXP(30);
                  } else {
                    audioSystem.playIncorrect();
                    alert(`Bit ${pos} is healthy! Glitch is hiding at another position.`);
                  }
                }}
                size="lg"
              />

              {gameDFixed && (
                <div style={{ backgroundColor: '#E8FAF1', border: '2px solid #2EC4B6', borderRadius: 12, padding: 14, maxWidth: 500, margin: '16px auto' }}>
                  <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                  <div style={{ fontWeight: 900, color: '#25264F', margin: '4px 0' }}>
                    Glitch stopped! Message restored to {gameDOriginal}!
                  </div>
                  <button
                    type="button"
                    className="btn-cartoon btn-primary"
                    onClick={() => initGameD()}
                    style={{ marginTop: 10 }}
                  >
                    Next Round ➔
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ---------------- GAME E: SYNDROME DETECTIVE ---------------- */}
          {activeGame === 'gameE' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <p style={{ fontSize: '1.05rem', color: '#25264F', marginBottom: 14 }}>
                The 3 Parity Detectives are inspecting received word [{gameEWord}]:
              </p>

              <CodewordRow codeword={gameEWord} size="md" />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, maxWidth: 620, margin: '16px auto' }}>
                <div style={{ backgroundColor: '#FFE8E9', border: '1.5px solid #FF777F', borderRadius: 10, padding: 10 }}>
                  <div style={{ fontWeight: 900 }}>S1 Check {1, 3, 5, 7}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FF777F' }}>
                    {syndrome(gameEWord, 'even').s1}
                  </div>
                </div>
                <div style={{ backgroundColor: '#E7F8FF', border: '1.5px solid #84DCFF', borderRadius: 10, padding: 10 }}>
                  <div style={{ fontWeight: 900 }}>S2 Check {2, 3, 6, 7}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#34449A' }}>
                    {syndrome(gameEWord, 'even').s2}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFF8DF', border: '1.5px solid #FFDA70', borderRadius: 10, padding: 10 }}>
                  <div style={{ fontWeight: 900 }}>S4 Check {4, 5, 6, 7}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#D4A017' }}>
                    {syndrome(gameEWord, 'even').s4}
                  </div>
                </div>
              </div>

              <div style={{ margin: '14px 0' }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#25264F', marginBottom: 8 }}>
                  Read in order S4 S2 S1 = [{syndrome(gameEWord, 'even').syndromeStr}]. Which decimal position is corrupted?
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className="btn-cartoon"
                      onClick={() => {
                        const actualDec = syndrome(gameEWord, 'even').decimal;
                        if (p === actualDec) {
                          audioSystem.playCorrect();
                          setGameESolved(true);
                          onAwardXP(35);
                        } else {
                          audioSystem.playIncorrect();
                          alert(`Binary ${syndrome(gameEWord, 'even').syndromeStr} does not equal ${p}. Try converting again!`);
                        }
                      }}
                      style={{
                        backgroundColor: gameESolved && p === syndrome(gameEWord, 'even').decimal ? '#A8EBCB' : '#FFF',
                        minWidth: 44,
                        fontSize: '1rem',
                        fontWeight: 900,
                      }}
                    >
                      Pos {p}
                    </button>
                  ))}
                </div>
              </div>

              {gameESolved && (
                <div style={{ backgroundColor: '#E8FAF1', border: '2px solid #2EC4B6', borderRadius: 12, padding: 14, maxWidth: 500, margin: '16px auto' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔍</span>
                  <div style={{ fontWeight: 900, color: '#25264F', margin: '4px 0' }}>
                    Case Solved! Position {syndrome(gameEWord, 'even').decimal} was identified!
                  </div>
                  <button
                    type="button"
                    className="btn-cartoon btn-primary"
                    onClick={() => initGameE()}
                    style={{ marginTop: 10 }}
                  >
                    Solve Another Case ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* 4. QUIZ ARENA */}
      {/* ============================================================= */}
      {activeGame === 'quiz_arena' && arenaQuestions.length > 0 && (
        <div>
          <button
            type="button"
            className="btn-cartoon"
            onClick={() => setActiveGame('menu')}
            style={{ backgroundColor: '#FFF', marginBottom: 14 }}
          >
            ◀ Back to All Games
          </button>
          <Quiz
            questions={arenaQuestions}
            title="Quiz Arena (5 Casual Practice Questions)"
            onXPBonus={onAwardXP}
            onComplete={(score) => {
              if (score >= 4) {
                setShowConfetti(true);
                audioSystem.playBadgeUnlocked();
                onAwardStars(2);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
