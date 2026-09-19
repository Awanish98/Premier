import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`bento-grid-container ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  name: string;
  className?: string;
  background?: React.ReactNode;
  Icon?: React.ElementType;
  description: string;
  href?: string;
  cta?: string;
  badge?: string;
  subBadge?: string;
  themeColor?: string;
  onClick?: () => void;
  colSpan?: number;
  style?: React.CSSProperties;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  name,
  className = '',
  background,
  Icon,
  description,
  cta = 'Explore Saga',
  badge,
  subBadge,
  themeColor = 'var(--accent)',
  onClick,
  colSpan = 1,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bento-card group ${className}`}
      style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '280px',
        padding: '1.75rem',
        cursor: 'pointer',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.7)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = themeColor;
        e.currentTarget.style.boxShadow = `0 20px 45px -10px rgba(0, 0, 0, 0.9), 0 0 30px ${themeColor}44`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.7)';
      }}
    >
      {/* Background Media with Dark Gradient & Zoom on Hover */}
      {background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {background}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(6,7,10,0.96) 0%, rgba(6,7,10,0.65) 55%, rgba(6,7,10,0.25) 100%)',
            }}
          />
        </div>
      )}

      {/* Top Header with Icon & Badges */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        {Icon ? (
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(6, 7, 10, 0.8)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${themeColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: themeColor,
              boxShadow: `0 0 16px ${themeColor}55`,
            }}
          >
            <Icon size={22} />
          </div>
        ) : <div />}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {subBadge && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {subBadge}
            </span>
          )}

          {badge && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '999px',
                background: `${themeColor}25`,
                color: themeColor,
                border: `1px solid ${themeColor}`,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', paddingTop: '2rem' }}>
        <h3
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.45rem)',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            color: '#ffffff',
            marginBottom: '0.4rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            marginBottom: '1.15rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Action Button CTA */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: themeColor,
            background: 'rgba(6, 7, 10, 0.65)',
            backdropFilter: 'blur(10px)',
            padding: '0.4rem 0.9rem',
            borderRadius: '8px',
            border: `1px solid ${themeColor}44`,
            transition: 'all 0.2s ease',
          }}
        >
          <span>{cta}</span>
          <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
};
