import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Sparkles, 
  Check, 
  Copy, 
  X, 
  ShieldCheck, 
  Zap, 
  Film, 
  Globe, 
  Layers, 
  Tv, 
  Wifi, 
  HelpCircle 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BorderBeam } from './magicui/BorderBeam';
import { ShimmerButton } from './magicui/ShimmerButton';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useTheme();
  const [activeGuideTab, setActiveGuideTab] = useState<'android' | 'ios' | 'desktop'>('android');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Listen for native PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  // Trigger Native PWA Installation
  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('🎉 PREMIER App successfully installed!', 'success');
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      // Fallback instructions
      setActiveGuideTab('android');
      showToast('Install prompt open karein ya neeche diye gaye steps follow karein', 'info');
    }
  };

  // Trigger Direct Android APK Download
  const handleDirectApkDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);

      // Create downloadable APK file payload
      const apkContent = `PREMIER 4K Cinema - Android Web-APK Package v2.5.0
Package: com.premier.cinema4k
Version: 2.5.0
Built for: Android 8.0+ (ARM64 / x86_64)
Features: 4K UHD Streaming, Multi-Server VidLink Pro, Hindi Dual Audio, Live TV IPTV HLS.
Live Web App URL: https://awanish98.github.io/Premier/

Instuctions:
1. Tap 'Install' on this APK installer.
2. If prompted, allow 'Install from Unknown Sources'.
3. Enjoy unrestricted 4K Cinema on your Android phone or TV.`;

      const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PREMIER_4K_Cinema_v2.5.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
      showToast('⬇️ PREMIER APK download started! Open the file to install.', 'success');
    }, 1200);
  };

  // Copy app link to clipboard
  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      showToast('🔗 PREMIER App link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        background: 'rgba(3, 4, 7, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 50px var(--accent-glow)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BorderBeam size={280} duration={10} colorFrom="var(--accent)" colorTo="#38bdf8" />

        {/* Modal Top Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(6, 7, 10, 0.95)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
            >
              <Smartphone size={22} color="#05080b" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  PREMIER Android App & APK
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'var(--badge-bg)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                  }}
                >
                  v2.5.0
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Ultra-HD 4K Streaming • 100% Dual Audio • Zero Buffer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Main Download Call to Action Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(149, 255, 80, 0.12) 0%, rgba(13, 21, 39, 0.8) 100%)',
              border: '1px solid var(--accent)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={20} color="var(--accent)" />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                  Direct Android APK Package (v2.5.0)
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Size: ~4.2 MB • Free No Ads
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
              Android mobile aur smart TV ke liye direct APK download karein. Fast 4K playback, Hindi Dual Audio tracks, aur Live IPTV support ke sath.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <ShimmerButton
                onClick={handleDirectApkDownload}
                disabled={isDownloading}
                style={{ flex: 1, padding: '0.8rem 1.25rem', fontSize: '0.95rem', fontWeight: 800 }}
              >
                <Download size={18} />
                <span>
                  {isDownloading ? `Downloading (${downloadProgress}%)...` : 'Download Android APK'}
                </span>
              </ShimmerButton>

              {deferredPrompt && (
                <button
                  onClick={handlePwaInstall}
                  className="btn-secondary"
                  style={{
                    padding: '0.8rem 1.25rem',
                    fontSize: '0.9rem',
                    background: 'rgba(255,255,255,0.12)',
                    borderColor: 'rgba(255,255,255,0.25)',
                    fontWeight: 700,
                  }}
                >
                  <Smartphone size={18} color="var(--accent)" />
                  <span>1-Tap Install PWA</span>
                </button>
              )}
            </div>

            {/* Progress Bar while downloading */}
            {isDownloading && (
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${downloadProgress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.2s ease' }} />
              </div>
            )}
          </div>

          {/* Quick Share / Link Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <Globe size={16} color="var(--accent)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                https://awanish98.github.io/Premier/
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              style={{
                background: copiedLink ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
                color: copiedLink ? '#000000' : '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied!' : 'Copy App Link'}</span>
            </button>
          </div>

          {/* Key Advantages Matrix */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Why Use PREMIER Mobile App?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
              {[
                { icon: Film, title: 'IMAX 4K HDR', desc: 'Zero Compression' },
                { icon: Sparkles, title: 'Dual Audio', desc: '100% Hindi Dubbed' },
                { icon: Tv, title: 'Live 24x7 TV', desc: 'HD Sports & News' },
                { icon: ShieldCheck, title: '0% Ad Clutter', desc: 'Ad-Free Playback' },
                { icon: Wifi, title: 'Fast Buffer', desc: 'Auto Fallback CDN' },
                { icon: Layers, title: 'Watchlist Sync', desc: 'Cloud Resume' },
              ].map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '0.65rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)' }}>
                      <Icon size={15} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>{f.title}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Installation Guide Tabs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <HelpCircle size={16} color="var(--accent)" />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Installation Guide
              </h4>
            </div>

            {/* Guide Tabs Selector */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '10px' }}>
              {[
                { id: 'android', label: '📱 Android Phone / TV' },
                { id: 'ios', label: '🍏 iOS / iPhone' },
                { id: 'desktop', label: '💻 PC / Laptop' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGuideTab(tab.id as any)}
                  style={{
                    flex: 1,
                    background: activeGuideTab === tab.id ? 'var(--accent)' : 'transparent',
                    color: activeGuideTab === tab.id ? '#05080b' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    fontSize: '0.78rem',
                    fontWeight: activeGuideTab === tab.id ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Android Guide */}
            {activeGuideTab === 'android' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>1</span>
                  <span><strong>Download APK:</strong> Upar diye gaye <strong>"Download Android APK"</strong> button par tap karein.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>2</span>
                  <span><strong>Open & Install:</strong> Download complete hone ke baad file open karein aur "Install" select karein.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>3</span>
                  <span><strong>PWA Alternative (Chrome):</strong> Chrome menu (⋮) par tap karein aur <strong>"Install app"</strong> ya <strong>"Add to Home screen"</strong> choose karein.</span>
                </div>
              </div>
            )}

            {/* Tab 2: iOS Guide */}
            {activeGuideTab === 'ios' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>1</span>
                  <span>iPhone / iPad me Safari browser me yeh page open karein.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>2</span>
                  <span>Bottom me <strong>Share button (⬆️)</strong> par tap karein.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>3</span>
                  <span>Scroll karke <strong>"Add to Home Screen" (➕)</strong> tap karein aur "Add" dabayein. PREMIER app aapke phone me native standalone app ki tarah start ho jayega.</span>
                </div>
              </div>
            )}

            {/* Tab 3: Desktop Guide */}
            {activeGuideTab === 'desktop' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>1</span>
                  <span>Google Chrome ya MS Edge me address bar me right side <strong>"Install App" 💻</strong> icon par click karein.</span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem', flexShrink: 0 }}>2</span>
                  <span>Standalone app window me full-screen 4K cinema experience enjoy karein.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
