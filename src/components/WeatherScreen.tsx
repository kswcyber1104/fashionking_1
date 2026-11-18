import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
} from 'lucide-react';
import { CITIES, CityId, SEOUL_DISTRICTS, SubRegion } from '../data/locations';
import { fetchWeather, WeatherData } from '../services/weather';
import { BrandMark } from './StyleIllustrations';

interface WeatherScreenProps {
  onBack: () => void;
  onRecommend: (weather: WeatherData, locationLabel: string) => void;
}

interface ActiveLocation {
  label: string;
  lat: number;
  lon: number;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({ onBack, onRecommend }) => {
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'success' | 'failed'>('idle');
  const [selectedCityId, setSelectedCityId] = useState<CityId | null>(null);
  const [selectedSubRegionId, setSelectedSubRegionId] = useState<string | null>(null);

  // Seoul-specific filters (dong search & gu filter)
  const [seoulGuFilter, setSeoulGuFilter] = useState<string>('전체');
  const [seoulSearch, setSeoulSearch] = useState<string>('');

  const [activeLocation, setActiveLocation] = useState<ActiveLocation | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const manualPickRef = useRef<boolean>(false);

  const requestGeolocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('failed');
      return;
    }

    manualPickRef.current = false;
    setGeoStatus('locating');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // If user already picked a region manually while GPS was pending, respect manual pick
        if (manualPickRef.current) return;
        const { latitude, longitude } = position.coords;
        setGeoStatus('success');
        setSelectedCityId(null);
        setSelectedSubRegionId(null);
        setActiveLocation({
          label: '현재 위치',
          lat: latitude,
          lon: longitude,
        });
      },
      () => {
        if (manualPickRef.current) return;
        setGeoStatus('failed');
      },
      {
        enableHighAccuracy: false,
        timeout: 6000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    requestGeolocation();
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Fetch weather whenever activeLocation changes
  useEffect(() => {
    if (!activeLocation) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoadingWeather(true);
    setWeatherError(null);

    fetchWeather(activeLocation.lat, activeLocation.lon, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setWeather(data);
          setIsLoadingWeather(false);
        }
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error && err.message
            ? err.message
            : '날씨를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';
        setWeatherError(message);
        setWeather(null);
        setIsLoadingWeather(false);
      });

    return () => {
      controller.abort();
    };
  }, [activeLocation]);

  const selectedCity = useMemo(
    () => CITIES.find((c) => c.id === selectedCityId) ?? null,
    [selectedCityId],
  );

  const filteredSubRegions = useMemo(() => {
    if (!selectedCity) return [];
    if (selectedCity.id !== 'seoul') return selectedCity.subRegions;

    const query = seoulSearch.trim();
    return selectedCity.subRegions.filter((sub) => {
      const matchesGu = seoulGuFilter === '전체' || sub.gu === seoulGuFilter;
      const matchesSearch =
        query === '' ||
        sub.name.includes(query) ||
        (sub.gu ? sub.gu.includes(query) : false);
      return matchesGu && matchesSearch;
    });
  }, [selectedCity, seoulGuFilter, seoulSearch]);

  const handleSelectCity = (cityId: CityId) => {
    manualPickRef.current = true;
    setSelectedCityId(cityId);
    setSelectedSubRegionId(null);
    setSeoulGuFilter('전체');
    setSeoulSearch('');
  };

  const handleSelectSubRegion = (sub: SubRegion) => {
    if (!selectedCity) return;
    manualPickRef.current = true;
    setSelectedSubRegionId(sub.id);
    setActiveLocation({
      label: `${selectedCity.name} ${sub.name}`,
      lat: sub.lat,
      lon: sub.lon,
    });
  };

  const handleRetryWeather = () => {
    if (!activeLocation) return;
    setActiveLocation({ ...activeLocation });
  };

  const handleRecommendClick = () => {
    if (!weather || !activeLocation || isLoadingWeather) return;
    onRecommend(weather, activeLocation.label);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FC] via-[#F4FAFF] to-[#FFFFFF] text-[#0F2942]">
      {/* Top App Bar */}
      <header className="border-b border-sky-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 shrink-0" />
            <span className="text-[22px] font-extrabold tracking-tight text-[#0C4A6E] whitespace-nowrap">
              패션왕 1번째
            </span>
          </div>
          <span className="text-[15px] font-semibold text-sky-700 whitespace-nowrap">
            2단계 · 오늘 날씨
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-7 pb-14 sm:px-8 sm:pt-10 sm:pb-20">
        {/* Screen Heading */}
        <div className="mb-7 sm:mb-9">
          <p className="mb-1.5 text-[15px] font-bold tracking-wide text-sky-700">
            두 번째 화면
          </p>
          <h1 className="text-[32px] leading-tight font-extrabold tracking-tight text-[#0F2942] sm:text-[38px]">
            오늘 날씨
          </h1>
          <p className="mt-2.5 text-[18px] leading-relaxed text-slate-600 sm:text-[19px]">
            지금 계신 곳의 날씨를 확인해 볼게요.
          </p>
        </div>

        <div className="space-y-7 sm:space-y-9">
          {/* Weather Result Card (Shown when locating, loading, error, or weather ready) */}
          {(activeLocation || isLoadingWeather || weatherError) && (
            <section
              aria-live="polite"
              aria-label="날씨 정보"
              className="rounded-3xl border-[3px] border-sky-500 bg-gradient-to-br from-[#FFFFFF] via-[#F4FAFF] to-[#E0F2FE] p-6 shadow-md shadow-sky-900/10 sm:p-8"
            >
              {isLoadingWeather ? (
                <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                  <Loader2
                    className="h-10 w-10 animate-spin text-sky-600"
                    aria-hidden="true"
                  />
                  <p className="text-[22px] font-extrabold text-[#0C4A6E] sm:text-[24px]">
                    날씨를 확인하는 중…
                  </p>
                  {activeLocation && (
                    <p className="text-[16px] font-semibold text-slate-600">
                      {activeLocation.label}
                    </p>
                  )}
                </div>
              ) : weatherError ? (
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="mt-1 h-7 w-7 shrink-0 text-amber-600"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[20px] font-bold text-[#0F2942]">
                        {weatherError}
                      </p>
                      <p className="mt-1 text-[16px] text-slate-600">
                        인터넷 연결을 확인하거나 다시 눌러 주세요.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRetryWeather}
                    className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-[17px] font-bold text-white hover:bg-sky-700 whitespace-nowrap"
                  >
                    <RefreshCw className="h-5 w-5" aria-hidden="true" />
                    <span>다시 확인하기</span>
                  </button>
                </div>
              ) : weather && activeLocation ? (
                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2 text-[17px] font-bold text-sky-800 sm:text-[18px]">
                      <MapPin className="h-5 w-5 shrink-0 text-sky-600" aria-hidden="true" />
                      <span>{activeLocation.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRetryWeather}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-[15px] font-bold text-sky-700 hover:bg-sky-100 whitespace-nowrap"
                    >
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      <span>새로고침</span>
                    </button>
                  </div>

                  {/* Primary Large Weather Readout */}
                  <div className="space-y-2.5">
                    <p className="text-[26px] leading-snug font-extrabold tracking-tight text-[#0F2942] tabular-nums sm:text-[32px]">
                      <span aria-hidden="true" className="mr-1.5">
                        {weather.conditionEmoji}
                      </span>
                      지금 {weather.currentTemp}℃ (체감 {weather.apparentTemp}℃) ·{' '}
                      <span className="text-[#0369A1]">{weather.conditionLabel}</span>
                    </p>
                    <p className="text-[20px] leading-relaxed font-bold text-slate-700 tabular-nums sm:text-[23px]">
                      오늘 최저 {weather.minTemp}℃ · 최고 {weather.maxTemp}℃ · 비 올 확률{' '}
                      <span className="text-[#0369A1]">{weather.rainProbability}%</span>
                    </p>
                  </div>
                </div>
              ) : null}
            </section>
          )}

          {/* Location Selection Card */}
          <section
            aria-labelledby="heading-location"
            className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-sm shadow-sky-900/5 sm:p-7"
          >
            {/* Status / Prompt Banner */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                {geoStatus === 'failed' ? (
                  <AlertCircle
                    className="mt-1 h-6 w-6 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                ) : (
                  <MapPin
                    className="mt-1 h-6 w-6 shrink-0 text-sky-600"
                    aria-hidden="true"
                  />
                )}
                <div>
                  <h2
                    id="heading-location"
                    className="text-[21px] leading-snug font-extrabold text-[#0F2942] sm:text-[23px]"
                  >
                    {geoStatus === 'failed'
                      ? '위치를 찾지 못했어요. 지역을 골라 주세요'
                      : '지역을 골라 주세요'}
                  </h2>
                  {geoStatus === 'locating' && (
                    <p className="mt-1 text-[15px] font-semibold text-sky-700">
                      현재 위치를 확인하는 동안 아래에서 지역을 바로 고르셔도 돼요.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={requestGeolocation}
                disabled={geoStatus === 'locating'}
                className="inline-flex min-h-[46px] shrink-0 items-center justify-center gap-2 self-start rounded-xl border-2 border-sky-200 bg-sky-50 px-4 py-2 text-[16px] font-bold text-sky-800 transition-colors hover:border-sky-400 hover:bg-sky-100 disabled:opacity-60 whitespace-nowrap sm:self-auto"
              >
                {geoStatus === 'locating' ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                )}
                <span>
                  {geoStatus === 'locating'
                    ? '위치 찾는 중…'
                    : geoStatus === 'failed'
                      ? '위치 다시 찾기'
                      : '내 위치로 찾기'}
                </span>
              </button>
            </div>

            {/* 8 Cities Grid */}
            <div
              role="group"
              aria-label="시·도 선택"
              className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5"
            >
              {CITIES.map((city) => {
                const isSelected = selectedCityId === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleSelectCity(city.id)}
                    className={`flex min-h-[58px] items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[19px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] sm:min-h-[62px] sm:text-[20px] ${
                      isSelected
                        ? 'border-[3px] border-sky-600 bg-sky-50 text-[#0369A1] shadow-sm'
                        : 'border-2 border-sky-100 bg-[#F8FCFF] text-[#1E3A5F] hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className="h-5 w-5 shrink-0 stroke-[3] text-sky-600"
                        aria-hidden="true"
                      />
                    )}
                    <span className="whitespace-nowrap">{city.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Region Picker (동 단위 for 서울, 구·군/시 단위 for others) */}
            {selectedCity && (
              <div className="mt-6 border-t border-sky-100 pt-6">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-[19px] font-extrabold text-[#0F2942] sm:text-[21px]">
                    {selectedCity.name} ·{' '}
                    {selectedCity.id === 'seoul'
                      ? '어느 동인가요?'
                      : `${selectedCity.subLabel}`}
                  </h3>
                  <span className="text-[15px] font-semibold text-sky-700">
                    {selectedCity.id === 'seoul'
                      ? '동을 누르면 바로 날씨를 알려드려요'
                      : '지역을 누르면 바로 날씨를 알려드려요'}
                  </span>
                </div>

                {/* Seoul Gu Filter & Search */}
                {selectedCity.id === 'seoul' && (
                  <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="seoul-gu-select" className="sr-only">
                        구 선택
                      </label>
                      <select
                        id="seoul-gu-select"
                        value={seoulGuFilter}
                        onChange={(e) => setSeoulGuFilter(e.target.value)}
                        className="min-h-[52px] w-full rounded-xl border-2 border-sky-200 bg-[#F8FCFF] px-4 text-[17px] font-bold text-[#0F2942] focus:border-sky-600 focus:outline-none"
                      >
                        {SEOUL_DISTRICTS.map((gu) => (
                          <option key={gu} value={gu}>
                            {gu === '전체' ? '서울 전체 구 보기' : gu}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <label htmlFor="seoul-dong-search" className="sr-only">
                        동 이름 검색
                      </label>
                      <Search
                        className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        id="seoul-dong-search"
                        type="text"
                        value={seoulSearch}
                        onChange={(e) => setSeoulSearch(e.target.value)}
                        placeholder="동 이름 찾기 (예: 잠실동, 명동)"
                        className="min-h-[52px] w-full rounded-xl border-2 border-sky-200 bg-[#F8FCFF] pr-4 pl-11 text-[17px] font-medium text-[#0F2942] placeholder:text-slate-400 focus:border-sky-600 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {filteredSubRegions.length === 0 ? (
                  <p className="rounded-2xl bg-sky-50/70 px-4 py-6 text-center text-[17px] font-semibold text-slate-600">
                    찾으시는 동 이름이 없어요. 구를 선택하거나 다른 동 이름으로 검색해 보세요.
                  </p>
                ) : (
                  <div
                    role="group"
                    aria-label={`${selectedCity.name} 세부 지역 선택`}
                    className={`grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 ${
                      selectedCity.id === 'seoul'
                        ? 'max-h-[320px] overflow-y-auto pr-1'
                        : ''
                    }`}
                  >
                    {filteredSubRegions.map((sub) => {
                      const isSubSelected = selectedSubRegionId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          aria-pressed={isSubSelected}
                          onClick={() => handleSelectSubRegion(sub)}
                          className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl px-3 py-2.5 text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] ${
                            isSubSelected
                              ? 'border-[3px] border-sky-600 bg-sky-50 text-[#0369A1] shadow-sm'
                              : 'border-2 border-sky-100 bg-white text-[#1E3A5F] hover:border-sky-300 hover:bg-sky-50/50'
                          }`}
                        >
                          <span className="text-[18px] font-bold whitespace-nowrap">
                            {sub.name}
                          </span>
                          {sub.gu && (
                            <span className="mt-0.5 text-[13px] font-medium text-slate-500 whitespace-nowrap">
                              {sub.gu}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Bottom Navigation Buttons: '이전' & '🤖 옷차림 추천받기' */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-[62px] items-center justify-center gap-2 rounded-2xl border-2 border-sky-200 bg-white px-6 py-4 text-[20px] font-extrabold text-[#1E3A5F] transition-colors hover:border-sky-400 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.99] sm:w-44 shrink-0"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
              <span>이전</span>
            </button>

            <button
              type="button"
              disabled={!weather || isLoadingWeather}
              onClick={handleRecommendClick}
              className={`flex min-h-[62px] flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[20px] font-extrabold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:text-[21px] ${
                weather && !isLoadingWeather
                  ? 'cursor-pointer bg-sky-600 text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 active:scale-[0.99]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              }`}
            >
              <span className="whitespace-nowrap">🤖 옷차림 추천받기</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
