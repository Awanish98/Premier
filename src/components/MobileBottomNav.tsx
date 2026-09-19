import React from 'react';
import { Home, Compass, Bookmark, Search, Smartphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenApkModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch,
  onOpenApkModal 
}) => {
  const { watchlist, isDayMode } = useTheme();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search, isAction: true },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length },
    { id: 'install', label: 'Install App', icon: Smartphone, isInstall: true },
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
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.isInstall && onOpenApkModal) {
                onOpenApkModal();
              } else if (item.isAction && onOpenSearch) {
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
              color: item.isInstall ? 'var(--accent)' : isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '0.72rem',
              fontWeight: isActive || item.isInstall ? 800 : 500,
              cursor: 'pointer',
              position: 'relative',
              padding: '0.3rem 0.5rem',
              transition: 'all 0.2s ease',
              touchAction: 'manipulation',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon 
                size={20} 
                color={item.isInstall ? 'var(--accent)' : isActive ? 'var(--accent)' : 'var(--text-secondary)'} 
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    background: 'var(--accent)',
                    color: 'var(--accent-text)',
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
              {item.isInstall && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    background: 'var(--accent)',
                    color: 'var(--accent-text)',
                    fontSize: '0.52rem',
                    fontWeight: 900,
                    padding: '1px 3px',
                    borderRadius: '3px',
                  }}
                >
                  PWA
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
