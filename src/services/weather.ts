import { buildApiUrl } from './api';

export interface WeatherData {
  currentTemp: number;
  apparentTemp: number;
  minTemp: number;
  maxTemp: number;
  rainProbability: number;
  conditionLabel: string;
  conditionEmoji: string;
}

interface OpenMeteoResponse {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
  };
  hourly?: {
    time?: string[];
    precipitation_probability?: number[];
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
}

export function mapWeatherCode(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: '맑음', emoji: '☀️' };
  if (code === 1) return { label: '대체로 맑음', emoji: '🌤️' };
  if (code === 2) return { label: '구름 조금', emoji: '⛅' };
  if (code === 3) return { label: '흐림', emoji: '☁️' };
  if (code === 45 || code === 48) return { label: '안개', emoji: '🌫️' };
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
    return { label: '이슬비', emoji: '🌦️' };
  }
  if (code === 61 || code === 63 || code === 65) return { label: '비', emoji: '🌧️' };
  if (code === 66 || code === 67) return { label: '진눈깨비', emoji: '🌨️' };
  if (code === 71 || code === 73 || code === 75 || code === 77) return { label: '눈', emoji: '❄️' };
  if (code === 80 || code === 81 || code === 82) return { label: '소나기', emoji: '🌦️' };
  if (code === 85 || code === 86) return { label: '눈보라', emoji: '🌨️' };
  if (code === 95 || code === 96 || code === 99) return { label: '천둥번개', emoji: '⛈️' };
  return { label: '맑음', emoji: '☀️' };
}

async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (err) {
    if (timedOut) {
      throw new Error('요청 시간이 초과되었어요.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}

export async function fetchOpenMeteoWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    current: 'temperature_2m,apparent_temperature,weather_code',
    hourly: 'precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Asia/Seoul',
    forecast_days: '1',
  });

  const data = await fetchJsonWithTimeout<OpenMeteoResponse>(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    4500,
    signal,
  );

  if (
    !data.current ||
    typeof data.current.temperature_2m !== 'number' ||
    typeof data.current.apparent_temperature !== 'number'
  ) {
    throw new Error('날씨 데이터가 올바르지 않아요.');
  }

  const weatherCode =
    typeof data.current.weather_code === 'number' ? data.current.weather_code : 0;
  const { label, emoji } = mapWeatherCode(weatherCode);

  let rainProb = 0;
  const currentHourPrefix = data.current.time ? data.current.time.slice(0, 13) : '';
  if (
    data.hourly?.time &&
    data.hourly?.precipitation_probability &&
    currentHourPrefix
  ) {
    const hourIndex = data.hourly.time.findIndex((t) =>
      t.startsWith(currentHourPrefix),
    );
    if (
      hourIndex !== -1 &&
      typeof data.hourly.precipitation_probability[hourIndex] === 'number'
    ) {
      rainProb = Math.round(data.hourly.precipitation_probability[hourIndex]);
    } else if (typeof data.daily?.precipitation_probability_max?.[0] === 'number') {
      rainProb = Math.round(data.daily.precipitation_probability_max[0]);
    }
  } else if (typeof data.daily?.precipitation_probability_max?.[0] === 'number') {
    rainProb = Math.round(data.daily.precipitation_probability_max[0]);
  }

  const minTemp =
    typeof data.daily?.temperature_2m_min?.[0] === 'number'
      ? Math.round(data.daily.temperature_2m_min[0])
      : Math.round(data.current.temperature_2m);

  const maxTemp =
    typeof data.daily?.temperature_2m_max?.[0] === 'number'
      ? Math.round(data.daily.temperature_2m_max[0])
      : Math.round(data.current.temperature_2m);

  return {
    currentTemp: Math.round(data.current.temperature_2m),
    apparentTemp: Math.round(data.current.apparent_temperature),
    minTemp,
    maxTemp,
    rainProbability: rainProb,
    conditionLabel: label,
    conditionEmoji: emoji,
  };
}

