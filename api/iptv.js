export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { country = 'all' } = req.query;
  const target = country === 'all'
    ? 'https://iptv-org.github.io/iptv/index.m3u'
    : `https://iptv-org.github.io/iptv/countries/${country.toLowerCase()}.m3u`;

  try {
    const upstreamRes = await fetch(target);
    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({ error: 'Country not found' });
    }
    const text = await upstreamRes.text();
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch playlist', details: err.message });
  }
}
