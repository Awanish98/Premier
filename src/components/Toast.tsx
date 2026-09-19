import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const Toast: React.FC = () => {
  const { toast } = useTheme();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="var(--accent)" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      default:
        return <Info size={18} color="#38bdf8" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2rem',
        zIndex: 999,
        background: 'rgba(13, 18, 28, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px var(--accent-glow)',
        borderRadius: '12px',
        padding: '0.75rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        color: '#ffffff',
        fontSize: '0.88rem',
        fontWeight: 600,
        pointerEvents: 'none',
      }}
      className="animate-toast"
    >
      {getIcon()}
      <span>{toast.message}</span>
    </div>
  );
};
