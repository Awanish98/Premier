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
  Sun,
  Moon,
  ChevronDown,
  Check,
  Minimize2,
  Maximize2,
  Layers
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
  const { theme, setTheme, isDayMode, toggleDayNight, watchlist, showToast } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isCapsuleCollapsed, setIsCapsuleCollapsed] = useState(false);
  const [collapsedDropdownOpen, setCollapsedDropdownOpen] = useState(false);

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
    { id: 'day', name: 'Flix Daylight', color: '#d5dfe9', tag: 'Frosted Silk' },
    { id: 'night', name: 'Flix Obsidian', color: '#06070a', tag: 'Deep Cinema' },
    { id: 'cinejoy', name: 'Premier Emerald', color: '#95FF50', tag: 'Electric Lime' },
    { id: 'prime', name: 'Prime Video', color: '#00a8e1', tag: 'Navy / Cyan' },
    { id: 'netflix', name: 'Netflix Red', color: '#e50914', tag: 'Dark / Red' },
    { id: 'disney', name: 'Disney+ / Hotstar', color: '#0072d2', tag: 'Cobalt / Blue' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', color: '#a855f7', tag: 'Purple Glow' },
  ];

  const notifications = [
    { id: 1, title: '🔥 Animation Spotlight: 12 New 4K Hits Added', time: '5m ago', unread: true },
    { id: 2, title: '🦸 Complete MCU Phase 1-5 (46 Titles) Live', time: '20m ago', unread: true },
    { id: 3, title: '⚡ VidLink Pro 4K & AutoEmbed Hindi Active', time: '1h ago', unread: false },
  ];

  const primaryTabs = [
    { id: 'home', label: 'Home', icon: Flame },
    { id: 'movies', label: 'Movie', icon: Film },
    { id: 'tv', label: 'Series', icon: Tv },
    { id: 'albums', label: 'Originals', icon: Disc },
    { id: 'livetv', label: 'Live TV', icon: Radio, isLive: true },
  ];

  const secondaryTabs = [
    { id: 'dualaudio', label: 'Dual Audio', icon: Sparkles, badge: '🇮🇳 DUAL' },
    { id: 'anime', label: 'Anime Universe', icon: Sparkles, badge: '4K' },
    { id: 'discover', label: 'Discover Radar', icon: Compass },
    { id: 'watchlist', label: `My Watchlist (${watchlist.length})`, icon: Bookmark },
  ];

  const getActiveTabLabel = () => {
    const allTabs = [...primaryTabs, ...secondaryTabs];
    const found = allTabs.find((t) => t.id === activeTab);
    return found ? found.label : 'Menu';
  };

  const isSecondaryActive = secondaryTabs.some((t) => t.id === activeTab);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        background: isDayMode
          ? isScrolled ? 'rgba(213, 223, 233, 0.94)' : 'rgba(213, 223, 233, 0.82)'
          : isScrolled ? 'rgba(6, 7, 10, 0.94)' : 'rgba(6, 7, 10, 0.8)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: isDayMode
          ? '1px solid rgba(255, 255, 255, 0.85)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isDayMode
          ? '0 10px 30px rgba(15, 23, 42, 0.08)'
          : '0 10px 35px rgba(0, 0, 0, 0.7)',
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
        {/* Left: Brand Logo (Flix.id style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
                background: isDayMode
                  ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)'
                  : 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isDayMode ? '0 4px 14px rgba(15, 23, 42, 0.2)' : '0 0 20px var(--accent-glow)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Film size={19} color={isDayMode ? '#ffffff' : (theme === 'cinejoy' ? '#05080b' : '#ffffff')} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span 
                style={{ 
                  fontSize: '1.45rem', 
                  fontWeight: 900, 
                  letterSpacing: '-0.03em', 
                  color: isDayMode ? '#0f172a' : '#ffffff',
                }}
              >
                Flix<span style={{ color: isDayMode ? '#2563eb' : 'var(--accent)' }}>.id</span>
              </span>
              <span 
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  marginLeft: '6px',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  backgroundColor: isDayMode ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                  color: isDayMode ? '#0f172a' : 'var(--accent)',
                  border: isDayMode ? '1px solid rgba(15, 23, 42, 0.15)' : '1px solid rgba(255, 255, 255, 0.1)',
                  letterSpacing: '0.06em'
                }}
              >
                PREMIER
              </span>
            </div>
          </div>
        </div>

        {/* Center: Flix.id Morphing Collapsible Capsule Navigation */}
        <div style={{ display: 'none' }} className="desktop-capsule-nav">
          <style>{`
            @media (min-width: 960px) {
              .desktop-capsule-nav { display: block !important; }
            }
          `}</style>
          
          {isCapsuleCollapsed ? (
            /* Collapsed Dynamic Island Pill */
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setCollapsedDropdownOpen((prev) => !prev)}
                className="flix-collapsed-island"
                title="Click to open menu or expand"
              >
                <Layers size={16} color={isDayMode ? '#2563eb' : 'var(--accent)'} />
                <span style={{ fontSize: '0.84rem', fontWeight: 800 }}>
                  {getActiveTabLabel()}
                </span>
                <ChevronDown size={14} style={{ opacity: 0.7 }} />
                
                {/* Expand Pill Action */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCapsuleCollapsed(false);
                    setCollapsedDropdownOpen(false);
                  }}
                  style={{
                    marginLeft: '0.25rem',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                  title="Expand Navigation Dock"
                >
                  <Maximize2 size={10} />
                  <span>Expand</span>
                </div>
              </button>

              {/* Collapsed Menu Popover */}
              {collapsedDropdownOpen && (
                <div className="flix-dropdown-panel" style={{ width: '220px', left: '50%', transform: 'translateX(-50%)' }}>
                  <div style={{ padding: '0.35rem 0.55rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Quick Navigation
                  </div>
                  {[...primaryTabs, ...secondaryTabs].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setCollapsedDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.55rem 0.75rem',
                          borderRadius: '10px',
                          background: isActive ? 'var(--accent)' : 'transparent',
                          color: isActive ? 'var(--accent-text)' : 'var(--text-primary)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 800 : 600,
                          marginBottom: '2px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                          <Icon size={15} />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Expanded Full Capsule Bar */
            <div className="flix-capsule-bar">
              {primaryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flix-capsule-item ${isActive ? 'active' : ''}`}
                  >
                    <span>{tab.label}</span>
                    {tab.isLive && (
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          boxShadow: '0 0 6px #ef4444',
                        }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Expandable More Menu Button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMoreMenuOpen((prev) => !prev)}
                  className={`flix-capsule-item ${isSecondaryActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    paddingRight: '0.75rem',
                  }}
                  title="More Categories & Watchlist"
                >
                  <span>More</span>
                  <ChevronDown size={13} style={{ transform: moreMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>

                {/* More Dropdown Menu */}
                {moreMenuOpen && (
                  <div className="flix-dropdown-panel" style={{ width: '230px', right: 0 }}>
                    <div style={{ padding: '0.35rem 0.55rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Additional Hubs
                    </div>
                    {secondaryTabs.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMoreMenuOpen(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.55rem 0.75rem',
                            borderRadius: '10px',
                            background: isActive ? 'var(--accent)' : 'transparent',
                            color: isActive ? 'var(--accent-text)' : 'var(--text-primary)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 800 : 600,
                            marginBottom: '2px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            <Icon size={15} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '0.62rem',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                fontWeight: 800,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Search Capsule Button */}
              <button
                onClick={onOpenSearch}
                className="flix-capsule-item"
                style={{ padding: '0.42rem 0.65rem' }}
                title="Search (Ctrl + K)"
              >
                <Search size={15} />
              </button>

              {/* Collapse to Island Toggle Button */}
              <button
                onClick={() => setIsCapsuleCollapsed(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '0.35rem 0.45rem',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)')}
                title="Collapse to Compact Island Mode"
              >
                <Minimize2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Day/Night Switch + Notifications + Profile Avatar Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          
          {/* Day / Night Mode 1-Click Instant Switch */}
          <button
            onClick={toggleDayNight}
            style={{
              background: isDayMode ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              border: isDayMode ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.15)',
              color: isDayMode ? '#0f172a' : '#ffffff',
              padding: '0.42rem 0.8rem',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              boxShadow: isDayMode ? '0 4px 14px rgba(15, 23, 42, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={isDayMode ? 'Switch to Night Mode (Velvet Obsidian)' : 'Switch to Day Mode (Frosted Slate)'}
          >
            {isDayMode ? (
              <>
                <Sun size={15} color="#f59e0b" fill="#f59e0b" />
                <span>Day</span>
              </>
            ) : (
              <>
                <Moon size={15} color="#38bdf8" fill="#38bdf8" />
                <span>Night</span>
              </>
            )}
          </button>

          {/* Notifications Flyout */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setThemeDropdownOpen(false);
                setProfileMenuOpen(false);
                setMoreMenuOpen(false);
              }}
              style={{
                background: isDayMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.08)',
                border: isDayMode ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isDayMode ? '#0f172a' : '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
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
                  top: '2px',
                  right: '2px',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '999px',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px',
                }}
              >
                8
              </span>
            </button>

            {notificationsOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.65rem',
                  width: '300px',
                  borderRadius: '16px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  padding: '0.9rem',
                  zIndex: 60,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>Flix Updates</span>
                  <span style={{ fontSize: '0.68rem', color: isDayMode ? '#ffffff' : 'var(--accent-text)', fontWeight: 800, background: isDayMode ? '#0f172a' : 'var(--accent)', padding: '1px 6px', borderRadius: '4px' }}>8 New</span>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      showToast(n.title, 'info');
                      setNotificationsOpen(false);
                    }}
                    style={{
                      padding: '0.6rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      marginBottom: '4px',
                      background: n.unread ? (isDayMode ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255,255,255,0.06)') : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = isDayMode ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255,255,255,0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.unread ? (isDayMode ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255,255,255,0.06)') : 'transparent')}
                  >
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>{n.title}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar Pill (Flix.id style) */}
          <div style={{ position: 'relative', display: 'none' }} className="desktop-profile-pill">
            <style>{`
              @media (min-width: 640px) {
                .desktop-profile-pill { display: block !important; }
              }
            `}</style>
            <div
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotificationsOpen(false);
                setThemeDropdownOpen(false);
                setMoreMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.32rem 0.75rem 0.32rem 0.35rem',
                borderRadius: '999px',
                background: isDayMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.08)',
                border: isDayMode ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Sarah J"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Sarah J
                </span>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: isDayMode ? '#2563eb' : 'var(--accent)' }}>
                  Premium
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            {profileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.65rem',
                  width: '220px',
                  borderRadius: '16px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  padding: '0.65rem',
                  zIndex: 60,
                }}
              >
                <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>Sarah Jenkins</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>sarah.ott@premier.io</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <User size={15} /> Account Settings
                </button>
                <button
                  onClick={() => {
                    setActiveTab('watchlist');
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Bookmark size={15} /> My Watchlist ({watchlist.length})
                </button>
              </div>
            )}
          </div>

          {/* Theme Skin Dropdown (Optional Advanced Skins) */}
          <div style={{ position: 'relative', display: 'none' }} className="desktop-skin-picker">
            <style>{`
              @media (min-width: 1200px) {
                .desktop-skin-picker { display: block !important; }
              }
            `}</style>
            <button
              onClick={() => {
                setThemeDropdownOpen(!themeDropdownOpen);
                setNotificationsOpen(false);
                setProfileMenuOpen(false);
                setMoreMenuOpen(false);
              }}
              style={{
                background: isDayMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.08)',
                border: isDayMode ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isDayMode ? '#0f172a' : '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Theme Presets"
            >
              <Palette size={16} />
            </button>

            {themeDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.65rem',
                  width: '210px',
                  borderRadius: '16px',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(28px)',
                  WebkitBackdropFilter: 'blur(28px)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
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
                      color: theme === t.id ? (isDayMode ? '#0f172a' : 'var(--accent)') : 'var(--text-primary)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontWeight: theme === t.id ? 800 : 500,
                      marginBottom: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: t.color }} />
                      <span>{t.name}</span>
                    </div>
                    {theme === t.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA App Install Button */}
          {onOpenApkModal && (
            <button
              onClick={onOpenApkModal}
              style={{
                background: isDayMode ? '#0f172a' : 'rgba(149, 255, 80, 0.15)',
                color: isDayMode ? '#ffffff' : 'var(--accent)',
                border: isDayMode ? '1px solid #0f172a' : '1px solid var(--accent)',
                padding: '0.42rem 0.8rem',
                borderRadius: '999px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                transition: 'all 0.2s ease',
              }}
              className="pwa-install-pill"
              title="Install Web App"
            >
              <style>{`
                @media (min-width: 768px) {
                  .pwa-install-pill { display: flex !important; }
                }
              `}</style>
              <Smartphone size={14} />
              <span>Install App</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: isDayMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.08)',
              border: isDayMode ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="mobile-menu-btn"
            aria-label="Menu"
          >
            <style>{`
              @media (min-width: 960px) {
                .mobile-menu-btn { display: none !important; }
              }
            `}</style>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: isDayMode ? 'rgba(213, 223, 233, 0.98)' : 'rgba(6, 7, 10, 0.98)',
            backdropFilter: 'blur(32px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          className="animate-fade-in"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {[
              { id: 'home', label: 'Home', icon: Flame },
              { id: 'movies', label: 'Movies', icon: Film },
              { id: 'tv', label: 'Series', icon: Tv },
              { id: 'albums', label: 'Originals', icon: Disc },
              { id: 'dualaudio', label: 'Dual Audio', icon: Sparkles },
              { id: 'livetv', label: 'Live TV', icon: Radio },
              { id: 'discover', label: 'Discover', icon: Compass },
              { id: 'watchlist', label: `Watchlist (${watchlist.length})`, icon: Bookmark },
            ].map((item) => {
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
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    background: isActive ? 'var(--accent)' : 'var(--bg-card)',
                    color: isActive ? 'var(--accent-text)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => {
                toggleDayNight();
                setMobileMenuOpen(false);
              }}
              style={{
                flex: 1,
                padding: '0.65rem',
                borderRadius: '10px',
                background: isDayMode ? '#0f172a' : '#ffffff',
                color: isDayMode ? '#ffffff' : '#0f172a',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
              }}
            >
              {isDayMode ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
