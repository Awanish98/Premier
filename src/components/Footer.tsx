import React from 'react';
import { Film, Shield, Heart, Smartphone, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenApkModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApkModal }) => {
  const { theme, setTheme } = useTheme();

  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3.5rem 1.5rem 2rem',
        marginTop: '4rem',
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px var(--accent-glow)'
                }}
              >
                <Film size={18} color="var(--accent-text)" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                Flix<span style={{ color: 'var(--accent)' }}>.id</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Next-generation ultra-premium streaming platform with IMAX 4K UHD, Multi-Server playback, and Dual Audio (Hindi + English).
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'var(--badge-bg)', color: 'var(--accent)', fontWeight: 700 }}>
                PREMIER Core
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                IMAX 4K HDR
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontWeight: 700 }}>
                Dual Audio Engine
              </span>
            </div>

            {/* Direct APK Button in Footer */}
            {onOpenApkModal && (
              <button
                onClick={onOpenApkModal}
                style={{
                  background: 'linear-gradient(135deg, rgba(149, 255, 80, 0.15) 0%, rgba(13, 21, 39, 0.8) 100%)',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  borderRadius: '8px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 0 12px var(--accent-glow)',
                }}
              >
                <Smartphone size={16} />
                <span>Download Android APK (v2.5)</span>
                <Download size={14} />
              </button>
            )}
          </div>

          {/* Col 2: Features & Navigation */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Streaming Hubs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>🔥 Trending Movies & Blockbusters (4K UHD)</li>
              <li>📺 Web Series with Season/Episode Selectors</li>
              <li>⚡ Dedicated Anime Sub & Dub Portal</li>
              <li>📡 24x7 Live TV Channels (HLS.js Player)</li>
              <li>📌 Saved Watchlist & Continue Watching</li>
            </ul>
          </div>

          {/* Col 3: Recommended Safety & Best Practices */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Safety & Tips
            </h4>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Shield size={14} />
                <span>Adblock Recommended</span>
              </div>
              Popups aur trackers ko prevent karne ke liye <strong>uBlock Origin</strong> extension install karein aur buffer-free experience ke liye fast DNS use karein.
            </div>
          </div>

          {/* Col 4: Theme Skins Quick Select */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Active Theme Skin
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { id: 'day', name: '☀️ Flix Daylight (Frosted Slate)' },
                { id: 'night', name: '🌙 Flix Obsidian (Deep Cinema)' },
                { id: 'cinejoy', name: '⚡ Premier Emerald' },
                { id: 'prime', name: '🎬 Prime Video Navy' },
                { id: 'netflix', name: '🔴 Netflix Red' },
                { id: 'disney', name: '🔷 Disney+ Cobalt' },
                { id: 'cyberpunk', name: '🟣 Cyberpunk Neon' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  style={{
                    textAlign: 'left',
                    background: theme === t.id ? 'var(--badge-bg)' : 'transparent',
                    color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)',
                    border: 'none',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: theme === t.id ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {theme === t.id ? '✓ ' : '• '} {t.name}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright / disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            © {new Date().getFullYear()} PREMIER 4K Cinema. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Powered with <Heart size={14} color="#ef4444" fill="#ef4444" /> for seamless streaming.
          </div>
        </div>
      </div>
    </footer>
  );
};
