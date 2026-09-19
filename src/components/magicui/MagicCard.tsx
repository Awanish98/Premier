import React, { useRef, useState } from 'react';

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
  gradientSize = 250,
  gradientColor = 'var(--accent)',
  gradientOpacity = 0.25,
  borderWidth = 1,
  style,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: -1000, y: -1000 });
      }}
      className={`magic-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'var(--bg-card)',
        border: `${borderWidth}px solid var(--border-subtle)`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
        boxShadow: isHovered 
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px -5px var(--accent-glow)' 
          : '0 8px 24px -8px rgba(0, 0, 0, 0.5)',
        ...style,
      }}
      {...props}
    >
      {/* Interactive Cursor Spotlight Glow (Magic UI) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.35s ease',
          background: `radial-gradient(${gradientSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${gradientColor} 0%, transparent 80%)`,
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
          transition: 'opacity 0.4s ease',
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
