/**
 * Pure mathematical functions for Hamming (7,4) Code
 * Supports both Even and Odd parity.
 * 
 * Educational positions (1-based):
 * Pos 1: P1 (powers of 2)
 * Pos 2: P2 (powers of 2)
 * Pos 3: D1 (data bit 1)
 * Pos 4: P4 (powers of 2)
 * Pos 5: D2 (data bit 2)
 * Pos 6: D3 (data bit 3)
 * Pos 7: D4 (data bit 4)
 * 
 * Parity groups:
 * P1 / S1: covers positions 1, 3, 5, 7  (binary xx1)
 * P2 / S2: covers positions 2, 3, 6, 7  (binary x1x)
 * P4 / S4: covers positions 4, 5, 6, 7  (binary 1xx)
 */

export const PARITY_GROUPS = {
  P1: [1, 3, 5, 7],
  P2: [2, 3, 6, 7],
  P4: [4, 5, 6, 7],
};

export const POSITION_INFO = [
  { pos: 1, type: 'P1', bitRole: 'parity', binary: '001', covers: [1, 3, 5, 7], color: '#FF777F', label: 'Parity Bit 1' },
  { pos: 2, type: 'P2', bitRole: 'parity', binary: '010', covers: [2, 3, 6, 7], color: '#84DCFF', label: 'Parity Bit 2' },
  { pos: 3, type: 'D1', bitRole: 'data',   binary: '011', covers: [],           color: '#A8EBCB', label: 'Data Bit 1' },
  { pos: 4, type: 'P4', bitRole: 'parity', binary: '100', covers: [4, 5, 6, 7], color: '#FFDA70', label: 'Parity Bit 4' },
  { pos: 5, type: 'D2', bitRole: 'data',   binary: '101', covers: [],           color: '#A8EBCB', label: 'Data Bit 2' },
  { pos: 6, type: 'D3', bitRole: 'data',   binary: '110', covers: [],           color: '#A8EBCB', label: 'Data Bit 3' },
  { pos: 7, type: 'D4', bitRole: 'data',   binary: '111', covers: [],           color: '#A8EBCB', label: 'Data Bit 4' },
];

/**
 * Normalizes input to an array of integers 0 or 1.
 * @param {string|number[]|string[]} input 
 * @param {number} expectedLength 
 * @returns {number[]}
 */
export function normalizeBits(input, expectedLength) {
  if (typeof input === 'string') {
    input = input.trim().split('');
  }
  if (!Array.isArray(input) || input.length !== expectedLength) {
    throw new Error(`Input must be exactly ${expectedLength} bits (received ${input ? input.length : 0}).`);
  }
  const bits = input.map((b) => {
    const n = Number(b);
    if (n !== 0 && n !== 1) {
      throw new Error(`Invalid bit value '${b}'. Only 0 and 1 are permitted.`);
    }
    return n;
  });
  return bits;
}

/**
 * Encodes 4 data bits into a 7-bit Hamming codeword.
 * 
 * @param {string|number[]} data4 - 4 data bits e.g. "1011" or [1,0,1,1]
 * @param {'even'|'odd'} [parityMode='even'] - 'even' or 'odd'
 * @returns {object} Structured encoding result
 */
