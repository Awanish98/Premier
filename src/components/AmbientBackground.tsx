import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AmbientBackground: React.FC = () => {
  const { activeHeroItem, theme } = useTheme();

  // Dynamic color resolution based on active movie or fallback theme
  const getThemeFallbackColor = () => {
    switch (theme) {
      case 'cinejoy':
        return '#95FF50';
      case 'prime':
        return '#00a8e1';
      case 'netflix':
        return '#e50914';
      case 'disney':
        return '#0284c7';
      case 'cyberpunk':
        return '#a855f7';
      default:
        return '#95FF50';
    }
  };

  const primaryColor = activeHeroItem?.accentColor || getThemeFallbackColor();
  const backdropUrl = activeHeroItem?.backdropPath || activeHeroItem?.posterPath;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        transition: 'background-color 0.5s ease',
      }}
      aria-hidden="true"
    >
      {/* Layer 1: Blurred Movie Backdrop Aura (Cinejoy Atmosphere Glow) */}
      {backdropUrl && (
        <div
          key={backdropUrl}
          style={{
            position: 'absolute',
            inset: '-10%',
            width: '120%',
            height: '120%',
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            filter: 'blur(90px) saturate(200%) brightness(0.4)',
            opacity: 0.38,
            transition: 'opacity 1.2s ease-in-out',
            transform: 'scale(1.05)',
            willChange: 'opacity, transform',
          }}
          className="ambient-aura-drift"
        />
      )}

      {/* Layer 2: Animated Floating Aurora Glow Orb 1 (Top Left Primary Glow) */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 65%)`,
          filter: 'blur(120px)',
          opacity: 0.42,
          transition: 'background 1s ease',
        }}
        className="aurora-orb-1"
      />

      {/* Layer 3: Animated Floating Aurora Glow Orb 2 (Right Mid Secondary Glow) */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '-5%',
          width: '680px',
          height: '680px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 65%)`,
          filter: 'blur(130px)',
          opacity: 0.32,
          transition: 'background 1s ease',
        }}
        className="aurora-orb-2"
      />

      {/* Layer 4: Animated Floating Aurora Glow Orb 3 (Bottom Center Ambient Glow) */}
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '35%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          filter: 'blur(140px)',
          opacity: 0.28,
          transition: 'background 1s ease',
        }}
        className="aurora-orb-3"
      />

      {/* Layer 5: Cosmic Subtle Dust / Stars Field */}
      <div className="ambient-stars-layer" />

      {/* Layer 6: Vignette Overlays for Crisp Text Legibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 30%, transparent 20%, rgba(6, 7, 10, 0.75) 85%, var(--bg-primary) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(6, 7, 10, 0.2) 0%, rgba(6, 7, 10, 0.6) 60%, var(--bg-primary) 100%)',
        }}
      />
    </div>
  );
};
