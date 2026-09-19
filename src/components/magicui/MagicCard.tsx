import React, { useRef, useState, useEffect } from 'react';

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  borderWidth?: number;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = '',
  gradientSize = 240,
  gradientColor = 'var(--accent)',
  gradientOpacity = 0.25,
  borderWidth = 1,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (!isTouchDevice.current) setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={`magic-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: `${borderWidth}px solid var(--border-subtle)`,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease',
        transform: 'translateZ(0)',
        willChange: 'transform',
        ...style,
      }}
      {...props}
    >
      {/* Interactive Cursor Spotlight Glow (Pure CSS variables for zero re-renders) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.25s ease',
          background: `radial-gradient(${gradientSize}px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), ${gradientColor} 0%, transparent 80%)`,
          mixBlendMode: 'screen',
          zIndex: 1,
        }}
      />

      {/* Subtle Ambient Radial Highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isHovered ? gradientOpacity : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(circle at 50% 0%, var(--accent-glow) 0%, transparent 70%)`,
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
};
