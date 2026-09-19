import React from 'react';
import { Filter, ArrowUpDown, Globe2 } from 'lucide-react';
import type { SortOption } from '../types';

interface CategoryFilterBarProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  availableGenres?: string[];
  totalResults?: number;
}

const DEFAULT_GENRES = [
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
  'Hindi',
  'Dual Audio',
  'South Dubbed',
  'English',
  'Japanese',
  'Korean',
];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedGenre,
  onSelectGenre,
  selectedLanguage,
  onSelectLanguage,
  sortBy,
  onSelectSort,
  availableGenres = DEFAULT_GENRES,
  totalResults,
}) => {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
      }}
    >
      {/* Top Line: Genre Pills Carousel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
          <Filter size={16} />
          <span>Genre:</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
          {availableGenres.map((g) => {
            const isSelected = selectedGenre.toLowerCase() === g.toLowerCase();
            return (
              <button
                key={g}
                onClick={() => onSelectGenre(g)}
                style={{
                  background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  borderRadius: '999px',
                  padding: '0.4rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSelected ? '0 0 14px var(--accent-glow)' : 'none',
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Line: Languages, Sort Dropdown & Result Count */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem',
        }}
      >
        {/* Languages selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Globe2 size={15} color="var(--accent)" />
            <span>Audio / Lang:</span>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage.toLowerCase() === lang.toLowerCase();
              return (
                <button
                  key={lang}
                  onClick={() => onSelectLanguage(lang)}
                  style={{
                    background: isSelected ? 'var(--badge-bg)' : 'transparent',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                    borderRadius: '6px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort & Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto' }}>
          {totalResults !== undefined && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {totalResults} Titles
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={14} color="var(--accent)" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="trending" style={{ background: '#111', color: '#fff' }}>🔥 Trending Now</option>
              <option value="top-rated" style={{ background: '#111', color: '#fff' }}>⭐ Highest Rated</option>
              <option value="newest" style={{ background: '#111', color: '#fff' }}>📅 Latest Release</option>
              <option value="title-asc" style={{ background: '#111', color: '#fff' }}>🔤 Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
