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

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useTheme();
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const total = items.length;

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
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        maxHeight: '940px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 2rem 5rem',
        overflow: 'hidden',
        background: '#040508',
      }}
    >
      {/* Background Image Layer with Ken Burns Animation & Smooth Crossfade */}
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

      {/* Dynamic Ambient Color Spotlight based on movie accent */}
      <div
        className="hero-glow-pulse"
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          opacity: 0.35,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Cinematic Vignette Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(4,5,8,0.35) 0%, rgba(4,5,8,0.65) 60%, var(--bg-primary) 100%)',
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, var(--bg-primary) 0%, rgba(4,5,8,0.85) 38%, rgba(4,5,8,0.2) 75%, transparent 100%)',
          zIndex: 3,
        }}
      />

      {/* Ambient Shooting Meteors Effect */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
        <Meteors number={24} />
      </div>

      {/* Left / Right Chevron Controls */}
      <button
        onClick={prevSlide}
        className="hero-nav-arrow"
        style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 25 }}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={26} />
      </button>

      <button
        onClick={nextSlide}
        className="hero-nav-arrow"
        style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', zIndex: 25 }}
        aria-label="Next Slide"
      >
        <ChevronRight size={26} />
      </button>

      {/* Hero Content Main Viewport */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '880px',
          width: '100%',
          margin: '0 auto 0 0',
        }}
      >
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.15rem', flexWrap: 'wrap' }}>
          {current.platformBadge && (
            <AnimatedBadge variant="accent" icon={<Sparkles size={13} />}>
              {current.platformBadge} EXCLUSIVE
            </AnimatedBadge>
          )}

          {(current.isDualAudio || current.hasHindiDubbed || current.language === 'Hindi') && (
            <AnimatedBadge variant="gold">
              🇮🇳 Dual Audio (Hindi + Eng 4K)
            </AnimatedBadge>
          )}

          {/* IMDb Rating Badge */}
          <span
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(12px)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#fbbf24',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.15)',
            }}
          >
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            <span>{current.rating.toFixed(1)}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '0.72rem' }}>IMDb</span>
          </span>

          {/* Rotten Tomatoes Score (if present) */}
          {current.rottenTomatoesScore && (
            <span
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(12px)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
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
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 800,
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              letterSpacing: '0.04em',
            }}
          >
            4K UHD • HDR10+ • ATMOS
          </span>

          {current.ageRating && (
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '0.25rem 0.55rem',
                borderRadius: '4px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {current.ageRating}
            </span>
          )}

          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {current.releaseYear}
          </span>
          {current.duration && (
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              • {current.duration}
            </span>
          )}
          {current.totalSeasons && (
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              • {current.totalSeasons} {current.totalSeasons > 1 ? 'Seasons' : 'Season'}
            </span>
          )}
        </div>

        {/* Tagline Preview */}
        {current.tagline && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: accentColor,
              marginBottom: '0.6rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <Flame size={15} />
            <span>{current.tagline}</span>
          </div>
        )}

        {/* Main Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.4rem, 5.8vw, 4.8rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '1.15rem',
            letterSpacing: '-0.025em',
            textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.5)',
            color: '#ffffff',
          }}
        >
          {current.title}
        </h1>

        {/* Overview Description */}
        <p
          style={{
            fontSize: 'clamp(0.98rem, 1.25vw, 1.15rem)',
            color: 'rgba(243, 244, 246, 0.88)',
            lineHeight: 1.65,
            marginBottom: '1.4rem',
            maxWidth: '720px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 2px 14px rgba(0,0,0,0.9)',
          }}
        >
          {current.overview}
        </p>

        {/* Cast & Director Pill Information */}
        {current.cast && current.cast.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Starring:
            </span>
            {current.cast.slice(0, 4).map((actor, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.85)',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {actor}
              </span>
            ))}
          </div>
        )}

        {/* Genres Pill List */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {current.genres.map((g) => (
            <span
              key={g}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Action Controls & Shimmer Play Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <ShimmerButton
            onClick={() => onPlay(current)}
            style={{ fontSize: '1.05rem', padding: '0.85rem 2.4rem', fontWeight: 800 }}
          >
            <Play size={22} fill="currentColor" />
            <span>Watch Stream (4K)</span>
          </ShimmerButton>

          {current.trailerUrl && (
            <button
              onClick={() => setTrailerModalOpen(true)}
              className="btn-secondary"
              style={{
                fontSize: '0.96rem',
                padding: '0.85rem 1.6rem',
                background: 'rgba(255, 255, 255, 0.12)',
                borderColor: 'rgba(255, 255, 255, 0.25)',
              }}
            >
              <Film size={19} color={accentColor} />
              <span>Watch Trailer</span>
            </button>
          )}

          <button
            onClick={toggleWatchlist}
            className="btn-secondary"
            style={{ fontSize: '0.96rem', padding: '0.85rem 1.4rem' }}
          >
            {inWatchlist ? <Check size={19} color="var(--accent)" /> : <Plus size={19} />}
            <span>{inWatchlist ? 'In Watchlist' : 'Add to List'}</span>
          </button>

          <button
            onClick={() => onShowDetails(current)}
            className="btn-secondary"
            style={{ fontSize: '0.96rem', padding: '0.85rem 1.25rem' }}
            title="More Information"
          >
            <Info size={19} />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Interactive Filmstrip Thumbnail Selector (Right Bottom) */}
      <div
        className="hero-filmstrip-container"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2.5rem',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.75rem',
        }}
      >
        {/* Filmstrip Title & Sound Equalizer Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700 }}>
            <Clapperboard size={14} color="var(--accent)" />
            <span>TOP BLOCKBUSTERS ({currentIndex + 1}/{total})</span>
          </div>

          {/* Sound Toggle with Equalizer Waveform */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              background: 'rgba(10, 14, 23, 0.75)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              borderRadius: '999px',
              padding: '0.35rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            title={isMuted ? 'Turn Sound Mode On' : 'Mute Ambient Audio'}
          >
            {!isMuted && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '14px' }}>
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
                <span className="equalizer-bar" />
              </div>
            )}
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} color="var(--accent)" />}
            <span>{isMuted ? 'Ambient Muted' : 'Audio Live'}</span>
          </button>
        </div>

        {/* Thumbnail Cards Row with Progress Bars */}
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            background: 'rgba(6, 7, 10, 0.75)',
            backdropFilter: 'blur(20px)',
            padding: '0.65rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            maxWidth: '620px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
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
                  borderColor: isActive ? (item.accentColor || 'var(--accent)') : 'transparent',
                }}
              >
                <img src={item.backdropPath || item.posterPath} alt={item.title} />
                
                {/* Title Overlay in Thumbnail */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)',
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
