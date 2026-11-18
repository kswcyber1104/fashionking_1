import { buildApiUrl } from './api';
import type { OutfitRecommendation } from '../components/OutfitScreen';

export interface RecommendPayload {
  ageGroup: string;
  gender: string;
  styleName: string;
  styleDescription: string;
  currentTemp: number;
  apparentTemp: number;
  conditionLabel: string;
  minTemp: number;
  maxTemp: number;
  rainProbability: number;
}

export async function fetchOutfitRecommendation(
  payload: RecommendPayload,
): Promise<OutfitRecommendation> {
  const response = await fetch(buildApiUrl('/api/recommend'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요');
  }

  const result = (await response.json()) as Partial<OutfitRecommendation>;
  if (
    !result.outerwear ||
    !result.top ||
    !result.bottom ||
    !result.shoes ||
    !result.accessories ||
    !result.reason
  ) {
    throw new Error('지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요');
  }

  return result as OutfitRecommendation;
}
