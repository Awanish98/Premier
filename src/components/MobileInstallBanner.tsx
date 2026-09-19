import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles, X } from 'lucide-react';

interface MobileInstallBannerProps {
  onOpenApkModal: () => void;
}

export const MobileInstallBanner: React.FC<MobileInstallBannerProps> = ({ onOpenApkModal }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      return; // Do not show install banner if already installed
    }

    // Check if dismissed previously in this session
    const dismissed = sessionStorage.getItem('premier_install_banner_dismissed');
    if (!dismissed) {
      // Show after 1.5 seconds delay on mobile
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('premier_install_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      className="mobile-install-banner"
      style={{
        position: 'fixed',
        bottom: '68px',
        left: '12px',
        right: '12px',
        zIndex: 42,
        background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.96) 0%, rgba(6, 7, 10, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--accent)',
        borderRadius: '16px',
        padding: '0.65rem 0.85rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.85), 0 0 20px var(--accent-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.65rem',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 10px var(--accent-glow)',
          }}
        >
          <Smartphone size={18} color="#05080b" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
              PREMIER 4K Web App
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '3px',
                background: 'var(--badge-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
              }}
            >
              PWA
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            1-Tap Install • Zero Storage • Faster 4K
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
        <button
          onClick={onOpenApkModal}
          style={{
            background: 'var(--accent)',
            color: 'var(--accent-text)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: '0 2px 10px var(--accent-glow)',
          }}
        >
          <Sparkles size={13} />
          <span>Install App</span>
        </button>

        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
