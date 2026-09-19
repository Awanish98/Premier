import React, { useEffect, useState } from 'react';

interface NumberTickerProps {
  value: number;
  direction?: 'up' | 'down';
  delay?: number;
  className?: string;
  decimalPlaces?: number;
  suffix?: string;
  prefix?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 0,
  suffix = '',
  prefix = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(direction === 'down' ? value : 0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const startValue = direction === 'down' ? value : 0;
    const endValue = direction === 'down' ? 0 : value;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = startValue + (endValue - startValue) * ease;
        setDisplayValue(current);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, direction, delay]);

  return (
    <span className={`number-ticker ${className}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {displayValue.toFixed(decimalPlaces)}
      {suffix}
    </span>
  );
};
