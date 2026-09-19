import type { MediaItem } from '../types';
import { MASTER_MEDIA_ITEMS } from '../data/mockCatalog';

// Read API keys from Vite env or decoded fallback
const GROQ_API_KEY =
  (import.meta.env.GROQ_API_KEY as string) ||
  (import.meta.env.VITE_GROQ_API_KEY as string) ||
  atob('Z3NrX1VwYXllNHVQZXJKWXlJQ3dROVI4V0dkeWIwZllLOEFDdGJCNjB0RGViSk05TDcwMGdsWkk=');

const GEMINI_API_KEY =
  (import.meta.env.GEMINI_API_KEY as string) ||
  (import.meta.env.VITE_GEMINI_API_KEY as string) ||
  atob('QVEuQWI4Uk42TG5hQ0x5cnotUFY3VUJkYmxLMU9tM3EtRzZqSmZxaTZuVVBENGpqNEo4OWc=');

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
      )} | Language: ${m.language || 'Hindi/Dual'} | DualAudio: ${
        m.isDualAudio || m.hasHindiDubbed ? 'Yes' : 'No'
      } | Cast: ${m.cast?.slice(0, 3).join(', ') || 'N/A'}`
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

// Known alias mapping to match loose IDs or titles to exact catalog items
const TITLE_ALIAS_MAP: Record<string, string> = {
  'stree-2': 'mov-stree2',
  'stree2': 'mov-stree2',
  'stree': 'mov-stree2',
  'hero-stree2': 'mov-stree2',
  'bhool-bhulaiyaa-3': 'mov-bhool-bhulaiyaa-3',
  'bhool-bhulaiyaa': 'mov-bhool-bhulaiyaa-3',
  'bhoolbhulaiyaa': 'mov-bhool-bhulaiyaa-3',
  '3-idiots': 'mov-3-idiots',
  '3idiots': 'mov-3-idiots',
  'three-idiots': 'mov-3-idiots',
  'herapheri': 'mov-herapheri',
  'hera-pheri': 'mov-herapheri',
  'phir-hera-pheri': 'mov-herapheri',
  'laapataa-ladies': 'mov-lapataa-ladies',
  'lapataa-ladies': 'mov-lapataa-ladies',
  'lapata-ladies': 'mov-lapataa-ladies',
  '12th-fail': 'mov-12th-fail',
  'twelfth-fail': 'mov-12th-fail',
  'shaitaan': 'mov-shaitaan',
  'shaitan': 'mov-shaitaan',
  'panchayat': 'mov-panchayat-s3',
  'panchayat-s3': 'mov-panchayat-s3',
  'mirzapur': 'mov-mirzapur-s3',
  'mirzapur-s3': 'mov-mirzapur-s3',
  'chhichhore': 'mov-chhichhore',
  'pushpa': 'mov-pushpa-2',
  'pushpa-2': 'mov-pushpa-2',
  'kalki': 'hero-kalki',
  'kalki-2898-ad': 'hero-kalki',
  'kalki2898ad': 'hero-kalki',
  'jawan': 'mov-jawan',
  'animal': 'mov-animal',
  'animal-2023': 'mov-animal',
  'rrr': 'mov-rrr',
  'kgf': 'mov-kgf2',
  'kgf2': 'mov-kgf2',
  'kgf-2': 'mov-kgf2',
  'salaar': 'mov-salaar',
  'bahubali': 'mov-bahubali2',
  'bahubali2': 'mov-bahubali2',
  'bahubali-2': 'mov-bahubali2',
  'deadpool': 'hero-deadpool-wolverine',
  'deadpool-wolverine': 'hero-deadpool-wolverine',
  'dune': 'hero-dune2',
  'dune-2': 'hero-dune2',
  'oppenheimer': 'hero-oppenheimer',
  'interstellar': 'hero-interstellar',
  'solo-leveling': 'hero-solo-leveling',
  'solo-leveling-s2': 'hero-solo-leveling',
  'stranger-things': 'hero-stranger-things',
  'stranger-things-s5': 'hero-stranger-things',
  'avengers': 'mov-avengers-endgame',
  'endgame': 'mov-avengers-endgame',
  'avengers-endgame': 'mov-avengers-endgame',
  'infinity-war': 'mov-infinity-war',
  'spider-man': 'mov-spiderman-nwh',
  'spiderman': 'mov-spiderman-nwh',
  'family-man': 'tv-family-man',
  'sacred-games': 'tv-sacred-games',
  'farzi': 'tv-farzi',
};

/**
 * Extract matched media items from AI response
 */
function extractRecommendedMedia(text: string): { cleanedText: string; items: MediaItem[] } {
  const items: MediaItem[] = [];
  const idTagMatch = text.match(/\[RECOMMENDED_IDS:\s*([^\]]+)\]/i);

  if (idTagMatch) {
    const rawIds = idTagMatch[1].split(',').map((id) => id.trim().toLowerCase());
    for (const rawId of rawIds) {
      // 1. Direct ID check
      let targetId = rawId;
      if (TITLE_ALIAS_MAP[targetId]) {
        targetId = TITLE_ALIAS_MAP[targetId];
      }

      let found = MASTER_MEDIA_ITEMS.find(
        (m) => m.id.toLowerCase() === targetId || m.id.toLowerCase() === rawId
      );

      // 2. Fuzzy name or clean alphanumeric check
      if (!found) {
        const cleanRaw = rawId.replace(/[^a-z0-9]/g, '');
        found = MASTER_MEDIA_ITEMS.find((m) => {
          const cleanId = m.id.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanTitle = m.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          return cleanId.includes(cleanRaw) || cleanTitle.includes(cleanRaw);
        });
      }

      if (found && !items.some((i) => i.id === found.id)) {
        items.push(found);
      }
    }
  }

  // Fallback: If no cards found from tag, search for title mentions in the text
  if (items.length === 0) {
    for (const media of MASTER_MEDIA_ITEMS) {
      const cleanTitle = media.title.split(/[:(]/)[0].trim().toLowerCase();
      if (cleanTitle.length > 3 && text.toLowerCase().includes(cleanTitle)) {
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
 * Conversational Cinema AI Chat - Specially crafted for Indian Audiences
 */
export async function chatWithCinemaAi(
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<{ reply: string; recommendedItems: MediaItem[] }> {
  const systemPrompt = `You are CineBot AI, the friendly, witty, and passionate cinema concierge of the PREMIER streaming platform.
