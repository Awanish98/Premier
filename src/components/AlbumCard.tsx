import React from 'react';
import { Play, Disc, Layers, Star, ArrowRight } from 'lucide-react';
import type { MediaAlbum } from '../types';
import { MagicCard } from './magicui/MagicCard';

interface AlbumCardProps {
  album: MediaAlbum;
  onClick: (album: MediaAlbum) => void;
  onPlayFirst: (album: MediaAlbum) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick, onPlayFirst }) => {
  return (
    <MagicCard
      onClick={() => onClick(album)}
      gradientSize={280}
      gradientColor={album.colorTheme || 'var(--accent)'}
      gradientOpacity={0.25}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '340px',
        cursor: 'pointer',
        borderRadius: '18px',
      }}
    >
      {/* Top Media Backdrop with Disc peek effect */}
      <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden' }}>
        <img
          src={album.backdropPath || album.coverPath}
          alt={album.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = album.coverPath;
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(6,7,10,0.2) 0%, rgba(6,7,10,0.9) 100%)',
          }}
        />

        {/* Floating Category Badge */}
        <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 10 }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '6px',
              background: 'rgba(6,7,10,0.8)',
              backdropFilter: 'blur(10px)',
              color: album.colorTheme || 'var(--accent)',
              border: `1px solid ${album.colorTheme || 'var(--accent)'}`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {album.category}
          </span>
        </div>

        {/* Floating Item Count & Year Badge */}
        <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', zIndex: 10 }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '6px',
              background: 'rgba(6,7,10,0.8)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Layers size={13} color="var(--accent)" />
            {album.totalItems} Titles
          </span>
        </div>

        {/* Quick Play Circle Button */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.85rem',
            right: '0.85rem',
            zIndex: 10,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayFirst(album);
            }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: album.colorTheme || 'var(--accent)',
              border: 'none',
              color: 'var(--accent-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.7), 0 0 15px var(--accent-glow)',
              transition: 'transform 0.2s ease',
            }}
            title="Play Album Collection"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />
          </button>
        </div>
      </div>

      {/* Album Content & Details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <Star size={12} fill="#fbbf24" />
              {album.ratingAverage.toFixed(1)}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {album.yearRange}</span>
          </div>

          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              marginBottom: '0.45rem',
            }}
          >
            {album.title}
          </h3>

          <p
            style={{
              fontSize: '0.84rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {album.description}
          </p>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Disc size={14} color={album.colorTheme || 'var(--accent)'} />
            <span>Franchise Saga</span>
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Explore Saga</span>
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </MagicCard>
  );
};
