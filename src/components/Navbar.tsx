import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Film, 
  Sparkles, 
  Radio, 
  Search, 
  Bookmark, 
  Palette, 
  Menu, 
  X,
  Flame,
  Disc,
  Compass,
  Bell,
  User,
  Smartphone,
  Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenApkModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onOpenSearch,
  onOpenApkModal 
}) => {
  const { theme, setTheme, watchlist, showToast } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Ctrl+K or Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  const themes: { id: ThemeMode; name: string; color: string; tag: string }[] = [
    { id: 'cinejoy', name: 'Premier Emerald', color: '#95FF50', tag: 'Electric Lime' },
    { id: 'prime', name: 'Prime Video', color: '#00a8e1', tag: 'Navy / Cyan' },
    { id: 'netflix', name: 'Netflix Mirror', color: '#e50914', tag: 'Dark / Red' },
    { id: 'disney', name: 'Disney+ / Hotstar', color: '#0072d2', tag: 'Cobalt / Blue' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', color: '#a855f7', tag: 'Purple Glow' },
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Flame },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tv', label: 'TV Shows', icon: Tv },
    { id: 'dualaudio', label: 'Dual Audio', icon: Sparkles, badgeText: '🇮🇳 DUAL' },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'albums', label: 'Albums', icon: Disc, badgeText: 'NEW' },
    { id: 'anime', label: 'Anime Hub', icon: Sparkles },
    { id: 'livetv', label: 'Live TV', icon: Radio, isLive: true },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, badge: watchlist.length },
  ];

  const notifications = [
    { id: 1, title: '🔥 DC Extended Universe (28 Titles) Added', time: '5m ago', unread: true },
    { id: 2, title: '🦸 Complete MCU Phase 1-5 (46 Titles) Live', time: '20m ago', unread: true },
    { id: 3, title: '⚡ VidLink Pro 4K & AutoEmbed Hindi Active', time: '1h ago', unread: false },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        background: isScrolled ? 'rgba(5, 7, 12, 0.92)' : 'rgba(5, 7, 12, 0.78)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: isScrolled ? '0 12px 35px rgba(0, 0, 0, 0.7)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div 
        style={{ 
          maxWidth: '1520px', 
          margin: '0 auto', 
          padding: '0.65rem clamp(1rem, 2.5vw, 2rem)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: Brand Logo + Primary Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2vw, 2rem)' }}>
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px var(--accent-glow)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Film size={19} color={theme === 'cinejoy' ? '#05080b' : '#ffffff'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
                PREM<span style={{ color: 'var(--accent)', textShadow: '0 0 16px var(--accent-glow)' }}>IER</span>
              </span>
              <span 
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  marginLeft: '6px',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  letterSpacing: '0.06em'
                }}
              >
                4K OTT
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            <style>{`
              @media (min-width: 1080px) {
                .desktop-nav { display: flex !important; gap: 0.2rem; align-items: center; }
              }
            `}</style>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                    border: 'none',
                    position: 'relative',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--accent)' : 'currentColor'} />
                  <span>{item.label}</span>
                  
                  {/* Subtle active glowing underline */}
                  {isActive && (
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '20%',
                        right: '20%',
                        height: '2px',
                        borderRadius: '2px',
                        background: 'var(--accent)',
                        boxShadow: '0 0 8px var(--accent-glow)'
                      }}
                    />
                  )}

                  {item.isLive && (
                    <span className="live-pulse" style={{ marginLeft: '2px' }} />
                  )}

                  {item.badgeText && (
                    <span
                      style={{
                        fontSize: '0.6rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: item.badgeText === 'NEW' ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'rgba(245, 158, 11, 0.2)',
                        color: item.badgeText === 'NEW' ? '#ffffff' : '#fbbf24',
                        fontWeight: 800,
                        border: item.badgeText === 'NEW' ? 'none' : '1px solid rgba(245, 158, 11, 0.4)',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.badgeText}
                    </span>
                  )}

                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '999px',
                        background: 'var(--accent)',
                        color: 'var(--accent-text)',
                        fontWeight: 900
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Quick Search + Notifications + APK + Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Quick Search Trigger Bar */}
          <button
            onClick={onOpenSearch}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.6)',
              padding: '0.42rem 0.85rem',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              fontSize: '0.8rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            <Search size={14} color="var(--accent)" />
            <span style={{ display: 'none' }} className="search-text">Search movies, 4K hits...</span>
            <kbd 
              style={{
                display: 'none',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: '0.65rem',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 600,
                fontFamily: 'monospace'
              }}
              className="search-shortcut"
            >
              Ctrl K
            </kbd>
            <style>{`
              @media (min-width: 640px) {
                .search-text { display: inline !important; }
              }
              @media (min-width: 1200px) {
                .search-shortcut { display: inline !important; }
              }
            `}</style>
          </button>

          {/* Notifications Flyout */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setThemeDropdownOpen(false);
              }}
              style={{
                background: notificationsOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                padding: '0.42rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              title="Notifications"
            >
              <Bell size={16} />
              <span 
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 6px var(--accent-glow)'
                }}
              />
            </button>

            {notificationsOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '290px',
                  borderRadius: '14px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                  padding: '0.85rem',
                  zIndex: 60,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>OTT Updates</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 800, background: 'var(--badge-bg)', padding: '1px 6px', borderRadius: '4px' }}>3 New</span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      showToast(n.title, 'info');
                      setNotificationsOpen(false);
                    }}
                    style={{
                      padding: '0.55rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      background: n.unread ? 'rgba(255,255,255,0.04)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? 'rgba(255,255,255,0.04)' : 'transparent')}
                  >
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{n.title}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Theme Skin Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setNotificationsOpen(false);
              }}
              style={{
                background: themeDropdownOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                padding: '0.42rem 0.65rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
              title="Switch OTT Color Theme"
            >
              <Palette size={15} color="var(--accent)" />
              <span style={{ textTransform: 'capitalize', display: 'none' }} className="theme-text">{theme}</span>
              <style>{`
                @media (min-width: 900px) {
                  .theme-text { display: inline !important; }
                }
              `}</style>
            </button>

            {themeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '210px',
                  borderRadius: '14px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
                  padding: '0.5rem',
                  zIndex: 60,
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Select Theme Skin
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                      showToast(`Switched to ${t.name} Theme`, 'info');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.55rem 0.7rem',
                      borderRadius: '8px',
                      background: theme === t.id ? 'var(--badge-bg)' : 'transparent',
                      color: theme === t.id ? 'var(--accent)' : 'var(--text-primary)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontWeight: theme === t.id ? 700 : 500,
                      marginBottom: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: t.color }} />
                      <span>{t.name}</span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* APK / App Install Trigger Button */}
          {onOpenApkModal && (
            <button
              onClick={onOpenApkModal}
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.18) 0%, rgba(13, 21, 39, 0.7) 100%)',
                color: '#4ade80',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                padding: '0.42rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                boxShadow: '0 0 16px rgba(34, 197, 94, 0.25)',
                transition: 'all 0.2s ease',
              }}
              className="apk-desktop-btn"
              title="Download Android APK & Install App"
            >
              <Smartphone size={15} />
              <span className="apk-btn-text">Get APK</span>
              <span
                style={{
                  fontSize: '0.6rem',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  background: '#22c55e',
                  color: '#05080b',
                  fontWeight: 900,
                }}
              >
                v2.5
              </span>
            </button>
          )}

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: activeTab === 'profile' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'profile' ? 'var(--accent-text)' : 'var(--text-primary)',
              border: '1px solid',
              borderColor: activeTab === 'profile' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
              padding: '0.42rem 0.7rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            title="User Profile & Streaming Preferences"
          >
            <User size={15} />
            <span style={{ display: 'none' }} className="profile-text">Profile</span>
            <style>{`
              @media (min-width: 960px) {
                .profile-text { display: inline !important; }
              }
            `}</style>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
            }}
            className="mobile-menu-btn"
          >
            <style>{`
              @media (min-width: 1080px) {
                .mobile-menu-btn { display: none !important; }
              }
            `}</style>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(5, 7, 12, 0.98)',
            backdropFilter: 'blur(32px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          className="animate-fade-in"
        >
          {/* Featured Mobile APK Install Card */}
          {onOpenApkModal && (
            <div
              onClick={() => {
                onOpenApkModal();
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(13, 21, 39, 0.9) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                marginBottom: '0.4rem',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Smartphone size={18} color="#05080b" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>Download Android APK</span>
                    <span style={{ fontSize: '0.62rem', background: '#22c55e', color: '#000', fontWeight: 900, padding: '1px 4px', borderRadius: '3px' }}>v2.5</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Direct 4K Cinema App Installation</p>
                </div>
              </div>
              <Download size={18} color="#22c55e" />
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  background: isActive ? 'var(--badge-bg)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                  border: 'none',
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={17} />
                  <span>{item.label}</span>
                </div>
                {item.badgeText && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--badge-bg)',
                      color: 'var(--accent)',
                      fontWeight: 800,
                    }}
                  >
                    {item.badgeText}
                  </span>
                )}
                {item.isLive && <span className="live-pulse" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
