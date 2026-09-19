import React, { useState } from 'react';
import { Bookmark, Clock, Trash2, Play, Flame, Film, Tv, Sparkles, SlidersHorizontal, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import type { MediaItem } from '../types';
import { ContentCard } from './ContentCard';

interface WatchlistSectionProps {
  onPlay: (item: MediaItem) => void;
  onShowDetails?: (item: MediaItem) => void;
  onExplore: () => void;
}

export const WatchlistSection: React.FC<WatchlistSectionProps> = ({ onPlay, onShowDetails, onExplore }) => {
  const { watchlist, continueWatching, removeFromWatchlist } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'year' | 'title'>('default');

  const filteredItems = watchlist.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'year') return b.releaseYear - a.releaseYear;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '6rem 1.5rem 5rem' }}>
      {/* Continue Watching Row (if any) */}
      {continueWatching.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <Clock size={22} color="var(--accent)" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Continue Watching
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'var(--badge-bg)',
                color: 'var(--accent)',
              }}
            >
              {continueWatching.length} in progress
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {continueWatching.map(({ item, progress, lastWatchedSeason, lastWatchedEpisode }) => (
              <div
                key={item.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                {/* Image Backdrop */}
                <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                  <img
                    src={item.backdropPath || item.posterPath}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(6,7,10,0.95) 0%, rgba(6,7,10,0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <button
                      onClick={() => onPlay(item)}
                      style={{
                        background: 'var(--accent)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-text)',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px var(--accent-glow)',
                        transition: 'transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      title="Resume Playback"
                    >
                      <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'var(--accent)',
                      }}
                    />
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '0.85rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.type === 'movie' ? 'Resume Movie' : `Season ${lastWatchedSeason} : Episode ${lastWatchedEpisode}`} • {progress}% watched
                    </p>
                  </div>
                  {onShowDetails && (
                    <button
                      onClick={() => onShowDetails(item)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.4rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                      title="View Details"
                    >
                      <Info size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Watchlist Header & Control Tabs */}
      <section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--badge-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Bookmark size={20} color="var(--accent)" />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                My Watchlist
              </h1>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '999px',
                  background: 'var(--badge-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {watchlist.length} {watchlist.length === 1 ? 'Title' : 'Titles'}
              </span>
            </div>

            {/* Sort Dropdown */}
            {watchlist.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={16} color="var(--text-muted)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="default">Recently Added</option>
                  <option value="rating">Highest IMDb Rating</option>
                  <option value="year">Release Year (Newest)</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            )}
          </div>

          {/* Type Filter Tabs */}
          {watchlist.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Items', icon: Bookmark, count: watchlist.length },
                { id: 'movie', label: 'Movies', icon: Film, count: watchlist.filter(m => m.type === 'movie').length },
                { id: 'tv', label: 'TV Shows', icon: Tv, count: watchlist.filter(m => m.type === 'tv').length },
                { id: 'anime', label: 'Anime Hub', icon: Sparkles, count: watchlist.filter(m => m.type === 'anime').length },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = filterType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id as any)}
                    style={{
                      background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)',
                        fontWeight: 700,
                      }}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <div
            style={{
              padding: '5rem 2rem',
              textAlign: 'center',
              background: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '300px',
                height: '150px',
                background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Bookmark size={54} color="var(--accent)" style={{ margin: '0 auto 1.25rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
              Aapki Watchlist Khali Hai
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Kisi bhi 4K movie, web series ya dual-audio blockbuster card par Bookmark icon dabayein aur apni personal playlist create karein.
            </p>
            <button onClick={onExplore} className="btn-accent" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
              <Flame size={18} />
              <span>Explore Trending Titles</span>
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Iss category me koi watchlist title nahi mila.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredItems.map((item) => (
              <div key={item.id} style={{ position: 'relative' }}>
                <ContentCard item={item} onPlay={onPlay} onShowDetails={onShowDetails} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(item.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.6rem',
                    right: '0.6rem',
                    background: 'rgba(239, 68, 68, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 25,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  title="Remove from Watchlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
