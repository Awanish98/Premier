import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Globe2, Sparkles, Film, RotateCcw } from 'lucide-react';
import { ContentCard } from './ContentCard';
import { SkeletonCard } from './SkeletonCard';
import { MASTER_MEDIA_ITEMS } from '../data/mockCatalog';
import type { MediaItem, SortOption } from '../types';

interface DiscoverSectionProps {
  onPlayMedia: (item: MediaItem) => void;
  onShowDetails: (item: MediaItem) => void;
  initialType?: 'all' | 'movie' | 'tv' | 'anime';
  initialAudio?: 'all' | 'dual' | 'hindi' | 'english';
}

const GENRES = [
  'All',
  'Dual Audio',
  'Action',
  'Sci-Fi',
  'Crime',
  'Drama',
  'Comedy',
  'Horror',
  'Thriller',
  'Romance',
  'Fantasy',
  'Superhero',
  'Supernatural',
  'K-Drama',
];

const LANGUAGES = [
  'All',
  'Dual Audio',
  'Hindi',
  'English',
  'Japanese',
  'Korean',
];

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({
  onPlayMedia,
  onShowDetails,
  initialType = 'all',
  initialAudio = 'all',
}) => {
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv' | 'anime'>(initialType);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    initialAudio === 'dual' ? 'Dual Audio' : initialAudio === 'hindi' ? 'Hindi' : 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setSelectedType(initialType);
  }, [initialType]);

  useEffect(() => {
    if (initialAudio === 'dual') {
      setSelectedLanguage('Dual Audio');
    } else if (initialAudio === 'hindi') {
      setSelectedLanguage('Hindi');
    }
  }, [initialAudio]);

  // Reset pagination when filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedType, selectedGenre, selectedLanguage, searchQuery, sortBy]);

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    let list = MASTER_MEDIA_ITEMS;

    // Filter Type
    if (selectedType !== 'all') {
      list = list.filter((item) => item.type === selectedType);
    }

    // Filter Genre
    if (selectedGenre !== 'All') {
      if (selectedGenre === 'Dual Audio') {
        list = list.filter((item) => item.isDualAudio || item.hasHindiDubbed || item.language === 'Hindi');
      } else {
        list = list.filter((item) =>
          item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
        );
      }
    }

    // Filter Language
    if (selectedLanguage !== 'All') {
      if (selectedLanguage.toLowerCase() === 'dual audio') {
        list = list.filter((item) => item.isDualAudio || item.hasHindiDubbed || item.language === 'Hindi');
      } else {
        list = list.filter((item) => item.language?.toLowerCase() === selectedLanguage.toLowerCase());
      }
    }

    // Filter Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.genres.some((g) => g.toLowerCase().includes(q)) ||
          item.overview.toLowerCase().includes(q) ||
          item.cast?.some((c) => c.toLowerCase().includes(q)) ||
          item.director?.toLowerCase().includes(q)
      );
    }

    // Sort Logic
    if (sortBy === 'top-rated') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sortBy === 'title-asc') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }

    return list;
  }, [selectedType, selectedGenre, selectedLanguage, searchQuery, sortBy]);

  // Endless virtual repetition to simulate massive catalog
  const pageSize = 12;
  const displayedItems = useMemo(() => {
    const totalCount = Math.max(filteredItems.length, 48);
    const countToTake = Math.min(page * pageSize, totalCount);
    const result: MediaItem[] = [];

    for (let i = 0; i < countToTake; i++) {
      const base = filteredItems[i % filteredItems.length];
      if (base) {
        if (i < filteredItems.length) {
          result.push(base);
        } else {
          result.push({
            ...base,
            id: `${base.id}-pg-${i}`,
          });
        }
      }
    }
    return result;
  }, [filteredItems, page]);

  const hasMore = displayedItems.length < Math.max(filteredItems.length, 48);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoading(false);
    }, 450);
  };

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSearchQuery('');
    setSortBy('trending');
    setPage(1);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '2rem auto', padding: '1rem 1.5rem' }} className="animate-fade-in">
      {/* Discovery Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--badge-bg)', border: '1px solid var(--border-subtle)', borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '0.75rem' }}>
          <Sparkles size={16} color="var(--accent)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Interactive Cinema Explorer
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Discover & Explore
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Filter thousands of 4K movies, TV series, anime, and dual audio blockbusters with instant stream playback.
        </p>
      </div>

      {/* Control Filter Panel */}
      <div
        style={{
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Row 1: Search Input & Media Type Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Media Type Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {(['all', 'movie', 'tv', 'anime'] as const).map((type) => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    background: isSelected ? 'var(--accent)' : 'transparent',
                    color: isSelected ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: 'none',
                    padding: '0.45rem 1rem',
                    borderRadius: '7px',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {type === 'all' ? 'All Content' : type === 'movie' ? 'Movies' : type === 'tv' ? 'TV Shows' : 'Anime'}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', maxWidth: '450px', minWidth: '240px' }}>
            <Search size={17} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, actor, director..."
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Genre Pills Carousel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.3rem', scrollbarWidth: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.82rem', flexShrink: 0 }}>
            <Filter size={15} />
            <span>Genre:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
            {GENRES.map((g) => {
              const isSelected = selectedGenre.toLowerCase() === g.toLowerCase();
              return (
                <button
                  key={g}
                  onClick={() => setSelectedGenre(g)}
                  style={{
                    background: isSelected ? 'var(--accent)' : 'var(--bg-secondary)',
                    color: isSelected ? 'var(--accent-text)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 14px var(--accent-glow)' : 'none',
                  }}
                >
                  {g === 'Dual Audio' ? '🇮🇳 Dual Audio' : g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Language & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          {/* Audio Language Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Globe2 size={15} color="var(--accent)" />
              <span>Audio:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase();
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    style={{
                      background: isSelected ? 'var(--badge-bg)' : 'transparent',
                      color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                      borderRadius: '6px',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.75rem',
                      fontWeight: isSelected ? 800 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {lang === 'Dual Audio' ? '🇮🇳 Dual Audio (Hindi+Eng)' : lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort & Result Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {displayedItems.length} Titles
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowUpDown size={14} color="var(--accent)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="trending">🔥 Trending Now</option>
                <option value="top-rated">⭐ Highest Rated</option>
                <option value="newest">📅 Latest Release</option>
                <option value="title-asc">🔤 Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Media Grid: 4 cols desktop, 3 cols tablet, 2 cols mobile */}
      {displayedItems.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '4rem 1.5rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Film size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No titles match your filters
          </h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Try resetting your search query or selecting a different genre and language combination.
          </p>
          <button
            onClick={resetFilters}
            className="btn-accent"
            style={{ fontSize: '0.88rem', padding: '0.65rem 1.5rem' }}
          >
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <>
          <div
            className="responsive-media-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {displayedItems.map((item) => (
              <div key={item.id} style={{ width: '100%' }}>
                <ContentCard
                  item={item}
                  aspectRatio="poster"
                  isGrid={true}
                  onPlay={onPlayMedia}
                  onShowDetails={onShowDetails}
                />
              </div>
            ))}

            {isLoading &&
              Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} aspectRatio="poster" />
              ))}
          </div>

          {/* Endless Scroll Load More Button */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="btn-secondary"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.85rem 2.5rem',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="live-pulse" />
                    Loading More Movies...
                  </span>
                ) : (
                  <span>Load More Titles ↓</span>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
