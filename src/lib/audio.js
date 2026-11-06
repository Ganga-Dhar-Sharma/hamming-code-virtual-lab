/**
 * Web Audio API synthesizer + Full Web Speech API character voice system
 * 
 * Fixes for Chrome/Edge on Windows:
 * 1. Force unmute on explicit user Listen action so speech is never blocked by default mute
 * 2. Asynchronous cancel-speak buffer (25ms) to prevent Chrome's cancel collision bug
 * 3. Strong reference retention (window.__activeUtterances) to prevent Chrome V8 garbage-collection bug
 * 4. Automatic speech queue resume if browser is in paused state
 * 5. Robust multi-fallback voice selection matching natural English voices
 * 6. Live diagnostic status: 'Voice ready' | 'Speaking' | 'Paused' | 'Finished' | 'Speech error'
 */

class SoundSystem {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
    this.speechRate = 1.0;
    this.selectedVoiceURI = null;
    this.availableVoices = [];

    this.currentUtterance = null;
    this.speakingState = 'idle'; // 'idle' | 'playing' | 'paused'
    this.diagnosticStatus = 'Voice ready'; // 'Voice ready' | 'Speaking' | 'Paused' | 'Finished' | 'Speech error'
    this.lastError = '';
    this.currentText = "Hello! I am Professor Parity. Welcome to Bit Busters. Let's learn Hamming Code together.";
    this.currentCharacter = 'professor';

