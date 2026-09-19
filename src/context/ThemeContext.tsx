import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeMode, MediaItem } from '../types';

export interface UserPreferences {
  audioLanguage: 'Hindi' | 'English' | 'Original';
  defaultServer: string;
  quality: '4K UHD' | '1080p Full HD' | 'Auto';
  autoplayNext: boolean;
}

export interface ToastInfo {
  id: number;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  watchlist: MediaItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (itemId: string) => void;
  isInWatchlist: (itemId: string) => boolean;
  continueWatching: { item: MediaItem; progress: number; lastWatchedSeason?: number; lastWatchedEpisode?: number }[];
  saveProgress: (item: MediaItem, progress: number, season?: number, episode?: number) => void;
  removeProgress: (itemId: string) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('cinejoy_theme') as ThemeMode) || 'cinejoy';
  });

  const [toast, setToast] = useState<ToastInfo | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('cinejoy_preferences');
      return saved ? JSON.parse(saved) : {
        audioLanguage: 'Hindi',
        defaultServer: 'vidlink_pro',
        quality: '4K UHD',
        autoplayNext: true
      };
    } catch {
      return {
        audioLanguage: 'Hindi',
        defaultServer: 'vidlink_pro',
        quality: '4K UHD',
        autoplayNext: true
      };
    }
  });

  const [watchlist, setWatchlist] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('cinejoy_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [continueWatching, setContinueWatching] = useState<{
    item: MediaItem;
    progress: number;
    lastWatchedSeason?: number;
    lastWatchedEpisode?: number;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('cinejoy_continue_watching');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3200);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('cinejoy_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showToast(`Theme switched to ${newTheme.toUpperCase()}`, 'info');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem('cinejoy_preferences', JSON.stringify(updated));
      return updated;
    });
    showToast('Preferences updated', 'success');
  };

  const addToWatchlist = (item: MediaItem) => {
    setWatchlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const updated = [item, ...prev];
      localStorage.setItem('cinejoy_watchlist', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added "${item.title}" to Watchlist`, 'success');
  };

  const removeFromWatchlist = (itemId: string) => {
    setWatchlist((prev) => {
      const target = prev.find((i) => i.id === itemId);
      const updated = prev.filter((i) => i.id !== itemId);
      localStorage.setItem('cinejoy_watchlist', JSON.stringify(updated));
      if (target) {
        showToast(`Removed "${target.title}" from Watchlist`, 'info');
      }
      return updated;
    });
  };

  const isInWatchlist = (itemId: string) => {
    return watchlist.some((i) => i.id === itemId);
  };

  const saveProgress = (item: MediaItem, progress: number, season?: number, episode?: number) => {
    setContinueWatching((prev) => {
      const filtered = prev.filter((entry) => entry.item.id !== item.id);
      const updated = [
        { item, progress, lastWatchedSeason: season || 1, lastWatchedEpisode: episode || 1 },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem('cinejoy_continue_watching', JSON.stringify(updated));
      return updated;
    });
  };

  const removeProgress = (itemId: string) => {
    setContinueWatching((prev) => {
      const updated = prev.filter((entry) => entry.item.id !== itemId);
      localStorage.setItem('cinejoy_continue_watching', JSON.stringify(updated));
      return updated;
    });
    showToast('Removed from Continue Watching', 'info');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        continueWatching,
        saveProgress,
        removeProgress,
        preferences,
        updatePreferences,
        toast,
        showToast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
