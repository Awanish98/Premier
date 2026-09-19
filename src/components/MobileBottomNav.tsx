import React from 'react';
import { Home, Compass, Bookmark, User, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  const { watchlist } = useTheme();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search, isAction: true },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        background: 'rgba(6, 7, 10, 0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '0.45rem 0.75rem 0.65rem',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.isAction && onOpenSearch) {
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
              gap: '0.2rem',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '0.72rem',
              fontWeight: isActive ? 800 : 500,
              cursor: 'pointer',
              position: 'relative',
              padding: '0.3rem 0.5rem',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} color={isActive ? 'var(--accent)' : 'var(--text-secondary)'} />
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    background: 'var(--accent)',
                    color: '#05080b',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    width: '16px',
                    height: '16px',
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
    </div>
  );
};
