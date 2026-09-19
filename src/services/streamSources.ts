import type { MediaItem, StreamServer } from '../types';

export const STREAM_SERVERS: StreamServer[] = [
  {
    id: 'vidlink_pro',
    name: 'VidLink Pro (Multi-Audio & 4K)',
    quality: '4K / 1080p',
    type: 'embed',
    badge: '🇮🇳 Dual Audio / Eng',
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
    name: 'AutoEmbed (Hindi & Regional Mirror)',
    quality: '1080p HD',
    type: 'embed',
    badge: '🇮🇳 Hindi Preferred',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const id = item.imdbId || item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://player.autoembed.cc/embed/movie/${id}`;
      }
      return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
    },
  },
  {
    id: 'vidsrc_cc',
    name: 'VidSrc (FMHY High Speed)',
    quality: '1080p',
    type: 'embed',
    badge: 'Multi-Sub & Dub',
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
    name: 'VidSrc.to (Stable Server)',
    quality: '1080p',
    type: 'embed',
    badge: 'Zero Buffer',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://vidsrc.to/embed/movie/${tmdbId}`;
      }
      return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
    },
  },
  {
    id: 'embed_su',
    name: 'Embed.su (4K HDR Fast)',
    quality: '4K / 1080p',
    type: 'embed',
    badge: 'Highest Bitrate',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://embed.su/embed/movie/${tmdbId}`;
      }
      return `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`;
    },
  },
  {
    id: 'smashystream',
    name: 'SmashyStream (Dual Audio Mirror)',
    quality: '1080p / 720p',
    type: 'embed',
    badge: 'Hindi + English',
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
    name: 'MultiEmbed / 2Embed Pro',
    quality: '1080p',
    type: 'embed',
    badge: 'Universal Mirror',
    getUrl: (item: MediaItem, season = 1, episode = 1) => {
      const tmdbId = item.tmdbId || item.id;
      if (item.type === 'movie') {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
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
