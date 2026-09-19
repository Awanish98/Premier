import React, { useState, useEffect } from 'react';
import { 
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
  HelpCircle,
  PlusSquare,
  Share2,
  MoreVertical,
  Download
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>((window as any).__premierDeferredPrompt || null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  // Detect platform & standalone mode on mount
  useEffect(() => {
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!isRunningStandalone);

    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) {
      setActiveGuideTab('ios');
    } else if (/Android/i.test(ua)) {
      setActiveGuideTab('android');
    } else {
      setActiveGuideTab('desktop');
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__premierDeferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  // Trigger Native PWA Installation
  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          showToast('🎉 PREMIER Web App successfully installed!', 'success');
          setDeferredPrompt(null);
          (window as any).__premierDeferredPrompt = null;
          setTimeout(() => {
            onClose();
          }, 1800);
        } else {
          showToast('Install prompt cancelled. You can install anytime from menu.', 'info');
        }
      } catch {
        showToast('Neeche diye gaye steps follow karein to install PREMIER App', 'info');
      }
    } else {
      // Fallback instructions based on platform
      const ua = navigator.userAgent || '';
      if (/iPhone|iPad|iPod/i.test(ua)) {
        setActiveGuideTab('ios');
        showToast('Safari me Share (⬆️) -> "Add to Home Screen" select karein', 'info');
      } else {
        setActiveGuideTab('android');
        showToast('Browser menu (⋮) me jaakar "Install app" ya "Add to Home screen" tap karein', 'info');
      }
    }
  };

  // Copy app link to clipboard
  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      showToast('🔗 PREMIER Web App link copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        background: 'rgba(3, 4, 7, 0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2.5vh, 1.5rem) clamp(0.5rem, 2vw, 1.25rem)',
        overflow: 'hidden',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 50px var(--accent-glow)',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="custom-scrollbar"
      >
        <BorderBeam size={280} duration={10} colorFrom="var(--accent)" colorTo="#38bdf8" />

        {/* Modal Top Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'rgba(6, 7, 10, 0.96)',
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
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #0d121c 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px var(--accent-glow)',
                flexShrink: 0,
              }}
            >
              <Smartphone size={22} color="#05080b" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  Install PREMIER Web App
                </h3>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '5px',
                    background: 'var(--badge-bg)',
                    color: 'var(--accent)',
                    border: '1px solid var(--accent)',
                  }}
                >
                  PWA • Fast 4K
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Direct Mobile & Desktop App • Zero Storage • Ad-Free Cinema
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
              flexShrink: 0,
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Main Install Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(149, 255, 80, 0.14) 0%, rgba(13, 21, 39, 0.85) 100%)',
              border: '1px solid var(--accent)',
              borderRadius: '18px',
              padding: '1.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Zap size={20} color="var(--accent)" />
                <span style={{ fontSize: '1.02rem', fontWeight: 900, color: '#ffffff' }}>
                  {isStandalone ? 'PREMIER App Running Active' : '1-Tap Mobile & Desktop Install'}
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '999px' }}>
                0 MB Download • Instant Launch
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.55 }}>
              {isStandalone 
                ? 'Aap PREMIER Web App standalone mode me use kar rahe hain. Fast 4K playback aur multi-server streaming active hai!' 
                : 'PREMIER ko apne phone ki Home Screen par install karein. Bina kisi APK download ke instant standalone full-screen cinema app chalu ho jayega.'}
            </p>

            {/* Primary 1-Tap Install Button */}
            {!isStandalone && (
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <ShimmerButton
                  onClick={handlePwaInstall}
                  style={{ 
                    flex: 1, 
                    padding: '0.85rem 1.4rem', 
                    fontSize: '0.98rem', 
                    fontWeight: 900,
                    letterSpacing: '0.01em'
                  }}
                >
                  <Smartphone size={19} />
                  <span>
                    {installSuccess 
                      ? 'Installed Successfully!' 
                      : deferredPrompt 
                        ? '📲 1-Tap Install Web App' 
                        : '📲 Install Web App on Phone'}
                  </span>
                </ShimmerButton>
              </div>
            )}

            {isStandalone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem' }}>
                <Check size={18} />
                <span>Web App is Installed & Ready!</span>
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
                padding: '0.38rem 0.85rem',
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

          {/* Installation Step-by-Step Guide Tabs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
              <HelpCircle size={16} color="var(--accent)" />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                How to Install (Step-by-Step)
              </h4>
            </div>

            {/* Guide Tabs Selector */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.85rem', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '12px' }}>
              {[
                { id: 'android', label: '📱 Android (Chrome/Brave)' },
                { id: 'ios', label: '🍏 iPhone / iPad (Safari)' },
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
                    padding: '0.5rem 0.35rem',
                    fontSize: '0.76rem',
                    fontWeight: activeGuideTab === tab.id ? 900 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
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
                  borderRadius: '14px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>1</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Open Browser Menu:</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      Chrome ya Brave browser me upar ya neeche right side <strong>3-Dots Menu (<MoreVertical size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />)</strong> par tap karein.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>2</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Select "Install app" ya "Add to Home screen":</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      Menu me <strong>"Install app" (<Download size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />)</strong> ya <strong>"Add to Home screen" (<PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />)</strong> option choose karein.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>3</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Instant Native App Ready!</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      Phone ki home screen par <strong>PREMIER 4K</strong> app icon aa jayega. Full screen 4K OTT without browser frame!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: iOS Guide */}
            {activeGuideTab === 'ios' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>1</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Safari Browser me Kholein:</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      iPhone ya iPad par <strong>Safari browser</strong> me yeh link open karein.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>2</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Tap Share Icon:</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      Safari ke bottom bar me <strong>Share button (<Share2 size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />)</strong> par tap karein.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>3</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>"Add to Home Screen" Select Karein:</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      List me <strong>"Add to Home Screen" (<PlusSquare size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />)</strong> tap karke "Add" dabayein.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Desktop Guide */}
            {activeGuideTab === 'desktop' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>1</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Click Install in Address Bar:</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      Google Chrome / Brave / Edge me URL address bar me right side <strong>Install App (💻 / ⊕)</strong> icon par click karein.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', flexShrink: 0, border: '1px solid var(--accent)' }}>2</div>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700 }}>Standalone 4K Window:</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>
                      PREMIER separate ultra-fast application window me open hoga with zero distraction and HDR playback.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Key Advantages Matrix */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Why PREMIER Web App is Best?
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '0.65rem' }}>
              {[
                { icon: Film, title: 'IMAX 4K HDR', desc: 'Zero Lag Playback' },
                { icon: Sparkles, title: 'Dual Audio', desc: '100% Hindi Dubbed' },
                { icon: Tv, title: 'Live 24x7 TV', desc: 'HD Sports & News' },
                { icon: ShieldCheck, title: 'Zero Ads', desc: 'Ad-Free Streams' },
                { icon: Wifi, title: '0 MB Storage', desc: 'No Memory Used' },
                { icon: Layers, title: 'Instant Updates', desc: 'Always Latest' },
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
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>{f.title}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{f.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
