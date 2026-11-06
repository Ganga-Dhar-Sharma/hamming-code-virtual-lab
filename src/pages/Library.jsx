import React, { useState } from 'react';
import { GLOSSARY } from '../data/glossary.js';

/**
 * LIBRARY TAB — Exam Notes & Searchable Theory Glossary
 */
export default function Library({ onTermClick }) {
  const [viewMode, setViewMode] = useState('notes'); // 'quick' | 'notes'
  const [searchQuery, setSearchQuery] = useState('');

  // 13 Theory Sections as specified in Section 9
  const theorySections = [
    {
      id: 1,
      title: '1. Definition & Purpose of Hamming Code',
      quick: 'A linear error-correcting code that detects up to 2-bit errors and corrects single-bit errors by adding redundant check bits.',
      full: `Invented by Richard W. Hamming in 1950 at Bell Labs, Hamming Code is a class of linear block error-correcting codes. Its primary purpose is to add redundant check bits (parity shields) to data so that receivers can automatically detect and correct single-bit errors without requesting retransmission.`,
      tags: ['hamming_code', 'error_detection', 'error_correction'],
    },
    {
      id: 2,
      title: '2. Data Bits vs. Parity Bits',
      quick: 'Data bits carry raw information (D1..D4). Parity bits are calculated shields (P1, P2, P4) that enable error localization.',
      full: `• Data Bits (m): The actual payload or user information. In Hamming (7,4), m = 4 (D1, D2, D3, D4).\n• Parity Bits (r): Redundant check bits added by the encoder. In Hamming (7,4), r = 3 (P1, P2, P4). They occupy power-of-two positions.`,
      tags: ['data_bit', 'parity_bit', 'redundancy'],
    },
    {
      id: 3,
      title: '3. Even and Odd Parity',
      quick: 'Even parity requires the total number of 1s in a group to be even. Odd parity requires the total number of 1s to be odd.',
      full: `• Even Parity: The parity bit is set such that the count of 1s (including parity bit) is an even number (0, 2, 4, ...). Group XOR sum = 0.\n• Odd Parity: The parity bit is set such that the count of 1s is an odd number (1, 3, 5, ...). Group XOR sum = 1.`,
      tags: ['even_parity', 'odd_parity'],
    },
    {
      id: 4,
      title: '4. Hamming (7,4) Arrangement',
      quick: '7 bit positions: Parity bits at powers of 2 (1, 2, 4); Data bits at non-powers of 2 (3, 5, 6, 7).',
      full: `Positions (1-based):\nPosition 1 = P1 (2^0)\nPosition 2 = P2 (2^1)\nPosition 3 = D1\nPosition 4 = P4 (2^2)\nPosition 5 = D2\nPosition 6 = D3\nPosition 7 = D4`,
      tags: ['hamming_code', 'codeword'],
    },
    {
      id: 5,
      title: '5. Parity Group Table',
      quick: 'P1 checks {1,3,5,7}; P2 checks {2,3,6,7}; P4 checks {4,5,6,7}.',
      full: `Every bit position is written in 3-bit binary:\n• P1 covers positions with 1 in least significant bit (xx1): {1, 3, 5, 7}\n• P2 covers positions with 1 in middle bit (x1x): {2, 3, 6, 7}\n• P4 covers positions with 1 in most significant bit (1xx): {4, 5, 6, 7}`,
      tags: ['parity_check_group'],
    },
    {
      id: 6,
      title: '6. Encoding Worked Example (Data = 1011)',
      quick: 'For data 1011, even parity yields P1=0, P2=1, P4=0. Final Codeword = 0110011.',
      full: `Given data = 1011 (D1=1, D2=0, D3=1, D4=1):\n• P1 checks {1, 3, 5, 7} -> P1 ⊕ D1(1) ⊕ D2(0) ⊕ D4(1) = 0 => P1 = 0\n• P2 checks {2, 3, 6, 7} -> P2 ⊕ D1(1) ⊕ D3(1) ⊕ D4(1) = 0 => P2 = 1\n• P4 checks {4, 5, 6, 7} -> P4 ⊕ D2(0) ⊕ D3(1) ⊕ D4(1) = 0 => P4 = 0\nCodeword [P1, P2, D1, P4, D2, D3, D4] = 0110011.`,
      tags: ['codeword', 'even_parity'],
    },
    {
      id: 7,
      title: '7. Error Detection Mechanics',
      quick: 'The receiver re-evaluates parity checks. If any group check fails, an error has occurred.',
      full: `The receiver checks each parity group S1, S2, S4. Under even parity, each check XORs all bits in its group. If no bits flipped, each check evaluates to 0. A non-zero check indicates one or more bits were corrupted.`,
      tags: ['error_detection'],
    },
    {
      id: 8,
      title: '8. Syndrome Calculation (S4 S2 S1)',
      quick: 'Assemble checks as S4 S2 S1. The resulting 3-bit binary number equals the decimal position of the error.',
      full: `• S1 = Bit1 ⊕ Bit3 ⊕ Bit5 ⊕ Bit7\n• S2 = Bit2 ⊕ Bit3 ⊕ Bit6 ⊕ Bit7\n• S4 = Bit4 ⊕ Bit5 ⊕ Bit6 ⊕ Bit7\nOrder: S4 (MSB), S2, S1 (LSB). Decimal position = (S4 * 4) + (S2 * 2) + (S1 * 1).`,
      tags: ['syndrome'],
    },
    {
      id: 9,
      title: '9. Error Correction Worked Example (Flip Position 6)',
      quick: 'Received 0110001 -> Syndrome 110 (decimal 6) -> Flip position 6 -> Restored 0110011.',
      full: `Sender sends 0110011. Position 6 flips to 0, producing received word 0110001.\n• S1 checks {0, 1, 0, 1} = 0\n• S2 checks {1, 1, 0, 1} = 1 (Violation!)\n• S4 checks {0, 0, 0, 1} = 1 (Violation!)\nSyndrome S4 S2 S1 = 110 in binary = 6 in decimal. Position 6 is inverted back to 1, completely restoring the original codeword 0110011.`,
      tags: ['error_correction', 'single_bit_error'],
    },
    {
      id: 10,
      title: '10. The Redundancy Formula: 2^r ≥ m + r + 1',
      quick: 'To correct all single-bit errors in m data bits, r parity bits must satisfy 2^r >= m + r + 1.',
      full: `• Total possible error states = m + r single-bit error positions + 1 zero-error state = m + r + 1.\n• r parity bits can represent 2^r distinct states.\n• Therefore: 2^r ≥ m + r + 1.\nFor m = 4 data bits: 2^3 = 8 ≥ 4 + 3 + 1 = 8 (r = 3 is sufficient!).`,
      tags: ['redundancy', 'hamming_code'],
    },
    {
      id: 11,
      title: '11. Advantages & Limitations',
      quick: 'Advantage: Fast hardware implementation, instant single-error correction. Limitation: Single-error correction only; 2-bit errors cause miscorrection.',
      full: `• Advantages: Low overhead, simple XOR hardware implementation, zero retransmission latency, high throughput.\n• Limitations: Standard Hamming (7,4) cannot correct burst errors or multiple-bit errors. A 2-bit error produces a deceptive syndrome that incorrectly inverts an innocent third bit.`,
      tags: ['hamming_distance', 'single_bit_error'],
    },
    {
      id: 12,
      title: '12. Real-World Applications (ECC Memory)',
      quick: 'Used universally in server ECC RAM, space satellite telemetry, flash storage, and RAID 2.',
      full: `• ECC RAM: Server DRAM modules use Hamming codes to prevent silent data corruption from cosmic rays and thermal noise.\n• Deep Space Communications: NASA probes use Hamming and concatenated codes for transmission through cosmic radiation.\n• RAID 2: Striping with Hamming code parity disks.`,
      tags: ['secded'],
    },
    {
      id: 13,
      title: '13. SECDED (Hamming 8,4 Extension)',
      quick: 'Single Error Correction, Double Error Detection by adding an extra overall parity bit P0.',
      full: `SECDED extends Hamming (7,4) to (8,4) by appending an overall parity bit P0 that checks ALL 7 bits. If the syndrome is non-zero and overall parity fails -> Single-bit error (corrected). If the syndrome is non-zero and overall parity passes -> Double-bit error (detected and flagged as uncorrectable, preventing silent corruption!).`,
      tags: ['secded'],
    },
  ];

  // Search filter
  const filteredSections = theorySections.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.full.toLowerCase().includes(q);
  });

  const glossaryEntries = Object.entries(GLOSSARY).filter(([key, val]) => {
    const q = searchQuery.toLowerCase();
    return val.term.toLowerCase().includes(q) || val.definition.toLowerCase().includes(q);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Mode Switch */}
      <div
        className="card-cartoon"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 14,
          padding: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#25264F' }}>
            📚 Signal City Knowledge Library
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#56587A' }}>
            Complete exam notes, worked examples, mathematical formulas, and searchable technical glossary.
          </p>
        </div>

        {/* Quick Revision vs Exam Notes Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              onClick={() => setViewMode('quick')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: '0.85rem',
                backgroundColor: viewMode === 'quick' ? '#FFDA70' : 'transparent',
                color: '#25264F',
                border: viewMode === 'quick' ? '1.5px solid #25264F' : 'none',
              }}
            >
              ⚡ Quick Revision
            </button>
            <button
              type="button"
              onClick={() => setViewMode('notes')}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontWeight: 800,
                fontSize: '0.85rem',
                backgroundColor: viewMode === 'notes' ? '#ECE7FF' : 'transparent',
                color: '#25264F',
                border: viewMode === 'notes' ? '1.5px solid #25264F' : 'none',
              }}
            >
              📖 Exam Notes
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Search Bar */}
      <div className="card-cartoon" style={{ padding: '14px 20px' }}>
        <input
          type="text"
          placeholder="🔍 Search formulas, worked examples, glossary terms (e.g. SECDED, P2, 1011, syndrome)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #25264F',
            fontSize: '1rem',
            fontFamily: 'inherit',
            backgroundColor: '#FFF8EB',
            color: '#25264F',
          }}
        />
      </div>

      {/* 13 Theory Sections Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        {filteredSections.map((sec) => (
          <div key={sec.id} className="card-cartoon">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#25264F', marginBottom: 8 }}>
              {sec.title}
            </h3>

            {viewMode === 'quick' ? (
              <p style={{ fontSize: '1.02rem', color: '#25264F', fontWeight: 600, lineHeight: 1.5 }}>
                {sec.quick}
              </p>
            ) : (
              <div
                style={{
                  fontSize: '0.98rem',
                  color: '#25264F',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}
              >
                {sec.full}
              </div>
            )}

            {/* Tappable Term Tags */}
            {sec.tags && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {sec.tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="term-link"
                    onClick={() => onTermClick(t)}
                    style={{ fontSize: '0.78rem', backgroundColor: '#ECE7FF', padding: '2px 8px', borderRadius: 6 }}
                  >
                    💡 {t.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Searchable Glossary Section */}
      <div className="card-cartoon" style={{ padding: 24, marginTop: 10 }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#25264F', marginBottom: 6 }}>
          📖 Technical Glossary (A to Z)
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#56587A', marginBottom: 18 }}>
          Tap on any term below to open its quick definition popup card:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {glossaryEntries.map(([k, item]) => (
            <button
              key={k}
              type="button"
              className="btn-cartoon"
              onClick={() => onTermClick(k)}
              style={{
                backgroundColor: '#FFF',
                textAlign: 'left',
                justifyContent: 'space-between',
                padding: '10px 14px',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#25264F' }}>
                {item.term}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#56587A', backgroundColor: '#ECE7FF', padding: '2px 6px', borderRadius: 4 }}>
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
