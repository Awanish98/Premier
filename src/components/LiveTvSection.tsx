import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  Search, 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { LIVE_CHANNELS } from '../data/mockCatalog';
import type { LiveChannel } from '../types';

export const LiveTvSection: React.FC = () => {
  const [channels, setChannels] = useState<LiveChannel[]>(LIVE_CHANNELS);
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(LIVE_CHANNELS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customM3uUrl, setCustomM3uUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const categories = [
    'All',
    'Hindi / India',
    'Sports',
    'Movies',
    'News',
    'Entertainment',
    'Global'
  ];

  // Quick preset shortcuts for instant 1-click loading
  const quickPresets = [
    { name: 'Aaj Tak HD', id: 'aaj-tak' },
    { name: 'DD Sports', id: 'dd-sports' },
    { name: 'Red Bull Extreme', id: 'red-bull-tv' },
    { name: 'Skate 4K Flex', id: 'skate-phantom-4k' },
    { name: 'Apple 4K HDR', id: 'apple-bipbop-4k' },
    { name: 'Sintel 4K Cinema', id: 'sintel-open-cinema' },
    { name: 'NASA 4K Live', id: 'nasa-tv' },
  ];

  // Initialize and load HLS stream whenever activeChannel changes
  useEffect(() => {
    if (!activeChannel || !videoRef.current) return;

    setStreamError(false);
    setIsLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;
    const streamUrl = activeChannel.streamUrl;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch(() => {
          // Autoplay was blocked, muted play fallback
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setStreamError(true);
              setIsLoading(false);
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native iOS Safari support
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setStreamError(true);
        setIsLoading(false);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeChannel]);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleCustomStreamLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customM3uUrl) return;

    const customChannel: LiveChannel = {
      id: `custom-${Date.now()}`,
      name: 'Custom M3U8 Stream',
      logo: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop',
      streamUrl: customM3uUrl,
      category: 'Global',
      country: 'Custom',
      language: 'Live',
      resolution: '4K / HD',
      isLive: true,
      currentProgram: 'Custom User Stream Feed'
    };

    setChannels([customChannel, ...channels]);
    setActiveChannel(customChannel);
    setCustomM3uUrl('');
  };

  const filteredChannels = channels.filter((c) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Global' ? c.country !== 'India' : c.category.includes(selectedCategory));
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '6rem 1.25rem 3rem' }}>
      {/* Header Title & Quick Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
            <span className="live-pulse" />
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Live TV Channels & 4K HLS Streams
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                letterSpacing: '0.05em'
              }}
            >
              24/7 LIVE
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Duniya bhar ke popular free-to-air Indian Hindi news, global sports, cinema streams aur 4K IPTV feeds direct HLS player me dekhein.
          </p>
        </div>

        {/* Custom M3U8 Link Input Bar */}
        <form onSubmit={handleCustomStreamLoad} style={{ display: 'flex', gap: '0.5rem', maxWidth: '440px', width: '100%' }}>
          <input
            type="url"
            placeholder="Paste any custom .m3u8 stream link..."
            value={customM3uUrl}
            onChange={(e) => setCustomM3uUrl(e.target.value)}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.55rem 0.9rem',
              color: '#fff',
              fontSize: '0.84rem',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn-accent" style={{ padding: '0.55rem 1.1rem', fontSize: '0.84rem', fontWeight: 800 }}>
            Play M3U8
          </button>
        </form>
      </div>

      {/* Quick Stream Preset Selector Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.85rem', marginBottom: '1.25rem', scrollbarWidth: 'none' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Zap size={14} /> Quick Feeds:
        </span>
        {quickPresets.map((preset) => {
          const target = channels.find((c) => c.id === preset.id);
          const isActive = activeChannel.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => {
                if (target) setActiveChannel(target);
              }}
              style={{
                background: isActive ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#05080b' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent)' : 'var(--border-subtle)',
                borderRadius: '999px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Left is Video Player, Right is Channel Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }} className="livetv-grid">
        <style>{`
          @media (min-width: 1024px) {
            .livetv-grid { grid-template-columns: 1.75fr 1fr !important; }
          }
        `}</style>

        {/* Left Side: Real HLS Stream Video Player */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Player Display */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              background: '#000',
              aspectRatio: '16/9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <video
              ref={videoRef}
              controls={false}
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />

            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  gap: '0.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                }}
              >
                <RefreshCw size={24} className="animate-spin" />
                <span>Buffering Live Stream...</span>
              </div>
            )}

            {streamError && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.88)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  textAlign: 'center',
                  gap: '0.85rem',
                }}
              >
                <div style={{ color: '#ef4444', fontSize: '1.15rem', fontWeight: 800 }}>
                  ⚠️ Live Feed Temporarily Offline or Geo-Restricted
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.5 }}>
                  Yeh channel is samay response nahi de raha hai ya VPN required hai. Kripya list se dusra stream (jaise Aaj Tak, DD Sports ya Sintel 4K) select karein.
                </p>
                <button
                  onClick={() => {
                    const next = channels.find((c) => c.id !== activeChannel.id);
                    if (next) setActiveChannel(next);
                  }}
                  className="btn-accent"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1.2rem', fontWeight: 800 }}
                >
                  Switch Next Stream
                </button>
              </div>
            )}

            {/* Custom On-Screen Live Watermark & Channel Logo */}
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)',
                padding: '0.35rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span className="live-pulse" />
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fff' }}>LIVE</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>{activeChannel.name}</span>
            </div>

            {/* Resolution Badge */}
            {activeChannel.resolution && (
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                }}
              >
                {activeChannel.resolution}
              </div>
            )}
          </div>

          {/* Player Controls & Current Program Info */}
          <div
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img
                src={activeChannel.logo}
                alt={activeChannel.name}
                style={{
                  width: '44px',
                  height: '44px',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '4px',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop';
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activeChannel.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {activeChannel.currentProgram || '24x7 Broadcast Stream'} • {activeChannel.country} ({activeChannel.language})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleMuteToggle}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                onClick={handleFullScreen}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  color: '#fff',
                  cursor: 'pointer',
                }}
                title="Fullscreen"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Channel Directory & Category Filters */}
        <div
          style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '580px',
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  color: selectedCategory === cat ? '#05080b' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.38rem 0.8rem',
                  fontSize: '0.78rem',
                  fontWeight: selectedCategory === cat ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search 24+ live channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                color: '#fff',
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Channel Cards Scroll List */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }} className="custom-scrollbar">
            {filteredChannels.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No channels found matching query.
              </div>
            ) : (
              filteredChannels.map((c) => {
                const isSelected = activeChannel.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveChannel(c)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--badge-bg)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <img
                      src={c.logo}
                      alt={c.name}
                      style={{
                        width: '34px',
                        height: '34px',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        background: '#111',
                        padding: '2px',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop';
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h4
                          style={{
                            fontSize: '0.84rem',
                            fontWeight: isSelected ? 800 : 600,
                            color: isSelected ? 'var(--accent)' : 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {c.name}
                        </h4>
                        {c.isLive && <span className="live-pulse" style={{ width: '6px', height: '6px' }} />}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {c.category} • {c.country}
                      </span>
                    </div>

                    <Play size={16} color={isSelected ? 'var(--accent)' : 'var(--text-muted)'} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
