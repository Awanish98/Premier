import React from 'react';
import { X, Play, Plus, Check, Star, Sparkles } from 'lucide-react';
import type { MediaItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { MASTER_MEDIA_ITEMS } from '../data/mockCatalog';
import { BorderBeam } from './magicui/BorderBeam';
import { ShimmerButton } from './magicui/ShimmerButton';
import { AnimatedBadge } from './magicui/AnimatedBadge';

interface MediaDetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ item, onClose, onPlay }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useTheme();

  if (!item) return null;

  const inWatchlist = isInWatchlist(item.id);

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  // Find related media from same genre or album
  const relatedItems = MASTER_MEDIA_ITEMS.filter(
    (m) =>
      m.id !== item.id &&
      (m.albumId === item.albumId || m.genres.some((g) => item.genres.includes(g)))
  ).slice(0, 4);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(0, 0, 0, 0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2.5vh, 1.75rem) clamp(0.5rem, 2vw, 1.25rem)',
        overflow: 'hidden',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px var(--accent-glow)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
        }}
        className="custom-scrollbar"
      >
        <BorderBeam size={260} duration={12} colorFrom="var(--accent)" colorTo="#f59e0b" />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 30,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          <X size={20} />
        </button>

        {/* Hero Backdrop Banner Area */}
        <div style={{ position: 'relative', width: '100%', height: 'clamp(230px, 32vh, 320px)', overflow: 'hidden' }}>
          <img
            src={item.backdropPath || item.posterPath}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(13,21,39,0.2) 0%, rgba(13,21,39,0.8) 70%, var(--bg-secondary) 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: 'clamp(1rem, 3vw, 1.75rem)',
              right: 'clamp(1rem, 3vw, 1.75rem)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '1rem',
            }}
          >
            {/* Small Poster thumbnail */}
            <img
              src={item.posterPath}
              alt={item.title}
              style={{
                width: 'clamp(70px, 15vw, 100px)',
                height: 'clamp(105px, 22vw, 145px)',
                objectFit: 'cover',
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                border: '2px solid rgba(255,255,255,0.2)',
                flexShrink: 0,
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                {item.platformBadge && (
                  <AnimatedBadge variant="accent">
                    {item.platformBadge}
                  </AnimatedBadge>
                )}
                {(item.isDualAudio || item.hasHindiDubbed || item.language === 'Hindi') && (
                  <AnimatedBadge variant="gold">
                    🇮🇳 Dual Audio
                  </AnimatedBadge>
                )}
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                  }}
                >
                  <Star size={13} fill="#fbbf24" />
                  {item.rating.toFixed(1)} / 10
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {item.releaseYear}
                </span>
                {item.duration && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    • {item.duration}
                  </span>
                )}
                {item.totalSeasons && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    • {item.totalSeasons} {item.totalSeasons > 1 ? 'Seasons' : 'Season'}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff', lineHeight: 1.1 }}>
                {item.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <ShimmerButton
              onClick={() => {
                onClose();
                onPlay(item);
              }}
              style={{ padding: '0.8rem 2.2rem', fontSize: '1rem' }}
            >
              <Play size={20} fill="currentColor" />
              <span>Watch Stream Now</span>
            </ShimmerButton>

            <button
              onClick={toggleWatchlist}
              className="btn-secondary"
              style={{ padding: '0.8rem 1.5rem', fontSize: '0.95rem' }}
            >
              {inWatchlist ? <Check size={18} color="var(--accent)" /> : <Plus size={18} />}
              <span>{inWatchlist ? 'In Your Watchlist' : 'Add to Watchlist'}</span>
            </button>
          </div>

          {/* Synopsis */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Storyline & Synopsis
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {item.overview}
            </p>
          </div>

          {/* Details Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              background: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {item.director && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Director
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {item.director}
                </p>
              </div>
            )}

            {item.cast && item.cast.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Starring Cast
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {item.cast.join(', ')}
                </p>
              </div>
            )}

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Genres
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 600, marginTop: '2px' }}>
                {item.genres.join(' • ')}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Streaming Source Engine
              </span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                Multi-Server (VidLink Pro, VidSrc, AutoEmbed)
              </p>
            </div>
          </div>

          {/* Related / More Like This */}
          {relatedItems.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.9rem' }}>
                <Sparkles size={16} color="var(--accent)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  More in this Universe & Genre
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.85rem' }}>
                {relatedItems.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onClose();
                      onPlay(rel);
                    }}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <img
                      src={rel.posterPath}
                      alt={rel.title}
                      style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop';
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {rel.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rel.releaseYear} • ⭐ {rel.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
