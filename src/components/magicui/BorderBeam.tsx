import React from 'react';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  size = 200,
  duration = 12,
  borderWidth = 1.5,
  colorFrom = 'var(--accent)',
  colorTo = '#ffffff',
  delay = 0,
  className = '',
  style,
}) => {
  return (
    <div
      className={`border-beam-wrapper ${className}`}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        border: `${borderWidth}px solid transparent`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        padding: `${borderWidth}px`,
        zIndex: 10,
        ...style,
      }}
    >
      <div
        className="border-beam-spinner"
        style={{
          position: 'absolute',
          inset: `-${size / 2}px`,
          width: `calc(100% + ${size}px)`,
          height: `calc(100% + ${size}px)`,
          background: `radial-gradient(circle at center, ${colorFrom} 10%, ${colorTo} 40%, transparent 70%)`,
          animation: `border-beam-spin ${duration}s linear infinite`,
          animationDelay: `-${delay}s`,
        }}
      />
    </div>
  );
};
