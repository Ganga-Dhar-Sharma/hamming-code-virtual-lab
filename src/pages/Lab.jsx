import React, { useState, useEffect } from 'react';
import BitSlot from '../components/BitSlot.jsx';
import CodewordRow from '../components/CodewordRow.jsx';
import SpeechBubble from '../components/SpeechBubble.jsx';
import ProfessorParity from '../components/Characters/ProfessorParity.jsx';
import { encode, syndrome, correct, flipBitAt, POSITION_INFO, PARITY_GROUPS } from '../lib/hamming.js';
import { audioSystem } from '../lib/audio.js';

/**
 * THE VIRTUAL LAB 2.0 — Guided Experiment & Expert Playground
 * Preserves all 4 sections:
 * 1. Encoder
 * 2. Transmission
 * 3. Detector
 * 4. Full Workflow
 *
 * Adds:
 * - Guided Mode walkthrough with 4-box pedagogical card:
 *   1. What is happening?
 *   2. Why is it happening?
 *   3. What should I do?
 *   4. What result should I expect?
 * - Separate Expert Mode for free experimentation
 */
export default function Lab({ onTermClick, onAwardXP }) {
  const [labMode, setLabMode] = useState('guided'); // 'guided' | 'expert'
  const [guidedStep, setGuidedStep] = useState(1); // 1 to 5
  const [labSubtab, setLabSubtab] = useState('encoder'); // 'encoder' | 'transmission' | 'detector' | 'workflow'

  // Data & State
  const [dataBits, setDataBits] = useState(['1', '0', '1', '1']);
  const [parityMode, setParityMode] = useState('even'); // 'even' | 'odd'
  const [activeGroup, setActiveGroup] = useState(null); // 'P1' | 'P2' | 'P4' | null
  const [transmittedWord, setTransmittedWord] = useState('0110011');
  const [receivedWord, setReceivedWord] = useState('0110001'); // pos 6 flipped
  const [corruptedPos, setCorruptedPos] = useState(6);
  const [isTransmitting, setIsTransmitting] = useState(false);

  // Live pure calculations
  const dataString = dataBits.join('');
  const encodedResult = encode(dataString, parityMode);
  const syndromeResult = syndrome(receivedWord, parityMode);
  const correctionResult = correct(receivedWord, parityMode);

  // Guided Step metadata (The 4 questions)
  const guidedStepsInfo = [
    {
      step: 1,
      title: 'Step 1: Enter 4 Data Bits',
      subtab: 'encoder',
      whatIsHappening: 'We are preparing the 4 data bits (D1, D2, D3, D4) that we want to transmit.',
      whyIsItHappening: 'Before sending a message, digital systems package information into binary data blocks.',
      whatShouldIDo: 'Click any of the 4 green data bits below to change them between 0 and 1, or keep 1-0-1-1.',
      whatResultToExpect: 'The data string updates live and is ready to receive parity shields.',
      teacherVoice:
        "Welcome to the Guided Experiment! In Step 1, we choose our 4 data bits. You can toggle them with a click. Notice how they sit in positions 3, 5, 6, and 7!",
    },
    {
      step: 2,
      title: 'Step 2: Generate 3 Parity Shields',
      subtab: 'encoder',
      whatIsHappening: 'Hamming Code calculates P1, P2, and P4 and places them at positions 1, 2, and 4.',
      whyIsItHappening: 'Placing parity bits at powers of two creates overlapping groups that can pinpoint any error position in binary!',
      whatShouldIDo: "Click 'P1 Group', 'P2 Group', or 'P4 Group' to see which bits each shield covers.",
      whatResultToExpect: 'For data 1011, P1=0, P2=1, P4=0. The assembled 7-bit codeword is 0110011.',
      teacherVoice:
        "In Step 2, our encoder places parity bits at positions 1, 2, and 4. Click the group buttons to see the colorful shields illuminate!",
    },
    {
      step: 3,
      title: 'Step 3: Transmit & Inject Noise',
      subtab: 'transmission',
      whatIsHappening: 'The codeword is sent through a simulated cable. A bit is flipped to simulate noise.',
      whyIsItHappening: 'In the real world, wires experience electromagnetic interference, thermal noise, and voltage dips.',
      whatShouldIDo: "Click 'Pulse Transmission' or click on Bit 6 to corrupt it (or leave it clean!).",
      whatResultToExpect: 'Bit 6 turns red, and the received word becomes 0110001.',
      teacherVoice:
        "In Step 3, our packet travels across the wire! Click Bit 6 to simulate a Glitch attack. Watch the bit turn red!",
    },
    {
      step: 4,
      title: 'Step 4: Run the Parity Detectives',
      subtab: 'detector',
      whatIsHappening: 'Detectives S1, S2, and S4 inspect their assigned groups on the received word.',
      whyIsItHappening: 'Checking each group reveals which parity rules were violated by the flipped bit.',
      whatShouldIDo: 'Inspect S1, S2, and S4. See if each check evaluated to 0 (Clean) or 1 (Violation).',
      whatResultToExpect: 'S1=0, S2=1, S4=1. Assembling S4 S2 S1 gives binary 110, which equals decimal 6!',
      teacherVoice:
        "In Step 4, our detectives inspect the groups. S2 and S4 find violations! Reading S4 S2 S1 gives binary 1-1-0, which is decimal 6!",
    },
    {
      step: 5,
      title: 'Step 5: Error Correction & Data Recovery',
      subtab: 'detector',
      whatIsHappening: 'We flip the bit at the position identified by the syndrome and recover the original data.',
      whyIsItHappening: 'Since only 1 bit flipped, inverting position 6 restores the exact original message without resending!',
      whatShouldIDo: "Click 'Auto-Flip Bit 6 Back' and look at the recovered data bits [D1, D2, D3, D4].",
      whatResultToExpect: 'The codeword is restored to 0110011, and the recovered data matches [1, 0, 1, 1]!',
      teacherVoice:
        "In Step 5, we flip Bit 6 back to 1! Look at data positions 3, 5, 6, 7—they match our original 1011 data perfectly! Experiment complete!",
    },
  ];

  const currentGuided = guidedStepsInfo[guidedStep - 1];

  const handleToggleDataBit = (idx) => {
    audioSystem.playBitFlip();
    const next = [...dataBits];
    next[idx] = next[idx] === '1' ? '0' : '1';
    setDataBits(next);

    const nextEncoded = encode(next.join(''), parityMode);
    setTransmittedWord(nextEncoded.codeword);
    if (corruptedPos) {
      setReceivedWord(flipBitAt(nextEncoded.codeword, corruptedPos));
    } else {
      setReceivedWord(nextEncoded.codeword);
    }
  };

  const handleFlipBit = (pos1Based) => {
    audioSystem.playBitFlip();
    if (corruptedPos === pos1Based) {
      setCorruptedPos(null);
      setReceivedWord(transmittedWord);
    } else {
      setCorruptedPos(pos1Based);
      setReceivedWord(flipBitAt(transmittedWord, pos1Based));
    }
  };

  const handleNextGuidedStep = () => {
    audioSystem.playClick();
    if (guidedStep < 5) {
      const nextS = guidedStep + 1;
      setGuidedStep(nextS);
      setLabSubtab(guidedStepsInfo[nextS - 1].subtab);
    }
  };

  const handlePrevGuidedStep = () => {
    audioSystem.playClick();
    if (guidedStep > 1) {
      const prevS = guidedStep - 1;
      setGuidedStep(prevS);
      setLabSubtab(guidedStepsInfo[prevS - 1].subtab);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Mode Switcher */}
      <div
        className="card-cartoon"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          padding: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ProfessorParity state="neutral" size={54} />
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#25264F' }}>
              🧪 The Virtual Laboratory 2.0
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#56587A' }}>
              {labMode === 'guided'
                ? 'Guided Experiment Mode: Professor Parity guides you through every step with explanations!'
                : 'Expert Mode: Free playground to test any 4-bit data, parity mode, and noise condition.'}
            </p>
          </div>
        </div>

        {/* Guided vs Expert Toggle */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: '#FFF8EB',
            borderRadius: 12,
            border: '2px solid #25264F',
            padding: 3,
          }}
        >
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick();
              setLabMode('guided');
              setGuidedStep(1);
              setLabSubtab('encoder');
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: '0.85rem',
              backgroundColor: labMode === 'guided' ? '#A8EBCB' : 'transparent',
              color: '#25264F',
              border: labMode === 'guided' ? '1.5px solid #25264F' : 'none',
              cursor: 'pointer',
            }}
          >
            💡 Guided Experiment
          </button>
          <button
            type="button"
            onClick={() => {
              audioSystem.playClick();
              setLabMode('expert');
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: '0.85rem',
              backgroundColor: labMode === 'expert' ? '#FFDA70' : 'transparent',
              color: '#25264F',
              border: labMode === 'expert' ? '1.5px solid #25264F' : 'none',
              cursor: 'pointer',
            }}
          >
            ⚡ Expert Playground
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* GUIDED EXPERIMENT WALKTHROUGH BAR & 4-BOX PEDAGOGICAL CARD */}
      {/* ======================================================== */}
      {labMode === 'guided' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Step Progress Tracker */}
          <div
            className="card-cartoon"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
              padding: '12px 18px',
            }}
          >
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {guidedStepsInfo.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    setGuidedStep(s.step);
                    setLabSubtab(s.subtab);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    backgroundColor: guidedStep === s.step ? '#25264F' : '#FFF',
                    color: guidedStep === s.step ? '#FFF' : '#25264F',
                    border: '1.5px solid #25264F',
                    cursor: 'pointer',
                  }}
                >
                  Step {s.step}: {s.title.split(':')[1]}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn-cartoon"
                onClick={handlePrevGuidedStep}
                disabled={guidedStep === 1}
                style={{ backgroundColor: '#FFF', fontSize: '0.82rem', padding: '6px 12px' }}
              >
                ◀ Back
              </button>
              <button
                type="button"
                className="btn-cartoon btn-primary"
                onClick={handleNextGuidedStep}
                disabled={guidedStep === 5}
                style={{ fontSize: '0.82rem', padding: '6px 16px' }}
              >
                Next Step ➔
              </button>
            </div>
          </div>

          <SpeechBubble
            character="professor"
            text={currentGuided.teacherVoice}
            expression="celebrating"
            roleBadge="Main Teacher"
          />

          {/* 4-Box Pedagogical Card (What, Why, Action, Expected Result) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', border: '2px solid #25264F', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#34449A', fontSize: '0.92rem' }}>🔍 What is happening?</strong>
              <p style={{ fontSize: '0.88rem', color: '#25264F', marginTop: 4 }}>
                {currentGuided.whatIsHappening}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', border: '2px solid #25264F', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#8338EC', fontSize: '0.92rem' }}>💡 Why is it happening?</strong>
              <p style={{ fontSize: '0.88rem', color: '#25264F', marginTop: 4 }}>
                {currentGuided.whyIsItHappening}
              </p>
            </div>

            <div style={{ backgroundColor: '#FFF8DF', border: '2px solid #FFDA70', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#25264F', fontSize: '0.92rem' }}>👉 What should I do?</strong>
              <p style={{ fontSize: '0.88rem', color: '#25264F', marginTop: 4 }}>
                {currentGuided.whatShouldIDo}
              </p>
            </div>

            <div style={{ backgroundColor: '#E8FAF1', border: '2px solid #2EC4B6', borderRadius: 12, padding: 14 }}>
              <strong style={{ color: '#2EC4B6', fontSize: '0.92rem' }}>🎯 What result to expect?</strong>
              <p style={{ fontSize: '0.88rem', color: '#25264F', marginTop: 4 }}>
                {currentGuided.whatResultToExpect}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* EXPERT MODE SUBTAB SWITCHER */}
      {/* ======================================================== */}
      {labMode === 'expert' && (
        <div
          className="card-cartoon"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            padding: 12,
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'encoder', label: '1. Encoder', icon: '🛡️' },
            { id: 'transmission', label: '2. Transmission', icon: '⚡' },
            { id: 'detector', label: '3. Detector', icon: '🔍' },
            { id: 'workflow', label: '4. Full Workflow', icon: '🔄' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                audioSystem.playClick();
                setLabSubtab(tab.id);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: '0.9rem',
                fontWeight: 800,
                backgroundColor: labSubtab === tab.id ? '#25264F' : '#FFF',
                color: labSubtab === tab.id ? '#FFF' : '#25264F',
                border: '2px solid #25264F',
                cursor: 'pointer',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. ENCODER VIEW */}
      {/* ======================================================== */}
      {labSubtab === 'encoder' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-cartoon" style={{ padding: 22 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
              1. Four Data Bits Input (Positions 3, 5, 6, 7)
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#56587A', marginBottom: 16 }}>
              Click any of the green data bits below to toggle between 0 and 1:
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '12px 0' }}>
              {dataBits.map((b, i) => (
                <BitSlot
                  key={i}
                  role={`D${i + 1}`}
                  value={Number(b)}
                  size="lg"
                  interactive
                  onClick={() => handleToggleDataBit(i)}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
              {['1011', '0101', '1100', '1111', '0000'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    audioSystem.playBitFlip();
                    setDataBits(p.split(''));
                    const nextEnc = encode(p, parityMode);
                    setTransmittedWord(nextEnc.codeword);
                    setReceivedWord(nextEnc.codeword);
                    setCorruptedPos(null);
                  }}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1.5px solid #25264F',
                    backgroundColor: dataString === p ? '#ECE7FF' : '#FFF',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                  }}
                >
                  {p} {p === '1011' && '★'}
                </button>
              ))}
            </div>
          </div>

          <div className="card-cartoon" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F' }}>
                2. Seven-Position Codeword Assembly
              </h3>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setActiveGroup(activeGroup === 'P1' ? null : 'P1')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    backgroundColor: activeGroup === 'P1' ? '#FF777F' : '#FFE8E9',
                    color: activeGroup === 'P1' ? '#FFF' : '#25264F',
                    border: '1.5px solid #25264F',
                    cursor: 'pointer',
                  }}
                >
                  🛡️ P1 Group {1, 3, 5, 7}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGroup(activeGroup === 'P2' ? null : 'P2')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    backgroundColor: activeGroup === 'P2' ? '#84DCFF' : '#E7F8FF',
                    color: '#25264F',
                    border: '1.5px solid #25264F',
                    cursor: 'pointer',
                  }}
                >
                  🛡️ P2 Group {2, 3, 6, 7}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGroup(activeGroup === 'P4' ? null : 'P4')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    backgroundColor: activeGroup === 'P4' ? '#FFDA70' : '#FFF8DF',
                    color: '#25264F',
                    border: '1.5px solid #25264F',
                    cursor: 'pointer',
                  }}
                >
                  🛡️ P4 Group {4, 5, 6, 7}
                </button>
              </div>
            </div>

            <CodewordRow codeword={encodedResult.codeword} activeGroup={activeGroup} size="lg" />

            <div
              style={{
                marginTop: 18,
                padding: '12px 18px',
                borderRadius: 12,
                backgroundColor: '#FFF8DF',
                border: '2px solid #25264F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 10,
              }}
            >
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#56587A' }}>
                  Resulting 7-Bit Hamming Codeword:
                </span>
                <div className="binary-text" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#25264F' }}>
                  {encodedResult.codeword}
                </div>
              </div>

              {labMode === 'guided' && (
                <button
                  type="button"
                  className="btn-cartoon btn-primary"
                  onClick={handleNextGuidedStep}
                >
                  Go to Step 3: Transmission ➔
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TRANSMISSION VIEW */}
      {/* ======================================================== */}
      {labSubtab === 'transmission' && (
        <div className="card-cartoon" style={{ padding: 22 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
            📡 Transmission Noise & Bit Corruption
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#56587A', marginBottom: 16 }}>
            Simulate noise on the wire! Click any bit below to flip it, or click 'Random Error'.
          </p>

          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2EC4B6' }}>ORIGINAL TRANSMITTED CODEWORD:</span>
            <CodewordRow codeword={transmittedWord} size="md" />
          </div>

          <div
            style={{
              padding: '18px 14px',
              backgroundColor: '#1E1E38',
              borderRadius: 14,
              border: '2.5px solid #25264F',
              textAlign: 'center',
              margin: '14px 0',
              color: '#FFF',
            }}
          >
            <div
              style={{
                height: 6,
                backgroundColor: isTransmitting ? '#84DCFF' : '#34449A',
                boxShadow: isTransmitting ? '0 0 16px #84DCFF' : 'none',
                borderRadius: 4,
                margin: '10px 0',
                transition: 'all 0.3s ease',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 800 }}>
              <span>🚀 Transmitter</span>
              <span style={{ color: corruptedPos ? '#FF4D6D' : '#A8EBCB' }}>
                {isTransmitting
                  ? '⚡ Transmitting through cable...'
                  : corruptedPos
                  ? `⚠️ Bit at Position ${corruptedPos} is corrupted!`
                  : '✅ Clean transmission'}
              </span>
              <span>📡 Receiver</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', margin: '14px 0' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#25264F' }}>
              RECEIVED CODEWORD (Click any bit to manually flip):
            </span>
            <CodewordRow
              codeword={receivedWord}
              corruptedPosition={corruptedPos}
              interactive
              onBitClick={handleFlipBit}
              size="lg"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-cartoon btn-coral"
              onClick={() => {
                audioSystem.playBitFlip();
                const rndPos = Math.floor(Math.random() * 7) + 1;
                setCorruptedPos(rndPos);
                setReceivedWord(flipBitAt(transmittedWord, rndPos));
              }}
            >
              ⚡ Random Single Error
            </button>
            <button
              type="button"
              className="btn-cartoon btn-mint"
              onClick={() => {
                audioSystem.playClick();
                setCorruptedPos(null);
                setReceivedWord(transmittedWord);
              }}
            >
              ✨ Clear Error (Clean Word)
            </button>
            {labMode === 'guided' && (
              <button
                type="button"
                className="btn-cartoon btn-primary"
                onClick={handleNextGuidedStep}
              >
                Go to Step 4: Detectives ➔
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. DETECTOR VIEW */}
      {/* ======================================================== */}
      {labSubtab === 'detector' && (
        <div className="card-cartoon" style={{ padding: 22 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
            🔍 Parity Detectives & Syndrome Resolution
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#56587A', marginBottom: 14 }}>
            Detectives S1, S2, and S4 inspect their assigned groups. The syndrome is assembled in order S4 S2 S1!
          </p>

          <CodewordRow codeword={receivedWord} corruptedPosition={syndromeResult.decimal || null} size="md" />

          {/* 3 Detectives Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, margin: '16px 0' }}>
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: syndromeResult.s1 === 0 ? '#E8FAF1' : '#FFE8E9', border: `2px solid ${syndromeResult.s1 === 0 ? '#2EC4B6' : '#FF777F'}` }}>
              <div style={{ fontWeight: 900 }}>S1 Check {1, 3, 5, 7}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: syndromeResult.s1 === 0 ? '#2EC4B6' : '#FF777F' }}>
                S1 = {syndromeResult.s1} ({syndromeResult.s1 === 0 ? 'Pass' : 'Violation!'})
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 10, backgroundColor: syndromeResult.s2 === 0 ? '#E8FAF1' : '#E7F8FF', border: `2px solid ${syndromeResult.s2 === 0 ? '#2EC4B6' : '#84DCFF'}` }}>
              <div style={{ fontWeight: 900 }}>S2 Check {2, 3, 6, 7}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: syndromeResult.s2 === 0 ? '#2EC4B6' : '#34449A' }}>
                S2 = {syndromeResult.s2} ({syndromeResult.s2 === 0 ? 'Pass' : 'Violation!'})
              </div>
            </div>

            <div style={{ padding: 12, borderRadius: 10, backgroundColor: syndromeResult.s4 === 0 ? '#E8FAF1' : '#FFF8DF', border: `2px solid ${syndromeResult.s4 === 0 ? '#2EC4B6' : '#FFDA70'}` }}>
              <div style={{ fontWeight: 900 }}>S4 Check {4, 5, 6, 7}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: syndromeResult.s4 === 0 ? '#2EC4B6' : '#D4A017' }}>
                S4 = {syndromeResult.s4} ({syndromeResult.s4 === 0 ? 'Pass' : 'Violation!'})
              </div>
            </div>
          </div>

          {/* Syndrome Verdict */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              backgroundColor: syndromeResult.hasError ? '#FFF0F2' : '#E8FAF1',
              border: `2.5px solid ${syndromeResult.hasError ? '#FF4D6D' : '#2EC4B6'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#56587A' }}>
                Syndrome Verdict (S4 S2 S1):
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                <span className="binary-text" style={{ fontSize: '1.8rem', fontWeight: 900, color: '#25264F' }}>
                  {syndromeResult.syndromeStr}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#56587A' }}>
                  = Decimal {syndromeResult.decimal}
                </span>
              </div>
            </div>

            {syndromeResult.hasError && (
              <button
                type="button"
                className="btn-cartoon btn-coral"
                onClick={() => {
                  audioSystem.playBitFlip();
                  setReceivedWord(correctionResult.correctedCodeword);
                  setCorruptedPos(null);
                }}
              >
                🛠️ Auto-Flip Bit {syndromeResult.decimal} Back!
              </button>
            )}
          </div>

          {/* Recovered Data Bits */}
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 10,
              backgroundColor: '#FFF',
              border: '2px solid #25264F',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#56587A' }}>
                Recovered Data Bits (Positions 3, 5, 6, 7):
              </span>
              <div className="binary-text" style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F' }}>
                [{correctionResult.dataBits}]
              </div>
            </div>

            <span
              style={{
                backgroundColor: correctionResult.dataBits === dataString ? '#A8EBCB' : '#FFE5E9',
                padding: '4px 10px',
                borderRadius: 6,
                fontWeight: 900,
                fontSize: '0.82rem',
                border: '1.5px solid #25264F',
              }}
            >
              {correctionResult.dataBits === dataString ? 'MATCHES ORIGINAL ✅' : 'MISMATCH ❌'}
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FULL WORKFLOW VIEW */}
      {/* ======================================================== */}
      {labSubtab === 'workflow' && (
        <div className="card-cartoon" style={{ padding: 22 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
            🔄 End-to-End Hamming Pipeline Simulator
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#56587A', marginBottom: 16 }}>
            All 4 stages connected on one screen! Input data, send through noise, calculate syndrome, and restore original data.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            {/* Stage 1 */}
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: '#FFF', border: '1.5px solid #25264F' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#34449A' }}>STAGE 1: ENCODER</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {dataBits.map((b, i) => (
                  <BitSlot key={i} role={`D${i + 1}`} value={Number(b)} size="sm" interactive onClick={() => handleToggleDataBit(i)} />
                ))}
                <span style={{ fontSize: '1.3rem', fontWeight: 900 }}>➔</span>
                <CodewordRow codeword={encodedResult.codeword} size="sm" />
              </div>
            </div>

            {/* Stage 2 */}
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: '#FFF', border: '1.5px solid #25264F' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#34449A' }}>STAGE 2: CHANNEL</span>
              <CodewordRow codeword={receivedWord} corruptedPosition={corruptedPos} interactive onBitClick={handleFlipBit} size="sm" />
            </div>

            {/* Stage 3 */}
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: '#FFF', border: '1.5px solid #25264F' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#34449A' }}>STAGE 3: SYNDROME</span>
              <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.1rem', color: '#25264F', marginTop: 4 }}>
                S4 S2 S1 = {syndromeResult.syndromeStr} (Decimal {syndromeResult.decimal})
              </div>
            </div>

            {/* Stage 4 */}
            <div style={{ padding: 12, borderRadius: 10, backgroundColor: '#E8FAF1', border: '1.5px solid #2EC4B6' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#2EC4B6' }}>STAGE 4: RECOVERED DATA</span>
              <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '1.2rem', color: '#25264F', marginTop: 4 }}>
                Recovered: [{correctionResult.dataBits}]
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
