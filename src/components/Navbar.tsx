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
  User
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeMode } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenSearch }) => {
  const { theme, setTheme, watchlist, showToast } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
    { id: 'cinejoy', name: 'Cinejoy Neon', color: '#95FF50', tag: 'Electric Lime' },
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
    { id: 1, title: '🔥 Stree 2 Dual Audio 4K Added', time: '10m ago', unread: true },
    { id: 2, title: '⭐ Solo Leveling Season 2 EP 11 Live', time: '1h ago', unread: true },
    { id: 3, title: '⚡ VidLink Pro Fast Server Optimized', time: '3h ago', unread: false },
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
        background: isScrolled ? 'var(--glass-bg)' : 'var(--header-grad)',
        backdropFilter: isScrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.6)' : 'none',
      }}
    >
      <div 
        style={{ 
          maxWidth: '1480px', 
          margin: '0 auto', 
          padding: '0.75rem 1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        {/* Left: Brand Logo + Primary Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
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
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 18px var(--accent-glow)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Film size={20} color={theme === 'cinejoy' ? '#05080b' : '#ffffff'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
                CINE<span style={{ color: 'var(--accent)', textShadow: '0 0 12px var(--accent-glow)' }}>JOY</span>
              </span>
              <span 
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  marginLeft: '7px',
                  padding: '2px 6px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--badge-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--border-subtle)',
                  letterSpacing: '0.05em'
                }}
              >
                PRO
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            <style>{`
              @media (min-width: 1024px) {
                .desktop-nav { display: flex !important; gap: 0.25rem; align-items: center; }
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
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-subtle)' : 'transparent',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.83rem',
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
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {item.isLive && (
                    <span className="live-pulse" style={{ marginLeft: '2px' }} />
                  )}
                  {item.badgeText && (
                    <span
                      style={{
                        fontSize: '0.62rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'var(--badge-bg)',
                        color: 'var(--accent)',
                        fontWeight: 800,
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {item.badgeText}
                    </span>
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        background: 'var(--accent)',
                        color: 'var(--accent-text)',
                        fontWeight: 800
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

        {/* Center / Right: Quick Search Input + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick Search Trigger Bar */}
          <button
            onClick={onOpenSearch}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.82rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <Search size={15} color="var(--accent)" />
            <span style={{ display: 'none' }} className="search-text">Search movies, 4K hits...</span>
            <kbd 
              style={{
                display: 'none',
                padding: '2px 5px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
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
                background: notificationsOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.45rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              title="Notifications"
            >
              <Bell size={18} />
              <span 
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '7px',
                  height: '7px',
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
                  width: '280px',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  padding: '0.75rem',
                  zIndex: 60,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>3 New</span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      showToast(n.title, 'info');
                      setNotificationsOpen(false);
                    }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      background: n.unread ? 'rgba(255,255,255,0.04)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? 'rgba(255,255,255,0.04)' : 'transparent')}
                  >
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{n.title}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</p>
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
                background: themeDropdownOpen ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
              title="Switch OTT Mirror Theme"
            >
              <Palette size={16} color="var(--accent)" />
              <span style={{ textTransform: 'capitalize', display: 'none' }} className="theme-text">{theme}</span>
              <style>{`
                @media (min-width: 840px) {
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
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  padding: '0.5rem',
                  zIndex: 60,
                }}
              >
                <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Select OTT Skin
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
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: t.color }} />
                      <span>{t.name}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{t.tag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Button */}
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              background: activeTab === 'profile' ? 'var(--accent)' : 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
              color: activeTab === 'profile' ? 'var(--accent-text)' : 'var(--text-primary)',
              border: '1px solid',
              borderColor: activeTab === 'profile' ? 'var(--accent)' : 'var(--border-subtle)',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            title="User Profile & Streaming Preferences"
          >
            <User size={16} />
            <span style={{ display: 'none' }} className="profile-text">Profile</span>
            <style>{`
              @media (min-width: 900px) {
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
              @media (min-width: 1024px) {
                .mobile-menu-btn { display: none !important; }
              }
            `}</style>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(28px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
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
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
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
