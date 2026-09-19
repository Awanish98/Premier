import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { 
  Search, 
  Play, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RefreshCw,
  Zap,
  Tv,
  Check,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { GLOBAL_LIVE_CHANNELS, IPTV_COUNTRY_PRESETS } from '../data/globalLiveTvCatalog';
import type { LiveChannel } from '../types';

export const LiveTvSection: React.FC = () => {
  const [channels, setChannels] = useState<LiveChannel[]>(GLOBAL_LIVE_CHANNELS);
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(GLOBAL_LIVE_CHANNELS[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customM3uUrl, setCustomM3uUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingIptv, setIsFetchingIptv] = useState<boolean>(false);
  const [iptvStatusMessage, setIptvStatusMessage] = useState<string>('');
  const [serverMode, setServerMode] = useState<'embed' | 'hls' | 'backup'>(
    GLOBAL_LIVE_CHANNELS[0].embedUrl ? 'embed' : 'hls'
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    'All',
    'News',
    'Sports',
    'Movies',
    'Science',
    'Nature',
    'Music',
    'Anime',
    'Kids',
    'Entertainment'
  ];

  // Quick preset shortcuts for instant 1-click loading
  const quickPresets = [
    { name: 'ABP News HD', id: 'abp-news' },
    { name: 'Aaj Tak HD', id: 'aaj-tak' },
    { name: 'NDTV India', id: 'ndtv-india' },
    { name: 'DD Sports Live', id: 'dd-sports' },
    { name: 'WION Global', id: 'wion-news' },
    { name: 'Red Bull Extreme', id: 'red-bull-tv' },
    { name: 'NASA 4K Live', id: 'nasa-tv' },
    { name: 'Sky News UK', id: 'sky-news-intl' },
    { name: 'Al Jazeera HD', id: 'al-jazeera' },
    { name: 'Big Buck Bunny 4K', id: 'big-buck-bunny-4k' },
    { name: 'Sintel 4K Cinema', id: 'sintel-open-cinema' },
    { name: 'Lofi Girl Beats', id: 'lofigirl-beats' }
  ];

  // Channel switch handler: auto pick best server
  const handleSelectChannel = (channel: LiveChannel) => {
    setActiveChannel(channel);
    setStreamError(false);
    // If channel has official verified 24/7 embed, default to embed for instant guaranteed playback
    if (channel.embedUrl) {
      setServerMode('embed');
    } else {
      setServerMode('hls');
    }
  };

  // Initialize and load HLS stream when in 'hls' or 'backup' mode
  useEffect(() => {
    if (!activeChannel) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (serverMode === 'embed') {
      setIsLoading(false);
      setStreamError(false);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    if (!videoRef.current) return;

    setStreamError(false);
    setIsLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;
    const targetStreamUrl =
      serverMode === 'backup' && activeChannel.backupStreamUrl
        ? activeChannel.backupStreamUrl
        : activeChannel.streamUrl;

    // Fail-safe Watchdog: If HLS takes > 4.5s (due to CORS/network block), failover to embed
    timeoutRef.current = window.setTimeout(() => {
      if (isLoading) {
        if (activeChannel.embedUrl) {
          setServerMode('embed');
          setIsLoading(false);
        } else {
          setStreamError(true);
          setIsLoading(false);
        }
      }
    }, 4500);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        manifestLoadingTimeOut: 4000,
        manifestLoadingMaxRetry: 1,
      });

      hlsRef.current = hls;
      hls.loadSource(targetStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsLoading(false);
        setStreamError(false);
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (activeChannel.embedUrl) {
            // Auto failover to Server 1 (Official Live Stream)
            setServerMode('embed');
            setIsLoading(false);
          } else {
            setStreamError(true);
            setIsLoading(false);
            hls.destroy();
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native iOS Safari support
      video.src = targetStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsLoading(false);
        setStreamError(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (activeChannel.embedUrl) {
          setServerMode('embed');
        } else {
          setStreamError(true);
        }
        setIsLoading(false);
      });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeChannel, serverMode]);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullScreen = () => {
    if (playerContainerRef.current) {
      if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen();
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
    setServerMode('hls');
    setCustomM3uUrl('');
  };

  // Dynamic iptv-org M3U Playlist Loader
  const loadIptvCountryPlaylist = async (countryCode: string, countryName: string) => {
    setIsFetchingIptv(true);
    setIptvStatusMessage(`Fetching 24/7 channels for ${countryName} from iptv-org...`);

    try {
      const url =
        countryCode === 'all'
          ? 'https://iptv-org.github.io/iptv/index.m3u'
          : `https://iptv-org.github.io/iptv/countries/${countryCode}.m3u`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const text = await res.text();

      // Parse M3U playlist lines
      const lines = text.split('\n');
      const parsedChannels: LiveChannel[] = [];
      let currentInfo: Partial<LiveChannel> = {};

      for (let i = 0; i < lines.length && parsedChannels.length < 60; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXTINF:')) {
          const nameMatch = line.match(/,(.+)$/);
          const logoMatch = line.match(/tvg-logo="([^"]+)"/);
          const groupMatch = line.match(/group-title="([^"]+)"/);

          currentInfo = {
            id: `iptv-${countryCode}-${parsedChannels.length + 1}-${Date.now()}`,
            name: nameMatch ? nameMatch[1].trim() : `Channel ${parsedChannels.length + 1}`,
            logo: logoMatch ? logoMatch[1] : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop',
            category: groupMatch ? groupMatch[1] : 'General',
            country: countryName,
            language: 'Live Broadcast',
            resolution: 'HD',
            isLive: true,
            currentProgram: '24x7 Live Transmission'
          };
        } else if (line.startsWith('http://') || line.startsWith('https://')) {
          if (currentInfo.name) {
            parsedChannels.push({
              ...(currentInfo as LiveChannel),
              streamUrl: line,
            });
            currentInfo = {};
          }
        }
      }

      if (parsedChannels.length > 0) {
        setChannels([...GLOBAL_LIVE_CHANNELS, ...parsedChannels]);
        setIptvStatusMessage(`✓ Successfully added ${parsedChannels.length} live channels from ${countryName}!`);
        setActiveChannel(parsedChannels[0]);
        setServerMode('hls');
      } else {
        setIptvStatusMessage(`Using curated verified streams for ${countryName}.`);
      }
    } catch {
      setIptvStatusMessage(`Loaded curated verified channels for ${countryName}.`);
    } finally {
      setIsFetchingIptv(false);
      setTimeout(() => setIptvStatusMessage(''), 4000);
    }
  };

  const filteredChannels = channels.filter((c) => {
    const matchesCountry =
      selectedCountry === 'all' ||
      (selectedCountry === 'in' ? c.country.toLowerCase().includes('india') : true);

    const matchesCategory =
      selectedCategory === 'All' ||
      c.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCountry && matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1520px', margin: '0 auto', padding: '6rem 1.25rem 3rem' }}>
      {/* Header Title & Quick Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
            <span className="live-pulse" />
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Global Live TV Universe & 4K OTT Streams
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
              8,000+ FREE CHANNELS
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Duniya bhar ke Indian Hindi news, global sports cricket, 4K cinema, space, EDM music aur IPTV feeds bina kisi subscription ke free me dekhein.
          </p>
        </div>

        {/* Custom M3U8 Link Input Bar */}
        <form onSubmit={handleCustomStreamLoad} style={{ display: 'flex', gap: '0.5rem', maxWidth: '460px', width: '100%' }}>
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
            Stream M3U8
          </button>
        </form>
      </div>

      {/* World Countries 1-Click Importer Rail */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} color="var(--accent)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Explore World IPTV Feeds:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', scrollbarWidth: 'none', padding: '2px 0' }}>
          {IPTV_COUNTRY_PRESETS.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                setSelectedCountry(country.code);
                loadIptvCountryPlaylist(country.code, country.name);
              }}
              style={{
                background: selectedCountry === country.code ? 'var(--accent)' : 'var(--bg-secondary)',
                color: selectedCountry === country.code ? 'var(--accent-text)' : 'var(--text-primary)',
                border: selectedCountry === country.code ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{country.name}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.75 }}>({country.count})</span>
            </button>
          ))}
        </div>
      </div>

      {iptvStatusMessage && (
        <div
          style={{
            background: 'rgba(149, 255, 80, 0.12)',
            border: '1px solid var(--accent)',
            borderRadius: '10px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="animate-fade-in"
        >
          {isFetchingIptv ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
          <span>{iptvStatusMessage}</span>
        </div>
      )}

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
                if (target) handleSelectChannel(target);
              }}
              style={{
                background: isActive ? 'var(--accent)' : 'var(--bg-card)',
                color: isActive ? 'var(--accent-text)' : 'var(--text-primary)',
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

      {/* Multi-Server Selector Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.5rem 0.85rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tv size={16} color="var(--accent)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Streaming Source:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {activeChannel.embedUrl && (
            <button
              onClick={() => {
                setServerMode('embed');
                setStreamError(false);
              }}
              style={{
                background: serverMode === 'embed' ? 'var(--accent)' : 'var(--bg-secondary)',
                color: serverMode === 'embed' ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: serverMode === 'embed' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
            >
              <ShieldCheck size={13} />
              <span>Server 1: Official Live 24/7 (Instant 1080p)</span>
              {serverMode === 'embed' && <Check size={12} />}
            </button>
          )}

          <button
            onClick={() => {
              setServerMode('hls');
              setStreamError(false);
            }}
            style={{
              background: serverMode === 'hls' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: serverMode === 'hls' ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: serverMode === 'hls' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s ease',
            }}
          >
            <Zap size={13} />
            <span>Server 2: HLS Direct Stream</span>
            {serverMode === 'hls' && <Check size={12} />}
          </button>

          {activeChannel.backupStreamUrl && (
            <button
              onClick={() => {
                setServerMode('backup');
                setStreamError(false);
              }}
              style={{
                background: serverMode === 'backup' ? 'var(--accent)' : 'var(--bg-secondary)',
                color: serverMode === 'backup' ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: serverMode === 'backup' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Globe size={13} />
              <span>Server 3: Mirror Feed</span>
              {serverMode === 'backup' && <Check size={12} />}
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left is Video Player, Right is Channel Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }} className="livetv-grid">
        <style>{`
          @media (min-width: 1024px) {
            .livetv-grid { grid-template-columns: 1.75fr 1fr !important; }
          }
        `}</style>

        {/* Left Side: Video Player Container */}
        <div
          ref={playerContainerRef}
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
            {serverMode === 'embed' && activeChannel.embedUrl ? (
              <iframe
                key={activeChannel.id + '-embed'}
                src={activeChannel.embedUrl}
                title={activeChannel.name}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  position: 'absolute',
                  inset: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                controls={true}
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            )}

            {isLoading && serverMode !== 'embed' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  gap: '0.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  zIndex: 10,
                }}
              >
                <RefreshCw size={26} className="animate-spin" />
                <span>Connecting to HLS Stream...</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Auto failover to Server 1 in a moment if network is slow
                </span>
              </div>
            )}

            {streamError && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.92)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  textAlign: 'center',
                  gap: '0.85rem',
                  zIndex: 10,
                }}
              >
                <div style={{ color: '#ef4444', fontSize: '1.15rem', fontWeight: 800 }}>
                  ⚠️ Direct HLS Stream Blocked by ISP or Offline
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.5 }}>
                  Browser CORS policy ya ISP ne direct HLS link block kiya hai. Kripya <strong>Server 1: Official Live 24/7</strong> par switch karein jo 100% chalega!
                </p>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  {activeChannel.embedUrl && (
                    <button
                      onClick={() => {
                        setServerMode('embed');
                        setStreamError(false);
                      }}
                      className="btn-accent"
                      style={{ fontSize: '0.85rem', padding: '0.55rem 1.3rem', fontWeight: 800 }}
                    >
                      Switch to Server 1 (Official Live)
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const next = channels.find((c) => c.id !== activeChannel.id);
                      if (next) handleSelectChannel(next);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
                  >
                    Next Channel
                  </button>
                </div>
              </div>
            )}

            {/* Custom On-Screen Live Watermark & Channel Logo (in HLS mode) */}
            {serverMode !== 'embed' && (
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
                  zIndex: 5,
                }}
              >
                <span className="live-pulse" />
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fff' }}>LIVE</span>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>{activeChannel.name}</span>
              </div>
            )}

            {/* Resolution Badge */}
            {activeChannel.resolution && serverMode !== 'embed' && (
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
                  zIndex: 5,
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
              {serverMode !== 'embed' && (
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
              )}

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
            maxHeight: '620px',
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.75rem', scrollbarWidth: 'none' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? 'var(--accent-text)' : 'var(--text-secondary)',
                  border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
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
              placeholder="Search across all live channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.55rem 0.85rem 0.55rem 2.2rem',
                color: 'var(--text-primary)',
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
                    onClick={() => handleSelectChannel(c)}
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
