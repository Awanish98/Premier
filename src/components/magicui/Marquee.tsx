import React from 'react';

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  repeat?: number;
  speed?: number; // seconds for full cycle
  style?: React.CSSProperties;
}

export const Marquee: React.FC<MarqueeProps> = ({
  className = '',
  reverse = false,
  pauseOnHover = true,
  children,
  repeat = 4,
  speed = 35,
  style,
}) => {
  return (
    <div
      className={`marquee-container ${className}`}
      style={{
        display: 'flex',
        overflow: 'hidden',
        userSelect: 'none',
        gap: '1.5rem',
        maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, transparent 100%)',
        ...style,
      }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={`marquee-track ${pauseOnHover ? 'pause-on-hover' : ''}`}
          style={{
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'space-around',
            gap: '1.5rem',
            animation: `${reverse ? 'marquee-scroll-reverse' : 'marquee-scroll'} ${speed}s linear infinite`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};
