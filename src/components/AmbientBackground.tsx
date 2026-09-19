import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AmbientBackground: React.FC = () => {
  const { activeHeroItem, theme, isDayMode } = useTheme();

  // Dynamic color resolution based on active movie or fallback theme
  const getThemeFallbackColor = () => {
    switch (theme) {
      case 'day':
        return '#3b82f6';
      case 'night':
        return '#38bdf8';
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
        return '#3b82f6';
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
        background: isDayMode 
          ? 'linear-gradient(135deg, #d3dce6 0%, #e2e8f0 45%, #cad7e3 100%)' 
          : 'var(--bg-primary)',
        transform: 'translateZ(0)',
        willChange: 'transform',
        transition: 'background 0.4s ease',
      }}
      aria-hidden="true"
      className="ambient-background-root"
    >
      {/* Blurred Movie Backdrop Aura */}
      {backdropUrl && (
        <div
          key={backdropUrl}
          style={{
            position: 'absolute',
            inset: '-5%',
            width: '110%',
            height: '110%',
            backgroundImage: `url(${backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            opacity: isDayMode ? 0.18 : 0.3,
            transform: 'translateZ(0)',
            filter: isDayMode ? 'saturate(1.2)' : 'none',
          }}
          className="desktop-ambient-aura"
        />
      )}

      {/* Lightweight GPU-Optimized Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: 'min(700px, 90vw)',
          height: 'min(700px, 90vw)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}${isDayMode ? '33' : '26'} 0%, transparent 70%)`,
          transform: 'translateZ(0)',
        }}
        className="aurora-orb-1"
      />

      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '-5%',
          width: 'min(600px, 80vw)',
          height: 'min(600px, 80vw)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${primaryColor}${isDayMode ? '22' : '1a'} 0%, transparent 70%)`,
          transform: 'translateZ(0)',
        }}
        className="aurora-orb-2"
      />

      {/* Vignette Overlays for Crisp Text Legibility (Day vs Night adapted) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDayMode
            ? 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(213, 223, 233, 0.45) 85%, var(--bg-primary) 100%)'
            : 'radial-gradient(circle at 50% 30%, transparent 30%, rgba(6, 7, 10, 0.75) 85%, var(--bg-primary) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDayMode
            ? 'linear-gradient(180deg, rgba(213, 223, 233, 0.2) 0%, rgba(213, 223, 233, 0.5) 60%, var(--bg-primary) 100%)'
            : 'linear-gradient(180deg, rgba(6, 7, 10, 0.2) 0%, rgba(6, 7, 10, 0.6) 60%, var(--bg-primary) 100%)',
        }}
      />
    </div>
  );
};
