import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Film, Tv, Sparkles, Radio, Play, Star } from 'lucide-react';
import { ALL_MEDIA_CATALOG, LIVE_CHANNELS } from '../data/mockCatalog';
import type { MediaItem, LiveChannel } from '../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayMedia: (item: MediaItem) => void;
  onPlayChannel: (channel: LiveChannel) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onPlayMedia,
  onPlayChannel,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv' | 'anime' | 'livetv'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matchedMedia = ALL_MEDIA_CATALOG.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesQuery =
      query.trim() === '' ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.genres.some((g) => g.toLowerCase().includes(query.toLowerCase())) ||
      item.overview.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const matchedChannels = filter === 'all' || filter === 'livetv'
    ? LIVE_CHANNELS.filter((ch) => {
        return (
          query.trim() === '' ||
          ch.name.toLowerCase().includes(query.toLowerCase()) ||
          ch.category.toLowerCase().includes(query.toLowerCase()) ||
          ch.country.toLowerCase().includes(query.toLowerCase())
        );
      })
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        background: 'rgba(5, 7, 12, 0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(1.25rem, 4vh, 3rem) clamp(0.75rem, 3vw, 1.5rem) 2rem',
        overflowY: 'auto',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Search Header Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={20}
            color="var(--accent)"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Movies, TV Shows, Anime & Live TV..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--accent)',
              borderRadius: '14px',
              padding: '0.9rem 3.2rem 0.9rem 2.8rem',
              color: '#fff',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              outline: 'none',
              boxShadow: '0 0 30px var(--accent-glow)',
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Results' },
            { id: 'movie', label: 'Movies', icon: Film },
            { id: 'tv', label: 'TV Shows', icon: Tv },
            { id: 'anime', label: 'Anime', icon: Sparkles },
            { id: 'livetv', label: 'Live TV Channels', icon: Radio },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              style={{
                background: filter === f.id ? 'var(--accent)' : 'rgba(255, 255, 255, 0.06)',
                color: filter === f.id ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: filter === f.id ? 700 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Media Items Results */}
          {matchedMedia.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Movies, Shows & Anime ({matchedMedia.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {matchedMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onPlayMedia(item);
                      onClose();
                    }}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.75rem',
                      display: 'flex',
                      gap: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <img
                      src={item.posterPath}
                      alt={item.title}
                      style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: 'var(--badge-bg)',
                            color: 'var(--accent)',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}
                        >
                          {item.type}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                          <Star size={11} fill="#fbbf24" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.releaseYear} • {item.genres[0]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Channels Results */}
          {matchedChannels.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                Live TV Channels ({matchedChannels.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                {matchedChannels.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onPlayChannel(ch);
                      onClose();
                    }}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <img
                      src={ch.logo}
                      alt={ch.name}
                      style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', background: '#111' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ch.name}
                      </h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {ch.category} • {ch.country}
                      </span>
                    </div>
                    <Play size={16} color="var(--accent)" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedMedia.length === 0 && matchedChannels.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              Koi results nahi mile "{query}" ke liye. Kuch aur search karke dekhein!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
