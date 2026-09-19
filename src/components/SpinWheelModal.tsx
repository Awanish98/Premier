import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Play, 
  RotateCw, 
  Star, 
  Volume2, 
  VolumeX
} from 'lucide-react';
import type { MediaItem } from '../types';
import { MASTER_MEDIA_ITEMS } from '../data/mockCatalog';
import { BorderBeam } from './magicui/BorderBeam';
import { AnimatedBadge } from './magicui/AnimatedBadge';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayMedia: (item: MediaItem) => void;
  onShowDetails: (item: MediaItem) => void;
}

interface MoodSlice {
  id: string;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
  movieIds: string[];
  aiReason: string;
}

const MOOD_SLICES: MoodSlice[] = [
  {
    id: 'comedy',
    label: '😂 Pet Pakad ke Hasna',
    shortLabel: 'Hasne Wali',
    emoji: '😂',
    color: '#f59e0b',
    movieIds: ['mov-herapheri', 'mov-3-idiots', 'mov-stree2', 'mov-bhool-bhulaiyaa-3', 'mov-lapataa-ladies', 'mov-chhichhore'],
    aiReason: 'Baburao aur Rancho se behtar koi nahi jab mood fresh aur hasi se bhar dena ho!',
  },
  {
    id: 'mass-action',
    label: '🔥 Dhamakedar Mass Action',
    shortLabel: 'Mass Action',
    emoji: '🔥',
    color: '#ef4444',
    movieIds: ['mov-pushpa-2', 'hero-kalki', 'mov-jawan', 'mov-animal', 'mov-rrr', 'mov-kgf2', 'mov-salaar'],
    aiReason: 'Pure high-voltage adrenaline, iconic dialogues aur goosebumps action packed entertainment!',
  },
  {
    id: 'horror-thriller',
    label: '👻 Rongte Khade Karne Wali',
    shortLabel: 'Darr & Thrill',
    emoji: '👻',
    color: '#8b5cf6',
    movieIds: ['mov-stree2', 'mov-shaitaan', 'mov-bhool-bhulaiyaa-3', 'hero-stranger-things'],
    aiReason: 'Spooky twists aur chilling suspense jo aapko sofa ke kinare par baithaye rakhega!',
  },
  {
    id: 'dual-audio',
    label: '🎧 Hollywood 4K Dual Audio',
    shortLabel: 'Dual Audio',
    emoji: '🎧',
    color: '#06b6d4',
    movieIds: ['hero-deadpool-wolverine', 'hero-dune2', 'hero-oppenheimer', 'hero-interstellar', 'mov-avengers-endgame'],
    aiReason: 'Global blockbusters with world-class IMAX visuals aur crystal clear Hindi dubbed tracks!',
  },
  {
    id: 'heartwarming',
    label: '❤️ Dil Chhoo Lene Wali',
    shortLabel: 'Inspirational',
    emoji: '❤️',
    color: '#ec4899',
    movieIds: ['mov-12th-fail', 'mov-lapataa-ladies', 'mov-3-idiots', 'mov-chhichhore'],
    aiReason: 'Emotionally rich masterclass kahani jo dil ko chhoo jayegi aur zindgi me ummeed bharegi!',
  },
  {
    id: 'desi-binge',
    label: '📺 Raat Bhar Desi Binge',
    shortLabel: 'Web Series',
    emoji: '📺',
    color: '#10b981',
    movieIds: ['mov-panchayat-s3', 'mov-mirzapur-s3', 'tv-sacred-games', 'tv-family-man', 'tv-farzi'],
    aiReason: 'Phulera ki relatable comedy ya Purvanchal ki raw thrill — ek baar chalu kiya toh ruk nahi sakte!',
  },
  {
    id: 'anime-power',
    label: '⚡ Super Power Anime (Hindi)',
    shortLabel: 'Anime Hindi',
    emoji: '⚡',
    color: '#38bdf8',
    movieIds: ['hero-solo-leveling', 'ani-jujutsu-kaisen', 'ani-demon-slayer', 'ani-chainsaw-man'],
    aiReason: 'Sung Jinwoo aur Gojo Satoru ki limit-breaking powers in Hindi dubbed 4K streaming!',
  },
  {
    id: 'mind-bending',
    label: '🧠 Dimag Hilane Wali Sci-Fi',
    shortLabel: 'Mind Bending',
    emoji: '🧠',
    color: '#6366f1',
    movieIds: ['hero-kalki', 'hero-interstellar', 'mov-inception', 'hero-dune2'],
    aiReason: 'Mind-bending temporal paradoxes aur futuristic dystopian worlds jo sochne par majboor kar de!',
  },
];

