import React from 'react';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children: React.ReactNode;
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  shimmerColor = 'var(--accent)',
  shimmerSize = '0.08em',
  borderRadius = '12px',
  shimmerDuration = '2.5s',
  background = 'var(--accent)',
  className = '',
  children,
  style,
  ...props
}) => {
  return (
    <button
      className={`shimmer-button ${className}`}
      style={{
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        border: 'none',
        borderRadius,
        background,
        color: 'var(--accent-text)',
        fontWeight: 800,
        padding: '0.75rem 1.6rem',
        fontSize: '0.95rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        boxShadow: '0 0 20px var(--accent-glow), 0 8px 16px rgba(0,0,0,0.4)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
        e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow), 0 12px 24px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow), 0 8px 16px rgba(0,0,0,0.4)';
      }}
      {...props}
    >
      {/* Shimmer Light Streak Layer */}
      <div
        className="shimmer-streak"
        style={{
          position: 'absolute',
          top: 0,
          left: '-150%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.45) 50%, transparent 100%)',
          transform: 'skewX(-25deg)',
          animation: `shimmer-sweep ${shimmerDuration} ease-in-out infinite`,
          pointerEvents: 'none',
        }}
      />

      {/* Button Content */}
      <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </span>
    </button>
  );
};
