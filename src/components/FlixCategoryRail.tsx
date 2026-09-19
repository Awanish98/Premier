import React, { useState } from 'react';
import { 
  Flame, 
  Swords, 
  Heart, 
  Ghost, 
  Film, 
  Rocket, 
  Radio, 
  SlidersHorizontal,
  Check,
  Laugh,
  Headphones,
  Tv,
  Zap,
  Cloud
} from 'lucide-react';
import type { FlixCategory, SortOption } from '../types';

interface FlixCategoryRailProps {
  activeCategory: FlixCategory;
  onSelectCategory: (cat: FlixCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onOpenSpinWheel?: () => void;
  onOpenCloudstream?: () => void;
}

export const FlixCategoryRail: React.FC<FlixCategoryRailProps> = ({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  onOpenSpinWheel,
  onOpenCloudstream,
}) => {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const categories: { id: FlixCategory; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'trending', label: '🔥 Trending Now', icon: Flame },
    { id: 'bollywood', label: '🇮🇳 Bollywood & Pan-India', icon: Film },
    { id: 'comedy', label: '😂 Hasne Wali Comedy', icon: Laugh },
    { id: 'dualaudio', label: '🎧 Dual Audio & Hindi Dubbed', icon: Headphones },
    { id: 'action', label: '💥 Action & Masala', icon: Swords },
    { id: 'webseries', label: '📺 Desi Web Series', icon: Tv },
    { id: 'horror', label: '👻 Horror & Thriller', icon: Ghost },
    { id: 'anime', label: '⚡ Anime in Hindi', icon: Zap },
    { id: 'scifi', label: '🚀 Sci-Fi Epics', icon: Rocket },
    { id: 'romance', label: '❤️ Romance & Drama', icon: Heart },
    { id: 'livetv', label: '📡 24/7 Live TV', icon: Radio },
  ];

  const getCategoryTitle = () => {
    const found = categories.find((c) => c.id === activeCategory);
    return found ? found.label : 'Trending';
  };

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'trending', label: '🔥 Most Popular' },
    { id: 'top-rated', label: '⭐ Highest Rated' },
    { id: 'newest', label: '📅 Release Date' },
    { id: 'title-asc', label: '🔤 Title A-Z' },
  ];

  return (
    <div style={{ width: '100%', marginBottom: '1.5rem' }}>
      {/* Horizontal Category Pills Rail (Flix.id style) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          overflowX: 'auto',
          padding: '0.5rem 0.25rem 1.25rem',
          scrollbarWidth: 'none',
        }}
        className="scroll-rail-container"
      >
        {/* Mood Roulette Special Pill */}
        {onOpenSpinWheel && (
          <button
            onClick={onOpenSpinWheel}
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              borderRadius: '999px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Confused Mood? Spin the Wheel!"
          >
            <span style={{ fontSize: '1rem' }}>🎡</span>
            <span>Mood Roulette</span>
          </button>
        )}

        {/* Cloudstream Hub Pill */}
        {onOpenCloudstream && (
          <button
            onClick={onOpenCloudstream}
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
              border: '1px solid #3b82f6',
              color: '#60a5fa',
              borderRadius: '999px',
              padding: '0.45rem 1.1rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 16px rgba(59, 130, 246, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Cloudstream 3 & 4 Ecosystem & Extensions"
          >
            <Cloud size={15} />
            <span>Cloudstream Hub</span>
          </button>
        )}

        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flix-category-pill ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Title Header + Filter Button (Flix.id style) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.25rem 0.25rem 0.75rem',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 1.8vw, 1.55rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Trending in {getCategoryTitle()}
          </h2>
        </div>

        {/* Filter / Sort Button & Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setFilterMenuOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Filter & Sort"
          >
            <SlidersHorizontal size={17} />
          </button>

          {/* Sort Dropdown Popup */}
          {filterMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                zIndex: 40,
                width: '190px',
                background: 'var(--bg-card)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '0.45rem',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  padding: '0.35rem 0.55rem',
                  letterSpacing: '0.05em',
                }}
              >
                Sort By
              </div>
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSortChange(opt.id);
                    setFilterMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: sortBy === opt.id ? 'var(--accent)' : 'transparent',
                    color: sortBy === opt.id ? 'var(--accent-text)' : 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontWeight: sortBy === opt.id ? 800 : 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <span>{opt.label}</span>
                  {sortBy === opt.id && <Check size={14} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
