import React, { useState } from 'react';
import {
  X,
  Cloud,
  Download,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Smartphone,
  Tv,
  Sparkles,
  ShieldCheck,
  Globe2,
  Film,
  Zap,
  CheckCircle2,
  Radio,
  BookOpen
} from 'lucide-react';

interface CloudstreamHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMediaToStream?: () => void;
}

interface RepoItem {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  repoUrl: string;
  shortcode?: string;
  pluginsCount: number;
  highlightProviders: string[];
  isOfficial?: boolean;
}

const PREMIER_REPO_URL = 'https://awanish98.github.io/Premier/cloudstream/repo.json';

const REPOSITORIES: RepoItem[] = [
  {
    id: 'premier-official',
    name: 'Premier Official Repository',
    badge: 'Official Premier Hub',
    category: 'Bollywood, South Dub & Live TV',
    description: 'Premier ki verified official Cloudstream repository. Isme Bollywood 4K, South Hindi Dub, Hollywood Dual Audio, Desi Web Series, Anime Hindi Dub aur Live Cricket IPTV directly included hain.',
    repoUrl: PREMIER_REPO_URL,
    shortcode: 'premier',
    pluginsCount: 6,
    highlightProviders: ['Premier Bollywood', 'South Hindi Dub', 'Hollywood Dual Audio', 'Desi Binge Series', 'Hindi Anime', 'Live Sports IPTV'],
    isOfficial: true,
  },
  {
    id: 'hexated-hindi',
    name: 'Hexated Indian Cinema & Dub Repo',
    badge: '🔥 Most Popular in India',
    category: 'Indian Cinema & OTT',
    description: 'India ka sabse popular repository jisme Vegamovies, BollyFlix, HDHub4u, DesiCinemas, KatmovieHD aur 4K Hindi Dubbed movies auto-scrape hoti hain.',
    repoUrl: 'https://raw.githubusercontent.com/hexated/cloudstream-extensions-hexated/builds/repo.json',
    shortcode: 'hexated',
    pluginsCount: 24,
    highlightProviders: ['Vegamovies', 'BollyFlix', 'HDHub4u', 'DesiCinemas', 'KatmovieHD', 'TopMovies'],
  },
  {
    id: 'megarepo-multi',
    name: 'Cloudstream Multi-Language Megarepo',
    badge: 'Global 4K Multi-Lang',
    category: 'Hollywood & Global OTT',
    description: 'Sabhi Hollywood 4K OTT platforms, Netflix/Prime/Disney content, SuperStream, SFlix aur multi-subtitles stream karne ke liye best repository.',
    repoUrl: 'https://raw.githubusercontent.com/recloudstream/cloudstream-extensions-multilingual/builds/repo.json',
    shortcode: 'cs-multi',
    pluginsCount: 45,
    highlightProviders: ['SuperStream', 'SFlix', 'FlixHQ', 'Soap2Day', 'VidSrc', 'NetMirror'],
  },
  {
    id: 'anime-official',
    name: 'Anime & Donghua Hindi/Subbed Repo',
    badge: 'Anime Dub & Sub',
    category: 'Anime Worldwide',
    description: 'HiAnime, Zoro, AnimePahe, Gogoanime aur Hindi Dubbed anime series 1080p 60fps me stream karne ke liye specialized providers.',
    repoUrl: 'https://raw.githubusercontent.com/recloudstream/cloudstream-extensions/builds/repo.json',
    shortcode: 'cs-official',
    pluginsCount: 18,
    highlightProviders: ['HiAnime', 'Zoro', 'AnimePahe', 'GogoAnime', 'YugenAnime'],
  },
  {
    id: 'storm-sports',
    name: 'Live Sports & Indian IPTV Streams',
    badge: 'Live Cricket & TV',
    category: 'Live TV & IPTV',
    description: 'Live Cricket tournaments, Star Sports, Sony Sports Network, DD Sports aur 200+ Indian Live News/Entertainment channels.',
    repoUrl: 'https://raw.githubusercontent.com/stormunblessed/cricket-cloudstream/builds/repo.json',
    shortcode: 'storm-sports',
    pluginsCount: 12,
    highlightProviders: ['CricHD Live', 'Star Sports M3U8', 'Sony LIV IPTV', 'Hindi News Hub'],
  },
];

