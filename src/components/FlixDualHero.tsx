import React, { useState } from 'react';
import { Play, Info, Plus, Check, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { MediaItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FlixDualHeroProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onShowDetails: (item: MediaItem) => void;
}

export const FlixDualHero: React.FC<FlixDualHeroProps> = ({ items, onPlay, onShowDetails }) => {
  const [activePairIndex, setActivePairIndex] = useState(0);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useTheme();

  if (!items || items.length === 0) return null;

  // Group items into pairs of 2
  const pairs: [MediaItem, MediaItem][] = [];
  for (let i = 0; i < items.length; i += 2) {
    if (items[i] && items[i + 1]) {
      pairs.push([items[i], items[i + 1]]);
    } else if (items[i]) {
      pairs.push([items[i], items[0]]);
    }
  }

  const currentPair = pairs[activePairIndex % pairs.length] || [items[0], items[1] || items[0]];

  const handleNext = () => {
    setActivePairIndex((prev) => (prev + 1) % pairs.length);
  };

  const handlePrev = () => {
    setActivePairIndex((prev) => (prev - 1 + pairs.length) % pairs.length);
  };

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '1.75rem' }}>
      {/* Pair Carousel Controls (Desktop & Tablet) */}
      {pairs.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '-2.75rem',
            right: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            zIndex: 10,
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Previous Spotlight"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Next Spotlight"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Dual Hero Grid */}
      <div className="flix-dual-hero-grid">
        {currentPair.map((item, idx) => {
          const inWatchlist = isInWatchlist(item.id);
          const bgGrad =
            idx === 0
              ? 'linear-gradient(135deg, rgba(20, 50, 95, 0.95) 0%, rgba(10, 25, 50, 0.8) 45%, rgba(15, 23, 42, 0.6) 100%)'
              : 'linear-gradient(135deg, rgba(70, 40, 90, 0.95) 0%, rgba(45, 25, 65, 0.8) 45%, rgba(15, 23, 42, 0.6) 100%)';

          return (
            <div
              key={`${item.id}-${idx}`}
              className="flix-hero-card"
              onClick={() => onShowDetails(item)}
              style={{
                position: 'relative',
                minHeight: '340px',
                background: bgGrad,
              }}
            >
              {/* Cinematic Backdrop Image with Smart Mask */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${item.backdropPath || item.posterPath})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 25%',
                  opacity: 0.65,
                  mixBlendMode: 'overlay',
                  transition: 'transform 0.6s ease',
                }}
                className="hero-backdrop-img"
              />

              {/* Character Illustration / Poster Art Right Accent */}
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  bottom: '0',
                  width: '55%',
                  backgroundImage: `url(${item.backdropPath || item.posterPath})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center right',
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, transparent 100%)',
                  opacity: 0.9,
                  pointerEvents: 'none',
                }}
              />

              {/* Dynamic Dark Gradient Overlay for Maximum Text Contrast */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(6, 12, 24, 0.92) 0%, rgba(6, 12, 24, 0.75) 50%, rgba(6, 12, 24, 0.1) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Card Foreground Content */}
              <div style={{ position: 'relative', zIndex: 4, maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                
                {/* Platform Badge */}
                {item.platformBadge && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        letterSpacing: '0.04em',
                        width: 'fit-content',
                      }}
                    >
                      {item.platformBadge}
                    </span>
                    {(item.isDualAudio || item.hasHindiDubbed) && (
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(245, 158, 11, 0.25)',
                          border: '1px solid rgba(245, 158, 11, 0.45)',
                          color: '#fbbf24',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Sparkles size={11} /> 🇮🇳 Dual Audio
                      </span>
                    )}
                  </div>
                )}

                {/* Big Title (Flix.id style) */}
                <h2
                  style={{
                    fontSize: 'clamp(1.35rem, 2.2vw, 1.85rem)',
                    fontWeight: 900,
                    lineHeight: 1.15,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 14px rgba(0,0,0,0.8)',
                  }}
                >
                  {item.title}
                </h2>

                {/* Overview Tagline */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.82)',
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '0.35rem',
                  }}
                >
                  {item.tagline || item.overview}
                </p>

                {/* Interactive Action Pill Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(item);
                    }}
                    className="flix-play-pill"
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Play size={11} color="#0f172a" fill="#0f172a" style={{ marginLeft: '1px' }} />
                    </div>
                    <span>Let Play Moview</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inWatchlist) {
                        removeFromWatchlist(item.id);
                      } else {
                        addToWatchlist(item);
                      }
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: inWatchlist ? '#10b981' : 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(10px)',
                      border: inWatchlist ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowDetails(item);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    title="More Info"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
