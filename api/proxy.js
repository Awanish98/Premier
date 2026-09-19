export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Range'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const targetUrl = req.query.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing target URL' });
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
    res.setHeader('Content-Type', contentType || 'application/vnd.apple.mpegurl');

    if (upstreamRes.headers.get('content-range')) {
      res.setHeader('Content-Range', upstreamRes.headers.get('content-range'));
      res.status(206);
    }

    // Rewrite relative URLs in M3U8 playlists
    if (contentType.includes('mpegurl') || targetUrl.endsWith('.m3u8') || contentType.includes('text')) {
      const text = await upstreamRes.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);

      const rewritten = text
        .split('\n')
        .map((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('#') || trimmed === '') return line;
          const absolute = trimmed.startsWith('http')
            ? trimmed
            : new URL(trimmed, baseUrl).toString();
          return `/api/proxy?url=${encodeURIComponent(absolute)}`;
        })
        .join('\n');

      return res.status(200).send(rewritten);
    }

    const buffer = await upstreamRes.arrayBuffer();
    return res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    return res.status(502).json({ error: 'Proxy failed', details: err.message });
  }
}
