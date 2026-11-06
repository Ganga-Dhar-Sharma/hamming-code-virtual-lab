import { describe, it, expect } from 'vitest';
import { encode, syndrome, correct, flipBitAt, normalizeBits, PARITY_GROUPS } from '../lib/hamming.js';

describe('Hamming (7,4) Core Mathematical Verification', () => {
  it('encodes worked example data=1011 with even parity to 0110011', () => {
    const res = encode('1011', 'even');
    expect(res.codeword).toBe('0110011');
    expect(res.parityBits).toEqual({ p1: 0, p2: 1, p4: 0 });
    expect(res.dataBits).toEqual({ d1: 1, d2: 0, d3: 1, d4: 1 });
    expect(res.codewordArray).toEqual([0, 1, 1, 0, 0, 1, 1]);
  });

  it('produces syndrome 110 when position 6 is flipped in 0110011', () => {
    const original = '0110011';
    const corrupted = flipBitAt(original, 6);
    expect(corrupted).toBe('0110001');

    const syn = syndrome(corrupted, 'even');
    expect(syn.s1).toBe(0);
    expect(syn.s2).toBe(1);
    expect(syn.s4).toBe(1);
    expect(syn.syndromeStr).toBe('110');
    expect(syn.decimal).toBe(6);
    expect(syn.hasError).toBe(true);
  });

  it('correct restores 0110011 and original data 1011 when position 6 is flipped', () => {
    const corrupted = '0110001';
    const res = correct(corrupted, 'even');
    expect(res.wasCorrected).toBe(true);
    expect(res.identifiedPosition).toBe(6);
    expect(res.correctedCodeword).toBe('0110011');
    expect(res.dataBits).toBe('1011');
  });

  it('returns syndrome 000 and decimal 0 when there is no error', () => {
    const syn = syndrome('0110011', 'even');
    expect(syn.s1).toBe(0);
    expect(syn.s2).toBe(0);
    expect(syn.s4).toBe(0);
    expect(syn.syndromeStr).toBe('000');
    expect(syn.decimal).toBe(0);
    expect(syn.hasError).toBe(false);

    const cor = correct('0110011', 'even');
    expect(cor.wasCorrected).toBe(false);
    expect(cor.identifiedPosition).toBe(0);
    expect(cor.correctedCodeword).toBe('0110011');
    expect(cor.dataBits).toBe('1011');
  });

  it('supports odd parity correctly for worked example 1011', () => {
    const enc = encode('1011', 'odd');
    // Group 1: {1,3,5,7} -> D1=1, D2=0, D4=1 => sum=2. For odd parity, P1=1 (sum=3).
    // Group 2: {2,3,6,7} -> D1=1, D3=1, D4=1 => sum=3. For odd parity, P2=0 (sum=3).
    // Group 3: {4,5,6,7} -> D2=0, D3=1, D4=1 => sum=2. For odd parity, P4=1 (sum=3).
    // Positions: [P1=1, P2=0, D1=1, P4=1, D2=0, D3=1, D4=1] = "1011011"
    expect(enc.parityBits).toEqual({ p1: 1, p2: 0, p4: 1 });
    expect(enc.codeword).toBe('1011011');

    // Clean odd parity codeword should produce syndrome 000
    const synClean = syndrome('1011011', 'odd');
    expect(synClean.syndromeStr).toBe('000');
    expect(synClean.decimal).toBe(0);
    expect(synClean.hasError).toBe(false);

    // Corrupt position 4 (index 3)
    const corrupted = flipBitAt('1011011', 4); // "1010011"
    const syn = syndrome(corrupted, 'odd');
    expect(syn.syndromeStr).toBe('100'); // S4=1, S2=0, S1=0 => decimal 4
    expect(syn.decimal).toBe(4);

    const cor = correct(corrupted, 'odd');
    expect(cor.wasCorrected).toBe(true);
    expect(cor.identifiedPosition).toBe(4);
    expect(cor.correctedCodeword).toBe('1011011');
    expect(cor.dataBits).toBe('1011');
  });

  it('validates invalid inputs properly', () => {
    expect(() => encode('101', 'even')).toThrow();
    expect(() => encode('10110', 'even')).toThrow();
    expect(() => encode('1021', 'even')).toThrow();
    expect(() => syndrome('011001', 'even')).toThrow();
    expect(() => syndrome('01100110', 'even')).toThrow();
    expect(() => syndrome('01100a1', 'even')).toThrow();
    expect(() => flipBitAt('0110011', 0)).toThrow();
    expect(() => flipBitAt('0110011', 8)).toThrow();
  });

  it('corrects all 16 possible 4-bit data words across all 7 single-bit error positions for both even and odd parity (224 exhaustive cases)', () => {
    const parityModes = ['even', 'odd'];

    for (const mode of parityModes) {
      for (let i = 0; i < 16; i++) {
        const dataStr = i.toString(2).padStart(4, '0');
        const encoded = encode(dataStr, mode);
        const originalCodeword = encoded.codeword;

        // Verify clean codeword produces 000 syndrome
        const cleanSyndrome = syndrome(originalCodeword, mode);
        expect(cleanSyndrome.decimal).toBe(0);
        expect(cleanSyndrome.hasError).toBe(false);

        // Verify all 7 error positions
        for (let pos = 1; pos <= 7; pos++) {
          const corrupted = flipBitAt(originalCodeword, pos);
          const syn = syndrome(corrupted, mode);

          expect(syn.hasError).toBe(true);
          expect(syn.decimal).toBe(pos);

          const cor = correct(corrupted, mode);
          expect(cor.wasCorrected).toBe(true);
          expect(cor.identifiedPosition).toBe(pos);
          expect(cor.correctedCodeword).toBe(originalCodeword);
          expect(cor.dataBits).toBe(dataStr);
        }
      }
    }
  });

  it('demonstrates the limitation on 2-bit errors (syndrome is deceptive, not zero, but wrong single position)', () => {
    const original = encode('1011', 'even').codeword; // "0110011"
    // Flip pos 3 and pos 5
    const corrupted2 = flipBitAt(flipBitAt(original, 3), 5);
    const syn = syndrome(corrupted2, 'even');
    // For 2-bit errors, syndrome is non-zero, but points to a single bit which does NOT restore the original!
    expect(syn.hasError).toBe(true);
    const cor = correct(corrupted2, 'even');
    expect(cor.correctedCodeword).not.toBe(original);
  });
});
