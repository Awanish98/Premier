import React, { useState } from 'react';
import { Sparkles, Play, Filter } from 'lucide-react';
import { POPULAR_ANIME } from '../data/mockCatalog';
import type { MediaItem } from '../types';
import { ContentCard } from './ContentCard';

interface AnimeSectionProps {
  onPlay: (item: MediaItem) => void;
  onShowDetails?: (item: MediaItem) => void;
}

export const AnimeSection: React.FC<AnimeSectionProps> = ({ onPlay, onShowDetails }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Action', 'Fantasy', 'Supernatural', 'Dark Fantasy', 'Mystery'];

  const filteredAnime = POPULAR_ANIME.filter((a) => {
    if (selectedGenre === 'All') return true;
    return a.genres.includes(selectedGenre);
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '6rem 1.5rem 3rem' }}>
      {/* Anime Banner / Intro */}
      <div
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          padding: '2.5rem',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="#c084fc" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sub & Dub Stream Hub
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Anime Universe
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            FMHY aur Miruro jaise leading sources se latest Shonen, Seinen aur fantasy anime episodes stream karein HD quality me.
          </p>

          <button
            onClick={() => onPlay(POPULAR_ANIME[0])}
            className="btn-accent"
            style={{ padding: '0.7rem 1.8rem' }}
          >
            <Play size={18} fill="#fff" />
            <span>Featured: Solo Leveling S2</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              style={{
                background: selectedGenre === g ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: selectedGenre === g ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                fontWeight: selectedGenre === g ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing {filteredAnime.length} Titles
        </span>
      </div>

      {/* Grid of Anime Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredAnime.map((anime) => (
          <ContentCard
            key={anime.id}
            item={anime}
            aspectRatio="poster"
            onPlay={onPlay}
            onShowDetails={onShowDetails}
          />
        ))}
      </div>
    </div>
  );
};