export function encode(data4, parityMode = 'even') {
  const normMode = (parityMode || 'even').toLowerCase();
  if (normMode !== 'even' && normMode !== 'odd') {
    throw new Error(`Invalid parityMode '${parityMode}'. Expected 'even' or 'odd'.`);
  }

  const [d1, d2, d3, d4] = normalizeBits(data4, 4);
  const expectedParity = normMode === 'even' ? 0 : 1;

  // Parity bits formulas:
  // For even parity, P ^ group_data_bits = 0 => P = XOR(group_data_bits)
  // For odd parity, P ^ group_data_bits = 1 => P = XOR(group_data_bits) ^ 1
  const p1 = d1 ^ d2 ^ d4 ^ expectedParity;
  const p2 = d1 ^ d3 ^ d4 ^ expectedParity;
  const p4 = d2 ^ d3 ^ d4 ^ expectedParity;

  // Codeword positions: [P1, P2, D1, P4, D2, D3, D4]
  const codewordArray = [p1, p2, d1, p4, d2, d3, d4];
  const codeword = codewordArray.join('');

  return {
    codeword,
    codewordArray,
    dataBits: { d1, d2, d3, d4 },
    dataString: `${d1}${d2}${d3}${d4}`,
    parityBits: { p1, p2, p4 },
    parityMode: normMode,
    steps: {
      p1: {
        formula: normMode === 'even' ? 'D1 ⊕ D2 ⊕ D4' : 'D1 ⊕ D2 ⊕ D4 ⊕ 1',
        values: [d1, d2, d4],
        dataBitsCovered: ['D1', 'D2', 'D4'],
        positionsCovered: [3, 5, 7],
        calculatedBit: p1,
        totalOnesWithParity: p1 + d1 + d2 + d4,
        explanation: `${normMode === 'even' ? 'Even' : 'Odd'} parity for positions {1,3,5,7}: D1(${d1}) + D2(${d2}) + D4(${d4}) = ${d1+d2+d4} ones. P1 is set to ${p1}.`,
      },
      p2: {
        formula: normMode === 'even' ? 'D1 ⊕ D3 ⊕ D4' : 'D1 ⊕ D3 ⊕ D4 ⊕ 1',
        values: [d1, d3, d4],
        dataBitsCovered: ['D1', 'D3', 'D4'],
        positionsCovered: [3, 6, 7],
        calculatedBit: p2,
        totalOnesWithParity: p2 + d1 + d3 + d4,
        explanation: `${normMode === 'even' ? 'Even' : 'Odd'} parity for positions {2,3,6,7}: D1(${d1}) + D3(${d3}) + D4(${d4}) = ${d1+d3+d4} ones. P2 is set to ${p2}.`,
      },
      p4: {
        formula: normMode === 'even' ? 'D2 ⊕ D3 ⊕ D4' : 'D2 ⊕ D3 ⊕ D4 ⊕ 1',
        values: [d2, d3, d4],
        dataBitsCovered: ['D2', 'D3', 'D4'],
        positionsCovered: [5, 6, 7],
        calculatedBit: p4,
        totalOnesWithParity: p4 + d2 + d3 + d4,
        explanation: `${normMode === 'even' ? 'Even' : 'Odd'} parity for positions {4,5,6,7}: D2(${d2}) + D3(${d3}) + D4(${d4}) = ${d2+d3+d4} ones. P4 is set to ${p4}.`,
      },
    },
  };
}

/**
 * Calculates syndrome for a 7-bit received codeword.
 * 
 * @param {string|number[]} code7 - 7-bit codeword e.g. "0110001"
 * @param {'even'|'odd'} [parityMode='even'] - 'even' or 'odd'
 * @returns {object} Structured syndrome result
 */
