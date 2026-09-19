import type { LiveChannel } from '../types';

export interface CountryPreset {
  name: string;
  code: string;
  flag: string;
  region: string;
  count: string;
}

export const WORLD_COUNTRY_PRESETS: CountryPreset[] = [
  // South Asia
  { name: 'India', code: 'in', flag: '🇮🇳', region: 'South Asia', count: '100+ Channels' },
  { name: 'Pakistan', code: 'pk', flag: '🇵🇰', region: 'South Asia', count: '40+ Channels' },
  { name: 'Bangladesh', code: 'bd', flag: '🇧🇩', region: 'South Asia', count: '30+ Channels' },
  { name: 'Nepal', code: 'np', flag: '🇳🇵', region: 'South Asia', count: '15+ Channels' },
  { name: 'Sri Lanka', code: 'lk', flag: '🇱🇰', region: 'South Asia', count: '15+ Channels' },

  // Americas
  { name: 'United States', code: 'us', flag: '🇺🇸', region: 'Americas', count: '150+ Channels' },
  { name: 'United Kingdom', code: 'uk', flag: '🇬🇧', region: 'Europe', count: '80+ Channels' },
  { name: 'Canada', code: 'ca', flag: '🇨🇦', region: 'Americas', count: '50+ Channels' },
  { name: 'Australia', code: 'au', flag: '🇦🇺', region: 'Oceania', count: '40+ Channels' },
  { name: 'New Zealand', code: 'nz', flag: '🇳🇿', region: 'Oceania', count: '20+ Channels' },

  // Europe
  { name: 'Germany', code: 'de', flag: '🇩🇪', region: 'Europe', count: '60+ Channels' },
  { name: 'France', code: 'fr', flag: '🇫🇷', region: 'Europe', count: '50+ Channels' },
  { name: 'Italy', code: 'it', flag: '🇮🇹', region: 'Europe', count: '45+ Channels' },
  { name: 'Spain', code: 'es', flag: '🇪🇸', region: 'Europe', count: '50+ Channels' },
  { name: 'Netherlands', code: 'nl', flag: '🇳🇱', region: 'Europe', count: '30+ Channels' },
  { name: 'Russia', code: 'ru', flag: '🇷🇺', region: 'Europe', count: '70+ Channels' },
  { name: 'Turkey', code: 'tr', flag: '🇹🇷', region: 'Europe/Asia', count: '40+ Channels' },

  // Asia & Middle East
  { name: 'United Arab Emirates', code: 'ae', flag: '🇦🇪', region: 'Middle East', count: '35+ Channels' },
  { name: 'Saudi Arabia', code: 'sa', flag: '🇸🇦', region: 'Middle East', count: '30+ Channels' },
  { name: 'Qatar', code: 'qa', flag: '🇶🇦', region: 'Middle East', count: '20+ Channels' },
  { name: 'Japan', code: 'jp', flag: '🇯🇵', region: 'East Asia', count: '40+ Channels' },
  { name: 'South Korea', code: 'kr', flag: '🇰🇷', region: 'East Asia', count: '35+ Channels' },
  { name: 'Singapore', code: 'sg', flag: '🇸🇬', region: 'Southeast Asia', count: '25+ Channels' },
  { name: 'Malaysia', code: 'my', flag: '🇲🇾', region: 'Southeast Asia', count: '25+ Channels' },
  { name: 'Indonesia', code: 'id', flag: '🇮🇩', region: 'Southeast Asia', count: '35+ Channels' },

  // Latin America & Africa
  { name: 'Brazil', code: 'br', flag: '🇧🇷', region: 'South America', count: '50+ Channels' },
  { name: 'Argentina', code: 'ar', flag: '🇦🇷', region: 'South America', count: '30+ Channels' },
  { name: 'Mexico', code: 'mx', flag: '🇲🇽', region: 'North America', count: '40+ Channels' },
  { name: 'South Africa', code: 'za', flag: '🇿🇦', region: 'Africa', count: '20+ Channels' },
  { name: 'Egypt', code: 'eg', flag: '🇪🇬', region: 'Africa', count: '25+ Channels' },
];

