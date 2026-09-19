import React from 'react';
import { Home, Bookmark, Bot, Radio, Film, RotateCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenApkModal?: () => void;
  onOpenAiModal?: () => void;
  onOpenSpinWheel?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch,
  onOpenAiModal,
  onOpenSpinWheel
}) => {
  const { watchlist, isDayMode } = useTheme();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'wheel', label: 'Roulette', icon: RotateCw, isWheel: true, isHero: false },
    { id: 'ai', label: 'Ask AI', icon: Bot, isAi: true, isHero: true },
    { id: 'livetv', label: 'Live TV', icon: Radio, isLive: true },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        background: isDayMode ? 'rgba(213, 223, 233, 0.96)' : 'rgba(6, 7, 10, 0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: isDayMode ? '1px solid rgba(255, 255, 255, 0.85)' : '1px solid var(--border-subtle)',
        paddingTop: '0.45rem',
        paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0.65rem))',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: isDayMode ? '0 -10px 25px rgba(15, 23, 42, 0.08)' : '0 -10px 25px rgba(0, 0, 0, 0.7)',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isWheel) {
          return (
            <button
              key={item.id}
              onClick={() => {
                if (onOpenSpinWheel) onOpenSpinWheel();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.18rem',
                color: '#f59e0b',
                fontSize: '0.7rem',
                fontWeight: 800,
                cursor: 'pointer',
                padding: '0.25rem 0.45rem',
                touchAction: 'manipulation',
              }}
            >
              <span style={{ fontSize: '1.15rem' }}>🎡</span>
              <span>Roulette</span>
            </button>
          );
        }

        if (item.isHero) {
          // Elevated Center AI Connoisseur Action Button
          return (
            <button
              key={item.id}
              onClick={() => {
                if (onOpenAiModal) onOpenAiModal();
              }}
              style={{
                background: isDayMode 
                  ? 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)' 
                  : 'linear-gradient(135deg, var(--accent, #95FF50) 0%, #00f0ff 50%, #a855f7 100%)',
                border: isDayMode ? '2px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '999px',
                padding: '0.42rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: isDayMode ? '#ffffff' : '#05080b',
                cursor: 'pointer',
                boxShadow: isDayMode 
                  ? '0 6px 18px rgba(37, 99, 235, 0.35)' 
                  : '0 0 20px var(--accent-glow, rgba(149, 255, 80, 0.6)), 0 4px 14px rgba(0, 0, 0, 0.5)',
                transform: 'translateY(-6px)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                touchAction: 'manipulation',
              }}
            >
              <Bot size={17} color={isDayMode ? '#ffffff' : '#05080b'} />
              <span style={{ fontSize: '0.74rem', fontWeight: 900, letterSpacing: '0.02em' }}>
                Ask AI
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => {
              if (onOpenSearch && item.id === 'search') {
                onOpenSearch();
              } else {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.18rem',
              color: isActive 
                ? (isDayMode ? '#2563eb' : 'var(--accent)') 
                : (isDayMode ? '#64748b' : 'var(--text-secondary)'),
              fontSize: '0.7rem',
              fontWeight: isActive ? 800 : 500,
              cursor: 'pointer',
              position: 'relative',
              padding: '0.25rem 0.45rem',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon 
                size={20} 
                color={
                  isActive 
                    ? (isDayMode ? '#2563eb' : 'var(--accent)') 
                    : (isDayMode ? '#64748b' : 'var(--text-secondary)')
                } 
              />
              {item.isLive && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    boxShadow: '0 0 8px #ef4444',
                    animation: 'pulse 1.2s infinite',
                  }}
                />
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    background: isDayMode ? '#2563eb' : 'var(--accent)',
                    color: isDayMode ? '#ffffff' : 'var(--accent-text)',
                    fontSize: '0.58rem',
                    fontWeight: 900,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