    this.listeners = new Set();
    this.captionListeners = new Set();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      // Use both addEventListener and property assignment for maximum cross-browser reliability
      window.speechSynthesis.addEventListener('voiceschanged', () => this.initVoices());
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      this.availableVoices = voices;
      this.diagnosticStatus = this.speakingState === 'playing' ? 'Speaking' : 'Voice ready';
      this.notifyListeners();
    }
  }

  ensureVoices() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        this.availableVoices = voices;
      }
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Emit initial state immediately
    listener({
      speakingState: this.speakingState,
      diagnosticStatus: this.diagnosticStatus,
      lastError: this.lastError,
      currentCharacter: this.currentCharacter,
      currentText: this.currentText,
      speechRate: this.speechRate,
      speechEnabled: this.speechEnabled,
      soundEnabled: this.soundEnabled,
      availableVoices: this.availableVoices,
      selectedVoiceURI: this.selectedVoiceURI,
    });
    return () => this.listeners.delete(listener);
  }

  subscribeCaptions(listener) {
    this.captionListeners.add(listener);
    return () => this.captionListeners.delete(listener);
  }

  notifyListeners() {
    const payload = {
      speakingState: this.speakingState,
      diagnosticStatus: this.diagnosticStatus,
      lastError: this.lastError,
      currentCharacter: this.currentCharacter,
      currentText: this.currentText,
      speechRate: this.speechRate,
      speechEnabled: this.speechEnabled,
      soundEnabled: this.soundEnabled,
      availableVoices: this.availableVoices,
      selectedVoiceURI: this.selectedVoiceURI,
    };
    this.listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  broadcastCaption(text, character) {
    this.captionListeners.forEach((fn) => {
      try {
        fn(text, character);
      } catch (err) {
        console.error('Caption listener error:', err);
      }
    });
  }

  initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = !!enabled;
    if (this.soundEnabled) this.initAudio();
    this.notifyListeners();
  }

  setSpeechEnabled(enabled) {
    this.speechEnabled = !!enabled;
    if (!this.speechEnabled) {
      this.stopSpeech();
    }
    this.notifyListeners();
  }

  setSpeechRate(rate) {
    this.speechRate = Math.max(0.5, Math.min(2.0, Number(rate) || 1.0));
    this.notifyListeners();
  }

  setSelectedVoiceURI(uri) {
    this.selectedVoiceURI = uri;
    this.notifyListeners();
  }

  /* ---------------- Procedural Sound Effects ---------------- */
  playTone(freq, type = 'sine', duration = 0.1, delay = 0, gainValue = 0.15) {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(gainValue, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playBitFlip() {
    this.playTone(520, 'square', 0.05, 0, 0.12);
    this.playTone(840, 'triangle', 0.06, 0.03, 0.14);
  }

  playClick() {
    this.playTone(420, 'sine', 0.03, 0, 0.08);
  }

  playCorrect() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.15, idx * 0.07, 0.15);
    });
  }

  playIncorrect() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playBadgeUnlocked() {
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, idx * 0.1, 0.18);
    });
  }

  playMissionCompleted() {
    const notes = [587.33, 739.99, 880.00, 1174.66, 1479.98];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.3, idx * 0.08, 0.14);
    });
  }

  /* ---------------- Voice Selection Helper ---------------- */
  pickBestVoice(character = 'professor') {
    this.ensureVoices();
    const voices = this.availableVoices;
    if (!voices || voices.length === 0) return null;

    if (this.selectedVoiceURI) {
      const match = voices.find((v) => v.voiceURI === this.selectedVoiceURI);
      if (match) return match;
    }

    const enVoices = voices.filter(
      (v) => v.lang && (v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().includes('en'))
    );
    const pool = enVoices.length > 0 ? enVoices : voices;

    const charLower = (character || '').toLowerCase();
    const isProf = charLower.includes('professor');
    const isByte = charLower.includes('byte');
    const isGlitch = charLower.includes('glitch');

    if (isProf) {
      // Prefer warm, clear, male or natural teacher voices on Windows/Edge/Chrome
      const profVoice = pool.find((v) =>
        /david|guy|george|mark|male|richard|natural/i.test(v.name)
      );
      return profVoice || pool[0];
    } else if (isByte) {
      // Prefer friendly, crisp assistant voices
      const byteVoice = pool.find((v) =>
        /zira|jenny|female|samantha|aria/i.test(v.name)
      );
      return byteVoice || pool[1] || pool[0];
    } else if (isGlitch) {
      const glitchVoice = pool.find((v) =>
        /steffan|roger|junior|child|quirky/i.test(v.name)
      );
      return glitchVoice || pool[pool.length - 1] || pool[0];
    }

    return pool[0];
  }

  /* ---------------- Robust Web Speech Synthesis ---------------- */
  speak(text, character = 'professor', onDone = null, forceUnmute = false) {
    if (!text) {
      console.warn('[AudioSystem] speak() called with empty text.');
      return;
    }

    // If student explicitly requested speech (e.g. clicked Listen button), force enable speech
    if (forceUnmute && !this.speechEnabled) {
      this.speechEnabled = true;
      this.notifyListeners();
    }

    // Broadcast caption immediately so student sees subtitle text
    this.broadcastCaption(text, character);

    if (!this.speechEnabled) {
      this.speakingState = 'idle';
      this.diagnosticStatus = 'Voice ready';
      this.currentText = text;
      this.currentCharacter = character;
      this.notifyListeners();
      if (onDone) onDone();
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('[AudioSystem] window.speechSynthesis is not available in this browser.');
      this.speakingState = 'idle';
      this.diagnosticStatus = 'Speech error';
      this.lastError = 'Web Speech API is not supported in this browser.';
      this.notifyListeners();
      if (onDone) onDone();
      return;
    }

    this.ensureVoices();

    // Cancel any previous utterance to avoid overlap and clear queue
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (e) {
      console.warn('[AudioSystem] Error clearing previous speech:', e);
    }

    // Clean text of markdown characters
    const cleanSpeechText = String(text)
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanSpeechText) {
      if (onDone) onDone();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    this.currentUtterance = utterance;
    this.currentText = text;
    this.currentCharacter = character;
    this.diagnosticStatus = 'Speaking';
    this.lastError = '';

    // Fix for Chrome V8 Garbage Collection Bug: Keep a strong global reference
    if (typeof window !== 'undefined') {
      if (!window.__activeUtterances) {
        window.__activeUtterances = new Set();
      }
      window.__activeUtterances.add(utterance);
    }

    // Character profiles
    let basePitch = 1.0;
    let baseRate = 1.0;
    const charLower = character.toLowerCase();

    if (charLower.includes('professor')) {
      basePitch = 0.95; // Warm, steady, friendly teacher
      baseRate = 0.95;
    } else if (charLower.includes('byte')) {
      basePitch = 1.25; // Cheerful assistant robot
      baseRate = 1.05;
    } else if (charLower.includes('glitch')) {
      basePitch = 1.45; // Impish, quick gremlin
      baseRate = 1.15;
    } else if (charLower.includes('pal')) {
      basePitch = 1.35;
      baseRate = 1.1;
    }

    utterance.pitch = basePitch;
    utterance.rate = Math.max(0.5, Math.min(2.0, baseRate * this.speechRate));
    utterance.volume = 1.0; // Ensure full volume

    const selectedVoice = this.pickBestVoice(character);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || 'en-US';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      this.speakingState = 'playing';
      this.diagnosticStatus = 'Speaking';
      this.notifyListeners();
    };

    utterance.onpause = () => {
      this.speakingState = 'paused';
      this.diagnosticStatus = 'Paused';
      this.notifyListeners();
    };

    utterance.onresume = () => {
      this.speakingState = 'playing';
      this.diagnosticStatus = 'Speaking';
      this.notifyListeners();
    };

    utterance.onend = () => {
      this.speakingState = 'idle';
      this.diagnosticStatus = 'Finished';
      if (typeof window !== 'undefined' && window.__activeUtterances) {
        window.__activeUtterances.delete(utterance);
      }
      this.notifyListeners();
      if (onDone) onDone();
    };

    utterance.onerror = (err) => {
      if (err.error === 'canceled' || err.error === 'interrupted') {
        // Canceled deliberately because another speech started or stop was pressed
        this.speakingState = 'idle';
        this.diagnosticStatus = 'Finished';
      } else {
        console.warn('[AudioSystem] SpeechSynthesis error:', err);
        this.speakingState = 'idle';
        this.diagnosticStatus = 'Speech error';
        this.lastError = err.error ? `Error: ${err.error}` : 'Speech playback error';
      }
      if (typeof window !== 'undefined' && window.__activeUtterances) {
        window.__activeUtterances.delete(utterance);
      }
      this.notifyListeners();
      if (onDone) onDone();
    };

    // Chrome Windows Fix: Dispatch speak inside a short 25ms timer to allow cancel() IPC to finalize
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('[AudioSystem] speechSynthesis.speak failed:', err);
        this.speakingState = 'idle';
        this.diagnosticStatus = 'Speech error';
        this.lastError = err.message || 'Speak execution failed';
        this.notifyListeners();
        if (onDone) onDone();
      }
    }, 25);
  }

  pauseSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.pause();
        this.speakingState = 'paused';
        this.diagnosticStatus = 'Paused';
        this.notifyListeners();
      } catch (e) {
        console.warn('Error pausing speech:', e);
      }
    }
  }

  resumeSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.resume();
        this.speakingState = 'playing';
        this.diagnosticStatus = 'Speaking';
        this.notifyListeners();
      } catch (e) {
        console.warn('Error resuming speech:', e);
      }
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        this.speakingState = 'idle';
        this.diagnosticStatus = 'Finished';
        this.notifyListeners();
      } catch (e) {
        console.warn('Error stopping speech:', e);
      }
    }
  }
}

export const audioSystem = new SoundSystem();
