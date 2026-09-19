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
  Globe,
  Heart,
  PictureInPicture,
  Maximize2,
  Minimize2,
  Upload,
  Radio
} from 'lucide-react';
import { GLOBAL_LIVE_CHANNELS } from '../data/globalLiveTvCatalog';
import { 
  WORLD_COUNTRY_PRESETS, 
  IPTV_GENRES, 
  getFavoriteChannelIds, 
  toggleFavoriteChannelId,
  fetchIptvCountryChannels,
  parseCustomM3uText,
  getProxiedStreamUrl 
} from '../services/iptvService';
import type { LiveChannel } from '../types';
import { useTheme } from '../context/ThemeContext';

export const LiveTvSection: React.FC = () => {
  const { isDayMode, showToast } = useTheme();
  const [channels, setChannels] = useState<LiveChannel[]>(GLOBAL_LIVE_CHANNELS);
  const [activeChannel, setActiveChannel] = useState<LiveChannel>(GLOBAL_LIVE_CHANNELS[0]);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customM3uUrl, setCustomM3uUrl] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [streamError, setStreamError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingIptv, setIsFetchingIptv] = useState<boolean>(false);
  const [iptvStatusMessage, setIptvStatusMessage] = useState<string>('');
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(getFavoriteChannelIds());
  const [proxyTier, setProxyTier] = useState<'direct' | 'relay1' | 'relay2' | 'backend'>('direct');
  const [serverMode, setServerMode] = useState<'embed' | 'hls' | 'backup'>(
    GLOBAL_LIVE_CHANNELS[0].embedUrl ? 'embed' : 'hls'
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setProxyTier('direct');

    // If channel has official verified 24/7 embed, default to embed for instant guaranteed playback
    if (channel.embedUrl) {
      setServerMode('embed');
    } else {
      setServerMode('hls');
    }
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleFavoriteChannelId(id);
    setFavoriteIds(updated);
    const isFav = updated.includes(id);
    showToast(isFav ? 'Added to Favorite Channels ❤️' : 'Removed from Favorites', 'info');
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
    const baseStreamUrl =
      serverMode === 'backup' && activeChannel.backupStreamUrl
        ? activeChannel.backupStreamUrl
        : activeChannel.streamUrl;

    const resolvedStreamUrl = getProxiedStreamUrl(baseStreamUrl, proxyTier);

    // Fail-safe Watchdog: If HLS takes > 5s (due to CORS/network block), auto failover to CORS relay
    timeoutRef.current = window.setTimeout(() => {
      if (isLoading) {
        if (proxyTier === 'direct') {
          console.log('Auto switching to CORS Relay 1...');
          setProxyTier('relay1');
        } else if (proxyTier === 'relay1') {
          console.log('Auto switching to CORS Relay 2...');
          setProxyTier('relay2');
        } else if (activeChannel.embedUrl) {
          setServerMode('embed');
          setIsLoading(false);
        } else {
          setStreamError(true);
          setIsLoading(false);
        }
      }
    }, 5000);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        manifestLoadingTimeOut: 5000,
        manifestLoadingMaxRetry: 2,
      });

      hlsRef.current = hls;
      hls.loadSource(resolvedStreamUrl);
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
          if (proxyTier === 'direct') {
            setProxyTier('relay1');
          } else if (proxyTier === 'relay1') {
            setProxyTier('relay2');
          } else if (activeChannel.embedUrl) {
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
      video.src = resolvedStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsLoading(false);
        setStreamError(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (proxyTier === 'direct') {
          setProxyTier('relay1');
        } else if (activeChannel.embedUrl) {
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
  }, [activeChannel, serverMode, proxyTier]);

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handlePictureInPicture = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('PiP error', err);
      }
    }
  };

  const handleFullScreen = () => {
    if (playerContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (playerContainerRef.current.requestFullscreen) {
        playerContainerRef.current.requestFullscreen().catch(() => {});
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
    setProxyTier('direct');
    setCustomM3uUrl('');
    showToast('Loaded custom M3U8 feed', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCustomM3uText(text);
        if (parsed.length > 0) {
          setChannels([...parsed, ...channels]);
          setActiveChannel(parsed[0]);
          setServerMode('hls');
          showToast(`Loaded ${parsed.length} channels from playlist file`, 'success');
        } else {
          showToast('Could not find valid stream entries in M3U file', 'warning');
        }
      }
    };
    reader.readAsText(file);
  };

  // Dynamic iptv-org M3U Playlist Loader
  const loadCountryChannels = async (countryCode: string, countryName: string) => {
    setIsFetchingIptv(true);
    setIptvStatusMessage(`Fetching 24/7 channels for ${countryName} from global IPTV database...`);

    try {
      const fetched = await fetchIptvCountryChannels(countryCode, countryName);
      if (fetched.length > 0) {
        setChannels([...GLOBAL_LIVE_CHANNELS, ...fetched]);
        setIptvStatusMessage(`✓ Successfully added ${fetched.length} live channels from ${countryName}!`);
        setActiveChannel(fetched[0]);
        setServerMode('hls');
        setProxyTier('direct');
      } else {
        setIptvStatusMessage(`Loaded curated verified channels for ${countryName}.`);
      }
    } catch {
      setIptvStatusMessage(`Loaded curated verified channels for ${countryName}.`);
    } finally {
      setIsFetchingIptv(false);
      setTimeout(() => setIptvStatusMessage(''), 4000);
    }
  };

  const filteredChannels = channels.filter((c) => {
    const isFavMatch = selectedCategory === 'Favorites' ? favoriteIds.includes(c.id) : true;

    const matchesCountry =
      selectedCountry === 'all' ||
      c.country.toLowerCase().includes(selectedCountry.toLowerCase()) ||
      (selectedCountry === 'in' && c.country.toLowerCase().includes('india'));

    const matchesCategory =
      selectedCategory === 'All' ||
      selectedCategory === 'Favorites' ||
      c.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesSearch =
      searchQuery.trim() === '' ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.language && c.language.toLowerCase().includes(searchQuery.toLowerCase()));

    return isFavMatch && matchesCountry && matchesCategory && matchesSearch;
  });

  const isCurrentFav = favoriteIds.includes(activeChannel.id);

  return (
    <div style={{ maxWidth: '1520px', margin: '0 auto', padding: '5.5rem clamp(0.75rem, 2.5vw, 1.5rem) 3rem' }}>
      
      {/* Top Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <span className="live-pulse" />
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Worldwide Live TV Universe & 4K OTT Streams
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
              10,000+ FREE GLOBAL CHANNELS
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Duniya bhar ke Indian Hindi news, global sports cricket, 4K cinema, space, EDM music aur IPTV feeds bina kisi buffering aur subscription ke free me dekhein.
          </p>
        </div>

        {/* Custom Stream & File Importers */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <form onSubmit={handleCustomStreamLoad} style={{ display: 'flex', gap: '0.4rem', minWidth: '280px' }}>
            <input
              type="url"
              placeholder="Paste any custom .m3u8 link..."
              value={customM3uUrl}
              onChange={(e) => setCustomM3uUrl(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.5rem 0.85rem',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button type="submit" className="btn-accent" style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', fontWeight: 800 }}>
              Play M3U8
            </button>
          </form>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Upload custom .m3u playlist file"
          >
            <Upload size={14} />
            <span>Upload M3U</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".m3u,.m3u8,.txt"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* 50+ Countries Worldwide Selector Rail */}
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
          <Globe size={18} color="var(--accent)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Select Country Broadcast:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', overflowX: 'auto', scrollbarWidth: 'none', padding: '2px 0', maxWidth: '100%' }}>
          <button
            onClick={() => {
              setSelectedCountry('all');
              setChannels(GLOBAL_LIVE_CHANNELS);
            }}
            style={{
              background: selectedCountry === 'all' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: selectedCountry === 'all' ? 'var(--accent-text)' : 'var(--text-primary)',
              border: selectedCountry === 'all' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            🌐 All Worldwide (80+ Verified)
          </button>

          {WORLD_COUNTRY_PRESETS.map((country) => (
            <button
              key={country.code}
              onClick={() => {
                setSelectedCountry(country.code);
                loadCountryChannels(country.code, country.name);
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
              <span>{country.flag}</span>
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
            padding: '0.55rem 1rem',
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
          {isFetchingIptv ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
          <span>{iptvStatusMessage}</span>
        </div>
      )}

      {/* Quick Stream Preset Selector Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Zap size={14} /> Quick Hits:
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

      {/* Multi-Server & CORS Proxy Engine Switcher Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.55rem 0.95rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tv size={16} color="var(--accent)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Stream Engine & CORS Proxy:
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
              }}
            >
              <ShieldCheck size={13} />
              <span>Server 1: Official 24/7 (Instant 1080p)</span>
              {serverMode === 'embed' && <Check size={12} />}
            </button>
          )}

          <button
            onClick={() => {
              setServerMode('hls');
              setProxyTier('direct');
              setStreamError(false);
            }}
            style={{
              background: serverMode === 'hls' && proxyTier === 'direct' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: serverMode === 'hls' && proxyTier === 'direct' ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: serverMode === 'hls' && proxyTier === 'direct' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Zap size={13} />
            <span>Server 2: Direct HLS</span>
            {serverMode === 'hls' && proxyTier === 'direct' && <Check size={12} />}
          </button>

          <button
            onClick={() => {
              setServerMode('hls');
              setProxyTier('relay1');
              setStreamError(false);
            }}
            style={{
              background: serverMode === 'hls' && proxyTier === 'relay1' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: serverMode === 'hls' && proxyTier === 'relay1' ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: serverMode === 'hls' && proxyTier === 'relay1' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
            title="Bypasses browser CORS blocking using public stream relay"
          >
            <Globe size={13} />
            <span>Server 3: CORS Relay 1</span>
            {serverMode === 'hls' && proxyTier === 'relay1' && <Check size={12} />}
          </button>

          <button
            onClick={() => {
              setServerMode('hls');
              setProxyTier('relay2');
              setStreamError(false);
            }}
            style={{
              background: serverMode === 'hls' && proxyTier === 'relay2' ? 'var(--accent)' : 'var(--bg-secondary)',
              color: serverMode === 'hls' && proxyTier === 'relay2' ? 'var(--accent-text)' : 'var(--text-secondary)',
              border: serverMode === 'hls' && proxyTier === 'relay2' ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Radio size={13} />
            <span>Server 4: CORS Relay 2</span>
            {serverMode === 'hls' && proxyTier === 'relay2' && <Check size={12} />}
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Video Player, Right is Search & Channel List */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
        className="livetv-grid"
      >
        <style>{`
          @media (min-width: 1024px) {
            .livetv-grid { grid-template-columns: ${isTheater ? '1fr' : '1.75fr 1fr'} !important; }
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
            position: 'relative',
          }}
        >
          {/* Video / Embed Display */}
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
                  background: 'rgba(0,0,0,0.78)',
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
                <RefreshCw size={28} className="animate-spin" />
                <span>Connecting to HLS Stream...</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Auto resolving stream via CORS proxies
                </span>
              </div>
            )}

            {streamError && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.94)',
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
                  ⚠️ Stream Blocked by ISP or Offline
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.5 }}>
                  Browser CORS policy ya ISP ne is direct stream ko block kiya hai. Kripya <strong>Server 1: Official Live 24/7</strong> ya <strong>Server 3/4 CORS Relay</strong> switch karein!
                </p>
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                      setProxyTier('relay1');
                      setServerMode('hls');
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
                  >
                    Try CORS Relay 1
                  </button>
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

          {/* Player Controls Bar & Program Meta */}
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
                  width: '46px',
                  height: '46px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {activeChannel.name}
                  </h3>
                  <button
                    onClick={(e) => handleToggleFavorite(activeChannel.id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: isCurrentFav ? '#ef4444' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                    title={isCurrentFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart size={18} fill={isCurrentFav ? '#ef4444' : 'none'} />
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {activeChannel.currentProgram || '24x7 Broadcast Stream'} • {activeChannel.country} ({activeChannel.language})
                </p>
              </div>
            </div>

            {/* Live Playback Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Volume Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={handleMuteToggle}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  style={{ width: '60px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>

              {/* PiP Button */}
              <button
                onClick={handlePictureInPicture}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
                title="Picture-in-Picture Mode"
              >
                <PictureInPicture size={15} />
                <span>PiP</span>
              </button>

              {/* Theater Mode Button */}
              <button
                onClick={() => setIsTheater(!isTheater)}
                style={{
                  background: isTheater ? 'var(--accent)' : 'var(--bg-card)',
                  color: isTheater ? 'var(--accent-text)' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
                title={isTheater ? 'Exit Theater Mode' : 'Theater Mode'}
              >
                {isTheater ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                <span>Theater</span>
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullScreen}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  padding: '0.45rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
                title="Fullscreen"
              >
                <Maximize size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Channel Directory & Filter Search */}
        {!isTheater && (
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '680px',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '0.85rem' }}>
              <Search size={16} color="var(--accent)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by Channel, Country, Language..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem 0.55rem 2.4rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.65rem', marginBottom: '0.75rem', scrollbarWidth: 'none' }}>
              {IPTV_GENRES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: isActive ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 800 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    {cat === 'Favorites' && <Heart size={12} fill={isActive ? 'currentColor' : '#ef4444'} color="#ef4444" />}
                    <span>{cat}</span>
                    {cat === 'Favorites' && <span>({favoriteIds.length})</span>}
                  </button>
                );
              })}
            </div>

            {/* Channel List Header Stats */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              <span>Available Channels: {filteredChannels.length}</span>
              <span>HD / 4K UHD</span>
            </div>

            {/* Scrollable Channel List Cards */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingRight: '0.25rem',
              }}
              className="custom-scrollbar"
            >
              {filteredChannels.map((channel) => {
                const isSelected = activeChannel.id === channel.id;
                const isFav = favoriteIds.includes(channel.id);

                return (
                  <div
                    key={channel.id}
                    onClick={() => handleSelectChannel(channel)}
                    style={{
                      background: isSelected ? 'var(--badge-bg)' : 'var(--bg-secondary)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        style={{
                          width: '38px',
                          height: '38px',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.06)',
                          padding: '3px',
                          flexShrink: 0,
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop';
                        }}
                      />

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <h4
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: isSelected ? 800 : 700,
                              color: isSelected ? (isDayMode ? '#0f172a' : 'var(--accent)') : 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {channel.name}
                          </h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>{channel.country}</span>
                          <span>•</span>
                          <span>{channel.category}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                      <button
                        onClick={(e) => handleToggleFavorite(channel.id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: isFav ? '#ef4444' : 'var(--text-muted)',
                          padding: '4px',
                        }}
                      >
                        <Heart size={16} fill={isFav ? '#ef4444' : 'none'} />
                      </button>

                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                          color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Play size={13} fill="currentColor" style={{ marginLeft: '1px' }} />
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredChannels.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  Koi channel nahi mila is filter ke sath. Doosra country ya category select karein!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
