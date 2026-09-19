import React from 'react';

interface AnimatedBadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'fire' | 'live' | 'gold' | 'cyan';
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  children,
  variant = 'accent',
  icon,
  className = '',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'fire':
        return { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.5)', text: '#f87171', glow: 'rgba(239, 68, 68, 0.4)' };
      case 'live':
        return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#ffffff', glow: 'rgba(239, 68, 68, 0.6)' };
      case 'gold':
        return { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.5)', text: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' };
      case 'cyan':
        return { bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.5)', text: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)' };
      default:
        return { bg: 'var(--badge-bg)', border: 'var(--accent)', text: 'var(--accent)', glow: 'var(--accent-glow)' };
    }
  };

  const colors = getColors();

  return (
    <span
      className={`animated-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '3px 9px',
        borderRadius: '999px',
        fontSize: '0.72rem',
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        boxShadow: `0 0 12px ${colors.glow}`,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {variant === 'live' && <span className="live-pulse" style={{ width: '6px', height: '6px' }} />}
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
