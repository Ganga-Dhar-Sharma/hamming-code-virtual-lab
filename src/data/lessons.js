/**
 * BIT BUSTERS 2.0 — 7 Beginner-First Lessons
 * Each lesson follows the 7-step sequence:
 * 1. Explain the concept in simple English
 * 2. Show a visual example
 * 3. Demonstrate it step by step
 * 4. Ask one very simple question
 * 5. Give feedback
 * 6. Let the student try an interactive activity
 * 7. Summarize what was learned
 */

export const BEGINNER_LESSONS = [
  {
    id: 1,
    title: 'Lesson 1: Understanding Bits',
    tagline: 'The Building Blocks of Digital Communication',
    character: 'professor',
    teacherIntro:
      "Hello, Junior Engineer! I am Professor Parity. Let's start with something easy. Inside every computer and communication cable, all information is made of tiny switches called bits. A bit can only be two things: a 0 (OFF) or a 1 (ON). When we group 4 bits together, like 1-0-1-1, we can represent numbers, letters, and signals across Signal City!",
    step1_explain:
      "A bit is the smallest piece of computer information. It is either 0 or 1. Computers send messages as streams of bits.",
    step2_visualExample: {
      type: 'four_bits',
      data: ['1', '0', '1', '1'],
      caption: "Here is a 4-bit message packet: [1, 0, 1, 1]. Notice how each box holds a single 0 or 1.",
    },
    step3_demoSteps: [
      "1. A bit is either 0 or 1.",
      "2. When we combine four bits, we get a 4-bit packet (like 1011).",
      "3. These bits travel across cables at nearly the speed of light!",
    ],
    step4_simpleQuestion: {
      question: "What are the only two possible values a single bit can hold?",
      options: [
        "(Recommended) 0 and 1",
        "1 and 2",
        "A and B",
        "Any number from 0 to 9",
      ],
      answer: 0,
      hint: "Think of a light switch: it is either completely OFF or completely ON.",
      explanation: "Exactly right! In digital electronics, a bit can only be 0 (low voltage) or 1 (high voltage).",
    },
    step6_activity: {
      type: 'toggle_bits',
      prompt: "Try it yourself! Click on any bit below to flip it between 0 and 1. See how the 4-bit message changes:",
      initialData: ['1', '0', '1', '1'],
    },
    step7_recap:
      "A bit is simply a 0 or 1. Data travels across networks in packets of bits. But what happens if a bit changes along the way? That brings us to Lesson 2!",
    xpReward: 50,
  },
  {
    id: 2,
    title: 'Lesson 2: Transmission Errors',
    tagline: 'When Good Bits Go Bad',
    character: 'professor',
    teacherIntro:
      "Imagine sending a 4-bit message to your friend across the city. As the signal travels through long cables, electrical noise or our mischievous gremlin Glitch can flip a bit! A 0 turns into a 1, or a 1 turns into a 0. That is called a transmission error. If we don't catch it, the computer gets the wrong message!",
    step1_explain:
      "During transmission, noise can cause a 'bit flip'. If a bit flips from 1 to 0 or 0 to 1, the received message is corrupted.",
    step2_visualExample: {
      type: 'transmission_compare',
      sent: ['1', '0', '1', '1'],
      received: ['1', '0', '0', '1'],
      corruptedIndex: 2, // 3rd bit flipped
      caption: "The sender sent 1011. But on the wire, the 3rd bit flipped to 0! The receiver got 1001.",
    },
    step3_demoSteps: [
      "1. Sender transmits: 1 0 1 1.",
      "2. Electrical interference strikes the wire: ZAP!",
      "3. Receiver receives: 1 0 0 1.",
      "4. The 3rd bit was changed, so the message is damaged!",
    ],
    step4_simpleQuestion: {
      question: "If the sender sends a '0' and electrical noise causes a bit flip, what does the receiver see?",
      options: [
        "(Recommended) 1 (the bit flipped to its opposite value)",
        "0 (nothing changed)",
        "An empty blank space",
        "The number 2",
      ],
      answer: 0,
      hint: "Remember: a bit can only be 0 or 1. A flip turns it into the other value.",
      explanation: "Spot on! When a 0 flips, it becomes a 1. When a 1 flips, it becomes a 0.",
    },
    step6_activity: {
      type: 'find_flip',
      prompt: "Glitch attacked the cable! Compare the sent message [1, 0, 1, 1] with the received message below. Click on the damaged bit to spot the error:",
      sent: ['1', '0', '1', '1'],
      received: ['1', '1', '1', '1'],
      corruptedIndex: 1, // 2nd bit
    },
    step7_recap:
      "Noise on wires causes single-bit errors (bit flips). Without an extra check, the receiver cannot tell if the message was changed. That is why we need PARITY!",
    xpReward: 75,
  },
  {
    id: 3,
    title: 'Lesson 3: Understanding Parity',
    tagline: 'Counting the Ones for Balance',
    character: 'professor',
    teacherIntro:
      "Now for my favorite invention: Parity! Parity is a very simple counting game. We count how many 1s are in our data. If we use EVEN parity, the total number of 1s must be an even number like 0, 2, 4, or 6. If the count of 1s is odd, we add a parity bit of 1 to make it even! If it is already even, our parity bit is 0.",
    step1_explain:
      "Parity counts the number of 1s in a message.\n• Even Parity: We add a bit so the total count of 1s is EVEN.\n• Odd Parity: We add a bit so the total count of 1s is ODD.",
    step2_visualExample: {
      type: 'parity_worked_example',
      data: ['1', '0', '1', '1'],
      onesCount: 3,
      evenParityBit: 1,
      totalWithEven: 4,
      oddParityBit: 0,
      totalWithOdd: 3,
      caption: "Data 1011 has THREE 1s. Three is odd! To make it EVEN, our even parity bit must be 1 (making 4 ones in total).",
    },
    step3_demoSteps: [
      "1. Look at data: 1 0 1 1.",
      "2. Count the ones: 1 + 0 + 1 + 1 = 3 ones.",
      "3. Is 3 even? No, 3 is odd!",
      "4. For EVEN parity, add a parity bit = 1 (3 + 1 = 4 ones, which is even!).",
      "5. For ODD parity, 3 is already odd, so parity bit = 0.",
    ],
    step4_simpleQuestion: {
      question: "Suppose data bits are '1 1 0 0'. There are two 1s. For EVEN parity, what should the parity bit be?",
      options: [
        "(Recommended) 0 (because two 1s is already an even number!)",
        "1 (which would make three 1s)",
        "2",
        "It is impossible to tell",
      ],
      answer: 0,
      hint: "Count the 1s: 1 + 1 = 2. Is 2 already an even number?",
      explanation: "Brilliant! Since 2 is already even, we add a 0 so the total stays at 2.",
    },
    step6_activity: {
      type: 'parity_practice',
      prompt: "Let's practise with Professor Parity's Counting Machine! Count the 1s and click the correct Even Parity bit:",
      testCases: [
        { data: ['1', '0', '0', '0'], ones: 1, correctEven: 1, explanation: "1 one is odd -> needs 1 to make 2 (even)!" },
        { data: ['1', '1', '1', '1'], ones: 4, correctEven: 0, explanation: "4 ones is already even -> parity bit is 0!" },
      ],
    },
    step7_recap:
      "A single parity bit can tell if an error occurred (because an odd number of flips breaks the count). But it cannot tell you WHICH bit broke! For that, we need Hamming Code!",
    xpReward: 100,
  },
  {
    id: 4,
    title: 'Lesson 4: Introduction to Hamming Code',
    tagline: 'Why Parity Bits Go to Positions 1, 2, and 4',
    character: 'professor',
    teacherIntro:
      "In 1950, a clever scientist named Richard Hamming asked: 'What if we use MORE than one parity bit?' By using THREE parity bits, we can not only detect an error, but pinpoint the EXACT position that was corrupted! But where do we put them? Hamming placed the parity bits at powers of two: positions 1, 2, and 4! The remaining positions (3, 5, 6, 7) hold our data.",
    step1_explain:
      "Hamming (7,4) code takes 4 data bits and adds 3 parity check bits, making a 7-bit codeword.\n• Parity bits occupy power-of-two positions: 1 (2^0), 2 (2^1), and 4 (2^2).\n• Data bits occupy the other positions: 3, 5, 6, and 7.",
    step2_visualExample: {
      type: 'seven_slot_layout',
      slots: [
        { pos: 1, type: 'P1', isParity: true, color: '#FF777F' },
        { pos: 2, type: 'P2', isParity: true, color: '#84DCFF' },
        { pos: 3, type: 'D1', isParity: false, color: '#A8EBCB' },
        { pos: 4, type: 'P4', isParity: true, color: '#FFDA70' },
        { pos: 5, type: 'D2', isParity: false, color: '#A8EBCB' },
        { pos: 6, type: 'D3', isParity: false, color: '#A8EBCB' },
        { pos: 7, type: 'D4', isParity: false, color: '#A8EBCB' },
      ],
      caption: "Positions 1, 2, and 4 are PARITY SHIELDS. Positions 3, 5, 6, and 7 are DATA BITS.",
    },
    step3_demoSteps: [
      "1. There are 7 total positions in Hamming (7,4).",
      "2. Position 1 = Parity bit P1 (2^0 = 1).",
      "3. Position 2 = Parity bit P2 (2^1 = 2).",
      "4. Position 4 = Parity bit P4 (2^2 = 4).",
      "5. Data bits fill positions 3 (D1), 5 (D2), 6 (D3), and 7 (D4).",
    ],
    step4_simpleQuestion: {
      question: "Which positions in a 7-bit Hamming codeword are reserved for parity bits?",
      options: [
        "(Recommended) Positions 1, 2, and 4 (powers of two)",
        "Positions 1, 2, and 3",
        "Positions 5, 6, and 7",
        "Only Position 7",
      ],
      answer: 0,
      hint: "Remember the powers of two: 1, 2, 4...",
      explanation: "Correct! Parity bits always sit at powers of two: 1, 2, and 4.",
    },
    step6_activity: {
      type: 'identify_roles',
      prompt: "Click on any PARITY position (1, 2, or 4) to activate its protective shield:",
      targetPositions: [1, 2, 4],
    },
    step7_recap:
      "In Hamming (7,4), positions 1, 2, and 4 are parity bits. Positions 3, 5, 6, and 7 are data bits. Next, we will calculate each parity bit!",
    xpReward: 125,
  },
  {
    id: 5,
    title: 'Lesson 5: Hamming(7,4) Encoding',
    tagline: 'Building the Complete 7-Bit Shield',
    character: 'professor',
    teacherIntro:
      "Now let's see how each parity bit protects a specific group of data bits! P1 checks positions 1, 3, 5, 7. P2 checks positions 2, 3, 6, 7. And P4 checks positions 4, 5, 6, 7. Let's encode the data 1-0-1-1 together step by step!",
    step1_explain:
      "Each parity bit is calculated using Even Parity over its assigned group:\n• P1 checks {1, 3, 5, 7} -> checks D1, D2, D4\n• P2 checks {2, 3, 6, 7} -> checks D1, D3, D4\n• P4 checks {4, 5, 6, 7} -> checks D2, D3, D4",
    step2_visualExample: {
      type: 'encoding_worked_example',
      data: '1011',
      p1: 0,
      p2: 1,
      p4: 0,
      finalCodeword: '0110011',
      caption: "For data 1011 (D1=1, D2=0, D3=1, D4=1):\nP1 = 0, P2 = 1, P4 = 0.\nAssembled Codeword: 0 1 1 0 0 1 1.",
    },
    step3_demoSteps: [
      "1. Place data 1011 into positions 3, 5, 6, 7: D1=1, D2=0, D3=1, D4=1.",
      "2. Calculate P1: checks D1(1), D2(0), D4(1) -> two 1s (even) -> P1 = 0.",
      "3. Calculate P2: checks D1(1), D3(1), D4(1) -> three 1s (odd) -> P2 = 1.",
      "4. Calculate P4: checks D2(0), D3(1), D4(1) -> two 1s (even) -> P4 = 0.",
      "5. Put them together in order [P1, P2, D1, P4, D2, D3, D4] = 0110011!",
    ],
    step4_simpleQuestion: {
      question: "Which positions are checked by Parity Bit P1?",
      options: [
        "(Recommended) Positions 1, 3, 5, and 7",
        "Positions 2, 3, 6, and 7",
        "Positions 4, 5, 6, and 7",
        "Positions 1, 2, and 4",
      ],
      answer: 0,
      hint: "Notice that 1, 3, 5, 7 are all odd position numbers (binary ending in 1).",
      explanation: "Exactly! P1 checks positions 1, 3, 5, and 7.",
    },
    step6_activity: {
      type: 'step_by_step_encoder',
      prompt: "Interactive Encoding Activity: Place the calculated parity bits P1=0, P2=1, P4=0 into their slots to assemble the complete codeword 0110011:",
      targetCodeword: '0110011',
    },
    step7_recap:
      "We encoded 4 bits (1011) into a 7-bit codeword (0110011). Now, what happens if Glitch corrupts a bit during transmission? Let's meet the Syndrome Detectives!",
    xpReward: 150,
  },
  {
    id: 6,
    title: 'Lesson 6: Syndrome Calculation',
    tagline: 'The Three Parity Detectives',
    character: 'professor',
    teacherIntro:
      "When the receiver gets the 7 bits, it runs three Parity Detectives called S1, S2, and S4. Each detective checks its group. If the group has even 1s, the detective gives a 0 (All Good!). If the group has odd 1s, an error happened, so the detective gives a 1 (Violation!). When we read their answers in order S4-S2-S1, that binary number gives the EXACT decimal position of the error!",
    step1_explain:
      "The syndrome is formed by reading the three checks in reverse order: S4 S2 S1.\n• S1 checks positions {1, 3, 5, 7}\n• S2 checks positions {2, 3, 6, 7}\n• S4 checks positions {4, 5, 6, 7}\nConverting binary S4 S2 S1 to decimal reveals the corrupted bit!",
    step2_visualExample: {
      type: 'syndrome_worked_example',
      corruptedWord: '0110001', // position 6 flipped
      s1: 0,
      s2: 1,
      s4: 1,
      syndromeBinary: '110',
      syndromeDecimal: 6,
      caption: "Checks report: S1=0, S2=1, S4=1. Read as S4 S2 S1: '1 1 0'. In binary, 110 = 6! That means Position 6 is corrupted!",
    },
    step3_demoSteps: [
      "1. Receiver gets 0110001 (bit 6 was flipped).",
      "2. S1 inspects {1, 3, 5, 7}: bits are 0, 1, 0, 1 (two 1s) -> S1 = 0.",
      "3. S2 inspects {2, 3, 6, 7}: bits are 1, 1, 0, 1 (three 1s) -> S2 = 1 (Error!).",
      "4. S4 inspects {4, 5, 6, 7}: bits are 0, 0, 0, 1 (one 1) -> S4 = 1 (Error!).",
      "5. Read S4 S2 S1 = 1 1 0. Binary 110 = (1*4) + (1*2) + (0*1) = 6! Position 6 is the culprit!",
    ],
    step4_simpleQuestion: {
      question: "If S4 = 0, S2 = 1, and S1 = 1, what is the syndrome in S4 S2 S1 order, and what is its decimal value?",
      options: [
        "(Recommended) Binary 011 = Decimal 3 (Error at Position 3)",
        "Binary 110 = Decimal 6",
        "Binary 000 = Decimal 0 (No error)",
        "Binary 111 = Decimal 7",
      ],
      answer: 0,
      hint: "Read S4 first (0), then S2 (1), then S1 (1) -> 011. Binary 011 = 0*4 + 1*2 + 1*1 = 3.",
      explanation: "Superb! S4 S2 S1 = 011, which equals decimal 3. That points directly to Position 3!",
    },
    step6_activity: {
      type: 'calculate_syndrome_interactive',
      prompt: "Interactive Detective Check: S1=0, S2=1, S4=1. Put S4 S2 S1 together to discover which position is damaged:",
      expectedDecimal: 6,
    },
    step7_recap:
      "Syndrome S4 S2 S1 in binary directly equals the 1-based index of the corrupted bit! If syndrome is 000, no error occurred.",
    xpReward: 175,
  },
  {
    id: 7,
    title: 'Lesson 7: Error Correction',
    tagline: 'Catching Glitch and Restoring the Signal',
    character: 'professor',
    teacherIntro:
      "We are at the final step! Once the syndrome tells us the damaged position, correcting it is delightfully simple: we just flip that single bit back! If it was 0, change it to 1. If it was 1, change it to 0. Then, we take our original 4 data bits from positions 3, 5, 6, and 7. The message is completely restored without asking the sender to resend it!",
    step1_explain:
      "To correct the error:\n1. Find the corrupted bit using the syndrome decimal.\n2. Invert that bit (0 -> 1 or 1 -> 0).\n3. Extract the clean data bits from positions 3, 5, 6, and 7.",
    step2_visualExample: {
      type: 'full_correction_example',
      received: '0110001',
      syndromeDec: 6,
      corrected: '0110011',
      extractedData: '1011',
      caption: "Position 6 was 0. We flip it back to 1. The codeword becomes 0110011. Extracting positions 3, 5, 6, 7 gives original data 1011!",
    },
    step3_demoSteps: [
      "1. Received Word: 0 1 1 0 0 0 1.",
      "2. Syndrome is 6 -> Flip Position 6 from 0 to 1.",
      "3. Corrected Word: 0 1 1 0 0 1 1.",
      "4. Look at data positions:\n   • Pos 3 = 1 (D1)\n   • Pos 5 = 0 (D2)\n   • Pos 6 = 1 (D3)\n   • Pos 7 = 1 (D4).",
      "5. Original Data Recovered: 1 0 1 1! Signal City is saved!",
    ],
    step4_simpleQuestion: {
      question: "After fixing the corrupted bit in a 7-bit codeword, which positions hold the original 4 data bits?",
      options: [
        "(Recommended) Positions 3, 5, 6, and 7",
        "Positions 1, 2, and 4",
        "Positions 1, 2, 3, and 4",
        "Positions 4, 5, 6, and 7",
      ],
      answer: 0,
      hint: "Remember: positions 1, 2, and 4 are parity shields. The rest are data bits!",
      explanation: "You did it! Positions 3, 5, 6, and 7 hold data bits D1, D2, D3, and D4.",
    },
    step6_activity: {
      type: 'interactive_repair',
      prompt: "Fix the corrupted bit! The syndrome points to Position 6. Click on Bit 6 to flip it back and recover the message:",
      damagedCodeword: '0110001',
      targetPos: 6,
    },
    step7_recap:
      "Congratulations, Junior Engineer! You have learned: 1. Bits -> 2. Errors -> 3. Parity -> 4. Hamming positions -> 5. Encoding -> 6. Syndrome -> 7. Error Correction! You are ready to play all the learning games and explore the Virtual Lab!",
    xpReward: 200,
  },
];
