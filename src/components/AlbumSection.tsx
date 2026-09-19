import React, { useState, useMemo } from 'react';
import { 
  Disc, 
  Play, 
  Sparkles, 
  X, 
  Layers, 
  Star, 
  Info, 
  Check, 
  Plus, 
  Search, 
  Grid, 
  List, 
  ArrowUpDown, 
  Film, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
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
  const [albumSearch, setAlbumSearch] = useState<string>('');
  const [albumFilterPhase, setAlbumFilterPhase] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOrder, setSortOrder] = useState<'release' | 'chronological' | 'rating'>('release');
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useTheme();

  const categories = [
    'All',
    'Marvel Universe',
    'Bollywood & Pan-India',
    'Director Spotlight',
    'Franchise',
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

  // Filtered and sorted items inside the active album
  const processedAlbumItems = useMemo(() => {
    if (!activeAlbum) return [];
    let items = getAlbumMediaItems(activeAlbum);

    // Filter by Phase / Type / Audio
    if (albumFilterPhase !== 'all') {
      if (albumFilterPhase === 'phase1') {
        items = items.filter((m) => m.mcuPhase === 'Phase 1');
      } else if (albumFilterPhase === 'phase2') {
        items = items.filter((m) => m.mcuPhase === 'Phase 2');
      } else if (albumFilterPhase === 'phase3') {
        items = items.filter((m) => m.mcuPhase === 'Phase 3');
      } else if (albumFilterPhase === 'phase4') {
        items = items.filter((m) => m.mcuPhase === 'Phase 4');
      } else if (albumFilterPhase === 'phase5') {
        items = items.filter((m) => m.mcuPhase === 'Phase 5');
      } else if (albumFilterPhase === 'movies') {
        items = items.filter((m) => m.type === 'movie');
      } else if (albumFilterPhase === 'series') {
        items = items.filter((m) => m.type === 'tv' || m.type === 'anime' || m.isDisneyPlusSeries);
      } else if (albumFilterPhase === 'hindi') {
        items = items.filter((m) => m.isDualAudio || m.hasHindiDubbed || m.language === 'Hindi');
      }
    }

    // Filter by Search Query
    if (albumSearch.trim()) {
      const q = albumSearch.toLowerCase();
      items = items.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.overview.toLowerCase().includes(q) ||
          m.cast?.some((c) => c.toLowerCase().includes(q)) ||
          m.director?.toLowerCase().includes(q) ||
          (m.mcuPhase && m.mcuPhase.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortOrder === 'chronological') {
      items = [...items].sort((a, b) => (a.chronologicalOrder || 99) - (b.chronologicalOrder || 99));
    } else if (sortOrder === 'rating') {
      items = [...items].sort((a, b) => b.rating - a.rating);
    } else {
      // Default: Release order (mcuOrder or releaseYear)
      items = [...items].sort((a, b) => (a.mcuOrder || 0) - (b.mcuOrder || 0) || a.releaseYear - b.releaseYear);
    }

    return items;
  }, [activeAlbum, albumFilterPhase, albumSearch, sortOrder]);

  const isMarvelAlbum = activeAlbum?.id === 'marvel-universe';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '6rem 1.5rem 4rem' }}>
      {/* Header Billboard */}
      <div
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(0, 168, 225, 0.15) 50%, rgba(13, 21, 39, 0.95) 100%)',
          border: '1px solid var(--border-subtle)',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#ef4444',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Disc size={15} />
              PREMIER OTT SAGAS & UNIVERSES
            </span>
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#22c55e',
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '4px 10px',
                borderRadius: '999px',
              }}
            >
              🇮🇳 Hindi Dual Audio
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              color: '#fff',
              marginBottom: '0.85rem',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
            }}
          >
            Cinematic Albums & Franchise Universes
          </h1>

          <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Marvel Cinematic Universe (MCU 46+ Titles), Christopher Nolan IMAX Masterpieces, DC Extended Universe, Spider-Verse, Pan-India Blockbusters aur Desi Crime Sagas ko album format me binge karein with 4K UHD & Hindi Dual Audio streams.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                const mcu = FRANCHISE_ALBUMS.find((a) => a.id === 'marvel-universe') || FRANCHISE_ALBUMS[0];
                setActiveAlbum(mcu);
              }}
              className="btn-accent"
              style={{ padding: '0.8rem 2rem', fontSize: '0.95rem', fontWeight: 800, background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 0 25px rgba(239, 68, 68, 0.4)' }}
            >
              <Sparkles size={18} fill="#fff" />
              <span>Explore Marvel Universe (46 Titles)</span>
            </button>

            <button
              onClick={() => {
                const pan = FRANCHISE_ALBUMS.find((a) => a.id === 'pan-india-epics') || FRANCHISE_ALBUMS[1];
                setActiveAlbum(pan);
              }}
              style={{
                padding: '0.8rem 1.6rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Film size={18} color="#f59e0b" />
              <span>Pan-India Epics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2.5rem', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
              border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              borderRadius: '999px',
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: selectedCategory === cat ? 800 : 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === cat ? '0 0 15px var(--accent-glow)' : 'none',
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
            onClick={(a) => {
              setActiveAlbum(a);
              setAlbumSearch('');
              setAlbumFilterPhase('all');
              setSortOrder('release');
            }}
            onPlayFirst={handlePlayFirst}
          />
        ))}
      </div>

      {/* Comprehensive Album Detail Modal / Showcase Tracklist */}
      {activeAlbum && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            background: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(0.5rem, 2.5vh, 1.75rem) clamp(0.5rem, 2vw, 1.25rem)',
            overflow: 'hidden',
          }}
          className="animate-fade-in"
          onClick={() => setActiveAlbum(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1150px',
              height: '92vh',
              maxHeight: '92vh',
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px var(--accent-glow)',
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="custom-scrollbar"
          >
            {/* Close Button - Sticky Float */}
            <button
              onClick={() => setActiveAlbum(null)}
              style={{
                position: 'sticky',
                top: '1rem',
                right: '1rem',
                alignSelf: 'flex-end',
                marginRight: '1.25rem',
                marginBottom: '-46px',
                zIndex: 60,
                background: 'rgba(6, 7, 10, 0.85)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#fff',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                transition: 'all 0.2s ease',
              }}
              title="Close Album"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
              }}
            >
              <X size={20} />
            </button>

            {/* Album Header Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                minHeight: '320px',
                padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem) 2.5rem',
                display: 'flex',
                alignItems: 'flex-end',
                borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0,
              }}
            >
              <img
                src={activeAlbum.backdropPath || activeAlbum.coverPath}
                alt={activeAlbum.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(13,21,39,0.4) 0%, rgba(13,21,39,0.92) 75%, rgba(13,21,39,0.99) 100%)',
                }}
              />

              <div style={{ position: 'relative', zIndex: 10, maxWidth: '820px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: activeAlbum.colorTheme || 'var(--accent)',
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {activeAlbum.category}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Star size={15} fill="#fbbf24" />
                    {activeAlbum.ratingAverage.toFixed(1)} Avg Rating
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    • {activeAlbum.yearRange}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    • {getAlbumMediaItems(activeAlbum).length} Total Titles
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      color: '#22c55e',
                    }}
                  >
                    🇮🇳 Dual Audio (Hindi + Eng)
                  </span>
                </div>

                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.15 }}>
                  {activeAlbum.title}
                </h1>

                {activeAlbum.tagline && (
                  <p style={{ fontSize: '1rem', color: activeAlbum.colorTheme || 'var(--accent)', fontWeight: 700, marginBottom: '0.75rem' }}>
                    "{activeAlbum.tagline}"
                  </p>
                )}

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {activeAlbum.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      handlePlayFirst(activeAlbum);
                      setActiveAlbum(null);
                    }}
                    className="btn-accent"
                    style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem', fontWeight: 800 }}
                  >
                    <Play size={18} fill="#fff" />
                    <span>Play Album from Start (Ep 1 / Title 1)</span>
                  </button>

                  {isMarvelAlbum && (
                    <button
                      onClick={() => {
                        setSortOrder('chronological');
                        const chronologicalItems = [...getAlbumMediaItems(activeAlbum)].sort(
                          (a, b) => (a.chronologicalOrder || 99) - (b.chronologicalOrder || 99)
                        );
                        if (chronologicalItems.length > 0) {
                          onPlayMedia(chronologicalItems[0]);
                          setActiveAlbum(null);
                        }
                      }}
                      style={{
                        padding: '0.75rem 1.4rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid var(--border-subtle)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Calendar size={16} color="var(--accent)" />
                      <span>Play in MCU Story Timeline Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Album Controls: Search, Phase Filters, Sorting, and View Switcher */}
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 40,
                padding: '1rem 1.75rem',
                background: 'rgba(13, 18, 28, 0.97)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid var(--border-subtle)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
              }}
            >
              {/* Search Bar & View Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div
                  style={{
                    position: 'relative',
                    flex: 1,
                    minWidth: '240px',
                  }}
                >
                  <Search
                    size={18}
                    color="var(--accent)"
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    value={albumSearch}
                    onChange={(e) => setAlbumSearch(e.target.value)}
                    placeholder={`Search within ${activeAlbum.title} (e.g. Iron Man, Loki, Thanos, Christian Bale)...`}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '0.65rem 1rem 0.65rem 2.75rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                  {albumSearch && (
                    <button
                      onClick={() => setAlbumSearch('')}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Sort Order Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '0.3rem 0.6rem', border: '1px solid var(--border-subtle)' }}>
                    <ArrowUpDown size={14} color="var(--accent)" />
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="release" style={{ background: '#0d1527' }}>Order: Release Chronology</option>
                      {isMarvelAlbum && <option value="chronological" style={{ background: '#0d1527' }}>Order: In-Universe Story Timeline</option>}
                      <option value="rating" style={{ background: '#0d1527' }}>Order: Highest IMDb Rating</option>
                    </select>
                  </div>

                  {/* Grid / List Switcher */}
                  <div style={{ display: 'flex', gap: '2px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
                        color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.6rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="List Track View"
                    >
                      <List size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      style={{
                        background: viewMode === 'grid' ? 'var(--accent)' : 'transparent',
                        color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.6rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Grid Poster View"
                    >
                      <Grid size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Phase / Category Filter Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
                <button
                  onClick={() => setAlbumFilterPhase('all')}
                  style={{
                    background: albumFilterPhase === 'all' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                    color: albumFilterPhase === 'all' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  All Titles ({getAlbumMediaItems(activeAlbum).length})
                </button>

                {isMarvelAlbum && (
                  <>
                    <button
                      onClick={() => setAlbumFilterPhase('phase1')}
                      style={{
                        background: albumFilterPhase === 'phase1' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                        color: albumFilterPhase === 'phase1' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '999px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Phase 1 (Avengers Assemble)
                    </button>
                    <button
                      onClick={() => setAlbumFilterPhase('phase2')}
                      style={{
                        background: albumFilterPhase === 'phase2' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                        color: albumFilterPhase === 'phase2' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '999px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Phase 2 (Age of Ultron)
                    </button>
                    <button
                      onClick={() => setAlbumFilterPhase('phase3')}
                      style={{
                        background: albumFilterPhase === 'phase3' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                        color: albumFilterPhase === 'phase3' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '999px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Phase 3 (Infinity War & Endgame)
                    </button>
                    <button
                      onClick={() => setAlbumFilterPhase('phase4')}
                      style={{
                        background: albumFilterPhase === 'phase4' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                        color: albumFilterPhase === 'phase4' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '999px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Phase 4 (Multiverse Saga)
                    </button>
                    <button
                      onClick={() => setAlbumFilterPhase('phase5')}
                      style={{
                        background: albumFilterPhase === 'phase5' ? '#ef4444' : 'rgba(255, 255, 255, 0.05)',
                        color: albumFilterPhase === 'phase5' ? '#fff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '999px',
                        padding: '0.35rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Phase 5 (Incursions & Deadpool)
                    </button>
                  </>
                )}

                <button
                  onClick={() => setAlbumFilterPhase('movies')}
                  style={{
                    background: albumFilterPhase === 'movies' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                    color: albumFilterPhase === 'movies' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🎬 Movies Only
                </button>

                <button
                  onClick={() => setAlbumFilterPhase('series')}
                  style={{
                    background: albumFilterPhase === 'series' ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                    color: albumFilterPhase === 'series' ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📺 Series / TV Shows
                </button>

                <button
                  onClick={() => setAlbumFilterPhase('hindi')}
                  style={{
                    background: albumFilterPhase === 'hindi' ? '#f59e0b' : 'rgba(255, 255, 255, 0.05)',
                    color: albumFilterPhase === 'hindi' ? '#000' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🇮🇳 Hindi Dubbed
                </button>
              </div>
            </div>

            {/* Tracklist / Movie List Display */}
            <div style={{ padding: '1.75rem', flex: 1, overflow: 'visible' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Titles in this Collection ({processedAlbumItems.length})
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <ShieldCheck size={15} color="#22c55e" />
                  <span>FMHY 4K Streams Available</span>
                </div>
              </div>

              {processedAlbumItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    No titles found matching your search or filters.
                  </p>
                  <button
                    onClick={() => {
                      setAlbumSearch('');
                      setAlbumFilterPhase('all');
                    }}
                    className="btn-accent"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : viewMode === 'list' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {processedAlbumItems.map((item, index) => {
                    const inWatchlist = isInWatchlist(item.id);

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '14px',
                          padding: '0.85rem 1.15rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = activeAlbum.colorTheme || 'var(--accent)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)', width: '28px' }}>
                            {(index + 1).toString().padStart(2, '0')}
                          </span>

                          <div style={{ position: 'relative', width: '52px', height: '74px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                            <img
                              src={item.posterPath}
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {item.isDualAudio && (
                              <span
                                style={{
                                  position: 'absolute',
                                  bottom: 2,
                                  left: 2,
                                  right: 2,
                                  background: 'rgba(245, 158, 11, 0.9)',
                                  color: '#000',
                                  fontSize: '0.55rem',
                                  fontWeight: 900,
                                  textAlign: 'center',
                                  borderRadius: '3px',
                                  padding: '1px 0',
                                }}
                              >
                                DUAL
                              </span>
                            )}
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                              {item.mcuPhase && (
                                <span
                                  style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                  }}
                                >
                                  {item.mcuPhase}
                                </span>
                              )}
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
                              <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Star size={12} fill="#fbbf24" />
                                {item.rating.toFixed(1)}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                • {item.releaseYear} {item.duration ? `• ${item.duration}` : item.totalSeasons ? `• ${item.totalSeasons} S (${item.totalEpisodes || 0} Ep)` : ''}
                              </span>
                              {item.audioTrack && (
                                <span style={{ fontSize: '0.7rem', color: '#22c55e', fontWeight: 600 }}>
                                  • {item.audioTrack}
                                </span>
                              )}
                            </div>

                            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.15rem' }}>
                              {item.title}
                            </h4>

                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.overview}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
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
                                padding: '0.5rem',
                                color: '#fff',
                                cursor: 'pointer',
                              }}
                              title="View Cast & Info"
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
                              padding: '0.5rem',
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
                            style={{ padding: '0.5rem 1.15rem', fontSize: '0.82rem', fontWeight: 800 }}
                          >
                            <Play size={14} fill="#fff" />
                            <span>Play</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Grid View */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                    gap: '1.25rem',
                  }}
                >
                  {processedAlbumItems.map((item) => {
                    const inWatchlist = isInWatchlist(item.id);

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.25s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          setActiveAlbum(null);
                          onPlayMedia(item);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.borderColor = activeAlbum.colorTheme || 'var(--accent)';
                          e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.6)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '2/3', background: '#000' }}>
                          <img
                            src={item.posterPath}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(0,0,0,0.7)',
                              backdropFilter: 'blur(6px)',
                              borderRadius: '6px',
                              padding: '2px 6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.72rem',
                              color: '#fbbf24',
                              fontWeight: 800,
                            }}
                          >
                            <Star size={11} fill="#fbbf24" />
                            {item.rating.toFixed(1)}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (inWatchlist) removeFromWatchlist(item.id);
                              else addToWatchlist(item);
                            }}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              left: item.mcuPhase ? '65px' : '8px',
                              background: inWatchlist ? 'var(--accent)' : 'rgba(0,0,0,0.7)',
                              backdropFilter: 'blur(6px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '6px',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              cursor: 'pointer',
                              zIndex: 10,
                            }}
                            title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                          >
                            {inWatchlist ? <Check size={13} /> : <Plus size={13} />}
                          </button>

                          {item.mcuPhase && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '8px',
                                left: '8px',
                                background: 'rgba(239, 68, 68, 0.85)',
                                color: '#fff',
                                borderRadius: '4px',
                                padding: '2px 5px',
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                              }}
                            >
                              {item.mcuPhase}
                            </div>
                          )}

                          {item.isDualAudio && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '8px',
                                background: 'rgba(245, 158, 11, 0.9)',
                                color: '#000',
                                borderRadius: '4px',
                                padding: '2px 5px',
                                fontSize: '0.62rem',
                                fontWeight: 900,
                              }}
                            >
                              DUAL AUDIO
                            </div>
                          )}
                        </div>

                        <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '0.4rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <span>{item.releaseYear}</span>
                            <span>{item.duration || `${item.totalEpisodes || 8} Ep`}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
