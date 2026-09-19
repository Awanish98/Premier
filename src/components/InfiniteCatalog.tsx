import React, { useState, useEffect, useRef, useCallback } from 'react';
import { queryCatalog } from '../data/mockCatalog';
import type { MediaItem, SortOption } from '../types';
import { ContentCard } from './ContentCard';
import { SkeletonCard } from './SkeletonCard';
import { CategoryFilterBar } from './CategoryFilterBar';
import { Sparkles, RefreshCw, Layers } from 'lucide-react';

interface InfiniteCatalogProps {
  type: 'all' | 'movie' | 'tv' | 'anime';
  title: string;
  subtitle?: string;
  onPlayMedia: (item: MediaItem) => void;
  onShowDetails?: (item: MediaItem) => void;
}

export const InfiniteCatalog: React.FC<InfiniteCatalogProps> = ({
  type,
  title,
  subtitle,
  onPlayMedia,
  onShowDetails,
}) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [genre, setGenre] = useState<string>('All');
  const [language, setLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial load or filter change reset
  const loadFirstPage = useCallback(() => {
    setLoading(true);
    setPage(1);

    const res = queryCatalog({
      type,
      genre,
      language,
      sortBy,
      page: 1,
      pageSize: 16,
    });

    setItems(res.items);
    setHasMore(res.hasMore);
    setTotalCount(res.total);
    setLoading(false);
  }, [type, genre, language, sortBy]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  // Load next page function
  const loadNextPage = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    const nextPage = page + 1;

    setTimeout(() => {
      const res = queryCatalog({
        type,
        genre,
        language,
        sortBy,
        page: nextPage,
        pageSize: 12,
      });

      setItems((prev) => [...prev, ...res.items]);
      setHasMore(res.hasMore);
      setPage(nextPage);
      setLoading(false);
    }, 400); // Small realistic async delay for smooth skeleton demonstration
  }, [loading, hasMore, page, type, genre, language, sortBy]);

  // IntersectionObserver for Endless Scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, loadNextPage]);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <Sparkles size={22} color="var(--accent)" />
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {title}
          </h1>
        </div>
        {subtitle && (
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Multi-Category, Language & Sort Filter Matrix */}
      <CategoryFilterBar
        selectedGenre={genre}
        onSelectGenre={setGenre}
        selectedLanguage={language}
        onSelectLanguage={setLanguage}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        totalResults={totalCount || items.length}
      />

      {/* Media Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: '1.5rem',
          minHeight: '400px',
        }}
      >
        {items.map((item, idx) => (
          <ContentCard
            key={`${item.id}-${idx}`}
            item={item}
            aspectRatio="poster"
            onPlay={onPlayMedia}
            onShowDetails={onShowDetails}
          />
        ))}

        {/* Shimmer Skeletons during page load */}
        {loading &&
          Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={`skel-${idx}`} aspectRatio="poster" />
          ))}
      </div>

      {/* Endless Scroll Trigger Sentinel */}
      <div ref={observerTarget} style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 700 }}>
            <RefreshCw size={20} className="animate-spin" />
            <span>Loading more titles seamlessly...</span>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={16} />
            <span>You have reached the end of this catalog universe.</span>
          </div>
        )}

        {items.length === 0 && !loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
            No titles matched the selected filters. Try choosing "All" genres or another language.
          </div>
        )}
      </div>
    </div>
  );
};