export const CloudstreamHubModal: React.FC<CloudstreamHubModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'premier' | 'all-repos' | 'guide' | 'download'>('premier');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getCloudstreamIntentUrl = (repoUrl: string) => {
    return `cloudstreamrepo://${repoUrl}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-neutral-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-black flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Cloud className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Cloudstream 3 & 4 Ecosystem Hub
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold uppercase tracking-wider">
                  Android & TV Ready
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Premier repository & top Indian Cloudstream extensions with 1-Click install & QR codes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-6 gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <button
            onClick={() => setActiveTab('premier')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'premier'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Premier Official Repo
          </button>
          <button
            onClick={() => setActiveTab('all-repos')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'all-repos'
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            Top Indian & Global Repos ({REPOSITORIES.length})
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Setup Guide (Phone & TV)
          </button>
          <button
            onClick={() => setActiveTab('download')}
            className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Cloudstream APKs
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* TAB 1: PREMIER OFFICIAL REPO */}
          {activeTab === 'premier' && (
            <div className="space-y-6">
              {/* Featured Banner */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 via-indigo-950/40 to-black border border-blue-500/30 overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Official Premier Repository
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% Online
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Premier Cinema & Live TV Extension Repo
                    </h3>
                    <p className="text-sm text-neutral-300 mt-1 max-w-xl">
                      Cloudstream app me Premier ka official repository add karein aur paayein Bollywood, South Hindi Dubbed, Hollywood Dual Audio aur Indian Live TV channels direct 4K playback ke saath.
                    </p>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto">
                    <a
                      href={getCloudstreamIntentUrl(PREMIER_REPO_URL)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-102 active:scale-98 transition-all"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      1-Click Add to Cloudstream
                    </a>
                    <button
                      onClick={() => setQrModalUrl(PREMIER_REPO_URL)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
                    >
                      <QrCode className="w-4 h-4" />
                      Scan QR Code (TV)
                    </button>
                  </div>
                </div>

                {/* Repo URL Box */}
                <div className="mt-5 p-3.5 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden w-full">
                    <span className="text-[11px] text-neutral-400 font-mono font-bold flex-shrink-0 uppercase bg-white/5 px-2 py-1 rounded">
                      Repo JSON URL
                    </span>
                    <code className="text-xs text-blue-300 font-mono truncate select-all">
                      {PREMIER_REPO_URL}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(PREMIER_REPO_URL, 'premier-url')}
                    className="flex-shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
                  >
                    {copiedId === 'premier-url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy URL
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Plugins Included in Premier Repo */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 text-blue-400" />
                  Plugins & Providers Included in Premier Repo
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      name: 'Premier Bollywood',
                      desc: 'Latest Hindi blockbusters & OTT original movies',
                      badge: 'Bollywood 4K',
                      icon: Film,
                      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
                    },
                    {
                      name: 'Premier South Hindi Dub',
                      desc: 'Telugu, Tamil, Kannada & Malayalam Hindi audio',
                      badge: 'South Hindi',
                      icon: Zap,
                      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
                    },
                    {
                      name: 'Premier Hollywood Dual',
                      desc: 'Marvel, DC, Sci-Fi movies in clean Hindi voiceover',
                      badge: 'Dual Audio',
                      icon: Globe2,
                      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
                    },
                    {
                      name: 'Premier Desi Binge Series',
                      desc: 'Indian OTT web series with all episodes & binge mode',
                      badge: 'Desi Series',
                      icon: Tv,
                      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
                    },
                    {
                      name: 'Premier Hindi Anime',
                      desc: 'Attack on Titan, JJK, Naruto with Hindi dubbing',
                      badge: 'Anime Dub',
                      icon: Sparkles,
                      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                    },
                    {
                      name: 'Premier Live Sports & TV',
                      desc: 'Live Cricket, Star Sports, Sony Sports & News IPTV',
                      badge: 'Live IPTV',
                      icon: Radio,
                      color: 'text-red-400 border-red-500/30 bg-red-500/10',
                    },
                  ].map((plugin, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <plugin.icon className={`w-4 h-4 ${plugin.color.split(' ')[0]}`} />
                          <span className="text-xs font-bold text-white">{plugin.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${plugin.color}`}>
                          {plugin.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        {plugin.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TOP REPOSITORIES LIST */}
          {activeTab === 'all-repos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-400">
                  Cloudstream 3 & 4 ke liye verified repositories. Kisi bhi repo par 1-Click install ya URL copy karein:
                </p>
              </div>

              <div className="space-y-3">
                {REPOSITORIES.map((repo) => (
                  <div
                    key={repo.id}
                    className={`p-4 rounded-xl border transition-all ${
                      repo.isOfficial
                        ? 'bg-blue-950/30 border-blue-500/40 shadow-lg shadow-blue-500/5'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-sm font-bold text-white">{repo.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                          {repo.badge}
                        </span>
                        <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                          {repo.pluginsCount}+ Plugins
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={getCloudstreamIntentUrl(repo.repoUrl)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          1-Click Add
                        </a>
                        <button
                          onClick={() => setQrModalUrl(repo.repoUrl)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10"
                          title="Show QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                      {repo.description}
                    </p>

                    {/* Providers Pill Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {repo.highlightProviders.map((provider, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/5"
                        >
                          {provider}
                        </span>
                      ))}
                    </div>

                    {/* URL & Shortcode */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-black/50 border border-white/5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[10px] text-neutral-500 font-mono font-bold uppercase">
                          URL:
                        </span>
                        <code className="text-[11px] text-neutral-400 font-mono truncate select-all">
                          {repo.repoUrl}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopy(repo.repoUrl, repo.id)}
                        className="flex-shrink-0 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors justify-center"
                      >
                        {copiedId === repo.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SETUP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Guide */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                      <Smartphone className="w-5 h-5" />
                      Android Phone Setup (1 Minute)
                    </div>
                    <ol className="space-y-3 text-xs text-neutral-300">
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          1
                        </span>
                        <span>
                          Cloudstream 3 APK download karke install karein (Download tab se).
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          2
                        </span>
                        <span>
                          Upar diye gaye <strong>"1-Click Add to Cloudstream"</strong> button par tap karein. App automatically open hoke repo import karega.
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          3
                        </span>
                        <span>
                          App me <strong>Settings &gt; Extensions</strong> me jaakar Premier ya Hexated providers ko Download/Enable karein.
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          4
                        </span>
                        <span>
                          Enjoy! Kisi bhi movie ya Live TV channel ko 4K HDR me zero-ads ke saath stream karein.
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>

                {/* Android TV Setup */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-3">
                      <Tv className="w-5 h-5" />
                      Android TV / FireStick Setup
                    </div>
                    <ol className="space-y-3 text-xs text-neutral-300">
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          1
                        </span>
                        <span>
                          TV par <strong>Downloader</strong> app se Cloudstream Android TV Leanback APK install karein.
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          2
                        </span>
                        <span>
                          Cloudstream TV App me <strong>Settings &gt; Extensions &gt; Add Repository</strong> par jaayein.
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          3
                        </span>
                        <span>
                          Phone se Premier screen par <strong>"Scan QR Code (TV)"</strong> open karke TV camera/remote se scan karein ya shortcode <code>premier</code> dalein.
                        </span>
                      </li>
                      <li className="flex gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                          4
                        </span>
                        <span>
                          TV remote navigation se 4K cinema aur Live Cricket stream karein.
                        </span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Alert */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 leading-relaxed">
                  <strong>Pro Tip:</strong> Agar kisi link par buffering ya ISP block aaye, toh Cloudstream app ke andar <strong>Settings &gt; Providers &gt; DNS-over-HTTPS (DoH)</strong> ko Cloudflare ya Google DNS par set karein. Isse 100% block bypass ho jaata hai.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APK DOWNLOADS */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Official open-source Cloudstream APK releases from the official recloudstream repository:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold text-[10px] uppercase">
                        Android Phone & Tablet
                      </span>
                      <span className="text-xs text-neutral-400">v4.4.x (Latest Pre-release)</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Cloudstream 3 Mobile APK
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      Touch-optimized UI with gesture controls, offline downloading, Pip mode, and subtitle auto-sync.
                    </p>
                  </div>
                  <a
                    href="https://github.com/recloudstream/cloudstream/releases"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Mobile APK (GitHub)
                  </a>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-semibold text-[10px] uppercase">
                        Android TV & FireStick
                      </span>
                      <span className="text-xs text-neutral-400">Leanback TV Edition</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">
                      Cloudstream TV Edition APK
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                      D-pad remote friendly interface with 4K HDR playback engine, audio passthrough, and Leanback launcher support.
                    </p>
                  </div>
                  <a
                    href="https://github.com/recloudstream/cloudstream/releases"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download TV APK (GitHub)
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <ExternalLink className="w-4 h-4 text-neutral-400" />
                  Official Cloudstream GitHub Source:
                  <a
                    href="https://github.com/recloudstream/cloudstream"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline font-mono"
                  >
                    github.com/recloudstream/cloudstream
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Open Source &amp; Completely Free • Zero Ads • No Subscription Required</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
          >
            Close Hub
          </button>
        </div>
      </div>

      {/* QR Code Overlay Submodal */}
      {qrModalUrl && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setQrModalUrl(null)}
        >
          <div
            className="w-full max-w-sm p-6 rounded-2xl bg-neutral-900 border border-white/20 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                Scan to Add on TV / Mobile
              </h3>
              <button
                onClick={() => setQrModalUrl(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Code Container using standard SVG API */}
            <div className="p-4 bg-white rounded-xl mx-auto w-52 h-52 flex items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `cloudstreamrepo://${qrModalUrl}`
                )}`}
                alt="Cloudstream Repo QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text if offline
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="text-xs text-neutral-300">
              Cloudstream app me <strong>Settings &gt; Extensions &gt; Add Repo</strong> me scanner open karein ya phone camera se scan karein.
            </p>

            <div className="p-2.5 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-neutral-400 truncate select-all">
              {qrModalUrl}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(qrModalUrl);
                setCopiedId('qr-copied');
                setTimeout(() => setCopiedId(null), 2000);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copiedId === 'qr-copied' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Repo Link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CloudstreamHubModal;
