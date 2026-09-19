import React from 'react';

interface SkeletonCardProps {
  aspectRatio?: 'poster' | 'backdrop';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ aspectRatio = 'poster' }) => {
  const isPoster = aspectRatio === 'poster';

  return (
    <div
      style={{
        width: isPoster ? '190px' : '300px',
        height: isPoster ? '280px' : '175px',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--border-subtle)',
      }}
      className="skeleton-box"
    >
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ height: '12px', width: '70%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
        <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }} />
      </div>
    </div>
  );
};
