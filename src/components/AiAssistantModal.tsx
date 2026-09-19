import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Play, 
  RotateCcw, 
  Star,
  Compass,
  Cloud
} from 'lucide-react';
import type { MediaItem } from '../types';
import { chatWithCinemaAi, type ChatMessage } from '../services/aiService';
import { BorderBeam } from './magicui/BorderBeam';
import { AnimatedBadge } from './magicui/AnimatedBadge';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayMedia: (item: MediaItem) => void;
  onShowDetails: (item: MediaItem) => void;
  onOpenSpinWheel?: () => void;
  onOpenCloudstream?: () => void;
}

const QUICK_MOOD_PROMPTS = [
  { label: '😂 Hasne wali Mast Comedy', prompt: 'Mujhe mast hasne wali comedy movies batao Hindi me with high IMDb score' },
  { label: '🇮🇳 Bollywood & Pan-India Hits', prompt: 'Top trending Bollywood aur South Hindi dubbed movies suggest karo' },
  { label: '🔥 Stree 2 jaisa Horror-Comedy', prompt: 'Mujhe Stree 2 aur Shaitaan jaisi horror thriller movies suggest karo' },
  { label: '🎧 Hollywood 4K Dual Audio', prompt: 'Top Hollywood blockbuster movies in Hindi Dubbed & Dual Audio 4K stream' },
  { label: '📺 Superhit Hindi Web Series', prompt: 'Panchayat aur Mirzapur jaisi best Hindi web series batao' },
  { label: '⚡ Action Anime in Hindi', prompt: 'Solo Leveling aur Jujutsu Kaisen jaise action anime Hindi dubbed me dikhao' },
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onPlayMedia,
  onShowDetails,
  onOpenSpinWheel,
  onOpenCloudstream,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Namaste! Mai hoon **CineBot AI**, aapka personal Indian Cinema & Streaming Dost. 🍿\n\nAapko kis tarah ki movie ya web series dekhni hai? Comedy, Bollywood, Pan-India, ya Hollywood in Dual Audio (Hindi+English)? Aap Hindi, Hinglish ya English me pooch sakte hain!',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithCinemaAi(query, messages);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.reply,
        recommendedItems: response.recommendedItems,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Kshama karein, network ya AI engine me thoda issue aa gaya. Lekin aap catalog me Stree 2, Pushpa 2, aur Solo Leveling S2 instant stream kar sakte hain!',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Namaste! Mai hoon **CineBot AI**, aapka personal Indian Cinema & Streaming Dost. 🍿\n\nAapko kis tarah ki movie ya web series dekhni hai? Comedy, Bollywood, Pan-India, ya Hollywood in Dual Audio (Hindi+English)? Aap Hindi, Hinglish ya English me pooch sakte hain!',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 115,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
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
          maxWidth: '820px',
          height: 'min(88vh, 760px)',
          background: 'var(--bg-secondary)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px var(--accent-glow)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <BorderBeam size={260} duration={10} colorFrom="var(--accent)" colorTo="#a855f7" />

        {/* Header Bar */}
        <div
          style={{
            padding: '1rem 1.25rem',
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
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-text)',
                boxShadow: '0 0 16px var(--accent-glow)',
              }}
            >
              <Sparkles size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  CineBot AI Assistant
                </h2>
                <AnimatedBadge variant="accent">
                  ⚡ Llama 3.3 70B & Gemini
                </AnimatedBadge>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Ask in Hindi, Hinglish or English for instant tailored recommendations
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={handleResetChat}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Reset conversation"
            >
              <RotateCcw size={16} />
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close AI Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Mood Prompts Carousel */}
        <div
          style={{
            padding: '0.65rem 1rem',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent)', fontSize: '0.74rem', fontWeight: 800, flexShrink: 0 }}>
            <Compass size={14} />
            <span>Try Prompt:</span>
          </div>

          {onOpenSpinWheel && (
            <button
              onClick={() => {
                onClose();
                onOpenSpinWheel();
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)',
                border: '1px solid #f59e0b',
                color: '#fbbf24',
                borderRadius: '999px',
                padding: '0.3rem 0.85rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <span>🎡</span>
              <span>Confused? Spin Mood Wheel</span>
            </button>
          )}

          {onOpenCloudstream && (
            <button
              onClick={() => {
                onClose();
                onOpenCloudstream();
              }}
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
                border: '1px solid #3b82f6',
                color: '#60a5fa',
                borderRadius: '999px',
                padding: '0.3rem 0.85rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Cloud size={13} />
              <span>☁️ Cloudstream Repo &amp; Guide</span>
            </button>
          )}

          {QUICK_MOOD_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '999px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Conversation Stream Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
          className="custom-scrollbar"
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  flexDirection: isUser ? 'row-reverse' : 'row',
                }}
              >
                {/* Avatar Icon */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isUser ? 'var(--accent)' : 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isUser ? 'var(--accent-text)' : '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div
                  style={{
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      background: isUser ? 'var(--accent)' : 'var(--bg-card)',
                      color: isUser ? 'var(--accent-text)' : 'var(--text-primary)',
                      border: isUser ? 'none' : '1px solid var(--border-subtle)',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      padding: '0.85rem 1.1rem',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    }}
                  >
                    {msg.content}
                  </div>

                  {/* Structured Interactive Media Cards (if returned by AI) */}
                  {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
                      {msg.recommendedItems.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '12px',
                            padding: '0.65rem',
                            display: 'flex',
                            gap: '0.75rem',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <img
                            src={item.posterPath}
                            alt={item.title}
                            style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '6px' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&auto=format&fit=crop';
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4
                              style={{
                                fontSize: '0.84rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                marginBottom: '0.2rem',
                              }}
                            >
                              {item.title}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                              <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <Star size={11} fill="#fbbf24" /> {item.rating.toFixed(1)}
                              </span>
                              <span>• {item.releaseYear}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => {
                                  onClose();
                                  onPlayMedia(item);
                                }}
                                style={{
                                  background: 'var(--accent)',
                                  color: 'var(--accent-text)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.25rem 0.55rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  cursor: 'pointer',
                                }}
                              >
                                <Play size={11} fill="currentColor" />
                                <span>Play</span>
                              </button>

                              <button
                                onClick={() => {
                                  onClose();
                                  onShowDetails(item);
                                }}
                                style={{
                                  background: 'var(--bg-secondary)',
                                  color: 'var(--text-primary)',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: '6px',
                                  padding: '0.25rem 0.45rem',
                                  fontSize: '0.72rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Sparkles size={16} className="animate-spin" />
              </div>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px 16px 16px 16px',
                  padding: '0.75rem 1.1rem',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span className="live-pulse" style={{ width: '6px', height: '6px' }} />
                <span>CineBot AI catalog analyse kar raha hai...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '0.9rem 1.25rem',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              position: 'relative',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CineBot AI... e.g. 'Mujhe Kalki jaisi sci-fi movies dikhao'"
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'var(--accent)',
                color: 'var(--accent-text)',
                border: 'none',
                borderRadius: '12px',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.6 : 1,
                boxShadow: '0 0 16px var(--accent-glow)',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>Ask AI</span>
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
