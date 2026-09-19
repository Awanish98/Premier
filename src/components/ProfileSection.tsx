import React from 'react';
import { User, ShieldCheck, Play, Trash2, Settings, Globe, Server, Palette, Clock, Film } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { MediaItem, ThemeMode } from '../types';

interface ProfileSectionProps {
  onPlayMedia: (item: MediaItem) => void;
  onShowDetails: (item: MediaItem) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ onPlayMedia, onShowDetails }) => {
  const { 
    theme, 
    setTheme, 
    watchlist, 
    continueWatching, 
    removeProgress, 
    preferences, 
    updatePreferences 
  } = useTheme();

  const themes: { id: ThemeMode; name: string; color: string; tag: string }[] = [
    { id: 'cinejoy', name: 'Premier Emerald', color: '#95FF50', tag: 'Signature Neon' },
    { id: 'prime', name: 'Prime Cinema', color: '#00a8e1', tag: 'Navy / Cyan' },
    { id: 'netflix', name: 'Netflix Mirror', color: '#e50914', tag: 'Dark / Red' },
    { id: 'disney', name: 'Disney+ / Hotstar', color: '#0072d2', tag: 'Cobalt / Blue' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', color: '#a855f7', tag: 'Purple Glow' },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '2rem auto', padding: '1.5rem' }} className="animate-fade-in">
      {/* Profile Header Hero Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(13, 18, 28, 0.95) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 25px var(--accent-glow)',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
              border: '2px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            <User size={40} color={theme === 'cinejoy' ? '#05080b' : '#ffffff'} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Premium Streamer
              </h1>
              <span
                style={{
                  background: 'var(--badge-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <ShieldCheck size={12} />
                VIP PASS
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Dual Audio & 4K Cinema Aggregator Member
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>
              {continueWatching.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>In Progress</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>
              {watchlist.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Watchlist</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>
              4K HDR
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quality</div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Continue Watching & Preferences */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left: Continue Watching List */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Continue Watching ({continueWatching.length})
            </h2>
          </div>

          {continueWatching.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Film size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No titles in progress</p>
              <p style={{ fontSize: '0.8rem' }}>Start streaming any movie or show to track playback automatically.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {continueWatching.map((entry) => (
                <div
                  key={entry.item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                  }}
                >
                  <div
                    onClick={() => onShowDetails(entry.item)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0, cursor: 'pointer' }}
                  >
                    <img
                      src={entry.item.posterPath}
                      alt={entry.item.title}
                      style={{ width: '45px', height: '65px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {entry.item.title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        {entry.item.type === 'tv' || entry.item.type === 'anime'
                          ? `Season ${entry.lastWatchedSeason || 1} • Episode ${entry.lastWatchedEpisode || 1}`
                          : entry.item.duration || 'Movie'}
                      </p>
                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.max(entry.progress, 15)}%`,
                            height: '100%',
                            background: 'var(--accent)',
                            borderRadius: '999px',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => onPlayMedia(entry.item)}
                      style={{
                        background: 'var(--accent)',
                        color: theme === 'cinejoy' ? '#05080b' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.45rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Resume Playback"
                    >
                      <Play size={16} fill={theme === 'cinejoy' ? '#05080b' : '#ffffff'} />
                    </button>
                    <button
                      onClick={() => removeProgress(entry.item.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '0.45rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Remove from history"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Settings & Preferences */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Streaming Preferences
            </h2>
          </div>

          {/* Audio Preference */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Globe size={15} color="var(--accent)" />
              <span>Default Audio Language:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['Hindi', 'English', 'Original'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => updatePreferences({ audioLanguage: lang })}
                  style={{
                    flex: 1,
                    background: preferences.audioLanguage === lang ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                    color: preferences.audioLanguage === lang ? '#05080b' : 'var(--text-primary)',
                    border: preferences.audioLanguage === lang ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '0.55rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {lang === 'Hindi' ? '🇮🇳 Hindi / Dual' : lang === 'English' ? '🇺🇸 English' : '🌐 Original'}
                </button>
              ))}
            </div>
          </div>

          {/* Server Preference */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Server size={15} color="var(--accent)" />
              <span>Default FMHY Stream Server:</span>
            </div>
            <select
              value={preferences.defaultServer}
              onChange={(e) => updatePreferences({ defaultServer: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="vidlink_pro" style={{ background: '#0d121c' }}>VidLink Pro (Multi-Audio 4K)</option>
              <option value="autoembed_hindi" style={{ background: '#0d121c' }}>AutoEmbed (Hindi Mirror)</option>
              <option value="vidsrc_cc" style={{ background: '#0d121c' }}>VidSrc (High Speed 1080p)</option>
              <option value="embed_su" style={{ background: '#0d121c' }}>Embed.su (4K HDR Master)</option>
              <option value="smashystream" style={{ background: '#0d121c' }}>SmashyStream (Dual Audio)</option>
            </select>
          </div>

          {/* Theme Skin Customizer */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Palette size={15} color="var(--accent)" />
              <span>Platform Theme Skin:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? `2px solid ${t.color}` : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 0 14px ${t.color}44` : 'none',
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.color }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#ffffff' : 'var(--text-secondary)' }}>
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
