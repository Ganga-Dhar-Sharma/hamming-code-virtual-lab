import React, { useState } from 'react';
import { audioSystem } from '../lib/audio.js';

/**
 * Interactive Quiz Card Component
 */
export default function Quiz({
  questions = [],
  onComplete,
  onXPBonus = null,
  showRetry = true,
  title = 'Challenge Quiz',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  if (!currentQ || completed) {
    return (
      <div
        className="card-cartoon"
        style={{
          textAlign: 'center',
          padding: 30,
          backgroundColor: '#FFFFFF',
        }}
      >
        <span style={{ fontSize: '3rem' }}>🎉</span>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '10px 0' }}>
          Quiz Complete!
        </h3>
        <p style={{ fontSize: '1.1rem', color: '#56587A', marginBottom: 20 }}>
          You scored {score} out of {questions.length} correct!
        </p>
        <button
          type="button"
          className="btn-cartoon btn-primary"
          onClick={() => {
            if (onComplete) onComplete(score, questions.length);
          }}
        >
          Claim Rewards & Continue 🚀
        </button>
      </div>
    );
  }

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.answer;
    setIsCorrect(correct);

    if (correct) {
      audioSystem.playCorrect();
      setScore((s) => s + 1);
      if (onXPBonus) onXPBonus(25);
    } else {
      audioSystem.playIncorrect();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      setCompleted(true);
      if (onComplete) onComplete(score + (isCorrect ? 1 : 0), questions.length);
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div
      className="card-cartoon"
      style={{
        backgroundColor: '#FFFFFF',
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#34449A',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title} • Question {currentIndex + 1} of {questions.length}
        </span>

        {currentQ.hint && !isAnswered && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#56587A',
              padding: '4px 10px',
              borderRadius: 8,
              border: '1.5px solid #25264F',
              backgroundColor: '#FFF8EB',
            }}
          >
            💡 Hint
          </button>
        )}
      </div>

      {/* Hint Alert */}
      {showHint && (
        <div
          style={{
            backgroundColor: '#FFF8DF',
            border: '2px solid #FFDA70',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: '0.92rem',
            color: '#25264F',
            marginBottom: 14,
          }}
        >
          <strong>Hint:</strong> {currentQ.hint}
        </div>
      )}

      {/* Question */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#25264F',
          lineHeight: 1.4,
          marginBottom: 18,
        }}
      >
        {currentQ.question}
      </h3>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {currentQ.options.map((opt, idx) => {
          let btnBg = '#FFF8EB';
          let borderCol = '#25264F';

          if (isAnswered) {
            if (idx === currentQ.answer) {
              btnBg = '#A8EBCB'; // Correct
              borderCol = '#25264F';
            } else if (idx === selectedOption) {
              btnBg = '#FFE5E9'; // Wrong choice
              borderCol = '#FF4D6D';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              className="btn-cartoon"
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              style={{
                backgroundColor: btnBg,
                borderColor: borderCol,
                textAlign: 'left',
                justifyContent: 'flex-start',
                padding: '12px 18px',
                width: '100%',
                fontSize: '0.98rem',
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

      {/* Feedback Section */}
      {isAnswered && (
        <div
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 12,
            backgroundColor: isCorrect ? '#E8FAF1' : '#FFF0F2',
            border: `2px solid ${isCorrect ? '#2EC4B6' : '#FF4D6D'}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: '1.3rem' }}>{isCorrect ? '✅' : '❌'}</span>
            <span style={{ fontWeight: 900, fontSize: '1.05rem', color: '#25264F' }}>
              {isCorrect ? 'Spot on! Correct!' : 'Not quite right!'}
            </span>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#25264F', lineHeight: 1.4 }}>
            {currentQ.explanation}
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {!isCorrect && showRetry && (
              <button
                type="button"
                className="btn-cartoon"
                onClick={handleRetryQuestion}
                style={{
                  backgroundColor: '#FFF',
                  fontSize: '0.9rem',
                  padding: '8px 14px',
                }}
              >
                🔄 Try Again
              </button>
            )}

            <button
              type="button"
              className="btn-cartoon btn-primary"
              onClick={handleNext}
              style={{
                fontSize: '0.9rem',
                padding: '8px 18px',
                marginLeft: 'auto',
              }}
            >
              {currentIndex + 1 < questions.length ? 'Next Question ➔' : 'Finish Quiz 🎉'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