export const IPTV_GENRES = [
  'All',
  'News',
  'Sports',
  'Movies',
  'Entertainment',
  'Music',
  'Science',
  'Nature',
  'Kids',
  'Anime',
  'Spiritual',
  'Favorites'
];

// LocalStorage key for saved favorites
const FAVORITES_STORAGE_KEY = 'premier_live_tv_favorites';

/**
 * Get user favorited channel IDs from localStorage
 */
export function getFavoriteChannelIds(): string[] {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Toggle channel favorite status
 */
export function toggleFavoriteChannelId(id: string): string[] {
  const current = getFavoriteChannelIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((x) => x !== id) : [...current, id];
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

/**
 * Build CORS-relayed HLS stream URL using public relays or local backend
 */
export function getProxiedStreamUrl(rawUrl: string, proxyTier: 'direct' | 'relay1' | 'relay2' | 'backend'): string {
  if (!rawUrl) return '';
  if (proxyTier === 'direct') return rawUrl;

  if (proxyTier === 'relay1') {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`;
  }

  if (proxyTier === 'relay2') {
    return `https://corsproxy.io/?url=${encodeURIComponent(rawUrl)}`;
  }

  if (proxyTier === 'backend') {
    // If backend is running locally or deployed on Vercel
    return `/api/proxy?url=${encodeURIComponent(rawUrl)}`;
  }

  return rawUrl;
}

/**
 * Fetch country channels from IPTV-Org Open Database with client-side parsing & caching
 */
export async function fetchIptvCountryChannels(
  countryCode: string,
  countryName: string
): Promise<LiveChannel[]> {
  const cacheKey = `iptv_country_${countryCode}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  const url =
    countryCode === 'all'
      ? 'https://iptv-org.github.io/iptv/index.m3u'
      : `https://iptv-org.github.io/iptv/countries/${countryCode}.m3u`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const text = await res.text();

  const lines = text.split('\n');
  const parsedChannels: LiveChannel[] = [];
  let currentInfo: Partial<LiveChannel> = {};

  for (let i = 0; i < lines.length && parsedChannels.length < 100; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const languageMatch = line.match(/tvg-language="([^"]+)"/);

      currentInfo = {
        id: `iptv-${countryCode}-${parsedChannels.length + 1}-${Date.now()}`,
        name: nameMatch ? nameMatch[1].trim() : `Live Channel ${parsedChannels.length + 1}`,
        logo:
          logoMatch && logoMatch[1].startsWith('http')
            ? logoMatch[1]
            : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop',
        category: groupMatch ? groupMatch[1] : 'General',
        country: countryName,
        language: languageMatch ? languageMatch[1].toUpperCase() : 'Live',
        resolution: 'HD / 1080p',
        isLive: true,
        currentProgram: '24x7 Live Transmission',
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
    sessionStorage.setItem(cacheKey, JSON.stringify(parsedChannels));
  }

  return parsedChannels;
}

/**
 * Parse custom user M3U file or text
 */
export function parseCustomM3uText(text: string): LiveChannel[] {
  const lines = text.split('\n');
  const channels: LiveChannel[] = [];
  let current: Partial<LiveChannel> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const nameMatch = line.match(/,(.+)$/);
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);

      current = {
        id: `custom-user-${channels.length + 1}-${Date.now()}`,
        name: nameMatch ? nameMatch[1].trim() : `Custom Channel ${channels.length + 1}`,
        logo: logoMatch ? logoMatch[1] : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop',
        category: groupMatch ? groupMatch[1] : 'Custom',
        country: 'User Stream',
        language: 'Live',
        resolution: '4K / HD',
        isLive: true,
        currentProgram: 'Custom M3U Feed'
      };
    } else if (line.startsWith('http://') || line.startsWith('https://')) {
      if (current.name) {
        channels.push({
          ...(current as LiveChannel),
          streamUrl: line,
        });
        current = {};
      }
    }
  }

  return channels;
}
