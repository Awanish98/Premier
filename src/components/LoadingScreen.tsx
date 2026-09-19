import React, { useState, useEffect } from 'react';
import { AnimatedLogo } from './AnimatedLogo';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Tv, ShieldCheck } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  minDurationMs = 1400,
}) => {
  const { theme } = useTheme();
  const isDayMode = theme === 'day';

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing 4K Cinema Engine...');
  const [isFading, setIsFading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const intervalTime = 30;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / minDurationMs) * 100));
      setProgress(currentProgress);

      if (currentProgress < 25) {
        setStatusText('Initializing PREMIER Core 4K Engine...');
      } else if (currentProgress < 55) {
        setStatusText('Connecting 10,000+ Worldwide Live TV & IPTV Streams...');
      } else if (currentProgress < 85) {
        setStatusText('Calibrating CineBot AI Cinema Connoisseur...');
      } else if (currentProgress < 100) {
        setStatusText('Finalizing Ultra-HD Dolby Atmos Audio...');
      } else {
        setStatusText('Welcome to PREMIER • Ready');
        clearInterval(timer);

        // Start fading out after reaching 100%
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsFinished(true);
            if (onComplete) onComplete();
          }, 450);
        }, 150);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [minDurationMs, onComplete]);

  // Handle immediate skip on user tap/click
  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 250);
  };

  if (isFinished) return null;

  return (
    <div
      onClick={handleSkip}
      className={`premier-loading-overlay ${isFading ? 'premier-loading-fadeout' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: isDayMode
          ? 'radial-gradient(circle at 50% 40%, #ffffff 0%, #e2ebf4 50%, #cad7e3 100%)'
          : 'radial-gradient(circle at 50% 40%, #0c1220 0%, #06070a 60%, #030406 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s ease, filter 0.45s ease',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.03)' : 'scale(1)',
        filter: isFading ? 'blur(6px)' : 'none',
        pointerEvents: isFading ? 'none' : 'auto',
      }}
    >
      {/* Background Ambient Animated Light Spheres */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: isDayMode
            ? 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, var(--accent-glow, rgba(149, 255, 80, 0.25)) 0%, rgba(0, 240, 255, 0.12) 40%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'premierPulseGlow 3s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDayMode
            ? 'linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)'
            : 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      {/* Center Hero Stage */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '560px',
          width: '100%',
        }}
      >
        {/* Animated Brand Logo in Hero Splash Size */}
        <div style={{ marginBottom: '1.75rem', transform: 'scale(1.1)' }}>
          <AnimatedLogo size="splash" showTagline={false} animated={true} />
        </div>

        {/* Cinematic Subtitle */}
        <p
          style={{
            fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: isDayMode ? '#475569' : 'rgba(255, 255, 255, 0.75)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span>4K Cinema</span>
          <span>•</span>
          <span>Global Live TV</span>
          <span>•</span>
          <span>CineBot AI</span>
        </p>

        {/* Glowing Progress Bar Container */}
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            position: 'relative',
            marginBottom: '1rem',
          }}
        >
          {/* Progress Bar Track */}
          <div
            style={{
              height: '6px',
              borderRadius: '999px',
              background: isDayMode ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
              border: isDayMode ? '1px solid rgba(15, 23, 42, 0.12)' : '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: isDayMode ? 'none' : 'inset 0 1px 3px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Glowing Active Progress Fill */}
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: '999px',
                background: isDayMode
                  ? 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)'
                  : 'linear-gradient(90deg, var(--accent, #95FF50) 0%, #00f0ff 60%, #a855f7 100%)',
                boxShadow: isDayMode
                  ? '0 0 10px rgba(37, 99, 235, 0.5)'
                  : '0 0 16px var(--accent-glow, rgba(149, 255, 80, 0.8)), 0 0 8px #00f0ff',
                transition: 'width 0.06s ease-out',
                position: 'relative',
              }}
            >
              {/* Shimmer Light Bar */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'premierProgressShimmer 1.2s infinite linear',
                }}
              />
            </div>
          </div>

          {/* Progress Details (Percentage & Status) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.65rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: isDayMode ? '#334155' : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isDayMode ? '#2563eb' : 'var(--accent, #95FF50)' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'currentColor',
                  animation: 'pulse 1s infinite',
                }}
              />
              <span style={{ fontWeight: 800 }}>{statusText}</span>
            </div>
            <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.82rem' }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: isDayMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
              border: isDayMode ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isDayMode ? '#0f172a' : 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <ShieldCheck size={13} color={isDayMode ? '#2563eb' : 'var(--accent)'} />
            <span>Ad-Free Ready</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: isDayMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
              border: isDayMode ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isDayMode ? '#0f172a' : 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <Tv size={13} color={isDayMode ? '#2563eb' : '#00f0ff'} />
            <span>50+ Countries Live TV</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '999px',
              background: isDayMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
              border: isDayMode ? '1px solid rgba(15, 23, 42, 0.1)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: isDayMode ? '#0f172a' : 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <Sparkles size={13} color={isDayMode ? '#2563eb' : '#a855f7'} />
            <span>CineBot AI Assistant</span>
          </div>
        </div>

        {/* Tap to skip hint */}
        <div
          style={{
            marginTop: '2.5rem',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: isDayMode ? '#94a3b8' : 'rgba(255, 255, 255, 0.35)',
            transition: 'color 0.2s ease',
          }}
        >
          Click or tap anywhere to enter
        </div>
      </div>
    </div>
  );
};
