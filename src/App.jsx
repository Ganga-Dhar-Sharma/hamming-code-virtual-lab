import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Navigation from './components/Navigation.jsx';
import Tour from './components/Tour.jsx';
import HelpModal from './components/HelpModal.jsx';
import AudioCaptionsDock from './components/AudioCaptionsDock.jsx';
import GlossaryPopup from './components/GlossaryPopup.jsx';

import Missions from './pages/Missions.jsx';
import Lab from './pages/Lab.jsx';
import Play from './pages/Play.jsx';
import Library from './pages/Library.jsx';

import { loadProgress, saveProgress, resetProgress, calculateLevel } from './lib/progress.js';
import { audioSystem } from './lib/audio.js';

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [activeTab, setActiveTab] = useState('missions');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Audio system sync
  useEffect(() => {
    audioSystem.setSoundEnabled(progress.soundEnabled);
    audioSystem.setSpeechEnabled(progress.speechEnabled);
  }, [progress.soundEnabled, progress.speechEnabled]);

  // First time onboarding check
  useEffect(() => {
    if (!progress.tourCompleted) {
      setIsTourOpen(true);
    }
  }, []);

  // Award XP
  const handleAwardXP = (amount) => {
    setProgress((prev) => {
      const nextXP = prev.xp + amount;
      const nextLevel = calculateLevel(nextXP);
      if (nextLevel > prev.level) {
        audioSystem.playBadgeUnlocked();
      }
      return {
        ...prev,
        xp: nextXP,
        level: nextLevel,
      };
    });
  };

  // Award Stars
  const handleAwardStars = (amount) => {
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + amount,
    }));
  };

  // Award Badge
  const handleAwardBadge = (badgeId) => {
    setProgress((prev) => {
      const alreadyUnlocked = prev.badges.find((b) => b.id === badgeId && b.unlocked);
      if (alreadyUnlocked) return prev;

      audioSystem.playBadgeUnlocked();
      return {
        ...prev,
        badges: prev.badges.map((b) => (b.id === badgeId ? { ...b, unlocked: true, unlockedAt: Date.now() } : b)),
      };
    });
  };

  // Complete Mission / Lesson
  const handleCompleteMission = (lessonId) => {
    setProgress((prev) => {
      const completed = new Set(prev.completedMissions);
      completed.add(lessonId);

      const unlocked = new Set(prev.unlockedMissions);
      if (lessonId + 1 <= 7) {
        unlocked.add(lessonId + 1);
      }

      return {
        ...prev,
        completedMissions: Array.from(completed),
        unlockedMissions: Array.from(unlocked),
      };
    });
  };

  // Reset Progress
  const handleReset = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    setIsTourOpen(true);
  };

  // Finish Tour
  const handleFinishTour = () => {
    setIsTourOpen(false);
    setProgress((prev) => ({
      ...prev,
      tourCompleted: true,
    }));
  };

  // Audio Toggles
  const handleToggleSound = () => {
    setProgress((prev) => {
      const next = !prev.soundEnabled;
      audioSystem.setSoundEnabled(next);
      if (next) audioSystem.playClick();
      return { ...prev, soundEnabled: next };
    });
  };

  const handleToggleSpeech = () => {
    setProgress((prev) => {
      const next = !prev.speechEnabled;
      audioSystem.setSpeechEnabled(next);
      return { ...prev, speechEnabled: next };
    });
  };

  return (
    <div className="app-container" style={{ paddingBottom: 68 }}>
      {/* Top App Header */}
      <Header
        progress={progress}
        onResetProgress={handleReset}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleSpeech={handleToggleSpeech}
      />

      <div className="app-main-layout">
        {/* Navigation Sidebar / Mobile Bar */}
        <Navigation
          activeTab={activeTab}
          onTabChange={(tabId) => {
            audioSystem.playClick();
            setActiveTab(tabId);
          }}
        />

        {/* Main Content Viewport */}
        <main className="content-viewport">
          {activeTab === 'missions' && (
            <Missions
              progress={progress}
              onCompleteMission={handleCompleteMission}
              onAwardXP={handleAwardXP}
              onAwardBadge={handleAwardBadge}
              onTermClick={setActiveGlossaryTerm}
            />
          )}

          {activeTab === 'lab' && (
            <Lab
              onTermClick={setActiveGlossaryTerm}
              onAwardXP={handleAwardXP}
            />
          )}

          {activeTab === 'play' && (
            <Play
              onAwardXP={handleAwardXP}
              onAwardStars={handleAwardStars}
              onAwardBadge={handleAwardBadge}
            />
          )}

          {activeTab === 'library' && (
            <Library onTermClick={setActiveGlossaryTerm} />
          )}
        </main>
      </div>

      {/* Real-time Subtitles & Voice Audio Controls Dock */}
      <AudioCaptionsDock />

      {/* Persistent Help Desk Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        activeTab={activeTab}
      />

      {/* Guided Tour Modal */}
      <Tour
        isOpen={isTourOpen}
        onFinish={handleFinishTour}
        onTabSelect={(tab) => setActiveTab(tab)}
      />

      {/* Glossary Definition Modal */}
      <GlossaryPopup
        termKey={activeGlossaryTerm}
        onClose={() => setActiveGlossaryTerm(null)}
      />
    </div>
  );
}