export function syndrome(code7, parityMode = 'even') {
  const normMode = (parityMode || 'even').toLowerCase();
  if (normMode !== 'even' && normMode !== 'odd') {
    throw new Error(`Invalid parityMode '${parityMode}'. Expected 'even' or 'odd'.`);
  }

  const bits = normalizeBits(code7, 7);
  // 1-based indexing alias:
  // bits[0] = pos 1, bits[1] = pos 2, ..., bits[6] = pos 7
  const b = (pos) => bits[pos - 1];

  const expectedParity = normMode === 'even' ? 0 : 1;

  // Syndrome checks:
  // For each check, the sum of bits in the group XOR expectedParity should be 0 if clean.
  const s1 = (b(1) ^ b(3) ^ b(5) ^ b(7)) ^ expectedParity;
  const s2 = (b(2) ^ b(3) ^ b(6) ^ b(7)) ^ expectedParity;
  const s4 = (b(4) ^ b(5) ^ b(6) ^ b(7)) ^ expectedParity;

  // Syndrome is read S4 S2 S1
  const syndromeStr = `${s4}${s2}${s1}`;
  const decimal = (s4 * 4) + (s2 * 2) + (s1 * 1);
  const hasError = decimal !== 0;

  return {
    s1,
    s2,
    s4,
    syndromeStr,
    decimal,
    hasError,
    parityMode: normMode,
    groupChecks: {
      s1: {
        positions: [1, 3, 5, 7],
        values: [b(1), b(3), b(5), b(7)],
        sum: b(1) + b(3) + b(5) + b(7),
        result: s1,
        isSatisfied: s1 === 0,
        explanation: `S1 checks positions {1,3,5,7}: [${b(1)}, ${b(3)}, ${b(5)}, ${b(7)}]. Parity ${s1 === 0 ? 'passed' : 'FAILED'} (S1 = ${s1}).`,
      },
      s2: {
        positions: [2, 3, 6, 7],
        values: [b(2), b(3), b(6), b(7)],
        sum: b(2) + b(3) + b(6),
        result: s2,
        isSatisfied: s2 === 0,
        explanation: `S2 checks positions {2,3,6,7}: [${b(2)}, ${b(3)}, ${b(6)}, ${b(7)}]. Parity ${s2 === 0 ? 'passed' : 'FAILED'} (S2 = ${s2}).`,
      },
      s4: {
        positions: [4, 5, 6, 7],
        values: [b(4), b(5), b(6), b(7)],
        sum: b(4) + b(5) + b(6) + b(7),
        result: s4,
        isSatisfied: s4 === 0,
        explanation: `S4 checks positions {4,5,6,7}: [${b(4)}, ${b(5)}, ${b(6)}, ${b(7)}]. Parity ${s4 === 0 ? 'passed' : 'FAILED'} (S4 = ${s4}).`,
      },
    },
  };
}

/**
 * Performs error detection and single-bit correction under the single-bit error assumption.
 * 
 * @param {string|number[]} code7 - 7-bit received codeword
 * @param {'even'|'odd'} [parityMode='even']
 * @returns {object} Detailed correction result
 */
export function correct(code7, parityMode = 'even') {
  const syn = syndrome(code7, parityMode);
  const bits = normalizeBits(code7, 7);
  const correctedArray = [...bits];
  let wasCorrected = false;
  let identifiedPosition = 0;

  if (syn.hasError) {
    identifiedPosition = syn.decimal;
    if (identifiedPosition >= 1 && identifiedPosition <= 7) {
      // Flip the bit at identifiedPosition (1-based => index identifiedPosition - 1)
      const targetIdx = identifiedPosition - 1;
      correctedArray[targetIdx] = correctedArray[targetIdx] === 1 ? 0 : 1;
      wasCorrected = true;
    }
  }

  const correctedCodeword = correctedArray.join('');
  // Extract data bits from positions 3, 5, 6, 7 (indices 2, 4, 5, 6)
  const d1 = correctedArray[2];
  const d2 = correctedArray[4];
  const d3 = correctedArray[5];
  const d4 = correctedArray[6];
  const dataBits = `${d1}${d2}${d3}${d4}`;
  const dataArray = [d1, d2, d3, d4];

  return {
    syndrome: syn,
    identifiedPosition, // 1-based (1..7, or 0 if no error)
    receivedCodeword: bits.join(''),
    receivedArray: bits,
    correctedCodeword,
    correctedArray,
    wasCorrected,
    dataBits,
    dataArray,
    // Note clearly that this correction is only guaranteed correct under the single-bit error assumption:
    isCandidateOnly: true,
    limitationNote: "Standard Hamming (7,4) guarantees single-bit error correction only. Multiple bit errors produce deceptive syndromes.",
  };
}

/**
 * Helper to flip a single bit at a 1-based position (1..7)
 */
export function flipBitAt(code7, pos1Based) {
  const bits = normalizeBits(code7, 7);
  if (pos1Based < 1 || pos1Based > 7) {
    throw new Error(`Position must be between 1 and 7 (received ${pos1Based}).`);
  }
  const idx = pos1Based - 1;
  bits[idx] = bits[idx] === 1 ? 0 : 1;
  return bits.join('');
}
