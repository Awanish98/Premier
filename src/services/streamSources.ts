import type { MediaItem, StreamServer } from '../types';

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'vidlink_pro',
    name: 'VidLink Pro (4K UHD & Multi-Audio)',
    quality: '4K UHD / 1080p',
    type: 'embed',
    badge: '🇮🇳 Dual Audio (Hindi + Eng)',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://vidlink.pro/movie/${tmdbId}?primaryColor=00a8e1&secondaryColor=0d1527&title=true`;
      }
      return `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=00a8e1&secondaryColor=0d1527&title=true`;
    },
  },
  {
    id: 'autoembed_hindi',
    name: 'AutoEmbed Hindi (Bollywood & Pan-India Fast)',
    quality: '1080p HD',
    type: 'embed',
    badge: '🇮🇳 Hindi Dubbed Priority',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const id = item.tmdbId || item.imdbId || item.id;
      if (item.type === 'movie') {
        return `https://player.autoembed.cc/embed/movie/${id}`;
      }
      return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
    },
  },
  {
    id: 'embed_su',
    name: 'Embed.su (Ultra 4K HDR Zero-Buffer)',
    quality: '4K HDR',
    type: 'embed',
    badge: '⚡ Highest Bitrate Master',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://embed.su/embed/movie/${tmdbId}`;
      }
      return `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
    },
  },
  {
    id: 'vidsrc_cc',
    name: 'VidSrc Pro (FMHY Multi-Sub & Track)',
    quality: '1080p 60FPS',
    type: 'embed',
    badge: '🌐 Multi-Track Audio',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://vidsrc.cc/v2/embed/movie/${tmdbId}`;
      }
      return `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`;
    },
  },
  {
    id: 'vidsrc_to',
    name: 'VidSrc.to (Stable High-Speed Cloud)',
    quality: '1080p HD',
    type: 'embed',
    badge: '🛡️ 99.9% Uptime',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://vidsrc.to/embed/movie/${tmdbId}`;
      }
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
    },
  },
  {
    id: 'smashystream',
    name: 'SmashyStream (Dual Audio Mirror)',
    quality: '1080p / 720p',
    type: 'embed',
    badge: '🇮🇳 Hindi + English Mirror',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`;
      }
      return `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
    },
  },
  {
    id: 'multiembed',
    name: 'MultiEmbed / 2Embed Universal',
    quality: '1080p',
    type: 'embed',
    badge: '🔄 Universal Backup',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
    },
  },
  {
    id: 'moviesapi',
    name: 'MoviesAPI Cloud (Fast CDN)',
    quality: '1080p',
    type: 'embed',
    badge: '⚡ Instant Load',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://moviesapi.club/movie/${tmdbId}`;
      }
      return `https://moviesapi.club/tv/${tmdbId}-${season}-${episode}`;
    },
  },
  {
    id: 'vidsrc_icu',
    name: 'VidSrc ICU (Alternative Stream)',
    quality: '1080p',
    type: 'embed',
    badge: '🟢 Active CDN',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://vidsrc.icu/embed/movie/${tmdbId}`;
      }
      return `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`;
    },
  },
  {
    id: 'cinejoy_mirror',
    name: 'CineJoy Pro Server (Auto Embed)',
    quality: '1080p HD',
    type: 'embed',
    badge: '🇮🇳 Fast OTT CDN',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://autoembed.to/movie/tmdb/${tmdbId}`;
      }
      return `https://autoembed.to/tv/tmdb/${tmdbId}-${season}-${episode}`;
    },
  },
];

export const getStreamUrl = (
  server: StreamServer,
  item: MediaItem,
  season = 1,
  episode = 1
): string => {
  return server.getUrl(item, season, episode);
};
