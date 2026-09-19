import React, { useState } from 'react';
import { Disc, Play, Sparkles, X, Layers, Star, Info, Check, Plus } from 'lucide-react';
import { FRANCHISE_ALBUMS, MASTER_MEDIA_ITEMS } from '../data/mockCatalog';
import type { MediaAlbum, MediaItem } from '../types';
import { AlbumCard } from './AlbumCard';
import { useTheme } from '../context/ThemeContext';

interface AlbumSectionProps {
  onPlayMedia: (item: MediaItem) => void;
  onShowMediaDetails?: (item: MediaItem) => void;
}

export const AlbumSection: React.FC<AlbumSectionProps> = ({
  onPlayMedia,
  onShowMediaDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeAlbum, setActiveAlbum] = useState<MediaAlbum | null>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useTheme();

  const categories = [
    'All',
    'Bollywood & Pan-India',
    'Marvel Universe',
    'Director Spotlight',
    'Anime Sagas',
    'Crime Universe',
    'K-Drama World',
  ];

  const filteredAlbums = FRANCHISE_ALBUMS.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  const getAlbumMediaItems = (album: MediaAlbum): MediaItem[] => {
    return album.itemIds
      .map((id) => MASTER_MEDIA_ITEMS.find((m) => m.id === id))
      .filter((m): m is MediaItem => m !== undefined);
  };

  const handlePlayFirst = (album: MediaAlbum) => {
    const items = getAlbumMediaItems(album);
    if (items.length > 0) {
      onPlayMedia(items[0]);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      {/* Header Billboard */}
      <div
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 168, 225, 0.2) 0%, rgba(13, 21, 39, 0.9) 100%)',
          border: '1px solid var(--border-subtle)',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Disc size={22} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Curated Franchise Albums & Sagas
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: '#fff',
              marginBottom: '0.75rem',
              lineHeight: 1.15,
            }}
          >
            Cinematic Albums & Universes
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Marvel MCU, Christopher Nolan, Pan-India Blockbusters, Anime Sagas aur Desi Crime Universes ko album playlist format me binge karein.
          </p>

          <button
            onClick={() => setActiveAlbum(FRANCHISE_ALBUMS[0])}
            className="btn-accent"
            style={{ padding: '0.75rem 1.8rem' }}
          >
            <Sparkles size={18} fill="#fff" />
            <span>Explore Featured: Pan-India Epics</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              borderRadius: '999px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: selectedCategory === cat ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Albums Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {filteredAlbums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onClick={(a) => setActiveAlbum(a)}
            onPlayFirst={handlePlayFirst}
          />
        ))}
      </div>

      {/* Album Detail Modal / Showcase Tracklist */}
      {activeAlbum && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            overflowY: 'auto',
          }}
          className="animate-fade-in"
          onClick={() => setActiveAlbum(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '960px',
              maxHeight: '92vh',
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px var(--accent-glow)',
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setActiveAlbum(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                zIndex: 30,
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {/* Album Header Banner */}
            <div style={{ position: 'relative', width: '100%', minHeight: '260px', padding: '2.5rem 2rem', display: 'flex', alignItems: 'flex-end' }}>
              <img
                src={activeAlbum.backdropPath || activeAlbum.coverPath}
                alt={activeAlbum.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(13,21,39,0.3) 0%, rgba(13,21,39,0.95) 100%)',
                }}
              />

              <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: activeAlbum.colorTheme || 'var(--accent)',
                      color: '#fff',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeAlbum.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={13} fill="#fbbf24" />
                    {activeAlbum.ratingAverage.toFixed(1)} Avg Rating
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    • {activeAlbum.yearRange}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    • {activeAlbum.totalItems} Titles
                  </span>
                </div>

                <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '0.5rem' }}>
                  {activeAlbum.title}
                </h1>

                {activeAlbum.tagline && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    "{activeAlbum.tagline}"
                  </p>
                )}

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {activeAlbum.description}
                </p>

                <button
                  onClick={() => {
                    handlePlayFirst(activeAlbum);
                    setActiveAlbum(null);
                  }}
                  className="btn-accent"
                  style={{ padding: '0.65rem 1.6rem' }}
                >
                  <Play size={18} fill="#fff" />
                  <span>Play Album from Start</span>
                </button>
              </div>
            </div>

            {/* Tracklist / Movie List */}
            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Layers size={18} color="var(--accent)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Titles in this Collection ({getAlbumMediaItems(activeAlbum).length})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {getAlbumMediaItems(activeAlbum).map((item, index) => {
                  const inWatchlist = isInWatchlist(item.id);

                  return (
                    <div
                      key={item.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '0.85rem 1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)', width: '24px' }}>
                          {(index + 1).toString().padStart(2, '0')}
                        </span>

                        <img
                          src={item.posterPath}
                          alt={item.title}
                          style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                        />

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '1px 5px',
                                borderRadius: '3px',
                                background: 'var(--badge-bg)',
                                color: 'var(--accent)',
                              }}
                            >
                              {item.type.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                              <Star size={11} fill="#fbbf24" />
                              {item.rating.toFixed(1)}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              • {item.releaseYear} {item.duration ? `• ${item.duration}` : ''}
                            </span>
                          </div>

                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </h4>

                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.overview}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                        {onShowMediaDetails && (
                          <button
                            onClick={() => {
                              setActiveAlbum(null);
                              onShowMediaDetails(item);
                            }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '8px',
                              padding: '0.45rem',
                              color: '#fff',
                              cursor: 'pointer',
                            }}
                            title="View Synopsis & Cast"
                          >
                            <Info size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (inWatchlist) removeFromWatchlist(item.id);
                            else addToWatchlist(item);
                          }}
                          style={{
                            background: inWatchlist ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            padding: '0.45rem',
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                          title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                        >
                          {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                        </button>

                        <button
                          onClick={() => {
                            setActiveAlbum(null);
                            onPlayMedia(item);
                          }}
                          className="btn-accent"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                        >
                          <Play size={14} fill="#fff" />
                          <span>Play</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
