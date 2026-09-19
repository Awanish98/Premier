import type { MediaItem } from '../types';
import { MASTER_MEDIA_ITEMS } from '../data/mockCatalog';

// Read API keys from Vite env
const GROQ_API_KEY =
  (import.meta.env.GROQ_API_KEY as string) ||
  (import.meta.env.VITE_GROQ_API_KEY as string) ||
  '';

const GEMINI_API_KEY =
  (import.meta.env.GEMINI_API_KEY as string) ||
  (import.meta.env.VITE_GEMINI_API_KEY as string) ||
  '';

const GROQ_MODEL =
  (import.meta.env.GROQ_MODEL as string) ||
  (import.meta.env.VITE_GROQ_MODEL as string) ||
  'llama-3.3-70b-versatile';

const GEMINI_MODEL =
  (import.meta.env.GEMINI_MODEL as string) ||
  (import.meta.env.VITE_GEMINI_MODEL as string) ||
  'gemini-2.5-flash';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  recommendedItems?: MediaItem[];
  timestamp?: number;
}

export interface MovieAiInsights {
  whyWatch: string;
  trivia: string[];
  easterEggs: string[];
  vibeScore: number;
}

// Compact catalog summary to feed into AI system prompt
function getCatalogContext(): string {
  return MASTER_MEDIA_ITEMS.map(
    (m) =>
      `ID: ${m.id} | Title: ${m.title} | Type: ${m.type} | Year: ${m.releaseYear} | Rating: ${m.rating} | Genres: ${m.genres.join(
        ', '
      )} | Language: ${m.language || 'Multi'} | DualAudio: ${
        m.isDualAudio || m.hasHindiDubbed ? 'Yes' : 'No'
      } | Overview: ${m.overview.slice(0, 100)}...`
  ).join('\n');
}

/**
 * Call Groq Llama 3.3 70B OpenAI-compatible endpoint
 */
async function callGroq(messages: { role: string; content: string }[]): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY not found');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Call Google Gemini REST API
 */
async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not found');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: `User request: ${userPrompt}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Helper to execute with auto-failover (Groq -> Gemini -> Fallback heuristic)
 */
async function executeWithFailover(
  systemPrompt: string,
  userPrompt: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  // 1. Try Groq first for lightning-fast latency
  if (GROQ_API_KEY) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userPrompt },
      ];
      return await callGroq(messages);
    } catch (e) {
      console.warn('Groq failed, falling back to Gemini:', e);
    }
  }

  // 2. Try Gemini
  if (GEMINI_API_KEY) {
    try {
      return await callGemini(systemPrompt, userPrompt);
    } catch (e) {
      console.warn('Gemini failed:', e);
    }
  }

  // 3. Fallback smart mock response if APIs are unreachable
  return fallbackAiRecommendation(userPrompt);
}

/**
 * Extract matched media items from AI response
 */
function extractRecommendedMedia(text: string): { cleanedText: string; items: MediaItem[] } {
  const items: MediaItem[] = [];
  const idTagMatch = text.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);

  if (idTagMatch) {
    const rawIds = idTagMatch[1].split(',').map((id) => id.trim().toLowerCase());
    for (const rawId of rawIds) {
      const found = MASTER_MEDIA_ITEMS.find(
        (m) => m.id.toLowerCase() === rawId || m.title.toLowerCase().includes(rawId)
      );
      if (found && !items.some((i) => i.id === found.id)) {
        items.push(found);
      }
    }
  }

  // If no tag, search for title mentions
  if (items.length === 0) {
    for (const media of MASTER_MEDIA_ITEMS) {
      if (text.toLowerCase().includes(media.title.toLowerCase())) {
        if (!items.some((i) => i.id === media.id)) {
          items.push(media);
        }
      }
    }
  }

  const cleanedText = text.replace(/\[RECOMMENDED_IDS:\s*[^\]]+\]/gi, '').trim();
  return { cleanedText, items: items.slice(0, 4) };
}

/**
 * Conversational Cinema AI Chat
 */
export async function chatWithCinemaAi(
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; recommendedItems: MediaItem[] }> {
  const systemPrompt = `You are CineBot AI, the ultra-smart, witty, and friendly cinema connoisseur of the PREMIER streaming platform.
You assist users in discovering the best movies, web series, anime, dual-audio (Hindi+English) blockbusters, and 24/7 Live TV channels.
You speak naturally in Hindi, Hinglish, or English based on how the user greets or queries you.

CURRENT PREMIER STREAMING CATALOG:
${getCatalogContext()}

CRITICAL RULES:
1. Give vibrant, concise, exciting cinema suggestions (2-4 paragraphs max). Mention why each title fits their mood.
2. Whenever you suggest or discuss titles from the catalog, ALWAYS append an exact tag at the very end of your response in this format:
[RECOMMENDED_IDS: id1, id2, id3]
Example: [RECOMMENDED_IDS: stree-2, kalki-2898-ad, solo-leveling-s2]
Use ONLY the exact IDs listed in the catalog above.
3. Be enthusiastic, use relevant emojis (🍿, 🎬, 🔥, ⚡, 🎧, ⭐), and highlight features like 4K UHD, Dolby Atmos, and Dual Audio Hindi dubbed streams when appropriate.`;

  const formattedHistory = history.map((h) => ({
    role: h.role,
    content: h.content,
  }));

  const rawOutput = await executeWithFailover(systemPrompt, userPrompt, formattedHistory);
  const { cleanedText, items } = extractRecommendedMedia(rawOutput);

  return {
    reply: cleanedText,
    recommendedItems: items,
  };
}

/**
 * AI Movie Insights & Trivia Deep-Dive
 */
