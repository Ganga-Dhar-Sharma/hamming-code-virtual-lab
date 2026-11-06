# ⚡ BIT BUSTERS 2.0 — BEGINNER-FIRST LEARNING EXPERIENCE
> **"Catch the error. Crack the code. Save the signal!"**  
> An animated, interactive Hamming Code Virtual Laboratory & Personal Teacher Adventure.

---

## 🌆 What's New in Bit Busters 2.0

Bit Busters 2.0 is redesigned from the ground up for **absolute beginners**:

1. **Personal Teacher System**:
   - **Professor Parity** personally teaches every concept in plain, friendly conversational English.
   - **Byte** acts as your encouraging assistant with visual diagrams and tips.
   - **Glitch** is the mischievous gremlin who creates errors on the wire.
   - **Packet Pals** represent animated binary packets hopping through cables.
   - **Persistent HELP Button**: Always accessible at the top header with contextual beginner tips, "Explain Like I'm 5" guides, and spoken advice.

2. **All Characters Speak (Full Web Speech API Narration)**:
   - Real-time character speech with natural conversational scripts.
   - **Audio Controls**: Play, Pause, Resume, and Stop buttons beside every character and inside the bottom dock.
   - **Real-Time Captions Dock**: Docked subtitles bar at the bottom showing live speech text, speaking status, and character identity.
   - **Voice Selection & Speed**: Choose from available browser English voices and adjust speed (0.8x, 1.0x, 1.2x).
   - **No Overlapping Speech**: Automatically cancels previous utterances before speaking new text.
   - **Works on Windows Chrome & Edge**: Graceful fallback if speech synthesis is disabled or unavailable.

3. **7 Beginner-First Lessons (Teaching from Absolute Zero)**:
   Every lesson strictly follows the 7-step pedagogical sequence:
   1. *Explain in simple English*
   2. *Show a visual example*
   3. *Demonstrate step by step*
   4. *Ask one very simple check question*
   5. *Give encouraging feedback*
   6. *Try an interactive hands-on activity*
   7. *Summarize what was learned*
   - **Lesson 1: Understanding Bits** (0 and 1, 4-bit packets).
   - **Lesson 2: Transmission Errors** (Bit flips, noise on the wire, why 1 bit matters).
   - **Lesson 3: Understanding Parity** (Counting 1s, Even vs. Odd parity rule).
   - **Lesson 4: Introduction to Hamming Code** (Why 1 parity bit isn't enough, placing parity at powers-of-two positions 1, 2, 4).
   - **Lesson 5: Hamming (7,4) Encoding** (Assigning data to 3, 5, 6, 7; calculating P1, P2, P4 step by step).
   - **Lesson 6: Syndrome Calculation** (Detectives S1, S2, S4, reading S4 S2 S1 as binary, converting to decimal).
   - **Lesson 7: Error Correction** (Locating the corrupted bit, inverting it back, recovering original 4 data bits).

4. **Redesigned Beginner Games (5 Games + 3 Modes)**:
   - **Dedicated Instruction Screen** before any game begins (Objective, What to click, How it works, What success looks like, Small worked example, and Professor Parity voice introduction).
   - **3 Modes**:
     1. *Learning Mode* (Interactive tutorial, step-by-step guidance, unlimited retries, no timers).
     2. *Practice Mode* (Self-guided play with hints).
     3. *Challenge Mode* (Score points and earn stars).
   - **5 Games**:
     - *Game A: Catch the Bit Flip* (Find the changed bit on the wire).
     - *Game B: Feed the Parity Machine* (Count 1s and supply Even/Odd parity bit).
     - *Game C: Build the Codeword* (Place data bits and calculate parity shields).
     - *Game D: Stop Glitch* (Detect & repair corrupted bit in transmission).
     - *Game E: Syndrome Detective* (Solve S1, S2, S4 checks and crack the error position).
   - Clear **Restart Game** button on every single game screen.

5. **Guided Experiment in the Virtual Lab**:
   - **Guided Mode**: A 5-step walkthrough with a 4-box pedagogical card on every step:
     - 🔍 *What is happening?*
     - 💡 *Why is it happening?*
     - 👉 *What should I do?*
     - 🎯 *What result should I expect?*
   - **Expert Mode**: Free playground with full access to Encoder, Transmission, Detector, and Full Workflow.

---

## 🛠️ Running the Application

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Run Automated Tests
```bash
npm test
```
All 8 test suites pass with 224 exhaustive cases tested.

### Production Build
```bash
npm run build
```
Generates the static distribution bundle in `dist/`.
