import React, { useMemo } from 'react';

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors: React.FC<MeteorsProps> = ({ number = 20, className = '' }) => {
  const meteors = useMemo(() => {
    return Array.from({ length: number }).map((_, idx) => ({
      id: idx,
      top: Math.floor(Math.random() * 80) + '%',
      left: Math.floor(Math.random() * 95) + '%',
      delay: Math.random() * 5 + 's',
      duration: Math.floor(Math.random() * 5 + 4) + 's',
      size: Math.floor(Math.random() * 2 + 1) + 'px',
    }));
  }, [number]);

  return (
    <div
      className={`meteors-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor-item"
          style={{
            position: 'absolute',
            top: m.top,
            left: m.left,
            width: m.size,
            height: m.size,
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 0 10px 2px var(--accent)',
            transform: 'rotate(215deg)',
            animation: `meteor-fall ${m.duration} linear infinite`,
            animationDelay: m.delay,
            opacity: 0,
          }}
        >
          {/* Meteor Tail */}
          <span
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '60px',
              height: '1px',
              background: 'linear-gradient(90deg, var(--accent), transparent)',
            }}
          />
        </span>
      ))}
    </div>
  );
};
