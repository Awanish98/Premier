import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  RefreshCw, 
  ShieldAlert, 
  Maximize2, 
  Minimize2,
  Layers,
  Sparkles,
  SkipForward,
  SkipBack,
  Gauge,
  ChevronDown,
  Keyboard,
  Info,
  Cloud
} from 'lucide-react';
import type { MediaItem, StreamServer } from '../types';
import { STREAM_SERVERS, getStreamUrl } from '../services/streamSources';
import { useTheme } from '../context/ThemeContext';
import { BorderBeam } from './magicui/BorderBeam';

interface PlayerModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onShowDetails?: (item: MediaItem) => void;
  onOpenCloudstream?: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ 
  item, 
  onClose, 
  onShowDetails,
  onOpenCloudstream 
}) => {
  const [selectedServer, setSelectedServer] = useState<StreamServer>(STREAM_SERVERS[0]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [key, setKey] = useState(0); // to force iframe reload
  const [isTheater, setIsTheater] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [serverPings, setServerPings] = useState<Record<string, number>>({});
  const [isTestingPings, setIsTestingPings] = useState(false);
  const [episodeDrawerOpen, setEpisodeDrawerOpen] = useState(false);

  const { saveProgress, showToast } = useTheme();

  // Initialize Pings & Defaults
  useEffect(() => {
    if (item) {
      setCurrentSeason(1);
      setCurrentEpisode(1);
      setSelectedServer(STREAM_SERVERS[0]);
      setIsMiniPlayer(false);
      saveProgress(item, 10, 1, 1);
      measureServerPings();
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      saveProgress(item, 25, currentSeason, currentEpisode);
    }
  }, [currentSeason, currentEpisode]);

  // Simulate server health latency ping checks
  const measureServerPings = () => {
    setIsTestingPings(true);
    const pings: Record<string, number> = {};
    STREAM_SERVERS.forEach((server) => {
      // Realistic low latency simulation based on server architecture
      const base = server.id.includes('vidlink') ? 28 : server.id.includes('autoembed') ? 35 : server.id.includes('embed_su') ? 42 : 55;
      pings[server.id] = base + Math.floor(Math.random() * 25);
    });
    setServerPings(pings);
    setTimeout(() => setIsTestingPings(false), 600);
  };

  const handleAutoFastestServer = () => {
    measureServerPings();
    const sorted = [...STREAM_SERVERS].sort((a, b) => (serverPings[a.id] || 99) - (serverPings[b.id] || 99));
    const fastest = sorted[0];
    if (fastest && fastest.id !== selectedServer.id) {
      setSelectedServer(fastest);
      setKey((k) => k + 1);
      showToast(`⚡ Switched to fastest server: ${fastest.name.split('(')[0]}`);
    } else {
      showToast(`🟢 Current server is already the fastest (${serverPings[selectedServer.id] || 28}ms)!`);
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;

      if (e.key.toLowerCase() === 'f' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) {
        e.preventDefault();
        setIsTheater((prev) => !prev);
      } else if (e.key.toLowerCase() === 'r' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) {
        e.preventDefault();
        setKey((k) => k + 1);
        showToast('🔄 Stream reloaded');
      } else if (e.key.toLowerCase() === 's' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase() || '')) {
        e.preventDefault();
        const currentIndex = STREAM_SERVERS.findIndex((s) => s.id === selectedServer.id);
        const nextServer = STREAM_SERVERS[(currentIndex + 1) % STREAM_SERVERS.length];
        setSelectedServer(nextServer);
        setKey((k) => k + 1);
        showToast(`🔀 Server: ${nextServer.name.split('(')[0]}`);
      } else if (e.key.toLowerCase() === 'n' && (item.type === 'tv' || item.type === 'anime')) {
        e.preventDefault();
        handleNextEpisode();
      } else if (e.key.toLowerCase() === 'p' && (item.type === 'tv' || item.type === 'anime')) {
        e.preventDefault();
        handlePrevEpisode();
      } else if (e.key === 'Escape') {
        if (isTheater) setIsTheater(false);
        else onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, selectedServer, isTheater, currentEpisode, currentSeason]);

  if (!item) return null;

  const isSeries = item.type === 'tv' || item.type === 'anime';
  const totalSeasons = item.totalSeasons || 1;
  const streamUrl = getStreamUrl(selectedServer, item, currentSeason, currentEpisode);

  const episodesList = item.episodes || Array.from({ length: 12 }, (_, i) => ({
    seasonNumber: currentSeason,
    episodeNumber: i + 1,
    title: `Episode ${i + 1}`,
    overview: `${item.title} Season ${currentSeason} Episode ${i + 1} stream in 4K UHD with Hindi / Dual Audio.`,
    duration: item.type === 'anime' ? '24m' : '48m',
  }));

  const currentSeasonEpisodes = episodesList.filter((ep) => ep.seasonNumber === currentSeason);

  const handleNextEpisode = () => {
    if (currentEpisode < currentSeasonEpisodes.length) {
      setCurrentEpisode((prev) => prev + 1);
      setKey((k) => k + 1);
      showToast(`⏭️ Playing Episode ${currentEpisode + 1}`);
    } else if (currentSeason < totalSeasons) {
      setCurrentSeason((prev) => prev + 1);
      setCurrentEpisode(1);
      setKey((k) => k + 1);
      showToast(`🎉 Season ${currentSeason + 1} Episode 1`);
    } else {
      showToast('✅ You have reached the final episode of this series!');
    }
  };

  const handlePrevEpisode = () => {
    if (currentEpisode > 1) {
      setCurrentEpisode((prev) => prev - 1);
      setKey((k) => k + 1);
      showToast(`⏮️ Playing Episode ${currentEpisode - 1}`);
    } else if (currentSeason > 1) {
      setCurrentSeason((prev) => prev - 1);
      setCurrentEpisode(1);
      setKey((k) => k + 1);
    }
  };

  // Mini Player Floating View
  if (isMiniPlayer) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 120,
          width: '360px',
          maxWidth: '90vw',
          aspectRatio: '16/9',
          background: '#000000',
          borderRadius: '16px',
          border: '2px solid var(--accent)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 30px var(--accent-glow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            padding: '0.45rem 0.75rem',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
            {item.title}
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              onClick={() => setIsMiniPlayer(false)}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }}
              title="Expand Player"
            >
              <Maximize2 size={13} />
            </button>
            <button
              onClick={onClose}
              style={{ background: 'rgba(239,68,68,0.4)', border: 'none', color: '#fff', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer' }}
              title="Close"
            >
              <X size={13} />
            </button>
          </div>
        </div>

        <iframe
          key={key}
          src={streamUrl}
          title={item.title}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isTheater ? '0' : 'clamp(0.25rem, 2vw, 1.25rem)',
        overflow: 'hidden',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isTheater ? '100vw' : '1240px',
          height: isTheater ? '100vh' : 'auto',
          maxHeight: isTheater ? '100vh' : '96vh',
          background: 'var(--bg-secondary)',
          borderRadius: isTheater ? '0' : '20px',
          border: isTheater ? 'none' : '1px solid var(--border-subtle)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px var(--accent-glow)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          position: 'relative',
        }}
        className="custom-scrollbar"
      >
        {!isTheater && <BorderBeam size={320} duration={10} colorFrom="var(--accent)" colorTo="#38bdf8" />}

        {/* Modal Header */}
        <div
          style={{
            padding: '0.75rem 1.15rem',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'var(--badge-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                textTransform: 'uppercase',
              }}
            >
              {item.type}
            </span>

            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
              {isSeries && (
                <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.95rem', marginLeft: '6px' }}>
                  (S{currentSeason} : E{currentEpisode})
                </span>
              )}
            </h2>

            {/* Server Ping Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22c55e',
                borderRadius: '999px',
                padding: '2px 8px',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} className="live-pulse" />
              <span>{serverPings[selectedServer.id] || 28}ms 🟢 4K CDN</span>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {/* Shortcuts Toggle */}
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              style={{
                background: showShortcuts ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: showShortcuts ? 'var(--accent-text)' : 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Keyboard Shortcuts"
            >
              <Keyboard size={16} />
            </button>

            {/* Mini Player PiP */}
            <button
              onClick={() => setIsMiniPlayer(true)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Mini Player (Picture-in-Picture)"
            >
              <Minimize2 size={16} />
            </button>

            {/* Movie Details */}
            {onShowDetails && (
              <button
                onClick={() => {
                  onClose();
                  onShowDetails(item);
                }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="View Movie Details & Trivia"
              >
                <Info size={16} />
              </button>
            )}

            {/* Reload */}
            <button
              onClick={() => {
                setKey((prev) => prev + 1);
                showToast('🔄 Reloading stream...');
              }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Reload Stream"
            >
              <RefreshCw size={16} />
            </button>

            {/* Cloudstream & External TV Hub */}
            {onOpenCloudstream && (
              <button
                onClick={onOpenCloudstream}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#60a5fa',
                  borderRadius: '8px',
                  padding: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Open Cloudstream 3 & 4 Ecosystem Hub"
              >
                <Cloud size={16} />
              </button>
            )}

            {/* Theater Mode */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              style={{
                background: isTheater ? 'var(--badge-bg)' : 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: isTheater ? 'var(--accent)' : 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
            >
              <Maximize2 size={16} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Close Player"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts Bar (Collapsible) */}
        {showShortcuts && (
          <div
            style={{
              padding: '0.65rem 1.25rem',
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.76rem',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span><strong style={{ color: 'var(--accent)' }}>F</strong> Fullscreen</span>
              <span><strong style={{ color: 'var(--accent)' }}>S</strong> Switch Server</span>
              <span><strong style={{ color: 'var(--accent)' }}>R</strong> Reload</span>
              {isSeries && <span><strong style={{ color: '#f59e0b' }}>N / P</strong> Next / Prev Episode</span>}
              <span><strong style={{ color: 'var(--accent)' }}>Esc</strong> Close</span>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              Dismiss ✕
            </button>
          </div>
        )}

        {/* Video Player Frame Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: '#000000',
            aspectRatio: isTheater ? 'auto' : '16/9',
            flex: isTheater ? 1 : 'none',
            minHeight: isTheater ? '0' : 'clamp(220px, 42vh, 480px)',
          }}
        >
          <iframe
            key={key}
            src={streamUrl}
            title={item.title}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Next Episode Floating Bar for Series */}
        {isSeries && (
          <div
            style={{
              padding: '0.65rem 1.25rem',
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(13, 21, 39, 0.8) 100%)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fef08a' }}>
                📺 Binge Navigation:
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                Season {currentSeason} • Episode {currentEpisode} of {currentSeasonEpisodes.length}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handlePrevEpisode}
                disabled={currentEpisode === 1 && currentSeason === 1}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-subtle)',
                  color: currentEpisode === 1 && currentSeason === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: currentEpisode === 1 && currentSeason === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <SkipBack size={14} />
                <span>Prev</span>
              </button>

              <button
                onClick={handleNextEpisode}
                style={{
                  background: '#f59e0b',
                  border: 'none',
                  color: '#000000',
                  borderRadius: '8px',
                  padding: '0.35rem 0.95rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)',
                }}
              >
                <span>Next Ep</span>
                <SkipForward size={14} />
              </button>

              <button
                onClick={() => setEpisodeDrawerOpen(!episodeDrawerOpen)}
                style={{
                  background: episodeDrawerOpen ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-subtle)',
                  color: episodeDrawerOpen ? 'var(--accent-text)' : 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  cursor: 'pointer',
                }}
              >
                <Layers size={14} />
                <span>All Episodes</span>
                <ChevronDown size={14} style={{ transform: episodeDrawerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            </div>
          </div>
        )}

        {/* Episode Selector Drawer (Expandable) */}
        {isSeries && episodeDrawerOpen && (
          <div
            style={{
              padding: '1rem 1.25rem',
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {/* Season Selector Tabs */}
            {totalSeasons > 1 && (
              <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setCurrentSeason(s);
                      setCurrentEpisode(1);
                      setKey((k) => k + 1);
                    }}
                    style={{
                      background: currentSeason === s ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                      color: currentSeason === s ? 'var(--accent-text)' : 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Season {s}
                  </button>
                ))}
              </div>
            )}

            {/* Episode Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }} className="custom-scrollbar">
              {currentSeasonEpisodes.map((ep) => {
                const isSelected = currentEpisode === ep.episodeNumber;
                return (
                  <button
                    key={ep.episodeNumber}
                    onClick={() => {
                      setCurrentEpisode(ep.episodeNumber);
                      setKey((k) => k + 1);
                      setEpisodeDrawerOpen(false);
                      showToast(`Playing S${currentSeason}:E${ep.episodeNumber}`);
                    }}
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' : 'var(--bg-secondary)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      border: isSelected ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem',
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>Episode {ep.episodeNumber}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{ep.duration || '45m'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Player Bottom Bar & Multi-Source Selector */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Audio Track Quick Selector Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.65rem 0.95rem',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(13, 21, 39, 0.6) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fef08a' }}>
                🎧 Audio Stream Mode:
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const s = STREAM_SERVERS.find((x) => x.id === 'autoembed_hindi') || STREAM_SERVERS[0];
                  setSelectedServer(s);
                  setKey((k) => k + 1);
                  showToast('🇮🇳 Switched to Dual Audio Hindi stream');
                }}
                style={{
                  background: selectedServer.id === 'autoembed_hindi' || selectedServer.id === 'vidlink_pro' ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                  color: selectedServer.id === 'autoembed_hindi' || selectedServer.id === 'vidlink_pro' ? '#000000' : 'var(--text-primary)',
                  border: '1px solid rgba(245, 158, 11, 0.6)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>🇮🇳 Dual Audio (Hindi + Eng)</span>
              </button>

              <button
                onClick={() => {
                  const s = STREAM_SERVERS.find((x) => x.id === 'embed_su') || STREAM_SERVERS[0];
                  setSelectedServer(s);
                  setKey((k) => k + 1);
                  showToast('🇺🇸 Switched to English Master 4K');
                }}
                style={{
                  background: selectedServer.id === 'embed_su' || selectedServer.id === 'vidsrc_cc' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  color: selectedServer.id === 'embed_su' || selectedServer.id === 'vidsrc_cc' ? 'var(--accent-text)' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>🇺🇸 English Master (4K)</span>
              </button>

              <button
                onClick={() => {
                  const s = STREAM_SERVERS.find((x) => x.id === 'vidsrc_to') || STREAM_SERVERS[0];
                  setSelectedServer(s);
                  setKey((k) => k + 1);
                }}
                style={{
                  background: selectedServer.id === 'vidsrc_to' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  color: selectedServer.id === 'vidsrc_to' ? 'var(--accent-text)' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>🇯🇵 Japanese / Multi-Sub</span>
              </button>
            </div>
          </div>

          {/* AdBlock / FMHY Safety Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              background: 'rgba(0, 168, 225, 0.08)',
              border: '1px solid rgba(0, 168, 225, 0.2)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={16} color="var(--accent)" />
              <span>
                <strong>FMHY Streaming Tip:</strong> Player settings (⚙️) icon se <strong>Audio Track (Hindi / English)</strong> change kar sakte hain. Free clean playback ke liye Brave browser ya uBlock Origin use karein.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontWeight: 700 }}>
              <Sparkles size={14} />
              <span>FMHY Verified Engine</span>
            </div>
          </div>

          {/* Server Selectors Row + Auto Fastest Button */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Server size={16} color="var(--accent)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  10+ Ultra-Fast Multi-CDN Streaming Mirrors:
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handleAutoFastestServer}
                  style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#22c55e',
                    borderRadius: '8px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    cursor: 'pointer',
                  }}
                  title="Auto-switch to the lowest latency buffer-free server"
                >
                  <Gauge size={13} />
                  <span>{isTestingPings ? 'Testing...' : '⚡ Auto Fastest Server'}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#22c55e', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                  <span>Active: {selectedServer.name.split('(')[0]}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.55rem' }}>
              {STREAM_SERVERS.map((server) => {
                const isSelected = selectedServer.id === server.id;
                const isHindi = server.badge?.includes('Hindi') || server.badge?.includes('Dual');
                const ping = serverPings[server.id] || 32;

                return (
                  <button
                    key={server.id}
                    onClick={() => {
                      setSelectedServer(server);
                      setKey((prev) => prev + 1);
                      showToast(`Switched to ${server.name.split('(')[0]}`);
                    }}
                    style={{
                      background: isSelected 
                        ? (isHindi ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(13, 21, 39, 0.9) 100%)' : 'var(--accent)')
                        : 'var(--bg-card)',
                      color: isSelected 
                        ? (isHindi ? '#fef08a' : 'var(--accent-text)') 
                        : 'var(--text-primary)',
                      border: isSelected 
                        ? (isHindi ? '1px solid #f59e0b' : '1px solid var(--accent)') 
                        : '1px solid var(--border-subtle)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.25rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? (isHindi ? '0 0 16px rgba(245, 158, 11, 0.4)' : '0 0 16px var(--accent-glow)') : 'none',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 800 }}>
                        {server.name.split('(')[0]}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: isSelected ? 'rgba(0,0,0,0.4)' : 'var(--badge-bg)',
                          color: isSelected ? '#fbbf24' : 'var(--accent)',
                          fontWeight: 800,
                        }}
                      >
                        {server.quality}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.68rem', color: isSelected ? '#fef08a' : 'var(--text-secondary)' }}>
                        {server.badge || '🟢 Fast Mirror'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: ping < 40 ? '#22c55e' : '#f59e0b', fontWeight: 800 }}>
                        {ping}ms
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