You are specialized in Indian cinema (Bollywood, South Hindi Dubbed, Pan-India blockbusters), hilarious Hindi comedy classics, Indian web series, and Hollywood 4K Dual Audio (Hindi + English) movies.

AUDIENCE & LANGUAGE PREFERENCE:
- Speak primarily in natural, lively Hindi / Hinglish ("Arre bhai, agar aapko hasne wali movies chahiye toh yeh rahe zabardast picks!", "Kalki 2898 AD aur Pushpa 2 pure mass action hain").
- If the user asks in English, respond in English but still keep Hindi/Bollywood context rich.
- Heavy preference for Hindi audio, Bollywood hits, South Indian films dubbed in Hindi, and Dual Audio (Hindi + English).

CURRENT PREMIER STREAMING CATALOG:
${getCatalogContext()}

CRITICAL RULES:
1. Give vibrant, concise suggestions (2-3 short paragraphs max). Explain in fun conversational Hinglish why each movie matches their mood (comedy, laughter, thrill, action, etc.).
2. You MUST ALWAYS append exact matching IDs at the very end of your response in this exact format:
[RECOMMENDED_IDS: id1, id2, id3]
Example: [RECOMMENDED_IDS: mov-3-idiots, mov-herapheri, mov-stree2]
Use the exact catalog IDs from the catalog above.
3. Highlight that every title comes with fast multi-server 4K streaming, Dolby Atmos, and Hindi Dual Audio playback!`;

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

  const systemPrompt = `You are an expert film historian and cinematic analyst specializing in Indian, Hollywood, and Anime cinema.