async function fetchWttrWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = `https://wttr.in/${lat.toFixed(4)},${lon.toFixed(4)}?format=j1`;
  const data = await fetchJsonWithTimeout<{
    current_condition?: Array<{
      temp_C?: string;
      FeelsLikeC?: string;
      weatherCode?: string;
    }>;
    weather?: Array<{
      mintempC?: string;
      maxtempC?: string;
      hourly?: Array<{
        time?: string;
        chanceofrain?: string;
      }>;
    }>;
  }>(url, 6000, signal);

  const current = data.current_condition?.[0];
  const today = data.weather?.[0];
  if (!current || typeof current.temp_C === 'undefined') {
    throw new Error('날씨 데이터가 올바르지 않아요.');
  }

  const currentTemp = Math.round(Number(current.temp_C));
  const apparentTemp =
    typeof current.FeelsLikeC !== 'undefined'
      ? Math.round(Number(current.FeelsLikeC))
      : currentTemp;
  const minTemp =
    today && typeof today.mintempC !== 'undefined'
      ? Math.round(Number(today.mintempC))
      : currentTemp;
  const maxTemp =
    today && typeof today.maxtempC !== 'undefined'
      ? Math.round(Number(today.maxtempC))
      : currentTemp;

  let rainProb = 0;
  if (today?.hourly && today.hourly.length > 0) {
    const kstHourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      hour: 'numeric',
      hour12: false,
    }).format(new Date());
    const kstHour = Number(kstHourStr) * 100;
    let closest = today.hourly[0];
    let minDiff = Infinity;
    for (const slot of today.hourly) {
      const slotTime = Number(slot.time ?? 0);
      const diff = Math.abs(slotTime - kstHour);
      if (diff < minDiff) {
        minDiff = diff;
        closest = slot;
      }
    }
    rainProb = Math.round(Number(closest?.chanceofrain ?? 0));
  }

  const code = Number(current.weatherCode);
  let label = '구름 조금';
  let emoji = '⛅';
  if (code === 113) {
    label = '맑음';
    emoji = '☀️';
  } else if (code === 116) {
    label = '구름 조금';
    emoji = '⛅';
  } else if (code === 119 || code === 122) {
    label = '흐림';
    emoji = '☁️';
  } else if (code === 143 || code === 248 || code === 260) {
    label = '안개';
    emoji = '🌫️';
  } else if ([176, 263, 266, 281, 284, 293, 296, 353].includes(code)) {
    label = '이슬비';
    emoji = '🌦️';
  } else if ([299, 302, 305, 308, 311, 314, 356, 359].includes(code)) {
    label = '비';
    emoji = '🌧️';
  } else if ([179, 182, 185, 317, 320, 362, 365].includes(code)) {
    label = '진눈깨비';
    emoji = '🌨️';
  } else if ([227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 374, 377].includes(code)) {
    label = '눈';
    emoji = '❄️';
  } else if ([200, 386, 389, 392, 395].includes(code)) {
    label = '천둥번개';
    emoji = '⛈️';
  }

  return {
    currentTemp,
    apparentTemp,
    minTemp,
    maxTemp,
    rainProbability: Number.isFinite(rainProb) ? rainProb : 0,
    conditionLabel: label,
    conditionEmoji: emoji,
  };
}

export async function fetchWeather(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
  });

  try {
    // 1차: 서버 프록시(/api/weather)를 통해 조회
    const data = await fetchJsonWithTimeout<WeatherData>(
      buildApiUrl(`/api/weather?${params.toString()}`),
      12000,
      signal,
    );
    if (typeof data.currentTemp === 'number') {
      return data;
    }
  } catch {
    if (signal?.aborted) throw new Error('ABORTED');
  }

  // 2차: 서버 프록시 실패 시 CORS가 허용된 공개 날씨 API를 병렬 호출로 폴백
  try {
    return await Promise.any([
      fetchOpenMeteoWeather(lat, lon, signal),
      fetchWttrWeather(lat, lon, signal),
    ]);
  } catch {
    if (signal?.aborted) throw new Error('ABORTED');
    throw new Error('날씨를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
  }
}
