import React from 'react';
import { Play, Plus, Check, Star, Info } from 'lucide-react';
import type { MediaItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { MagicCard } from './magicui/MagicCard';

interface ContentCardProps {
  item: MediaItem;
  onPlay: (item: MediaItem) => void;
  onShowDetails?: (item: MediaItem) => void;
  aspectRatio?: 'poster' | 'backdrop';
  isGrid?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onPlay,
  onShowDetails,
  aspectRatio = 'poster',
  isGrid = false,
}) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useTheme();
  const inWatchlist = isInWatchlist(item.id);

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const isPoster = aspectRatio === 'poster';

  return (
    <MagicCard
      onClick={() => (onShowDetails ? onShowDetails(item) : onPlay(item))}
      gradientSize={220}
      gradientColor="var(--accent)"
      gradientOpacity={0.2}
      className="media-card-magic"
      style={{
        flex: isGrid ? 'none' : isPoster ? '0 0 190px' : '0 0 300px',
        width: isGrid ? '100%' : isPoster ? '190px' : '300px',
        height: isPoster ? '290px' : '185px',
        position: 'relative',
        borderRadius: '14px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* Background Poster Image */}
      <img
        src={isPoster ? (item.posterPath || item.backdropPath) : (item.backdropPath || item.posterPath)}
        alt={item.title}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          const altFallback = isPoster ? item.backdropPath : item.posterPath;
          if (altFallback && img.src !== altFallback) {
            img.src = altFallback;
          } else {
            // Elegant premium dark OTT cinema backdrop
            img.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80';
          }
        }}
      />

      {/* Persistent Top Badges & Actions */}
      <div
        style={{
          position: 'absolute',
          top: '0.65rem',
          left: '0.65rem',
          right: '0.65rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        {item.platformBadge ? (
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '5px',
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            {item.platformBadge}
          </span>
        ) : (
          <span />
        )}

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {onShowDetails && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails(item);
              }}
              style={{
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
              }}
              title="View Details"
            >
              <Info size={14} />
            </button>
          )}

          <button
            onClick={toggleWatchlist}
            style={{
              background: inWatchlist ? 'var(--accent)' : 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              border: inWatchlist ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.25)',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: inWatchlist ? 'var(--accent-text)' : '#fff',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
          </button>
        </div>
      </div>

      {/* ALWAYS VISIBLE Bottom Content Gradient Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          padding: '2.5rem 0.85rem 0.75rem',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(6,7,10,0.75) 35%, rgba(6,7,10,0.98) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          marginTop: 'auto',
        }}
      >
        {/* Title (Always clearly visible!) */}
        <h3
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
          }}
          title={item.title}
        >
          {item.title}
        </h3>

        {/* Metadata Row: Rating, Year, Audio, 4K Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span
              style={{
                fontWeight: 800,
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Star size={11} fill="#fbbf24" />
              {item.rating.toFixed(1)}
            </span>
            <span style={{ color: 'rgba(226, 232, 240, 0.85)', fontWeight: 600 }}>
              • {item.releaseYear}
            </span>
            {(item.isDualAudio || item.hasHindiDubbed) ? (
              <span
                style={{
                  color: '#fbbf24',
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                }}
              >
                🇮🇳 Dual
              </span>
            ) : item.language === 'Hindi' ? (
              <span
                style={{
                  color: '#34d399',
                  fontWeight: 800,
                  fontSize: '0.66rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  border: '1px solid rgba(16, 185, 129, 0.45)',
                }}
              >
                🇮🇳 Hindi
              </span>
            ) : (
              <span style={{ color: 'rgba(203, 213, 225, 0.75)', fontSize: '0.7rem' }}>
                • {item.language || 'Multi'}
              </span>
            )}
          </div>

          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.12)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.35)',
            }}
          >
            4K UHD
          </span>
        </div>

        {/* Hover Quick Action Play Button */}
        <div className="card-hover-actions" style={{ marginTop: '0.35rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: 'var(--accent-text)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.45rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              boxShadow: '0 2px 14px var(--accent-glow)',
            }}
          >
            <Play size={14} fill="currentColor" />
            <span>Play Stream</span>
          </button>
        </div>
      </div>
    </MagicCard>
  );
};