// Web Audio API Sound Synthesizer for Spinning Tick & Win Chimes (Zero external audio assets required)
class WheelSoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 + Math.random() * 80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  playWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C Major arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.09;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // ignore
    }
  }
}

const soundEngine = new WheelSoundEngine();

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onPlayMedia,
  onShowDetails,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedSlice, setSelectedSlice] = useState<MoodSlice | null>(null);
  const [winningMovie, setWinningMovie] = useState<MediaItem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  const numSlices = MOOD_SLICES.length;
  const sliceAngle = 360 / numSlices;

  // Draw the Wheel Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 380;
    canvas.width = size * 2; // high-dpi
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const center = size / 2;
    const radius = center - 12;

    ctx.clearRect(0, 0, size, size);

    // Outer Glowing Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = '#111827';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();
    ctx.restore();

    // Slices
    MOOD_SLICES.forEach((slice, i) => {
      const startAngle = ((i * sliceAngle - 90) * Math.PI) / 180;
      const endAngle = (((i + 1) * sliceAngle - 90) * Math.PI) / 180;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      // Slice Gradient
      const grad = ctx.createRadialGradient(center, center, 20, center, center, radius);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.65, slice.color + '44');
      grad.addColorStop(1, slice.color);
      ctx.fillStyle = grad;
      ctx.fill();

      // Border line
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Slice Text & Emoji
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + ((endAngle - startAngle) / 2));
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(`${slice.emoji} ${slice.shortLabel}`, radius - 18, 5);
      ctx.restore();

      ctx.restore();
    });

    // Center Hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center, center, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.restore();
  }, []);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSlice(null);
    setWinningMovie(null);

    // Random slice selection
    const randomIndex = Math.floor(Math.random() * numSlices);
    const targetSlice = MOOD_SLICES[randomIndex];

    // Pick random movie from that slice
    const candidateIds = targetSlice.movieIds;
    const randomMovieId = candidateIds[Math.floor(Math.random() * candidateIds.length)];
    const movie = MASTER_MEDIA_ITEMS.find((m) => m.id === randomMovieId) || MASTER_MEDIA_ITEMS[0];

    // Calculate rotation angle to align top pointer (pointer is at top 0 deg / -90 in canvas)
    const sliceCenterAngle = randomIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 4));
    const finalAngle = rotationAngle + extraSpins + (360 - (sliceCenterAngle % 360));

    const startTime = performance.now();
    const duration = 4500; // 4.5 seconds
    const startAngle = rotationAngle;
    let lastTickAngle = startAngle;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease Out Quartic
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = startAngle + (finalAngle - startAngle) * easeOut;
      setRotationAngle(current);

      // Play tick sound when passing each slice
      if (soundEnabled && Math.abs(current - lastTickAngle) >= sliceAngle) {
        soundEngine.playTick();
        lastTickAngle = current;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        setSelectedSlice(targetSlice);
        setWinningMovie(movie);
        if (soundEnabled) {
          soundEngine.playWin();
        }
      }
    };

    animRef.current = requestAnimationFrame(animateSpin);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 2vh, 1.5rem)',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '840px',
          maxHeight: '92vh',
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px var(--accent-glow)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BorderBeam size={300} duration={12} colorFrom="#f59e0b" colorTo="#ec4899" />

        {/* Modal Header */}
        <div
          style={{
            padding: '1rem 1.35rem',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.5)',
              }}
            >
              <RotateCw size={22} className={isSpinning ? 'animate-spin' : ''} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  🎡 Mood Roulette
                </h2>
                <AnimatedBadge variant="accent">
                  Confused Mood? Spin to Watch!
                </AnimatedBadge>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Aaj samajh nahi aa raha kya dekhein? Wheel ghumaiye aur paaiye best Desi recommendations!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                color: soundEnabled ? 'var(--accent)' : 'var(--text-muted)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
              }}
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
              }}
              title="Close Wheel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Wheel Body Area */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="custom-scrollbar"
        >
          {/* Wheel Container with Pointer */}
          <div style={{ position: 'relative', width: '380px', height: '380px', maxWidth: '85vw', maxHeight: '85vw' }}>
            {/* Top Pointer Arrow Indicator */}
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                width: '0',
                height: '0',
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderTop: '26px solid #f59e0b',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))',
              }}
            />

            {/* Rotating Canvas */}
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                transform: `rotate(${rotationAngle}deg)`,
                transition: isSpinning ? 'none' : 'transform 0.1s ease',
                borderRadius: '50%',
              }}
            />

            {/* Center Spin Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 25,
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                border: '3px solid #ffffff',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 900,
                cursor: isSpinning ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 25px rgba(245, 158, 11, 0.8), inset 0 2px 6px rgba(255,255,255,0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.05em',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isSpinning) e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <RotateCw size={18} className={isSpinning ? 'animate-spin' : ''} />
              <span>{isSpinning ? '...' : 'SPIN'}</span>
            </button>
          </div>

          {/* Winning Result Card */}
          {winningMovie && selectedSlice ? (
            <div
              style={{
                width: '100%',
                maxWidth: '680px',
                background: 'var(--bg-card)',
                border: `2px solid ${selectedSlice.color}`,
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: `0 0 35px ${selectedSlice.color}33`,
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Top Banner of Result */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{selectedSlice.emoji}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: selectedSlice.color }}>
                    Mood Result: {selectedSlice.label}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Sparkles size={14} />
                  <span>AI Match 98%</span>
                </div>
              </div>

              {/* Movie Details Card */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={winningMovie.posterPath}
                  alt={winningMovie.title}
                  style={{
                    width: '80px',
                    height: '115px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop';
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {winningMovie.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#fbbf24', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={13} fill="#fbbf24" /> {winningMovie.rating.toFixed(1)}/10
                    </span>
                    <span>• {winningMovie.releaseYear}</span>
                    <span>• {winningMovie.genres.slice(0, 2).join(', ')}</span>
                    <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.7rem' }}>
                      🇮🇳 Dual Audio / Hindi
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {winningMovie.overview}
                  </p>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.76rem',
                      color: 'var(--text-primary)',
                      borderLeft: `3px solid ${selectedSlice.color}`,
                      marginBottom: '0.75rem',
                    }}
                  >
                    <strong>CineBot AI Verdict:</strong> {selectedSlice.aiReason}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onPlayMedia(winningMovie);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 100%)',
                        color: 'var(--accent-text)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.55rem 1.25rem',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px var(--accent-glow)',
                      }}
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Stream Now in 4K</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        onShowDetails(winningMovie);
                      }}
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.55rem 1rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      View Details
                    </button>

                    <button
                      onClick={handleSpin}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '0.55rem 0.95rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                      }}
                    >
                      <RotateCw size={14} />
                      <span>Spin Again</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', maxWidth: '480px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Center me <strong>SPIN</strong> button dabaiye ya wheel ghumaiye! CineBot AI aapke mood ke hisaab se sabse best movie pick karega.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
