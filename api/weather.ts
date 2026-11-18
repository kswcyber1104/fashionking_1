import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCorsPreflight } from '../lib/cors.js';
import { fetchServerWeather } from '../lib/weather.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (handleCorsPreflight(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(405).json({ error: '허용되지 않은 요청 방식입니다.' });
    return;
  }

  const latParam = Array.isArray(req.query.lat) ? req.query.lat[0] : req.query.lat;
  const lonParam = Array.isArray(req.query.lon) ? req.query.lon[0] : req.query.lon;

  const lat = Number(latParam);
  const lon = Number(lonParam);

  if (
    !latParam ||
    !lonParam ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    res.status(400).json({ error: '올바른 위도와 경도 값이 필요합니다.' });
    return;
  }

  try {
    const weather = await fetchServerWeather(lat, lon);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    res.status(200).json(weather);
  } catch (err: unknown) {
    console.error('Weather proxy error:', err);
    res.status(502).json({
      error: '날씨를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    });
  }
}