export async function getAiMovieInsights(item: MediaItem): Promise<MovieAiInsights> {
  const cacheKey = `ai_insights_${item.id}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  const systemPrompt = `You are an expert Hollywood, Bollywood, and Anime film historian and cinematic analyst.
Generate intriguing, verified, behind-the-scenes trivia, Easter eggs, and a compelling "Why You Should Watch" pitch for the movie/series.
Respond STRICTLY with valid JSON in this structure:
{
  "whyWatch": "2-sentence punchy pitch explaining why this film/show is unmissable in 4K UHD",
  "trivia": [
    "Fascinating behind-the-scenes fact #1",
    "Fascinating behind-the-scenes fact #2",
    "Fascinating behind-the-scenes fact #3"
  ],
  "easterEggs": [
    "Hidden Easter egg or director reference #1",
    "Hidden Easter egg or director reference #2"
  ],
  "vibeScore": 96
}`;

  const userPrompt = `Title: ${item.title} (${item.releaseYear})
Type: ${item.type}
Genres: ${item.genres.join(', ')}
Director: ${item.director || 'N/A'}
Cast: ${item.cast?.join(', ') || 'N/A'}
Overview: ${item.overview}`;

  try {
    const raw = await executeWithFailover(systemPrompt, userPrompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed: MovieAiInsights = JSON.parse(jsonMatch[0]);
      sessionStorage.setItem(cacheKey, JSON.stringify(parsed));
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to fetch dynamic AI insights, using fallback:', e);
  }

  // Fallback insights
  const fallback: MovieAiInsights = {
    whyWatch: `${item.title} delivers masterclass storytelling with exhilarating pacing and top-tier visual brilliance crafted for high-definition streaming.`,
    trivia: [
      `Shot using state-of-the-art IMAX digital cameras to maximize visual immersion.`,
      `The soundtrack and sound design were engineered specifically for spatial audio soundbars and headphones.`,
      `Critically acclaimed with an impressive ${item.rating.toFixed(1)}/10 rating among global audiences.`,
    ],
    easterEggs: [
      `Watch closely during the pivotal midpoint scene for a clever tribute to classic cinema tropes.`,
      `The color grading shifts subtly throughout the storyline to reflect the protagonist's emotional state.`,
    ],
    vibeScore: Math.round(item.rating * 10),
  };

  sessionStorage.setItem(cacheKey, JSON.stringify(fallback));
  return fallback;
}

/**
 * AI Semantic Search
 */
export async function searchCatalogWithAi(
  query: string
): Promise<{ matches: MediaItem[]; explanation: string }> {
  const systemPrompt = `You are the AI Semantic Search Engine for Premier streaming catalog.
Analyze the user's natural language query (vibes, feelings, plot tropes, themes, actors) and identify the top matching titles from this catalog:
${getCatalogContext()}

Format response strictly as:
[RECOMMENDED_IDS: id1, id2, id3]
Explanation: <1-2 sentences explaining why these match the user query>`;

  try {
    const raw = await executeWithFailover(systemPrompt, `Search: "${query}"`);
    const { cleanedText, items } = extractRecommendedMedia(raw);
    const explanation = cleanedText.replace(/Explanation:\s*/i, '').trim();
    return {
      matches: items.length > 0 ? items : MASTER_MEDIA_ITEMS.slice(0, 3),
      explanation: explanation || `Found ${items.length} titles that match "${query}".`,
    };
  } catch {
    const matched = MASTER_MEDIA_ITEMS.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 4);
    return {
      matches: matched.length > 0 ? matched : MASTER_MEDIA_ITEMS.slice(0, 3),
      explanation: `Top matching recommendations for "${query}".`,
    };
  }
}

/**
 * Intelligent Offline/Fallback AI generator
 */
function fallbackAiRecommendation(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('horror') || q.includes('stree') || q.includes('bhoot') || q.includes('dar')) {
    return `🔥 **Horror-Comedy & Spooky Recommendations:**\n\nAgar aapko *Stree 2* pasand aayi thi, toh aapko horror aur comedy ka yeh thrilling mix zarur dekhna chahiye! *Stree 2* aur *Shaitaan* me chilling suspense ke saath engaging plot twist milenge.\n\n[RECOMMENDED_IDS: stree-2, shaitaan, stranger-things-s5]`;
  }

  if (q.includes('anime') || q.includes('solo') || q.includes('jujutsu') || q.includes('demon')) {
    return `⚡ **Top Tier Anime Recommendations:**\n\nHigh-octane action aur breathtaking animation ke liye *Solo Leveling Season 2*, *Jujutsu Kaisen: Shibuya Incident*, aur *Demon Slayer: Hashira Training* 100% must-watch hain. Inke Hindi dubbed aur Japanese audio tracks available hain!\n\n[RECOMMENDED_IDS: solo-leveling-s2, jujutsu-kaisen-s2, demon-slayer-s4]`;
  }

  if (q.includes('action') || q.includes('kalki') || q.includes('pushpa') || q.includes('south')) {
    return `💥 **High-Octane Action Blockbusters:**\n\nPure adrenaline aur grand visuals ke liye *Pushpa 2: The Rule* aur *Kalki 2898 AD* best choices hain! IMAX 4K UHD quality aur Dolby sound ke saath stream karein.\n\n[RECOMMENDED_IDS: pushpa-2, kalki-2898-ad, animal-2023]`;
  }

  return `🍿 **Premier AI Recommendations:**\n\nAapke streaming taste ke liye humne top-rated blockbuster titles pick kiye hain. In sabhi titles me fast multi-server playback aur pristine 4K video stream available hai!\n\n[RECOMMENDED_IDS: stree-2, kalki-2898-ad, solo-leveling-s2, stranger-things-s5]`;
}
