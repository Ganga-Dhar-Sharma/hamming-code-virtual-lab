import React from 'react';

/**
 * 4 Main Tabs Navigation
 * 1. MISSIONS
 * 2. LAB
 * 3. PLAY
 * 4. LIBRARY
 */
export default function Navigation({ activeTab = 'missions', onTabChange }) {
  const tabs = [
    { id: 'missions', label: 'MISSIONS', icon: '🚀', desc: 'Campaign' },
    { id: 'lab', label: 'LAB', icon: '🧪', desc: 'Hamming Tools' },
    { id: 'play', label: 'PLAY', icon: '🎮', desc: 'Mini-Games & Arena' },
    { id: 'library', label: 'LIBRARY', icon: '📚', desc: 'Exam Notes & Glossary' },
  ];

  return (
    <>
      {/* Desktop Slim Sidebar */}
      <aside className="side-nav">
        <div style={{ marginBottom: 12, paddingLeft: 4 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 900,
              color: '#56587A',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Navigation
          </span>
        </div>

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                justifyContent: 'flex-start',
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{tab.icon}</span>
              <div>
                <div style={{ fontSize: '0.98rem', fontWeight: 900, color: '#25264F' }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#56587A' }}>
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span style={{ fontSize: '1.3rem' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