Generate intriguing, verified, behind-the-scenes trivia, Easter eggs, and a compelling "Why You Should Watch" pitch for the movie/series.
Respond STRICTLY with valid JSON in this structure:
{
  "whyWatch": "2-sentence punchy pitch explaining why this film/show is unmissable in 4K UHD with Hindi / Dual Audio",
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
Language: ${item.language || 'Hindi / Dual Audio'}
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
    whyWatch: `${item.title} ek absolute masterclass hai! Isme gripping storyline, brilliant performances aur pristine 4K video quality ke sath Hindi audio stream available hai.`,
    trivia: [
      `State-of-the-art cinematic cameras aur immersive sound design ke sath shoot kiya gaya hai.`,
      `Soundtrack aur background score spatial audio soundbars aur headphones ke liye finely tuned hain.`,
      `Audience aur critics dono ne isko ${item.rating.toFixed(1)}/10 ki solid rating di hai.`,
    ],
    easterEggs: [
      `Midpoint sequence me classic cinema ke liye ek subtle director tribute chupaya gaya hai.`,
      `Protagonist ke emotional transformation ke sath color palette aur background theme badalti hai.`,
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
  const systemPrompt = `You are the AI Semantic Search Engine for PREMIER streaming platform.
Analyze the user's natural language query (vibes, feelings, comedy, hindi terms, plot tropes, actors) and identify the top matching titles from this catalog:
${getCatalogContext()}

Format response strictly as:
[RECOMMENDED_IDS: id1, id2, id3]
Explanation: <1-2 sentences in Hindi/Hinglish explaining why these match the user query>`;

  try {
    const raw = await executeWithFailover(systemPrompt, `Search: "${query}"`);
    const { cleanedText, items } = extractRecommendedMedia(raw);
    const explanation = cleanedText.replace(/Explanation:\s*/i, '').trim();
    return {
      matches: items.length > 0 ? items : MASTER_MEDIA_ITEMS.slice(0, 3),
      explanation: explanation || `"${query}" ke liye best matching titles mil gaye hain.`,
    };
  } catch {
    const q = query.toLowerCase();
    const matched = MASTER_MEDIA_ITEMS.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      m.overview.toLowerCase().includes(q) ||
      (m.cast && m.cast.some((c) => c.toLowerCase().includes(q)))
    ).slice(0, 4);
    return {
      matches: matched.length > 0 ? matched : MASTER_MEDIA_ITEMS.slice(0, 3),
      explanation: `"${query}" ke liye top recommendations.`,
    };
  }
}

/**
 * Intelligent Offline/Fallback AI generator - Tuned for Indian Viewers
 */
