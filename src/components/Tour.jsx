import React, { useState } from 'react';
import Byte from './Characters/Byte.jsx';

/**
 * 3-Step Guided Onboarding Tour
 */
export default function Tour({ isOpen = false, onFinish, onTabSelect }) {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to Bit Busters!',
      text: "Welcome, Junior Signal Engineer! I'm Byte. Let's save Signal City from the Bit-Flip Gremlins by mastering Hamming Code!",
      targetTab: 'missions',
      expression: 'celebrating',
      highlight: 'MISSIONS TAB',
    },
    {
      title: 'The Virtual Laboratory',
      text: "The Lab is your playground! Build 7-bit codewords, simulate noisy transmissions, catch Glitch, and fix broken bits in real-time!",
      targetTab: 'lab',
      expression: 'happy',
      highlight: 'LAB TAB',
    },
    {
      title: 'Exam Library & Achievements',
      text: "Need quick exam notes or formulas? The Library has your complete cheat sheet! Keep an eye on your XP and badges in the top header.",
      targetTab: 'library',
      expression: 'winking',
      highlight: 'LIBRARY & HEADER',
    },
  ];

  const current = steps[step];

  const handleNext = () => {
    if (step + 1 < steps.length) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (onTabSelect) onTabSelect(steps[nextStep].targetTab);
    } else {
      if (onFinish) onFinish();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      if (onTabSelect) onTabSelect(steps[prevStep].targetTab);
    }
  };

  const handleSkip = () => {
    if (onFinish) onFinish();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(37, 38, 79, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        padding: 16,
      }}
    >
      <div
        className="card-cartoon"
        style={{
          maxWidth: 520,
          width: '100%',
          backgroundColor: '#FFF8EB',
          border: '3.5px solid #25264F',
          boxShadow: '0 8px 0 #25264F',
          padding: 24,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
          <Byte expression={current.expression} size={64} />
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: 6,
                backgroundColor: '#ECE7FF',
                color: '#34449A',
                border: '1px solid #25264F',
              }}
            >
              Tour Step {step + 1} of {steps.length} • {current.highlight}
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#25264F', marginTop: 4 }}>
              {current.title}
            </h3>
          </div>
        </div>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.5,
            color: '#25264F',
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          {current.text}
        </p>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={handleSkip}
            style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#56587A',
              padding: '6px 12px',
            }}
          >
            Skip Tour
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <button
                type="button"
                className="btn-cartoon"
                onClick={handlePrev}
                style={{ backgroundColor: '#FFF', fontSize: '0.9rem', padding: '8px 14px' }}
              >
                ◀ Previous
              </button>
            )}

            <button
              type="button"
              className="btn-cartoon btn-primary"
              onClick={handleNext}
              style={{ fontSize: '0.9rem', padding: '8px 18px' }}
            >
              {step + 1 < steps.length ? 'Next ➔' : 'Got it, Let’s Go! 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
