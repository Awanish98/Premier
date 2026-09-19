import React, { useState, useEffect } from 'react';
import { 
  X, 
  Server, 
  RefreshCw, 
  ShieldAlert, 
  Maximize2, 
  Layers,
  Sparkles
} from 'lucide-react';
import type { MediaItem, StreamServer } from '../types';
import { STREAM_SERVERS, getStreamUrl } from '../services/streamSources';
import { useTheme } from '../context/ThemeContext';
import { BorderBeam } from './magicui/BorderBeam';

interface PlayerModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ item, onClose }) => {
  const [selectedServer, setSelectedServer] = useState<StreamServer>(STREAM_SERVERS[0]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [key, setKey] = useState(0); // to force iframe refresh
  const [isTheater, setIsTheater] = useState(false);
  const { saveProgress } = useTheme();

  useEffect(() => {
    if (item) {
      setCurrentSeason(1);
      setCurrentEpisode(1);
      setSelectedServer(STREAM_SERVERS[0]);
      saveProgress(item, 10, 1, 1);
    }
  }, [item]);

  useEffect(() => {
    if (item) {
      saveProgress(item, 25, currentSeason, currentEpisode);
    }
  }, [currentSeason, currentEpisode]);

  if (!item) return null;

  const streamUrl = getStreamUrl(selectedServer, item, currentSeason, currentEpisode);
  const isSeries = item.type === 'tv' || item.type === 'anime';
  const totalSeasons = item.totalSeasons || 1;
  const episodesList = item.episodes || [
    { seasonNumber: currentSeason, episodeNumber: 1, title: 'Episode 1' },
    { seasonNumber: currentSeason, episodeNumber: 2, title: 'Episode 2' },
    { seasonNumber: currentSeason, episodeNumber: 3, title: 'Episode 3' },
    { seasonNumber: currentSeason, episodeNumber: 4, title: 'Episode 4' },
    { seasonNumber: currentSeason, episodeNumber: 5, title: 'Episode 5' },
    { seasonNumber: currentSeason, episodeNumber: 6, title: 'Episode 6' },
    { seasonNumber: currentSeason, episodeNumber: 7, title: 'Episode 7' },
    { seasonNumber: currentSeason, episodeNumber: 8, title: 'Episode 8' },
  ];

  const currentSeasonEpisodes = episodesList.filter(
    (ep) => ep.seasonNumber === currentSeason
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isTheater ? '0' : 'clamp(0.25rem, 2vw, 1.25rem)',
        overflowY: 'auto',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isTheater ? '100vw' : '1200px',
          height: isTheater ? '100vh' : 'auto',
          maxHeight: isTheater ? '100vh' : '96vh',
          background: 'var(--bg-secondary)',
          borderRadius: isTheater ? '0' : '16px',
          border: isTheater ? 'none' : '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px var(--accent-glow)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {!isTheater && <BorderBeam size={300} duration={10} colorFrom="var(--accent)" colorTo="#38bdf8" />}

        {/* Modal Header */}
        <div
          style={{
            padding: '0.75rem 1rem',
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
                borderRadius: '4px',
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
                fontWeight: 700,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.title}
              {isSeries && (
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem', marginLeft: '6px' }}>
                  (S{currentSeason} : E{currentEpisode})
                </span>
              )}
            </h2>
          </div>

          {/* Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setKey((prev) => prev + 1)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              title="Reload Stream"
            >
              <RefreshCw size={16} />
            </button>

            <button
              onClick={() => setIsTheater(!isTheater)}
              style={{
                background: isTheater ? 'var(--badge-bg)' : 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-subtle)',
                color: isTheater ? 'var(--accent)' : 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
            >
              <Maximize2 size={16} />
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444',
                borderRadius: '8px',
                padding: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              title="Close Player"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Frame Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            background: '#000000',
            aspectRatio: isTheater ? 'auto' : '16/9',
            flex: isTheater ? 1 : 'none',
            minHeight: isTheater ? '0' : 'clamp(200px, 35vh, 440px)',
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

        {/* Player Bottom Bar & Multi-Source Selector */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            overflowY: 'auto',
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
              borderRadius: '10px',
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
                }}
                style={{
                  background: selectedServer.id === 'autoembed_hindi' || selectedServer.id === 'vidlink_pro' ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                  color: selectedServer.id === 'autoembed_hindi' || selectedServer.id === 'vidlink_pro' ? '#000000' : '#ffffff',
                  border: '1px solid rgba(245, 158, 11, 0.6)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
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
                }}
                style={{
                  background: selectedServer.id === 'embed_su' || selectedServer.id === 'vidsrc_cc' ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
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
                  color: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>🇯🇵 Japanese / Multi-Sub</span>
              </button>
            </div>
          </div>

          {/* AdBlock / Safety Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.55rem 0.85rem',
              borderRadius: '8px',
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
                <strong>FMHY Streaming Tip:</strong> Player ke andar settings (⚙️) icon se <strong>Audio Track (Hindi / English)</strong> change kar sakte hain. Ads avoid karne ke liye uBlock Origin / Brave browser recommend hai.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontWeight: 700 }}>
              <Sparkles size={14} />
              <span>FMHY Verified Engine</span>
            </div>
          </div>

          {/* Server Selectors Row */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Server size={16} color="var(--accent)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Select FMHY Stream Server:
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {STREAM_SERVERS.map((server) => {
                const isSelected = selectedServer.id === server.id;
                return (
                  <button
                    key={server.id}
                    onClick={() => {
                      setSelectedServer(server);
                      setKey((prev) => prev + 1);
                    }}
                    style={{
                      background: isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 12px var(--accent-glow)' : 'none',
                    }}
                  >
                    <span>{server.name}</span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: isSelected ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.1)',
                        fontWeight: 700,
                      }}
                    >
                      {server.quality}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Season & Episode Picker (Only for TV Shows & Anime) */}
          {isSeries && (
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} color="var(--accent)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Episodes & Seasons
                  </span>
                </div>

                {/* Season Switcher Tabs */}
                {totalSeasons > 1 && (
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setCurrentSeason(s);
                          setCurrentEpisode(1);
                        }}
                        style={{
                          background: currentSeason === s ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                          color: currentSeason === s ? '#fff' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Season {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Episode Selection Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '0.5rem',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  padding: '0.25rem',
                }}
              >
                {(currentSeasonEpisodes.length > 0
                  ? currentSeasonEpisodes
                  : Array.from({ length: item.totalEpisodes || 12 }, (_, i) => ({
                      seasonNumber: currentSeason,
                      episodeNumber: i + 1,
                      title: `Ep ${i + 1}`,
                    }))
                ).map((ep) => {
                  const isActive = currentEpisode === ep.episodeNumber;
                  return (
                    <button
                      key={ep.episodeNumber}
                      onClick={() => {
                        setCurrentEpisode(ep.episodeNumber);
                        setKey((prev) => prev + 1);
                      }}
                      style={{
                        background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                        color: isActive ? '#fff' : 'var(--text-primary)',
                        border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        padding: '0.5rem 0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'all 0.15s ease',
                      }}
                      title={ep.title}
                    >
                      EP {ep.episodeNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Info & Synopsis */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {item.overview}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
