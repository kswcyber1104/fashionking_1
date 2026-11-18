import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleCorsPreflight } from '../lib/cors';
import {
  generateOutfitRecommendation,
  RecommendRequestBody,
  RecommendServiceError,
} from '../lib/recommend';

function parseBody(rawBody: unknown): RecommendRequestBody {
  if (!rawBody) return {};
  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody) as RecommendRequestBody;
    } catch {
      return {};
    }
  }
  if (typeof rawBody === 'object') {
    return rawBody as RecommendRequestBody;
  }
  return {};
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (handleCorsPreflight(req, res)) {
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).json({ error: '허용되지 않은 요청 방식입니다.' });
    return;
  }

  try {
    const body = parseBody(req.body);
    const result = await generateOutfitRecommendation(body);
    res.status(200).json(result);
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
}
