import React, { useState, useEffect } from 'react';
import SignalCityScene from '../components/Scenes/SignalCityScene.jsx';
import SpeechBubble from '../components/SpeechBubble.jsx';
import BitSlot from '../components/BitSlot.jsx';
import CodewordRow from '../components/CodewordRow.jsx';
import Confetti from '../components/Confetti.jsx';
import { BEGINNER_LESSONS } from '../data/lessons.js';
import { audioSystem } from '../lib/audio.js';

/**
 * BIT BUSTERS 2.0 — 7 Beginner-First Learning Lessons
 * Follows the 7-step personal teacher sequence:
 * 1. Explain in simple English
 * 2. Visual example
 * 3. Step-by-step demonstration
 * 4. Simple check question
 * 5. Instant feedback
 * 6. Hands-on interactive activity
 * 7. Summary / recap
 */
export default function Missions({
  progress,
  onCompleteMission,
  onAwardXP,
  onAwardBadge,
  onTermClick,
}) {
  const [selectedLessonId, setSelectedLessonId] = useState(1);
  const [lessonStep, setLessonStep] = useState(1); // 1 to 7
  const [showConfetti, setShowConfetti] = useState(false);

  // Lesson 1 Activity State
  const [l1Bits, setL1Bits] = useState(['1', '0', '1', '1']);

  // Lesson 2 Activity State
  const [l2Guessed, setL2Guessed] = useState(false);

  // Lesson 3 Activity State
  const [l3SelectedParity, setL3SelectedParity] = useState(null);

  // Lesson 4 Activity State
  const [l4ShieldsActive, setL4ShieldsActive] = useState({ 1: false, 2: false, 4: false });

  // Lesson 5 Activity State
  const [l5Placed, setL5Placed] = useState({ p1: null, p2: null, p4: null });

  // Lesson 6 Activity State
  const [l6GuessedDecimal, setL6GuessedDecimal] = useState(null);

  // Lesson 7 Activity State
  const [l7Word, setL7Word] = useState('0110001');
  const [l7Fixed, setL7Fixed] = useState(false);

  // Step 4 Question State
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [showQuestionHint, setShowQuestionHint] = useState(false);

  const lesson = BEGINNER_LESSONS.find((l) => l.id === selectedLessonId) || BEGINNER_LESSONS[0];

  // Reset question state when moving lessons or steps
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setShowQuestionHint(false);
  }, [selectedLessonId, lessonStep]);

  // When step changes, narrate the text
  useEffect(() => {
    let textToSpeak = '';
    if (lessonStep === 1) textToSpeak = lesson.teacherIntro;
    else if (lessonStep === 2) textToSpeak = lesson.step2_visualExample.caption;
    else if (lessonStep === 3) textToSpeak = lesson.step3_demoSteps.join(' ');
    else if (lessonStep === 4) textToSpeak = lesson.step4_simpleQuestion.question;
    else if (lessonStep === 6) textToSpeak = lesson.step6_activity.prompt;
    else if (lessonStep === 7) textToSpeak = lesson.step7_recap;

    // We do not force autoplay to respect browser policies, but audioSystem updates the captions dock
    if (textToSpeak) {
      audioSystem.broadcastCaption(textToSpeak, 'professor');
    }
  }, [selectedLessonId, lessonStep]);

  const handleNextStep = () => {
    audioSystem.playClick();
    if (lessonStep < 7) {
      setLessonStep((s) => s + 1);
    } else {
      // Completed lesson!
      setShowConfetti(true);
      audioSystem.playMissionCompleted();
      onAwardXP(lesson.xpReward);
      onCompleteMission(lesson.id);

      if (lesson.id === 3) onAwardBadge('parity_apprentice');
      if (lesson.id === 5) onAwardBadge('shield_builder');
      if (lesson.id === 6) onAwardBadge('error_detective');
      if (lesson.id === 7) onAwardBadge('master_of_hamming');

      if (selectedLessonId < BEGINNER_LESSONS.length) {
        setSelectedLessonId((id) => id + 1);
        setLessonStep(1);
      }
    }
  };

  const handlePrevStep = () => {
    audioSystem.playClick();
    if (lessonStep > 1) {
      setLessonStep((s) => s - 1);
    }
  };

  const handleAnswerQuestion = (idx) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(idx);
    setIsAnswerChecked(true);

    const isCorrect = idx === lesson.step4_simpleQuestion.answer;
    if (isCorrect) {
      audioSystem.playCorrect();
      onAwardXP(20);
    } else {
      audioSystem.playIncorrect();
    }
  };

  const stepLabels = [
    '1. Concept',
    '2. Visual Example',
    '3. Step-by-Step',
    '4. Simple Question',
    '5. Feedback',
    '6. Try Activity',
    '7. Lesson Recap',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Signal City Skyline (Levels 1 to 7 mapped to city progression) */}
      <SignalCityScene
        progressionLevel={Math.min(4, Math.floor(((selectedLessonId - 1) / 6) * 4))}
        height={190}
      />

      {/* 7-Lesson Selector Navigation Bar */}
      <div
        className="card-cartoon"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#34449A' }}>
            LEARNING JOURNEY:
          </span>
          <span style={{ fontSize: '0.82rem', color: '#56587A', fontWeight: 700 }}>
            (Lesson {selectedLessonId} of 7)
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {BEGINNER_LESSONS.map((l) => {
            const isSelected = selectedLessonId === l.id;
            const isDone = progress.completedMissions.includes(l.id);

            return (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  audioSystem.playClick();
                  setSelectedLessonId(l.id);
                  setLessonStep(1);
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: 10,
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  border: isSelected ? '2.5px solid #25264F' : '1.5px solid #25264F',
                  backgroundColor: isSelected
                    ? '#FFDA70'
                    : isDone
                    ? '#A8EBCB'
                    : '#FFFFFF',
                  color: '#25264F',
                  boxShadow: isSelected ? '0 3px 0 #25264F' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isDone ? '✅ ' : '📘 '}
                L{l.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Card */}
      <div className="card-cartoon" style={{ padding: 24 }}>
        {/* Lesson Title Header & 7-Step Progress Tracker */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            borderBottom: '2px dashed #25264F',
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 900,
                backgroundColor: '#ECE7FF',
                padding: '3px 8px',
                borderRadius: 6,
                border: '1px solid #25264F',
                color: '#34449A',
              }}
            >
              {lesson.tagline}
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#25264F', marginTop: 4 }}>
              {lesson.title}
            </h2>
          </div>

          {/* Step Pills */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setLessonStep(s)}
                style={{
                  padding: '5px 9px',
                  borderRadius: 8,
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  backgroundColor: lessonStep === s ? '#25264F' : '#FFF',
                  color: lessonStep === s ? '#FFF' : '#25264F',
                  border: '1.5px solid #25264F',
                  cursor: 'pointer',
                }}
              >
                Step {s}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: EXPLAIN THE CONCEPT IN SIMPLE ENGLISH */}
        {/* ======================================================== */}
        {lessonStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpeechBubble
              character="professor"
              text={lesson.teacherIntro}
              expression="celebrating"
              roleBadge="Main Teacher"
            />

            <div
              style={{
                backgroundColor: '#FFF8DF',
                border: '2px solid #FFDA70',
                borderRadius: 14,
                padding: '16px 20px',
                marginTop: 8,
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
                💡 Key Idea in Plain English:
              </h4>
              <p style={{ fontSize: '1.02rem', color: '#25264F', lineHeight: 1.5 }}>
                {lesson.step1_explain}
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: VISUAL EXAMPLE */}
        {/* ======================================================== */}
        {lessonStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpeechBubble
              character="byte"
              text={lesson.step2_visualExample.caption}
              expression="happy"
              roleBadge="Assistant"
            />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #25264F',
                borderRadius: 16,
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 0 #25264F',
              }}
            >
              <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#34449A', marginBottom: 14 }}>
                Visual Diagram:
              </h4>

              {/* Lesson 1 visual: 4 data bits */}
              {lesson.id === 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '14px 0' }}>
                  {lesson.step2_visualExample.data.map((b, i) => (
                    <BitSlot key={i} role={`Bit ${i + 1}`} value={Number(b)} size="lg" />
                  ))}
                </div>
              )}

              {/* Lesson 2 visual: comparison of sent vs received */}
              {lesson.id === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2EC4B6' }}>SENT BY SENDER:</span>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      {lesson.step2_visualExample.sent.map((b, i) => (
                        <BitSlot key={i} role={`B${i + 1}`} value={Number(b)} size="md" />
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: '1.4rem' }}>⚡ Glitch Attacks Wire ⚡</span>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FF4D6D' }}>RECEIVED (Damaged!):</span>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      {lesson.step2_visualExample.received.map((b, i) => (
                        <BitSlot
                          key={i}
                          role={`B${i + 1}`}
                          value={Number(b)}
                          isCorrupted={i === lesson.step2_visualExample.corruptedIndex}
                          size="md"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 3 visual: parity worked example */}
              {lesson.id === 3 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                    {lesson.step2_visualExample.data.map((b, i) => (
                      <BitSlot key={i} role={`D${i + 1}`} value={Number(b)} size="md" />
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#E8FAF1',
                      border: '2px solid #2EC4B6',
                      borderRadius: 12,
                      padding: '10px 18px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#25264F',
                    }}
                  >
                    Count = 3 ones (Odd) ➔ Even Parity Bit = 1 ➔ Total = 4 ones (Even!)
                  </div>
                </div>
              )}

              {/* Lesson 4 visual: 7 slots */}
              {lesson.id === 4 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                  {lesson.step2_visualExample.slots.map((s) => (
                    <BitSlot
                      key={s.pos}
                      pos={s.pos}
                      role={s.type}
                      value={s.isParity ? 'P' : 'D'}
                      isParity={s.isParity}
                      size="md"
                    />
                  ))}
                </div>
              )}

              {/* Lesson 5 visual: 0110011 codeword */}
              {lesson.id === 5 && (
                <div>
                  <CodewordRow codeword={lesson.step2_visualExample.finalCodeword} size="lg" />
                </div>
              )}

              {/* Lesson 6 visual: syndrome checks */}
              {lesson.id === 6 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                  <CodewordRow codeword={lesson.step2_visualExample.corruptedWord} corruptedPosition={6} size="md" />
                  <div
                    style={{
                      backgroundColor: '#FFF0F2',
                      border: '2px solid #FF4D6D',
                      borderRadius: 12,
                      padding: '12px 20px',
                      fontSize: '1.2rem',
                      fontWeight: 900,
                      color: '#FF4D6D',
                    }}
                  >
                    Syndrome S4 S2 S1 = 1 1 0 (Binary) = 6 (Decimal Position!)
                  </div>
                </div>
              )}

              {/* Lesson 7 visual: correction */}
              {lesson.id === 7 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FF4D6D' }}>CORRUPTED WORD:</span>
                    <CodewordRow codeword={lesson.step2_visualExample.received} corruptedPosition={6} size="sm" />
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>➔ Flip Bit 6 ➔</span>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2EC4B6' }}>RESTORED CODEWORD:</span>
                    <CodewordRow codeword={lesson.step2_visualExample.corrected} size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: DEMONSTRATE STEP BY STEP */}
        {/* ======================================================== */}
        {lessonStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpeechBubble
              character="professor"
              text="Follow my steps closely. Notice how each step builds on the last one!"
              expression="thinking"
              roleBadge="Main Teacher"
            />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #25264F',
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34449A', marginBottom: 12 }}>
                Step-by-Step Breakdown:
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lesson.step3_demoSteps.map((stepTxt, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: 12,
                      borderRadius: 10,
                      backgroundColor: '#FFF8EB',
                      border: '1.5px solid #25264F',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: '#FFDA70',
                        border: '1.5px solid #25264F',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '1rem', color: '#25264F', fontWeight: 700, lineHeight: 1.4 }}>
                      {stepTxt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: ASK ONE VERY SIMPLE QUESTION */}
        {/* ======================================================== */}
        {lessonStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpeechBubble
              character="professor"
              text="Now let's check your understanding with one very simple question. Don't worry—take your time!"
              expression="happy"
              roleBadge="Main Teacher"
            />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #25264F',
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34449A' }}>
                  QUICK CHECK QUESTION:
                </span>
                <button
                  type="button"
                  onClick={() => setShowQuestionHint(!showQuestionHint)}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: '#56587A',
                    padding: '4px 10px',
                    borderRadius: 8,
                    border: '1.5px solid #25264F',
                    backgroundColor: '#FFF8EB',
                    cursor: 'pointer',
                  }}
                >
                  💡 Hint
                </button>
              </div>

              {showQuestionHint && (
                <div
                  style={{
                    backgroundColor: '#FFF8DF',
                    border: '1.5px solid #FFDA70',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: '0.92rem',
                    color: '#25264F',
                    marginBottom: 14,
                  }}
                >
                  <strong>Professor's Hint:</strong> {lesson.step4_simpleQuestion.hint}
                </div>
              )}

              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#25264F', lineHeight: 1.4, marginBottom: 18 }}>
                {lesson.step4_simpleQuestion.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lesson.step4_simpleQuestion.options.map((opt, idx) => {
                  let btnBg = '#FFF8EB';
                  let borderCol = '#25264F';

                  if (isAnswerChecked) {
                    if (idx === lesson.step4_simpleQuestion.answer) {
                      btnBg = '#A8EBCB';
                      borderCol = '#2EC4B6';
                    } else if (idx === selectedAnswer) {
                      btnBg = '#FFE5E9';
                      borderCol = '#FF4D6D';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      className="btn-cartoon"
                      onClick={() => handleAnswerQuestion(idx)}
                      disabled={isAnswerChecked}
                      style={{
                        backgroundColor: btnBg,
                        borderColor: borderCol,
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        padding: '12px 18px',
                        width: '100%',
                        fontSize: '1rem',
                        color: '#25264F',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          backgroundColor: '#FFF',
                          border: '1.5px solid #25264F',
                          fontWeight: 900,
                          fontSize: '0.85rem',
                          marginRight: 10,
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isAnswerChecked && (
                <div style={{ marginTop: 18, textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-cartoon btn-primary"
                    onClick={() => setLessonStep(5)}
                  >
                    See Teacher Feedback ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 5: GIVE FEEDBACK */}
        {/* ======================================================== */}
        {lessonStep === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {selectedAnswer === lesson.step4_simpleQuestion.answer ? (
              <SpeechBubble
                character="professor"
                text={`Spot on! ${lesson.step4_simpleQuestion.explanation}`}
                expression="celebrating"
                roleBadge="Main Teacher"
              />
            ) : (
              <SpeechBubble
                character="professor"
                text={`Not quite right! Don't worry—let's review: ${lesson.step4_simpleQuestion.explanation}`}
                expression="thinking"
                roleBadge="Main Teacher"
              />
            )}

            <div
              style={{
                backgroundColor: selectedAnswer === lesson.step4_simpleQuestion.answer ? '#E8FAF1' : '#FFF0F2',
                border: `2.5px solid ${selectedAnswer === lesson.step4_simpleQuestion.answer ? '#2EC4B6' : '#FF4D6D'}`,
                borderRadius: 16,
                padding: 20,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>
                {selectedAnswer === lesson.step4_simpleQuestion.answer ? '🎉' : '💡'}
              </span>
              <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#25264F', margin: '8px 0' }}>
                {selectedAnswer === lesson.step4_simpleQuestion.answer
                  ? 'Excellent Understanding!'
                  : 'Great Effort! Practice makes perfect!'}
              </h4>
              <p style={{ fontSize: '1rem', color: '#25264F', maxWidth: 600, margin: '0 auto 16px', lineHeight: 1.5 }}>
                {lesson.step4_simpleQuestion.explanation}
              </p>

              <button
                type="button"
                className="btn-cartoon btn-primary"
                onClick={() => setLessonStep(6)}
              >
                Let's Try an Interactive Activity! ➔
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 6: INTERACTIVE ACTIVITY */}
        {/* ======================================================== */}
        {lessonStep === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpeechBubble
              character="byte"
              text={lesson.step6_activity.prompt}
              expression="winking"
              roleBadge="Assistant"
            />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2.5px solid #25264F',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
              }}
            >
              {/* L1 Activity: Click to flip bits */}
              {lesson.id === 1 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '16px 0' }}>
                    {l1Bits.map((b, i) => (
                      <BitSlot
                        key={i}
                        role={`Bit ${i + 1}`}
                        value={Number(b)}
                        size="lg"
                        interactive
                        onClick={() => {
                          audioSystem.playBitFlip();
                          const next = [...l1Bits];
                          next[i] = next[i] === '1' ? '0' : '1';
                          setL1Bits(next);
                        }}
                      />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#56587A' }}>
                    Current 4-bit word: <strong>[{l1Bits.join('')}]</strong>
                  </p>
                </div>
              )}

              {/* L2 Activity: Spot the flipped bit */}
              {lesson.id === 2 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '16px 0' }}>
                    {['1', '1', '1', '1'].map((b, i) => (
                      <BitSlot
                        key={i}
                        role={`Bit ${i + 1}`}
                        value={Number(b)}
                        isCorrupted={i === 1 && l2Guessed}
                        size="lg"
                        interactive
                        onClick={() => {
                          if (i === 1) {
                            audioSystem.playCorrect();
                            setL2Guessed(true);
                            onAwardXP(30);
                          } else {
                            audioSystem.playIncorrect();
                          }
                        }}
                      />
                    ))}
                  </div>
                  {l2Guessed && (
                    <div style={{ color: '#2EC4B6', fontWeight: 900, fontSize: '1.1rem' }}>
                      ✅ You caught the flipped bit! Bit 2 was originally 0, but turned into 1!
                    </div>
                  )}
                </div>
              )}

              {/* L3 Activity: Parity practice */}
              {lesson.id === 3 && (
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#25264F', marginBottom: 12 }}>
                    For data [1, 0, 0, 0] (one 1), what is the EVEN parity bit?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
                    <button
                      type="button"
                      className="btn-cartoon btn-mint"
                      onClick={() => {
                        audioSystem.playCorrect();
                        setL3SelectedParity(1);
                        onAwardXP(30);
                      }}
                      style={{ padding: '12px 24px', fontSize: '1.1rem' }}
                    >
                      Parity Bit = 1 (Makes 2 ones, which is even!)
                    </button>
                    <button
                      type="button"
                      className="btn-cartoon"
                      onClick={() => {
                        audioSystem.playIncorrect();
                        alert("Try again! 1 one is odd. Adding 0 would leave 1, which is still odd!");
                      }}
                      style={{ backgroundColor: '#FFF', padding: '12px 24px', fontSize: '1.1rem' }}
                    >
                      Parity Bit = 0
                    </button>
                  </div>
                  {l3SelectedParity === 1 && (
                    <div style={{ color: '#2EC4B6', fontWeight: 900, fontSize: '1.1rem', marginTop: 14 }}>
                      ✅ Correct! 1 + 1 = 2 ones (Even Parity satisfied!)
                    </div>
                  )}
                </div>
              )}

              {/* L4 Activity: Parity positions */}
              {lesson.id === 4 && (
                <div>
                  <p style={{ fontSize: '0.95rem', color: '#56587A', marginBottom: 14 }}>
                    Click on positions 1, 2, and 4 to activate their parity shields:
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((pos) => {
                      const isParityPos = [1, 2, 4].includes(pos);
                      return (
                        <BitSlot
                          key={pos}
                          pos={pos}
                          role={pos === 1 ? 'P1' : pos === 2 ? 'P2' : pos === 4 ? 'P4' : `D`}
                          value={isParityPos ? (l4ShieldsActive[pos] ? '🛡️' : 'P') : 'D'}
                          isParity={isParityPos}
                          size="md"
                          interactive={isParityPos}
                          onClick={() => {
                            audioSystem.playClick();
                            setL4ShieldsActive((prev) => ({ ...prev, [pos]: true }));
                          }}
                        />
                      );
                    })}
                  </div>
                  {l4ShieldsActive[1] && l4ShieldsActive[2] && l4ShieldsActive[4] && (
                    <div style={{ color: '#2EC4B6', fontWeight: 900, fontSize: '1.1rem', marginTop: 14 }}>
                      ✅ All 3 parity shields activated at powers of two (1, 2, 4)!
                    </div>
                  )}
                </div>
              )}

              {/* L5 Activity: Complete codeword */}
              {lesson.id === 5 && (
                <div>
                  <CodewordRow codeword="0110011" size="lg" />
                  <p style={{ fontSize: '0.95rem', color: '#25264F', marginTop: 12 }}>
                    Codeword assembled: <strong>P1(0), P2(1), D1(1), P4(0), D2(0), D3(1), D4(1)</strong> ➔ 0110011!
                  </p>
                </div>
              )}

              {/* L6 Activity: Calculate syndrome */}
              {lesson.id === 6 && (
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#25264F', marginBottom: 14 }}>
                    Detectives report: S4=1, S2=1, S1=0. Which position is corrupted?
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className="btn-cartoon"
                        onClick={() => {
                          if (num === 6) {
                            audioSystem.playCorrect();
                            setL6GuessedDecimal(6);
                            onAwardXP(35);
                          } else {
                            audioSystem.playIncorrect();
                          }
                        }}
                        style={{
                          backgroundColor: num === 6 && l6GuessedDecimal === 6 ? '#A8EBCB' : '#FFF',
                          fontSize: '1rem',
                          minWidth: 44,
                        }}
                      >
                        Pos {num}
                      </button>
                    ))}
                  </div>
                  {l6GuessedDecimal === 6 && (
                    <div style={{ color: '#2EC4B6', fontWeight: 900, fontSize: '1.1rem', marginTop: 14 }}>
                      ✅ Correct! S4 S2 S1 = 110 in binary = 6 in decimal! Position 6 is damaged!
                    </div>
                  )}
                </div>
              )}

              {/* L7 Activity: Flip bit 6 back */}
              {lesson.id === 7 && (
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 800, color: '#25264F', marginBottom: 14 }}>
                    Click on corrupted Bit 6 below to flip it from 0 back to 1:
                  </p>
                  <CodewordRow
                    codeword={l7Word}
                    corruptedPosition={l7Fixed ? null : 6}
                    interactive
                    onBitClick={(pos) => {
                      if (pos === 6) {
                        audioSystem.playCorrect();
                        setL7Word('0110011');
                        setL7Fixed(true);
                        onAwardXP(40);
                      }
                    }}
                    size="lg"
                  />
                  {l7Fixed && (
                    <div style={{ color: '#2EC4B6', fontWeight: 900, fontSize: '1.15rem', marginTop: 14 }}>
                      🎉 Bit 6 repaired! Codeword restored to 0110011. Original data 1011 recovered!
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: 24 }}>
                <button
                  type="button"
                  className="btn-cartoon btn-primary"
                  onClick={() => setLessonStep(7)}
                >
                  Continue to Summary & Complete ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: SUMMARIZE WHAT WAS LEARNED */}
        {/* ======================================================== */}
        {lessonStep === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SpeechBubble
              character="professor"
              text={lesson.step7_recap}
              expression="celebrating"
              roleBadge="Main Teacher"
            />

            <div
              style={{
                backgroundColor: '#E8FAF1',
                border: '2.5px solid #2EC4B6',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '3rem' }}>🏆</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#25264F', margin: '8px 0' }}>
                Lesson {lesson.id} Completed!
              </h3>
              <p style={{ fontSize: '1.05rem', color: '#25264F', maxWidth: 640, margin: '0 auto 16px', lineHeight: 1.5 }}>
                {lesson.step7_recap}
              </p>

              <div style={{ display: 'inline-flex', gap: 10, marginBottom: 20 }}>
                <span
                  style={{
                    backgroundColor: '#FFF8DF',
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1.5px solid #25264F',
                    fontWeight: 900,
                  }}
                >
                  +{lesson.xpReward} XP Earned! ⚡
                </span>
              </div>

              <div>
                <button
                  type="button"
                  className="btn-cartoon btn-dark"
                  onClick={handleNextStep}
                  style={{ padding: '12px 28px', fontSize: '1.1rem' }}
                >
                  {selectedLessonId < BEGINNER_LESSONS.length
                    ? `Unlock Lesson ${selectedLessonId + 1} 🚀`
                    : '🎉 You Mastered All 7 Lessons! Explore the Lab!'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Obvious Bottom Navigation Stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 24,
            paddingTop: 16,
            borderTop: '2px solid #25264F',
          }}
        >
          <button
            type="button"
            className="btn-cartoon"
            onClick={handlePrevStep}
            disabled={lessonStep === 1}
            style={{ backgroundColor: '#FFF', fontSize: '0.9rem' }}
          >
            ◀ Previous Step
          </button>

          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#56587A' }}>
            {stepLabels[lessonStep - 1]} ({lessonStep} / 7)
          </span>

          <button
            type="button"
            className="btn-cartoon btn-primary"
            onClick={handleNextStep}
            style={{ fontSize: '0.9rem', padding: '8px 20px' }}
          >
            {lessonStep < 7 ? 'Next Step ➔' : 'Finish Lesson 🏆'}
          </button>
        </div>
      </div>
    </div>
  );
}
