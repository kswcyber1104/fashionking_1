import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleCorsPreflight } from './lib/cors';
import {
  generateOutfitRecommendation,
  RecommendRequestBody,
  RecommendServiceError,
} from './lib/recommend';
import { fetchServerWeather } from './lib/weather';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api', (req, res, next) => {
    if (handleCorsPreflight(req, res)) {
      return;
    }
    next();
  });

  app.post('/api/recommend', async (req, res) => {
    try {
      const body = (req.body ?? {}) as RecommendRequestBody;
      const result = await generateOutfitRecommendation(body);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof RecommendServiceError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
      }

      console.error('Unexpected /api/recommend error:', err);
      res.status(500).json({
        error: '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요',
      });
    }
  });

  app.get('/api/weather', async (req, res) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);

    if (
      typeof req.query.lat !== 'string' ||
      typeof req.query.lon !== 'string' ||
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
      res.json(weather);
    } catch (err: unknown) {
      console.error('Weather proxy error:', err);
      res.status(502).json({
        error: '날씨를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
      });
    }
  });

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fashion King server listening on http://0.0.0.0:${PORT}`);
  });
}

createApp().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
