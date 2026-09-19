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
  const { watchlist } = useTheme();

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search', icon: Search, isAction: true },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length },
    { id: 'apk', label: 'Get APK', icon: Smartphone, isApk: true },
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
        background: 'rgba(6, 7, 10, 0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '0.45rem',
        paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0.65rem))',
        paddingLeft: '0.5rem',
        paddingRight: '0.5rem',
        display: 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.7)',
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.isApk && onOpenApkModal) {
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
              color: item.isApk ? 'var(--accent)' : isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontSize: '0.72rem',
              fontWeight: isActive || item.isApk ? 800 : 500,
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
                color={item.isApk ? 'var(--accent)' : isActive ? 'var(--accent)' : 'var(--text-secondary)'} 
              />
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
              {item.isApk && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-10px',
                    background: 'var(--accent)',
                    color: '#000',
                    fontSize: '0.52rem',
                    fontWeight: 900,
                    padding: '1px 3px',
                    borderRadius: '3px',
                  }}
                >
                  FREE
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
