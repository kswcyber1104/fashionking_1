import { GoogleGenAI, Type } from '@google/genai';

export interface RecommendRequestBody {
  ageGroup?: string;
  gender?: string;
  styleName?: string;
  styleDescription?: string;
  currentTemp?: number;
  apparentTemp?: number;
  conditionLabel?: string;
  minTemp?: number;
  maxTemp?: number;
  rainProbability?: number;
}

export interface OutfitRecommendationResult {
  outerwear: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  reason: string;
}

interface RawGeminiOutfit {
  겉옷?: string;
  상의?: string;
  하의?: string;
  신발?: string;
  소품?: string;
  추천이유?: string;
}

export class RecommendServiceError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'RecommendServiceError';
    this.statusCode = statusCode;
  }
}

const GEMINI_TIMEOUT_MS = 15_000;

export async function generateOutfitRecommendation(
  body: RecommendRequestBody,
): Promise<OutfitRecommendationResult> {
  // Vercel 환경 변수(GEMINI_API_KEY)에서 서버 측 API 키를 안전하게 읽습니다.
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new RecommendServiceError(
      500,
      '서버에 GEMINI_API_KEY 환경 변수가 설정되어 있지 않습니다.',
    );
  }

  const {
    ageGroup,
    gender,
    styleName,
    styleDescription,
    currentTemp,
    apparentTemp,
    conditionLabel,
    minTemp,
    maxTemp,
    rainProbability,
  } = body;

  if (
    !ageGroup ||
    !gender ||
    !styleName ||
    typeof currentTemp !== 'number' ||
    !Number.isFinite(currentTemp) ||
    typeof apparentTemp !== 'number' ||
    !Number.isFinite(apparentTemp) ||
    !conditionLabel ||
    typeof minTemp !== 'number' ||
    !Number.isFinite(minTemp) ||
    typeof maxTemp !== 'number' ||
    !Number.isFinite(maxTemp) ||
    typeof rainProbability !== 'number' ||
    !Number.isFinite(rainProbability)
  ) {
    throw new RecommendServiceError(400, '옷차림 추천에 필요한 정보가 부족합니다.');
  }

  const tempDiff = maxTemp - minTemp;

  const systemInstruction = [
    '당신은 한국인의 일상 옷차림을 친절하게 골라 주는 스타일 도우미입니다.',
    '사용자가 선택한 연령대, 성별, 스타일과 오늘 날씨 정보를 보고 가장 알맞은 옷차림을 정확히 1가지만 추천하세요.',
    '규칙:',
    '1. 고른 스타일에 맞는 겉옷, 상의, 하의, 신발, 소품을 각각 구체적으로 한 줄씩 추천하세요.',
    '2. 오늘 기온과 날씨에 꼭 맞게 고르세요. 비 올 확률이 높으면(예: 40% 이상) 소품이나 신발에 우산이나 방수 신발을 꼭 넣으세요.',
    '3. 아침저녁과 낮의 기온 차이(일교차)가 크면(예: 8℃ 이상) 가볍게 걸치거나 벗을 수 있는 껴입기를 추천하세요.',
    '4. 연령대와 성별에 자연스럽게 어울리면서 동네나 일반 매장에서 쉽게 구할 수 있는 평범한 옷으로 추천하세요. 특정 브랜드 이름은 절대 넣지 마세요.',
    '5. 추천이유는 오늘 날씨를 근거로 한 문장으로 쓰세요.',
    '6. 전체 답변은 쉬운 한국어와 부드러운 존댓말로 작성하세요.',
    '7. 반드시 지정된 JSON 스키마 형식으로만 답하세요.',
  ].join('\n');

  const userPrompt = [
    `연령대: ${ageGroup}`,
    `성별: ${gender}`,
    `고른 스타일: ${styleName}${styleDescription ? ` (${styleDescription})` : ''}`,
    `지금 기온: ${currentTemp}℃`,
    `체감온도: ${apparentTemp}℃`,
    `날씨 상태: ${conditionLabel}`,
    `오늘 최저 기온: ${minTemp}℃`,
    `오늘 최고 기온: ${maxTemp}℃ (일교차 ${tempDiff}℃)`,
    `비 올 확률: ${rainProbability}%`,
    '',
    '위 조건에 딱 맞는 오늘의 옷차림 1가지를 JSON으로 추천해 주세요.',
  ].join('\n');

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  try {
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              겉옷: {
                type: Type.STRING,
                description: '추천하는 겉옷 1가지 (쉬운 존댓말 설명)',
              },
              상의: {
                type: Type.STRING,
                description: '추천하는 상의 1가지',
              },
              하의: {
                type: Type.STRING,
                description: '추천하는 하의 1가지',
              },
              신발: {
                type: Type.STRING,
                description: '추천하는 신발 1가지',
              },
              소품: {
                type: Type.STRING,
                description: '추천하는 소품 1가지 (비 올 확률이 높으면 우산 포함)',
              },
              추천이유: {
                type: Type.STRING,
                description: '오늘 날씨를 근거로 한 한 문장의 추천 이유 (존댓말)',
              },
            },
            required: ['겉옷', '상의', '하의', '신발', '소품', '추천이유'],
          },
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('GEMINI_TIMEOUT')), GEMINI_TIMEOUT_MS),
      ),
    ]);

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      throw new RecommendServiceError(502, 'AI 응답이 비어 있습니다.');
    }

    const parsed = JSON.parse(rawText) as RawGeminiOutfit;
    if (
      !parsed.겉옷 ||
      !parsed.상의 ||
      !parsed.하의 ||
      !parsed.신발 ||
      !parsed.소품 ||
      !parsed.추천이유
    ) {
      throw new RecommendServiceError(502, '추천 결과 형식이 올바르지 않습니다.');
    }

    return {
      outerwear: parsed.겉옷,
      top: parsed.상의,
      bottom: parsed.하의,
      shoes: parsed.신발,
      accessories: parsed.소품,
      reason: parsed.추천이유,
    };
  } catch (err: unknown) {
    if (err instanceof RecommendServiceError) {
      throw err;
    }

    const errObj = err as { status?: number; message?: string };
    console.error(
      'Gemini recommendation failed:',
      errObj?.status,
      errObj?.message ?? err,
    );

    if (errObj?.message === 'GEMINI_TIMEOUT') {
      throw new RecommendServiceError(
        504,
        '추천 응답이 지연되고 있어요. 잠시 후 다시 눌러 주세요',
      );
    }

    throw new RecommendServiceError(
      500,
      '지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요',
    );
  }
}