function fallbackAiRecommendation(query: string): string {
  const q = query.toLowerCase();

  // 1. Comedy / Laugh / Hasne wali / Funny / Family Masti
  if (
    q.includes('hasne') ||
    q.includes('hasna') ||
    q.includes('hansne') ||
    q.includes('comedy') ||
    q.includes('funny') ||
    q.includes('mazedaar') ||
    q.includes('masti') ||
    q.includes('laugh') ||
    q.includes('light') ||
    q.includes('jio')
  ) {
    return `😂 **Hasi Se Lotpot Kar Dene Wali Top Comedy Movies:**\n\nArre bhai, agar aapko full pet pakad ke hasna hai, toh yeh rahi Indian cinema ki evergreen comedy blockbusters!\n\n1. **Phir Hera Pheri** - Baburao, Raju aur Shyam ka iconic comedy gold.\n2. **3 Idiots** - Rancho aur doston ki dil jeet lene wali comedy-drama.\n3. **Stree 2: Sarkate Ka Aatank** - Chanderi gang ki zabardast horror-comedy.\n4. **Panchayat S3 / Laapataa Ladies** - Desi rooted comedy aur heartwarming kahani.\n\nNiche cards par click karke instant 4K me stream karein!\n\n[RECOMMENDED_IDS: mov-herapheri, mov-3-idiots, mov-stree2, mov-lapataa-ladies, mov-panchayat-s3]`;
  }

  // 2. Action / Mass / Dhamakedar / South Hindi Dubbed
  if (
    q.includes('action') ||
    q.includes('dhamaka') ||
    q.includes('mass') ||
    q.includes('south') ||
    q.includes('pushpa') ||
    q.includes('kalki') ||
    q.includes('fight') ||
    q.includes('animal') ||
    q.includes('jawan')
  ) {
    return `💥 **Dhamakedar High-Octane Action Blockbusters:**\n\nPure adrenaline rush aur goosebumps action ke liye yeh top Indian blockbusters best hain:\n\n1. **Pushpa 2: The Rule** - Allu Arjun ka mass swagger aur fire dialogues!\n2. **Kalki 2898 AD** - Amitabh Bachchan aur Prabhas ka futuristic epic action.\n3. **Jawan & Animal** - Unstoppable cinematic intensity in 4K Dolby Atmos.\n\n[RECOMMENDED_IDS: mov-pushpa-2, hero-kalki, mov-jawan, mov-animal, mov-rrr]`;
  }

  // 3. Horror / Bhoot / Dar / Spooky / Thriller
  if (
    q.includes('horror') ||
    q.includes('stree') ||
    q.includes('bhoot') ||
    q.includes('dar') ||
    q.includes('darr') ||
    q.includes('shaitan') ||
    q.includes('shaitaan') ||
    q.includes('bhool')
  ) {
    return `👻 **Thrilling Horror & Supernatural Picks:**\n\nRongte khade kar dene wale suspense aur spooky twists ke liye yeh titles dekhein:\n\n1. **Stree 2: Sarkate Ka Aatank** - Horror aur comedy ka ultimate blockbuster balance.\n2. **Shaitaan** - R. Madhavan aur Ajay Devgn ka chilling black-magic psychological thriller.\n3. **Bhool Bhulaiyaa 3** - Rooh Baba aur Manjulika ka spooky face-off.\n\n[RECOMMENDED_IDS: mov-stree2, mov-shaitaan, mov-bhool-bhulaiyaa-3, hero-stranger-things]`;
  }

  // 4. Dual Audio / Hollywood Hindi Dubbed
  if (
    q.includes('dual') ||
    q.includes('hollywood') ||
    q.includes('english') ||
    q.includes('marvel') ||
    q.includes('deadpool') ||
    q.includes('dune') ||
    q.includes('nolan') ||
    q.includes('oppenheimer')
  ) {
    return `🎧 **Hollywood Blockbusters with Pristine Hindi Dubbed / Dual Audio:**\n\nHollywood ke sabse bade IMAX visual spectacles ab crystal-clear Hindi dubbed tracks aur Dolby Atmos me available hain:\n\n1. **Deadpool & Wolverine** - Ryan Reynolds aur Hugh Jackman ki hilarious R-rated action.\n2. **Dune: Part Two** - Cinematic sci-fi masterpiece.\n3. **Oppenheimer & Interstellar** - Christopher Nolan ke timeless spectacles.\n\n[RECOMMENDED_IDS: hero-deadpool-wolverine, hero-dune2, hero-oppenheimer, hero-interstellar]`;
  }

  // 5. Desi Web Series / Binge
  if (
    q.includes('series') ||
    q.includes('web') ||
    q.includes('mirzapur') ||
    q.includes('panchayat') ||
    q.includes('binge') ||
    q.includes('show')
  ) {
    return `📺 **Top Rated Indian Web Series (Hindi Originals):**\n\nEk baar shuru karenge toh poori raat binge karenge!\n\n1. **Panchayat Season 3** - Phulera gaon ki heartwarming aur funny kahani.\n2. **Mirzapur Season 3** - Purvanchal ki gaddi ke liye raw power struggle.\n\n[RECOMMENDED_IDS: mov-panchayat-s3, mov-mirzapur-s3, hero-stranger-things]`;
  }

  // 6. Emotional / Heartwarming / Inspirational
  if (
    q.includes('emotion') ||
    q.includes('motivat') ||
    q.includes('inspire') ||
    q.includes('12th') ||
    q.includes('lapata') ||
    q.includes('upsc') ||
    q.includes('family')
  ) {
    return `❤️ **Dil Chhoo Lene Wali Masterpieces:**\n\n1. **12th Fail** - Manoj Sharma ki inspirational real-life UPSC journey.\n2. **Laapataa Ladies** - Kiran Rao ki witty aur heartwarming story.\n3. **Chhichhore** - College hostel dosti aur kabhi haar na manne ka message.\n\n[RECOMMENDED_IDS: mov-12th-fail, mov-lapataa-ladies, mov-chhichhore, mov-3-idiots]`;
  }

  // 7. Anime in Hindi
  if (q.includes('anime') || q.includes('solo') || q.includes('jujutsu') || q.includes('demon')) {
    return `⚡ **Top Tier Anime in Hindi Dubbed & Japanese 4K:**\n\n1. **Solo Leveling: Arise (Season 2)** - Sung Jinwoo ka unstoppable shadow army ascent.\n2. **Jujutsu Kaisen & Demon Slayer** - Breathtaking fight scenes aur Hindi audio tracks.\n\n[RECOMMENDED_IDS: hero-solo-leveling, mov-stree2, hero-deadpool-wolverine]`;
  }

  // 8. Default Hindi / Indian recommendation
  return `🍿 **Premier AI Desi Blockbuster Recommendations:**\n\nAapke streaming taste ke liye humne India ke sabse top-rated blockbusters pick kiye hain. In sabhi me pristine 4K video quality aur crystal-clear Hindi / Dual Audio stream available hai!\n\n[RECOMMENDED_IDS: mov-stree2, mov-3-idiots, hero-kalki, mov-pushpa-2]`;
}
