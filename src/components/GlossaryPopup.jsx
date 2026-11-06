import React, { useEffect } from 'react';
import { GLOSSARY } from '../data/glossary.js';

/**
 * Glossary Definition Modal Popup
 */
export default function GlossaryPopup({ termKey = null, onClose }) {
  if (!termKey) return null;

  const entry = GLOSSARY[termKey] || {
    term: termKey.replace(/_/g, ' '),
    category: 'Concept',
    definition: 'No definition found for this term.',
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
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
        zIndex: 200,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card-cartoon"
        style={{
          maxWidth: 480,
          width: '100%',
          backgroundColor: '#FFF8EB',
          border: '3px solid #25264F',
          boxShadow: '0 8px 0 #25264F',
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '3px 8px',
              backgroundColor: '#ECE7FF',
              color: '#34449A',
              borderRadius: 6,
              border: '1px solid #25264F',
            }}
          >
            {entry.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close glossary popup"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '2px solid #25264F',
              backgroundColor: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <h3
          style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: '#25264F',
            marginBottom: 10,
          }}
        >
          {entry.term}
        </h3>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.5,
            color: '#25264F',
            marginBottom: 14,
          }}
        >
          {entry.definition}
        </p>

        {entry.formula && (
          <div
            style={{
              backgroundColor: '#FFF',
              border: '2px solid #25264F',
              borderRadius: 8,
              padding: '8px 12px',
              marginBottom: 12,
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#56587A' }}>
              Formula:{' '}
            </span>
            <span className="binary-text" style={{ fontSize: '1.05rem', color: '#8338EC' }}>
              {entry.formula}
            </span>
          </div>
        )}

        {entry.example && (
          <div
            style={{
              backgroundColor: '#E8FAF1',
              border: '2px solid #25264F',
              borderRadius: 8,
              padding: '10px 12px',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#25264F' }}>
              💡 Example:{' '}
            </span>
            <span style={{ fontSize: '0.92rem', color: '#25264F' }}>{entry.example}</span>
          </div>
        )}
      </div>
    </div>
  );
}
