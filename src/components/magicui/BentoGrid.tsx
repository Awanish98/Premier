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
      className={`bento-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
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
  onClick,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bento-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '260px',
        padding: '1.5rem',
        cursor: 'pointer',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.6)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px var(--accent-glow)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.6)';
      }}
    >
      {/* Background Media Container with Dark Gradient Overlay */}
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
              background: 'linear-gradient(to top, rgba(6,7,10,0.95) 0%, rgba(6,7,10,0.6) 50%, rgba(6,7,10,0.2) 100%)',
            }}
          />
        </div>
      )}

      {/* Top Header Row with Icon & Badge */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--badge-bg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              boxShadow: '0 0 15px var(--accent-glow)',
            }}
          >
            <Icon size={22} />
          </div>
        )}

        {badge && (
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 9px',
              borderRadius: '999px',
              background: 'var(--badge-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              letterSpacing: '0.04em',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Bottom Content Area */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto', paddingTop: '1.5rem' }}>
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            color: '#ffffff',
            marginBottom: '0.35rem',
            lineHeight: 1.25,
          }}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.45,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Action Button */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: 'var(--accent)',
          }}
        >
          <span>{cta}</span>
          <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
};
