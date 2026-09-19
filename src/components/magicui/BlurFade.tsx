import React, { useRef, useEffect, useState } from 'react';

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
  style?: React.CSSProperties;
}

export const BlurFade: React.FC<BlurFadeProps> = ({
  children,
  className = '',
  duration = 0.45,
  delay = 0,
  yOffset = 16,
  inView = true,
  inViewMargin = '-40px',
  blur = '8px',
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(!inView);

  useEffect(() => {
    if (!inView) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin: inViewMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [inView, inViewMargin]);

  return (
    <div
      ref={ref}
      className={`blur-fade-container ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        filter: isInView ? 'blur(0px)' : `blur(${blur})`,
        transform: isInView ? 'translateY(0px)' : `translateY(${yOffset}px)`,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, filter, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
