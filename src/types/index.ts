export type ContentType = 'movie' | 'tv' | 'anime' | 'livetv' | 'albums';

export interface MediaItem {
  id: string;
  tmdbId?: number;
  imdbId?: string;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'tv' | 'anime';
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseYear: number;
  rating: number; // 0 to 10
  genres: string[];
  language?: string;
  isDualAudio?: boolean;
  hasHindiDubbed?: boolean;
  duration?: string;
  totalSeasons?: number;
  totalEpisodes?: number;
  featured?: boolean;
  trending?: boolean;
  popular?: boolean;
  platformBadge?: 'Netflix' | 'Prime' | 'Disney+' | 'Hotstar' | 'HBO' | 'Anime' | 'JioCinema' | 'SonyLIV' | 'IMAX' | 'Apple TV+';
  cast?: string[];
  director?: string;
  albumId?: string;
  trailerUrl?: string;
  rottenTomatoesScore?: number;
  tagline?: string;
  accentColor?: string;
  ageRating?: string;
  audioTrack?: string;
  episodes?: Episode[];
  mcuPhase?: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4' | 'Phase 5';
  mcuOrder?: number;
  chronologicalOrder?: number;
  isDisneyPlusSeries?: boolean;
}

export interface MediaAlbum {
  id: string;
  title: string;
  slug: string;
  category: 'Franchise' | 'Director Spotlight' | 'Bollywood & Pan-India' | 'Anime Sagas' | 'Crime Universe' | 'K-Drama World' | 'Marvel Universe';
  description: string;
  coverPath: string;
  backdropPath: string;
  tagline?: string;
  yearRange: string;
  ratingAverage: number;
  totalItems: number;
  colorTheme?: string;
  itemIds: string[];
}

export interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview?: string;
  stillPath?: string;
  duration?: string;
}

export interface LiveChannel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  embedUrl?: string;
  backupStreamUrl?: string;
  youtubeId?: string;
  category: 'News' | 'Sports' | 'Movies' | 'Entertainment' | 'Kids' | 'Music' | 'Hindi / India' | 'International' | 'Global' | string;
  country: string;
  language: string;
  resolution?: string;
  isLive?: boolean;
  currentProgram?: string;
}

export interface StreamServer {
  id: string;
  name: string;
  quality: string;
  type: 'embed' | 'hls' | 'direct';
  badge?: string;
  getUrl: (item: MediaItem, season?: number, episode?: number) => string;
}

export type ThemeMode = 'cinejoy' | 'prime' | 'netflix' | 'disney' | 'cyberpunk' | 'day' | 'night';

export type FlixCategory = 
  | 'trending'
  | 'action'
  | 'romance'
  | 'animation'
  | 'horror'
  | 'special'
  | 'drakor'
  | 'bollywood'
  | 'scifi'
  | 'livetv';

export type SortOption = 'trending' | 'top-rated' | 'newest' | 'title-asc';
