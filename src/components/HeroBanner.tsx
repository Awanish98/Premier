import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Info, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Clapperboard, 
  Film, 
  X,
  Flame
} from 'lucide-react';
import type { MediaItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Meteors } from './magicui/Meteors';
import { ShimmerButton } from './magicui/ShimmerButton';
import { AnimatedBadge } from './magicui/AnimatedBadge';

interface HeroBannerProps {
  items: MediaItem[];
  onPlay: (item: MediaItem) => void;
  onShowDetails: (item: MediaItem) => void;
}

const SLIDE_DURATION = 8000; // 8 seconds per slide

export const HeroBanner: React.FC<HeroBannerProps> = ({ items, onPlay, onShowDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { isInWatchlist, addToWatchlist, removeFromWatchlist, setActiveHeroItem } = useTheme();
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const total = items.length;

  // Sync active slide with global ambient background
  useEffect(() => {
    if (items && items[currentIndex]) {
      setActiveHeroItem(items[currentIndex]);
    }
  }, [currentIndex, items, setActiveHeroItem]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (trailerModalOpen) return;
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, trailerModalOpen]);

  // Slide timer & progress tracking
  useEffect(() => {
    if (trailerModalOpen || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const startTime = Date.now();
    setProgress(0);

    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
    }, 50);

    timerRef.current = window.setTimeout(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isHovered, trailerModalOpen, nextSlide]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];
  const inWatchlist = isInWatchlist(current.id);
  const accentColor = current.accentColor || 'var(--accent)';

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(current.id);
    } else {
      addToWatchlist(current);
    }
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    setTouchStart(null);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="hero-banner-root"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'clamp(580px, 86vh, 900px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(6.2rem, 11vh, 8.2rem) clamp(1rem, 3vw, 2rem) clamp(1.25rem, 3vh, 2.5rem)',
        overflow: 'hidden',
        background: '#040508',
      }}
    >
      {/* Background Image Layer with Ken Burns Animation */}
      <div
        key={current.id}
        className="hero-ken-burns"
        style={{
          position: 'absolute',
          inset: '-20px',
          backgroundImage: `url(${current.backdropPath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 1,
        }}
      />

      {/* Dynamic Ambient Color Spotlight */}
      <div
        className="hero-glow-pulse"
        style={{
          position: 'absolute',
          top: '25%',
          left: '5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          filter: 'blur(110px)',
          opacity: 0.35,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Cinematic Vignette Overlays for Maximum Text Contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(4,5,8,0.55) 0%, rgba(4,5,8,0.5) 40%, rgba(4,5,8,0.85) 75%, var(--bg-primary) 100%)',
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, var(--bg-primary) 0%, rgba(4,5,8,0.9) 35%, rgba(4,5,8,0.4) 70%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Ambient Shooting Meteors Effect */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
        <Meteors number={20} />
      </div>

      {/* Hero Content & Filmstrip Responsive Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1480px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Main Movie Presentation Area */}
        <div style={{ maxWidth: '820px', width: '100%' }}>
          {/* Top Badges Row */}
          <div className="hero-badges-row" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
            {current.platformBadge && (
              <AnimatedBadge variant="accent" icon={<Sparkles size={13} />}>
                {current.platformBadge} EXCLUSIVE
              </AnimatedBadge>
            )}

            {(current.isDualAudio || current.hasHindiDubbed || current.language === 'Hindi') && (
              <AnimatedBadge variant="gold">
                🇮🇳 Dual Audio (Hindi + Eng)
              </AnimatedBadge>
            )}

            {/* IMDb Rating Badge */}
            <span
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(12px)',
                padding: '0.25rem 0.6rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: '#fbbf24',
                border: '1px solid rgba(251, 191, 36, 0.4)',
              }}
            >
              <Star size={13} fill="#fbbf24" color="#fbbf24" />
              <span>{current.rating.toFixed(1)}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.7rem' }}>IMDb</span>
            </span>

            {/* Rotten Tomatoes Score (if present) */}
            {current.rottenTomatoesScore && (
              <span
                className="hero-badge-hide-mobile"
                style={{
                  background: 'rgba(239, 68, 68, 0.18)',
                  backdropFilter: 'blur(12px)',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                }}
              >
                🍅 {current.rottenTomatoesScore}% Fresh
              </span>
            )}

            {/* Quality Badge */}
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                padding: '0.22rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                letterSpacing: '0.04em',
              }}
            >
              4K UHD • ATMOS
            </span>

            {current.ageRating && (
              <span
                className="hero-badge-hide-mobile"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.22rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                {current.ageRating}
              </span>
            )}

            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {current.releaseYear}
            </span>
            {current.duration && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                • {current.duration}
              </span>
            )}
            {current.totalSeasons && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                • {current.totalSeasons} {current.totalSeasons > 1 ? 'Seasons' : 'Season'}
              </span>
            )}
          </div>

          {/* Tagline */}
          {current.tagline && (
            <div
              className="hero-tagline-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.84rem',
                fontWeight: 700,
                color: accentColor,
                marginBottom: '0.35rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <Flame size={14} />
              <span>{current.tagline}</span>
            </div>
          )}

          {/* Main Title */}
          <h1
            className="hero-title-text"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.08,
              marginBottom: '0.65rem',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.95)',
              color: '#ffffff',
            }}
          >
            {current.title}
          </h1>

          {/* Overview Description */}
          <p
            className="hero-overview-text"
            style={{
              fontSize: 'clamp(0.85rem, 1.15vw, 1.05rem)',
              color: 'rgba(243, 244, 246, 0.88)',
              lineHeight: 1.55,
              marginBottom: '0.85rem',
              maxWidth: '680px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {current.overview}
          </p>

          {/* Cast pills */}
          {current.cast && current.cast.length > 0 && (
            <div className="hero-cast-row" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Starring:
              </span>
              {current.cast.slice(0, 3).map((actor, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.85)',
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.18rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {actor}
                </span>
              ))}
            </div>
          )}

          {/* Genres Pills */}
          <div className="hero-genres-row" style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.15rem', flexWrap: 'wrap' }}>
            {current.genres.map((g) => (
              <span
                key={g}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hero-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
            <ShimmerButton
              onClick={() => onPlay(current)}
              className="hero-play-main-btn"
              style={{ fontSize: '0.92rem', padding: '0.7rem 1.6rem', fontWeight: 800 }}
            >
              <Play size={17} fill="currentColor" />
              <span>Watch Stream (4K)</span>
            </ShimmerButton>

            {current.trailerUrl && (
              <button
                onClick={() => setTrailerModalOpen(true)}
                className="btn-secondary hero-trailer-btn"
                style={{
                  fontSize: '0.84rem',
                  padding: '0.7rem 1.1rem',
                  background: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                }}
              >
                <Film size={15} color={accentColor} />
                <span>Trailer</span>
              </button>
            )}

            <button
              onClick={toggleWatchlist}
              className="btn-secondary hero-secondary-btn"
              style={{ fontSize: '0.84rem', padding: '0.7rem 1rem' }}
            >
              {inWatchlist ? <Check size={15} color="var(--accent)" /> : <Plus size={15} />}
              <span>{inWatchlist ? 'Saved' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => onShowDetails(current)}
              className="btn-secondary hero-secondary-btn"
              style={{ fontSize: '0.84rem', padding: '0.7rem 0.9rem' }}
              title="More Information"
            >
              <Info size={15} />
              <span>Details</span>
            </button>
          </div>
        </div>

        {/* Filmstrip Thumbnail Rail & Bottom Controls (Desktop / Tablet) */}
        <div
          className="hero-filmstrip-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '1rem',
          }}
        >
          {/* Rail Header with Slide Index, Prev/Next buttons, and Audio Mode */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700 }}>
                <Clapperboard size={14} color="var(--accent)" />
                <span>FEATURED BLOCKBUSTERS ({currentIndex + 1}/{total})</span>
              </div>

              {/* Prev / Next Chevrons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  onClick={prevSlide}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={nextSlide}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                background: 'rgba(10, 14, 23, 0.75)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.35rem 0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              title={isMuted ? 'Turn Sound Mode On' : 'Mute Ambient Audio'}
            >
              {!isMuted && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                  <span className="equalizer-bar" />
                </div>
              )}
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} color="var(--accent)" />}
              <span>{isMuted ? 'Ambient Muted' : 'Audio Live'}</span>
            </button>
          </div>

          {/* Filmstrip Cards Row */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '0.35rem 0.15rem 0.75rem',
            }}
          >
            {items.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => goToSlide(idx)}
                  className={`hero-filmstrip-item ${isActive ? 'active' : ''}`}
                  style={{
                    borderColor: isActive ? (item.accentColor || 'var(--accent)') : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <img
                    src={item.backdropPath || item.posterPath}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        item.posterPath ||
                        'https://image.tmdb.org/t/p/w780/rstcAnBeCkxNQjNp3YXrF6IP1tW.jpg';
                    }}
                  />
                  
                  {/* Title Overlay in Thumbnail */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.85) 100%)',
                      padding: '0.35rem 0.45rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* Progress bar inside active item */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'rgba(255,255,255,0.2)',
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: item.accentColor || 'var(--accent)',
                          transition: 'width 0.05s linear',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Dot Indicators (Visible on Screens <= 900px) */}
        <div
          className="hero-mobile-dots"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0 0',
          }}
        >
          <style>{`
            @media (max-width: 900px) {
              .hero-mobile-dots { display: flex !important; }
            }
          `}</style>
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(idx)}
                style={{
                  width: isActive ? '24px' : '7px',
                  height: '7px',
                  borderRadius: '999px',
                  background: isActive ? (item.accentColor || 'var(--accent)') : 'rgba(255, 255, 255, 0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0,
                  boxShadow: isActive ? `0 0 10px ${item.accentColor || 'var(--accent)'}` : 'none',
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Global Embedded 4K Trailer Modal */}
      {trailerModalOpen && current.trailerUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 150,
            background: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          className="animate-fade-in"
          onClick={() => setTrailerModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '1080px',
              background: 'var(--bg-secondary)',
              borderRadius: '20px',
              border: `1px solid ${accentColor}`,
              boxShadow: `0 25px 60px rgba(0, 0, 0, 0.95), 0 0 50px ${accentColor}44`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                background: 'rgba(6,7,10,0.85)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Film size={20} color={accentColor} />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    {current.title} — Official 4K Trailer
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Cinematic Preview • {current.releaseYear} • {current.genres.join(', ')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setTrailerModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Trailer Iframe Player */}
            <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`${current.trailerUrl}?autoplay=1&rel=0&modestbranding=1`}
                title={`${current.title} Trailer`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.5rem',
                background: 'rgba(6,7,10,0.9)',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Ready to stream the full movie or series?
              </span>

              <ShimmerButton
                onClick={() => {
                  setTrailerModalOpen(false);
                  onPlay(current);
                }}
                style={{ padding: '0.65rem 1.8rem', fontSize: '0.9rem' }}
              >
                <Play size={17} fill="currentColor" />
                <span>Start Full Playback</span>
              </ShimmerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
