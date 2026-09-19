import React from 'react';
import { useTheme } from '../context/ThemeContext';

export interface AnimatedLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  showBadge?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'md',
  showBadge = true,
  showTagline = false,
  animated = true,
  onClick,
  className = '',
  style = {},
}) => {
  const { theme } = useTheme();
  const isDayMode = theme === 'day';

  // Sizing configurations
  const config = {
    xs: { iconSize: 24, fontSize: '1.05rem', badgeSize: '0.52rem', gap: '0.45rem', padding: '1px 5px' },
    sm: { iconSize: 32, fontSize: '1.35rem', badgeSize: '0.58rem', gap: '0.6rem', padding: '2px 6px' },
    md: { iconSize: 40, fontSize: '1.65rem', badgeSize: '0.65rem', gap: '0.75rem', padding: '2px 8px' },
    lg: { iconSize: 52, fontSize: '2.1rem', badgeSize: '0.75rem', gap: '0.9rem', padding: '3px 10px' },
    xl: { iconSize: 68, fontSize: '2.8rem', badgeSize: '0.85rem', gap: '1.1rem', padding: '4px 12px' },
    splash: { iconSize: 84, fontSize: '3.6rem', badgeSize: '0.95rem', gap: '1.35rem', padding: '5px 16px' },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`premier-logo-container ${animated ? 'premier-animated' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: config.gap,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        position: 'relative',
        ...style,
      }}
    >
      {/* Cinematic Glowing Emblem */}
      <div
        className="premier-emblem-wrap"
        style={{
          position: 'relative',
          width: `${config.iconSize}px`,
          height: `${config.iconSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {/* Ambient Halo Pulse */}
        <div
          className="premier-halo-pulse"
          style={{
            position: 'absolute',
            inset: '-20%',
            borderRadius: '50%',
            background: isDayMode
              ? 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0) 70%)'
              : 'radial-gradient(circle, var(--accent-glow) 0%, rgba(0, 240, 255, 0.15) 50%, transparent 70%)',
            filter: 'blur(8px)',
            opacity: animated ? 0.9 : 0.4,
            pointerEvents: 'none',
          }}
        />

        {/* Outer Rotating Glowing Ring */}
        <div
          className="premier-orbit-ring"
          style={{
            position: 'absolute',
            inset: '-6%',
            borderRadius: size === 'splash' || size === 'xl' ? '28%' : '24%',
            border: isDayMode
              ? '1.5px solid rgba(15, 23, 42, 0.2)'
              : '1.5px solid rgba(149, 255, 80, 0.35)',
            boxShadow: isDayMode
              ? '0 0 10px rgba(15, 23, 42, 0.1)'
              : '0 0 15px var(--accent-glow)',
            pointerEvents: 'none',
          }}
        />

        {/* SVG Monogram / Cinema Emblem */}
        <svg
          width={config.iconSize}
          height={config.iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: '100%',
            height: '100%',
            filter: isDayMode
              ? 'drop-shadow(0 4px 10px rgba(15, 23, 42, 0.15))'
              : 'drop-shadow(0 0 12px var(--accent-glow))',
          }}
        >
          <defs>
            <linearGradient id="premierGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDayMode ? '#0f172a' : 'var(--accent, #95FF50)'} />
              <stop offset="50%" stopColor={isDayMode ? '#2563eb' : '#00f0ff'} />
              <stop offset="100%" stopColor={isDayMode ? '#1e293b' : '#a855f7'} />
            </linearGradient>

            <linearGradient id="premierGradAccent" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor={isDayMode ? '#2563eb' : 'var(--accent, #95FF50)'} />
            </linearGradient>

            <filter id="premierNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Rounded Diamond / Hex Shield */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="22"
            fill={isDayMode ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' : 'rgba(10, 15, 29, 0.85)'}
            stroke="url(#premierGradMain)"
            strokeWidth="3.5"
          />

          {/* Futuristic Cinematic 'P' Monogram */}
          {/* Main Stem */}
          <path
            d="M 32 26 L 32 74"
            stroke="url(#premierGradMain)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Top Loop Curve */}
          <path
            d="M 32 30 C 58 24 74 34 74 48 C 74 62 58 64 32 64"
            stroke="url(#premierGradMain)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Glowing Play Jewel in Center */}
          <polygon
            points="46,41 46,55 58,48"
            fill="url(#premierGradAccent)"
            filter="url(#premierNeonGlow)"
          />

          {/* Sparkle Rays */}
          <circle cx="72" cy="28" r="3.5" fill={isDayMode ? '#2563eb' : '#00f0ff'} />
          <circle cx="28" cy="72" r="2.5" fill={isDayMode ? '#0f172a' : 'var(--accent)'} />
        </svg>
      </div>

      {/* Typography: PREMIER Branding */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            className="premier-brand-text"
            style={{
              fontSize: config.fontSize,
              fontWeight: 950,
              letterSpacing: '0.12em',
              lineHeight: 1,
              fontFamily: '"Outfit", "Cabinet Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
              background: isDayMode
                ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #ffffff 40%, var(--accent, #95FF50) 80%, #00f0ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: isDayMode ? 'none' : '0 0 25px rgba(149, 255, 80, 0.25)',
              position: 'relative',
              display: 'inline-block',
            }}
          >
            PREMIER
          </span>

          {showBadge && (
            <span
              className="premier-badge-pill"
              style={{
                fontSize: config.badgeSize,
                fontWeight: 900,
                letterSpacing: '0.1em',
                padding: config.padding,
                borderRadius: '6px',
                background: isDayMode
                  ? 'rgba(37, 99, 235, 0.12)'
                  : 'linear-gradient(135deg, rgba(149, 255, 80, 0.15) 0%, rgba(0, 240, 255, 0.15) 100%)',
                color: isDayMode ? '#2563eb' : 'var(--accent, #95FF50)',
                border: isDayMode
                  ? '1px solid rgba(37, 99, 235, 0.25)'
                  : '1px solid rgba(149, 255, 80, 0.35)',
                boxShadow: isDayMode ? 'none' : '0 0 10px var(--accent-glow)',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: isDayMode ? '#2563eb' : 'var(--accent, #95FF50)',
                  boxShadow: isDayMode ? 'none' : '0 0 6px var(--accent)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              4K ULTRA
            </span>
          )}
        </div>

        {showTagline && (
          <div
            style={{
              fontSize: size === 'splash' ? '0.95rem' : '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: isDayMode ? '#64748b' : 'rgba(255, 255, 255, 0.65)',
              marginTop: '4px',
            }}
          >
            Cinema • Global Live TV • CineBot AI
          </div>
        )}
      </div>
    </div>
  );
};
