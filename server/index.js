/**
 * Premier Streaming & Live TV Production Proxy Backend
 * 
 * Features:
 * - High-speed CORS streaming proxy for M3U8 and .ts video chunks
 * - Rewrites internal M3U8 URIs to maintain persistent proxied streams
 * - Worldwide IPTV channel caching & search endpoints
 * - Lightweight Express server deployable on Render, Railway, Vercel, Docker or local machine
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range']
}));

app.use(express.json());

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Premier Streaming & IPTV Backend Proxy',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Stream CORS Proxy Endpoint
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing target URL parameter' });
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': new URL(targetUrl).origin,
        ...(req.headers.range ? { 'Range': req.headers.range } : {})
      }
    });

    const contentType = upstreamRes.headers.get('content-type') || '';

    // Set permissive streaming headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', contentType || 'application/vnd.apple.mpegurl');

    if (upstreamRes.headers.get('content-range')) {
      res.setHeader('Content-Range', upstreamRes.headers.get('content-range'));
      res.status(206);
    }

    // If it's an M3U8 manifest, rewrite relative TS/m3u8 lines to route through this proxy
    if (contentType.includes('mpegurl') || targetUrl.endsWith('.m3u8') || contentType.includes('text')) {
      const manifestText = await upstreamRes.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      const rewritten = manifestText
        .split('\n')
        .map((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || trimmed === '') {
            return line;
          }
          // Resolve absolute target URL for the segment
          const absoluteSegmentUrl = trimmed.startsWith('http')
            ? trimmed
            : new URL(trimmed, baseUrl).toString();

          return `/api/proxy?url=${encodeURIComponent(absoluteSegmentUrl)}`;
        })
        .join('\n');

      return res.send(rewritten);
    }

    // If it is binary video segment (.ts, .mp4, audio), pipe stream directly
    upstreamRes.body.pipe(res);
  } catch (err) {
    console.error(`Proxy stream error for ${targetUrl}:`, err.message);
    res.status(502).json({ error: 'Failed to fetch upstream stream', details: err.message });
  }
});

// Worldwide Country IPTV API endpoint
app.get('/api/iptv/country/:code', async (req, res) => {
  const code = req.params.code.toLowerCase();
  const url = code === 'all'
    ? 'https://iptv-org.github.io/iptv/index.m3u'
    : `https://iptv-org.github.io/iptv/countries/${code}.m3u`;

  try {
    const upstreamRes = await fetch(url);
    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({ error: 'Country playlist not found' });
    }
    const m3uText = await upstreamRes.text();
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(m3uText);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch country playlist', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Premier Live TV & Streaming Proxy Backend running on http://localhost:${PORT}`);
  console.log(`⚡ CORS Proxy: http://localhost:${PORT}/api/proxy?url=<m3u8_stream_url>`);
});
