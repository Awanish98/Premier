import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MediaItem } from '../types';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  items: MediaItem[];
  icon?: LucideIcon;
  badge?: string;
  aspectRatio?: 'poster' | 'backdrop';
  onPlay: (item: MediaItem) => void;
  onShowDetails?: (item: MediaItem) => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  icon: Icon,
  badge,
  aspectRatio = 'poster',
  onPlay,
  onShowDetails,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section style={{ margin: '2rem 0', position: 'relative' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          marginBottom: '0.8rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {Icon && <Icon size={20} color="var(--accent)" />}
          <h2
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </h2>
          {badge && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'var(--badge-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Scroll Arrows */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => scroll('left')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            title="Scroll Left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            title="Scroll Right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Row Carousel */}
      <div
        ref={rowRef}
        className="row-scroll-container"
        style={{
          padding: '0.5rem 1.5rem 1.5rem',
        }}
      >
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            aspectRatio={aspectRatio}
            onPlay={onPlay}
            onShowDetails={onShowDetails}
          />
        ))}
      </div>
    </section>
  );
};
