/**
 * LocalStorage state management for Bit Busters Virtual Lab
 */

const STORAGE_KEY = 'bit_busters_progress_v2';

export const INITIAL_BADGES = [
  { id: 'bit_beginner', name: 'Bit Beginner', desc: 'Completed Lesson 1: Understanding Bits', icon: '⚡', unlocked: false },
  { id: 'parity_apprentice', name: 'Parity Apprentice', desc: 'Mastered Even & Odd Parity in Lesson 3', icon: '⚖️', unlocked: false },
  { id: 'shield_builder', name: 'Shield Builder', desc: 'Built a 7-bit Hamming codeword in Lesson 5', icon: '🛡️', unlocked: false },
  { id: 'error_detective', name: 'Error Detective', desc: 'Calculated syndromes in Lesson 6', icon: '🔍', unlocked: false },
  { id: 'syndrome_master', name: 'Syndrome Master', desc: 'Solved 10 syndromes in Syndrome Detective', icon: '🧠', unlocked: false },
  { id: 'signal_city_hero', name: 'Signal City Hero', desc: 'Restored the signal grid in Lesson 7', icon: '🌆', unlocked: false },
  { id: 'master_of_hamming', name: 'Master of Hamming Code', desc: 'Completed all 7 lessons and quiz challenges', icon: '👑', unlocked: false },
];

const DEFAULT_STATE = {
  xp: 0,
  stars: 0,
  level: 1,
  completedMissions: [],
  unlockedMissions: [1], // Lesson 1 unlocked by default
  badges: INITIAL_BADGES,
  tourCompleted: false,
  soundEnabled: true,
  speechEnabled: true, // Enabled by default so Listen button speaks immediately!
  speechRate: 1.0,
  streak: 0,
  quizStats: {
    totalAnswered: 0,
    correctCount: 0,
  },
};

export function loadProgress() {
  try {
    // Check v2 key first, then fallback to v1 migration
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = localStorage.getItem('bit_busters_progress_v1');
    }
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      soundEnabled: true,
      speechEnabled: true, // Always ensure speech is enabled for beginner-first experience
      unlockedMissions: parsed.unlockedMissions && parsed.unlockedMissions.includes(1) ? parsed.unlockedMissions : [1],
      badges: INITIAL_BADGES.map((b) => {
        const existing = (parsed.badges || []).find((eb) => eb.id === b.id);
        return existing ? { ...b, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt } : b;
      }),
    };
  } catch (err) {
    console.error('Failed to load progress from localStorage:', err);
    return DEFAULT_STATE;
  }
}

export function saveProgress(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('bit_busters_progress_v1');
  } catch (err) {
    console.error('Failed to reset progress:', err);
  }
  return DEFAULT_STATE;
}

export function calculateLevel(xp) {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 850) return 4;
  if (xp < 1300) return 5;
  return Math.floor(xp / 300) + 2;
}
