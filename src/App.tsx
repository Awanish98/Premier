import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FlixCategoryRail } from './components/FlixCategoryRail';
import { ContentCard } from './components/ContentCard';
import { ContentRow } from './components/ContentRow';
import { PlayerModal } from './components/PlayerModal';
import { MediaDetailModal } from './components/MediaDetailModal';
import { LiveTvSection } from './components/LiveTvSection';
import { AlbumSection } from './components/AlbumSection';
import { AlbumCard } from './components/AlbumCard';
import { InfiniteCatalog } from './components/InfiniteCatalog';
import { DiscoverSection } from './components/DiscoverSection';
import { ProfileSection } from './components/ProfileSection';
import { WatchlistSection } from './components/WatchlistSection';
import { SearchOverlay } from './components/SearchOverlay';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { MobileInstallBanner } from './components/MobileInstallBanner';
import { AiAssistantModal } from './components/AiAssistantModal';
import { SpinWheelModal } from './components/SpinWheelModal';
import { CloudstreamHubModal } from './components/CloudstreamHubModal';
import { AmbientBackground } from './components/AmbientBackground';
import { Toast } from './components/Toast';
import { LoadingScreen } from './components/LoadingScreen';
import { Footer } from './components/Footer';
import { Marquee } from './components/magicui/Marquee';
import { BentoGrid } from './components/magicui/BentoGrid';
import { 
  FEATURED_HERO_ITEMS,
  getFlixCategoryItems,
  POPULAR_MOVIES, 
  POPULAR_TV_SHOWS, 
  POPULAR_ANIME,
  DUAL_AUDIO_ITEMS,
  FRANCHISE_ALBUMS,
  MASTER_MEDIA_ITEMS
} from './data/mockCatalog';
import type { MediaItem, LiveChannel, MediaAlbum, FlixCategory, SortOption } from './types';
import { Tv, Sparkles, Flame, Clapperboard, Disc, ArrowRight, Play, Clock, Server, Bot } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [detailMedia, setDetailMedia] = useState<MediaItem | null>(null);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [apkModalOpen, setApkModalOpen] = useState<boolean>(false);
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [spinWheelOpen, setSpinWheelOpen] = useState<boolean>(false);
  const [cloudstreamOpen, setCloudstreamOpen] = useState<boolean>(false);
  const [flixCategory, setFlixCategory] = useState<FlixCategory>('trending');
  const [flixSort, setFlixSort] = useState<SortOption>('trending');
  const { continueWatching } = useTheme();

  // Scroll to top when active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handlePlayMedia = (item: MediaItem) => {
    setActiveMedia(item);
  };

  const handleShowDetails = (item: MediaItem) => {
    setDetailMedia(item);
  };

  const handlePlayChannel = (_: LiveChannel) => {
    setActiveTab('livetv');
  };

  const handleCategorySelect = (cat: FlixCategory) => {
    if (cat === 'livetv') {
      setActiveTab('livetv');
    } else {
      setFlixCategory(cat);
    }
  };

  // Get active category items sorted
  const rawCategoryItems = getFlixCategoryItems(flixCategory);
  let sortedCategoryItems = [...rawCategoryItems];
  if (flixSort === 'top-rated') {
    sortedCategoryItems.sort((a, b) => b.rating - a.rating);
  } else if (flixSort === 'newest') {
    sortedCategoryItems.sort((a, b) => b.releaseYear - a.releaseYear);
  } else if (flixSort === 'title-asc') {
    sortedCategoryItems.sort((a, b) => a.title.localeCompare(b.title));
  }

  const handlePlayAlbumFirst = (album: MediaAlbum) => {
    const firstItem = MASTER_MEDIA_ITEMS.find((m) => m.id === album.itemIds[0]);
    if (firstItem) {
      setActiveMedia(firstItem);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Cinematic Splash Loading Screen on initial launch */}
      <LoadingScreen />

      {/* Dynamic Animated Ambient Background Layer */}
      <AmbientBackground />

      {/* Interactive Global Toast Container */}
      <Toast />

      {/* Floating & Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenApkModal={() => setApkModalOpen(true)}
        onOpenAiModal={() => setAiModalOpen(true)}
        onOpenSpinWheel={() => setSpinWheelOpen(true)}
        onOpenCloudstream={() => setCloudstreamOpen(true)}
      />

      {/* Main Streaming Platform Viewport */}
      <main style={{ flex: 1, paddingBottom: '5rem', position: 'relative', zIndex: 1 }}>
        {/* ================= TAB: HOME ================= */}
        {activeTab === 'home' && (
          <div>
            {/* Cinematic Blockbuster Movie Hero Billboard */}
            <HeroBanner
              items={FEATURED_HERO_ITEMS}
              onPlay={handlePlayMedia}
              onShowDetails={handleShowDetails}
            />

            {/* Magic UI Infinite Marquee Live Ticker */}
            <div
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                borderTop: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '0.65rem 0',
                position: 'relative',
                zIndex: 10,
                marginBottom: '1.5rem',
              }}
            >
              <Marquee speed={35} pauseOnHover>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent)' }}>
                    <Flame size={15} /> <strong>TOP TRENDING:</strong> Stree 2 • Pushpa 2: The Rule • Kalki 2898 AD • Animal
                  </span>
                  <span style={{ color: 'var(--border-subtle)' }}>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#f59e0b' }}>
                    <Sparkles size={15} /> <strong>DUAL AUDIO:</strong> 100% Hindi Dubbed & Original Tracks Active in 4K UHD
                  </span>
                  <span style={{ color: 'var(--border-subtle)' }}>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#38bdf8' }}>
                    <Server size={15} /> <strong>FMHY ENGINES:</strong> VidLink Pro • AutoEmbed Hindi • Embed.su • SmashyStream
                  </span>
                  <span style={{ color: 'var(--border-subtle)' }}>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#a855f7' }}>
                    <Tv size={15} /> <strong>ANIME PINNACLE:</strong> Solo Leveling S2 • Jujutsu Kaisen • Demon Slayer
                  </span>
                </div>
              </Marquee>
            </div>

            <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '0 1rem' }}>
              
              {/* Flix.id Glass Category Pills Rail + Section Header */}
              <FlixCategoryRail
                activeCategory={flixCategory}
                onSelectCategory={handleCategorySelect}
                sortBy={flixSort}
                onSortChange={setFlixSort}
                onOpenSpinWheel={() => setSpinWheelOpen(true)}
                onOpenCloudstream={() => setCloudstreamOpen(true)}
              />

              {/* Flix.id Category Media Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2.5rem',
                }}
                className="flix-category-grid"
              >
                {sortedCategoryItems.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onPlay={handlePlayMedia}
                    onShowDetails={handleShowDetails}
                    aspectRatio="poster"
                    isGrid={true}
                  />
                ))}
              </div>

            </div>

            <div style={{ maxWidth: '1480px', margin: '0 auto', padding: '0 0.5rem' }}>


              
              {/* Quick Filter Ribbon */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  padding: '1.25rem 1.25rem 0.5rem', 
                  overflowX: 'auto',
                  scrollbarWidth: 'none'
                }}
              >
                {[
                  { label: '🔥 Trending 4K', tab: 'home' },
                  { label: '🇮🇳 Dual Audio (Hindi+Eng)', tab: 'dualaudio' },
                  { label: '🎬 4K UHD Movies', tab: 'movies' },
                  { label: '📺 Web Series', tab: 'tv' },
                  { label: '⚔️ Anime Universe', tab: 'anime' },
                  { label: '💿 Franchise Albums', tab: 'albums' },
                  { label: '📡 Live IPTV Channels', tab: 'livetv' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(chip.tab)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--badge-bg)';
                      e.currentTarget.style.color = 'var(--accent)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Continue Watching Horizontal Row (if present) */}
              {continueWatching.length > 0 && (
                <section style={{ margin: '2rem 0 1rem', padding: '0 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Clock size={20} color="var(--accent)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      Continue Watching
                    </h2>
                  </div>
                  <div 
                    style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      overflowX: 'auto', 
                      paddingBottom: '0.75rem', 
                      scrollSnapType: 'x mandatory',
                      scrollbarWidth: 'none'
                    }}
                  >
                    {continueWatching.map(({ item, progress, lastWatchedSeason, lastWatchedEpisode }) => (
                      <div
                        key={item.id}
                        style={{
                          minWidth: '240px',
                          maxWidth: '260px',
                          background: 'var(--bg-card)',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'pointer',
                          flexShrink: 0,
                          scrollSnapAlign: 'start',
                        }}
                        onClick={() => handlePlayMedia(item)}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '135px' }}>
                          <img
                            src={item.backdropPath || item.posterPath}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: 'var(--accent)',
                                color: 'var(--accent-text)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 15px var(--accent-glow)',
                              }}
                            >
                              <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />
                            </div>
                          </div>
                          {/* Progress Line */}
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)' }} />
                          </div>
                        </div>
                        <div style={{ padding: '0.65rem 0.85rem' }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </h4>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.type === 'movie' ? 'Resume Playback' : `S${lastWatchedSeason || 1} : E${lastWatchedEpisode || 1}`} • {progress}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Bollywood & Dual Audio (Hindi Dubbed) 4K Content Rail */}
              <ContentRow
                title="🇮🇳 Bollywood & Dual Audio (Hindi Dubbed) 4K"
                icon={Flame}
                badge="Dual Audio"
                items={DUAL_AUDIO_ITEMS}
                aspectRatio="poster"
                onPlay={handlePlayMedia}
                onShowDetails={handleShowDetails}
              />

              {/* Franchise Albums Row */}
              <section style={{ margin: '2.5rem 0 1.5rem', padding: '0 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Disc size={22} color="var(--accent)" />
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      Featured Franchise Sagas & Albums
                    </h2>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: 'var(--badge-bg)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                      }}
                    >
                      COLLECTIONS
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('albums')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                    }}
                  >
                    <span>View All Albums</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <BentoGrid style={{ marginTop: '1.25rem' }}>
                  {FRANCHISE_ALBUMS.slice(0, 4).map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onClick={() => setActiveTab('albums')}
                      onPlayFirst={handlePlayAlbumFirst}
                    />
                  ))}
                </BentoGrid>
              </section>

              {/* Trending Blockbusters */}
              <ContentRow
                title="Trending Movies & Global Hits"
                icon={Clapperboard}
                badge="4K UHD"
                items={POPULAR_MOVIES}
                aspectRatio="poster"
                onPlay={handlePlayMedia}
                onShowDetails={handleShowDetails}
              />

              {/* Top Rated Web Series */}
              <ContentRow
                title="Top Rated Web Series & Shows"
                icon={Tv}
                badge="All Seasons"
                items={POPULAR_TV_SHOWS}
                aspectRatio="poster"
                onPlay={handlePlayMedia}
                onShowDetails={handleShowDetails}
              />

              {/* Anime Hub */}
              <ContentRow
                title="Anime Pinnacle Sagas (Sub & Dub)"
                icon={Sparkles}
                badge="Hindi / Japanese"
                items={POPULAR_ANIME}
                aspectRatio="poster"
                onPlay={handlePlayMedia}
                onShowDetails={handleShowDetails}
              />

              {/* Cinematic Backdrops */}
              <ContentRow
                title="Cinematic Shots & Widescreen Epics"
                icon={Clapperboard}
                badge="4K HDR"
                items={POPULAR_MOVIES}
                aspectRatio="backdrop"
                onPlay={handlePlayMedia}
                onShowDetails={handleShowDetails}
              />

              {/* Bottom Endless Catalog on Home Page */}
              <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}>
                <InfiniteCatalog
                  type="all"
                  title="Explore The Entire Streaming Universe (Endless Feed)"
                  subtitle="Scroll down endlessly to discover thousands of movies, shows, anime, and dubbed hits."
                  onPlayMedia={handlePlayMedia}
                  onShowDetails={handleShowDetails}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: MOVIES ================= */}
        {activeTab === 'movies' && (
          <DiscoverSection
            initialType="movie"
            onPlayMedia={handlePlayMedia}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* ================= TAB: TV SHOWS ================= */}
        {activeTab === 'tv' && (
          <DiscoverSection
            initialType="tv"
            onPlayMedia={handlePlayMedia}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* ================= TAB: DUAL AUDIO ================= */}
        {activeTab === 'dualaudio' && (
          <DiscoverSection
            initialType="all"
            initialAudio="dual"
            onPlayMedia={handlePlayMedia}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* ================= TAB: DISCOVER ================= */}
        {activeTab === 'discover' && (
          <DiscoverSection
            initialType="all"
            onPlayMedia={handlePlayMedia}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* ================= TAB: ALBUMS & FRANCHISES ================= */}
        {activeTab === 'albums' && (
          <AlbumSection
            onPlayMedia={handlePlayMedia}
            onShowMediaDetails={handleShowDetails}
          />
        )}

        {/* ================= TAB: ANIME ================= */}
        {activeTab === 'anime' && (
          <DiscoverSection
            initialType="anime"
            onPlayMedia={handlePlayMedia}
            onShowDetails={handleShowDetails}
          />
        )}

        {/* ================= TAB: LIVE TV ================= */}
        {activeTab === 'livetv' && <LiveTvSection />}

        {/* ================= TAB: WATCHLIST ================= */}
        {activeTab === 'watchlist' && (
          <WatchlistSection
            onPlay={handlePlayMedia}
            onShowDetails={handleShowDetails}
            onExplore={() => setActiveTab('home')}
          />
        )}

        {/* ================= TAB: PROFILE ================= */}
        {activeTab === 'profile' && (
          <ProfileSection
            onPlayMedia={handlePlayMedia}
            onShowDetails={handleShowDetails}
          />
        )}
      </main>

      {/* Embedded Multi-Server Stream Player Modal */}
      {activeMedia && (
        <PlayerModal 
          item={activeMedia} 
          onClose={() => setActiveMedia(null)} 
          onShowDetails={handleShowDetails}
          onOpenCloudstream={() => setCloudstreamOpen(true)}
        />
      )}

      {/* Comprehensive Media Details Modal */}
      {detailMedia && (
        <MediaDetailModal
          item={detailMedia}
          onClose={() => setDetailMedia(null)}
          onPlay={handlePlayMedia}
        />
      )}

      {/* Global Universal Search Overlay with AI Smart Search */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPlayMedia={handlePlayMedia}
        onPlayChannel={handlePlayChannel}
        onOpenAiAssistant={() => setAiModalOpen(true)}
      />

      {/* CineBot AI Cinema Assistant Modal */}
      <AiAssistantModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onPlayMedia={handlePlayMedia}
        onShowDetails={handleShowDetails}
        onOpenSpinWheel={() => setSpinWheelOpen(true)}
        onOpenCloudstream={() => setCloudstreamOpen(true)}
      />

      {/* Confused Mood AI Spin Wheel (Roulette) Modal */}
      <SpinWheelModal
        isOpen={spinWheelOpen}
        onClose={() => setSpinWheelOpen(false)}
        onPlayMedia={handlePlayMedia}
        onShowDetails={handleShowDetails}
      />

      {/* Cloudstream 3 & 4 Ecosystem & Repository Hub Modal */}
      <CloudstreamHubModal
        isOpen={cloudstreamOpen}
        onClose={() => setCloudstreamOpen(false)}
      />

      {/* Floating CineBot AI Quick Launcher (Desktop bottom right) */}
      <button
        onClick={() => setAiModalOpen(true)}
        className="floating-ai-fab"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 40,
          background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 100%)',
          color: 'var(--accent-text)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '999px',
          padding: '0.65rem 1.15rem',
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 8px 30px var(--accent-glow), 0 0 20px rgba(56, 189, 248, 0.4)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        title="Open CineBot AI (Ctrl + J)"
      >
        <style>{`
          @media (min-width: 768px) {
            .floating-ai-fab { display: flex !important; }
          }
        `}</style>
        <Bot size={18} />
        <span>Ask CineBot AI</span>
        <span
          style={{
            fontSize: '0.62rem',
            padding: '1px 5px',
            borderRadius: '4px',
            background: 'rgba(0, 0, 0, 0.25)',
            color: '#fff',
            fontWeight: 800,
          }}
        >
          Ctrl+J
        </span>
      </button>

      {/* Sticky Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenApkModal={() => setApkModalOpen(true)}
        onOpenAiModal={() => setAiModalOpen(true)}
        onOpenSpinWheel={() => setSpinWheelOpen(true)}
      />

      {/* Floating Mobile APK Install Banner */}
      <MobileInstallBanner onOpenApkModal={() => setApkModalOpen(true)} />

      {/* Standalone Android APK & PWA Download Modal */}
      <ApkDownloadModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer onOpenApkModal={() => setApkModalOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
