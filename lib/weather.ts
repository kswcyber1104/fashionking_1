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

interface WttrResponse {
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
      weatherCode?: string;
    }>;
  }>;
}

interface MetNoResponse {
  properties?: {
    timeseries?: Array<{
      time?: string;
      data?: {
        instant?: {
          details?: {
            air_temperature?: number;
            relative_humidity?: number;
            wind_speed?: number;
          };
        };
        next_1_hours?: {
          summary?: { symbol_code?: string };
          details?: { precipitation_amount?: number };
        };
        next_6_hours?: {
          summary?: { symbol_code?: string };
          details?: { precipitation_amount?: number };
        };
      };
    }>;
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

function mapWttrCode(codeStr?: string): { label: string; emoji: string } {
  const code = Number(codeStr);
  if (code === 113) return { label: '맑음', emoji: '☀️' };
  if (code === 116) return { label: '구름 조금', emoji: '⛅' };
  if (code === 119 || code === 122) return { label: '흐림', emoji: '☁️' };
  if (code === 143 || code === 248 || code === 260) return { label: '안개', emoji: '🌫️' };
  if ([176, 263, 266, 281, 284, 293, 296, 353].includes(code)) {
    return { label: '이슬비', emoji: '🌦️' };
  }
  if ([299, 302, 305, 308, 311, 314, 356, 359].includes(code)) {
    return { label: '비', emoji: '🌧️' };
  }
  if ([179, 182, 185, 317, 320, 362, 365].includes(code)) {
    return { label: '진눈깨비', emoji: '🌨️' };
  }
  if ([227, 230, 323, 326, 329, 332, 335, 338, 368, 371, 374, 377].includes(code)) {
    return { label: '눈', emoji: '❄️' };
  }
  if ([200, 386, 389, 392, 395].includes(code)) {
    return { label: '천둥번개', emoji: '⛈️' };
  }
  return { label: '구름 조금', emoji: '⛅' };
}

function mapMetNoSymbol(symbol?: string): { label: string; emoji: string } {
  const s = (symbol ?? '').toLowerCase();
  if (s.includes('thunder')) return { label: '천둥번개', emoji: '⛈️' };
  if (s.includes('sleet')) return { label: '진눈깨비', emoji: '🌨️' };
  if (s.includes('snow')) return { label: '눈', emoji: '❄️' };
  if (s.includes('heavyrain')) return { label: '비', emoji: '🌧️' };
  if (s.includes('lightrain') || s.includes('rainshowers')) {
    return { label: '이슬비', emoji: '🌦️' };
  }
  if (s.includes('rain')) return { label: '비', emoji: '🌧️' };
  if (s.includes('fog')) return { label: '안개', emoji: '🌫️' };
  if (s.includes('cloudy')) return { label: '흐림', emoji: '☁️' };
  if (s.includes('partlycloudy')) return { label: '구름 조금', emoji: '⛅' };
  if (s.includes('fair')) return { label: '대체로 맑음', emoji: '🌤️' };
  if (s.includes('clearsky')) return { label: '맑음', emoji: '☀️' };
  return { label: '맑음', emoji: '☀️' };
}

async function fetchJsonWithTimeout<T>(
  url: string,
  timeoutMs: number,
  headers?: Record<string, string>,
  externalSignal?: AbortSignal,
): Promise<T> {
  const controller = new AbortController();
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener('abort', onExternalAbort);
  }
}

async function fetchOpenMeteo(
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
    6000,
    undefined,
    signal,
  );

  if (
    !data.current ||
    typeof data.current.temperature_2m !== 'number' ||
    typeof data.current.apparent_temperature !== 'number'
  ) {
    throw new Error('Open-Meteo payload invalid');
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

async function fetchWttr(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = `https://wttr.in/${lat.toFixed(4)},${lon.toFixed(4)}?format=j1`;
  const data = await fetchJsonWithTimeout<WttrResponse>(url, 6000, undefined, signal);

  const current = data.current_condition?.[0];
  const today = data.weather?.[0];
  if (!current || typeof current.temp_C === 'undefined') {
    throw new Error('wttr payload invalid');
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

  const { label, emoji } = mapWttrCode(current.weatherCode);

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

async function fetchMetNo(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<WeatherData> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  const data = await fetchJsonWithTimeout<MetNoResponse>(
    url,
    6000,
    {
      'User-Agent': 'FashionKingApp/1.0 (https://vercel.com)',
    },
    signal,
  );

  const series = data.properties?.timeseries;
  if (!series || series.length === 0) {
    throw new Error('MET payload invalid');
  }

  const first = series[0];
  const instant = first.data?.instant?.details;
  if (typeof instant?.air_temperature !== 'number') {
    throw new Error('MET temperature missing');
  }

  const temp = instant.air_temperature;
  const windMs = instant.wind_speed ?? 0;
  const humidity = instant.relative_humidity ?? 50;
  const vaporPressure =
    (humidity / 100) * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp));
  const apparent = temp + 0.33 * vaporPressure - 0.7 * windMs - 4.0;

  const kstDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const todayStr = kstDateFormatter.format(new Date());

  const todayTemps: number[] = [];
  for (const entry of series.slice(0, 30)) {
    if (!entry.time) continue;
    const entryTemp = entry.data?.instant?.details?.air_temperature;
    if (typeof entryTemp !== 'number') continue;
    if (kstDateFormatter.format(new Date(entry.time)) === todayStr) {
      todayTemps.push(entryTemp);
    }
  }

  const minTemp =
    todayTemps.length > 0 ? Math.round(Math.min(...todayTemps)) : Math.round(temp);
  const maxTemp =
    todayTemps.length > 0 ? Math.round(Math.max(...todayTemps)) : Math.round(temp);

  const symbolCode =
    first.data?.next_1_hours?.summary?.symbol_code ??
    first.data?.next_6_hours?.summary?.symbol_code;
  const precipMm =
    first.data?.next_1_hours?.details?.precipitation_amount ??
    first.data?.next_6_hours?.details?.precipitation_amount ??
    0;
  const { label, emoji } = mapMetNoSymbol(symbolCode);

  let rainProb = 10;
  if (precipMm >= 1) rainProb = 80;
  else if (precipMm > 0) rainProb = 60;
  else if (label === '맑음' || label === '대체로 맑음') rainProb = 10;
  else if (label === '흐림') rainProb = 30;
  else rainProb = 20;

  return {
    currentTemp: Math.round(temp),
    apparentTemp: Math.round(apparent),
    minTemp,
    maxTemp,
    rainProbability: rainProb,
    conditionLabel: label,
    conditionEmoji: emoji,
  };
}

const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000;
const weatherCache = new Map<string, { data: WeatherData; expiresAt: number }>();

export async function fetchServerWeather(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const controller = new AbortController();
  try {
    const data = await Promise.any([
      fetchOpenMeteo(lat, lon, controller.signal),
      fetchWttr(lat, lon, controller.signal),
      fetchMetNo(lat, lon, controller.signal),
    ]);
    weatherCache.set(cacheKey, {
      data,
      expiresAt: Date.now() + WEATHER_CACHE_TTL_MS,
    });
    return data;
  } finally {
    controller.abort();
  }
}
