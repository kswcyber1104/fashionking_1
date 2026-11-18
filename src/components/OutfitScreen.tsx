import React from 'react';
import { AlertCircle, Home, Loader2, RefreshCw } from 'lucide-react';
import { AgeGroup, GenderOption, StyleOption } from '../types/profile';
import { WeatherData } from '../services/weather';
import { BrandMark, StyleIllustration } from './StyleIllustrations';

export interface OutfitRecommendation {
  outerwear: string;
  top: string;
  bottom: string;
  shoes: string;
  accessories: string;
  reason: string;
}

interface OutfitScreenProps {
  ageGroup: AgeGroup;
  gender: GenderOption;
  styleOption: StyleOption;
  weather: WeatherData;
  locationLabel: string;
  recommendation: OutfitRecommendation | null;
  isLoading: boolean;
  errorMessage: string | null;
  onRetryRecommend: () => void;
  onGoHome: () => void;
}

export const OutfitScreen: React.FC<OutfitScreenProps> = ({
  ageGroup,
  gender,
  styleOption,
  weather,
  locationLabel,
  recommendation,
  isLoading,
  errorMessage,
  onRetryRecommend,
  onGoHome,
}) => {
  const outfitRows = recommendation
    ? [
        { emoji: '🧥', label: '겉옷', value: recommendation.outerwear },
        { emoji: '👕', label: '상의', value: recommendation.top },
        { emoji: '👖', label: '하의', value: recommendation.bottom },
        { emoji: '👟', label: '신발', value: recommendation.shoes },
        { emoji: '👜', label: '소품', value: recommendation.accessories },
      ]
    : [];

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
            3단계 · 오늘의 옷차림
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6 pb-14 sm:px-8 sm:pt-9 sm:pb-20">
        {/* Top 1-Line Weather Summary */}
        <section
          aria-label="오늘 날씨 요약"
          className="mb-6 rounded-2xl border-2 border-sky-300 bg-white px-5 py-4 shadow-sm shadow-sky-900/5 sm:mb-8 sm:px-6"
        >
          <p className="text-[17px] leading-relaxed font-extrabold text-[#0F2942] tabular-nums sm:text-[19px]">
            <span className="mr-1.5 text-sky-700">{locationLabel}</span>
            <span aria-hidden="true" className="mx-1 text-slate-300">
              |
            </span>
            <span aria-hidden="true" className="mr-1">
              {weather.conditionEmoji}
            </span>
            지금 {weather.currentTemp}℃ (체감 {weather.apparentTemp}℃) · {weather.conditionLabel} / 오늘 최저{' '}
            {weather.minTemp}℃ · 최고 {weather.maxTemp}℃ · 비 올 확률 {weather.rainProbability}%
          </p>
        </section>

        {/* Screen Heading */}
        <div className="mb-6 sm:mb-8">
          <p className="mb-1.5 text-[15px] font-bold tracking-wide text-sky-700">
            세 번째 화면
          </p>
          <h1 className="text-[32px] leading-tight font-extrabold tracking-tight text-[#0F2942] sm:text-[38px]">
            오늘의 옷차림
          </h1>
        </div>

        {/* Main Content: Loading / Error / Single Recommendation Card */}
        {isLoading ? (
          <section
            aria-live="polite"
            className="flex flex-col items-center justify-center gap-4 rounded-3xl border-[3px] border-sky-400 bg-white px-6 py-14 text-center shadow-md shadow-sky-900/10 sm:py-16"
          >
            <Loader2 className="h-12 w-12 animate-spin text-sky-600" aria-hidden="true" />
            <p className="text-[23px] font-extrabold text-[#0C4A6E] sm:text-[26px]">
              AI가 옷을 고르는 중이에요…
            </p>
            <p className="text-[17px] font-medium text-slate-600">
              {ageGroup} · {gender} · {styleOption.name} 스타일에 꼭 맞게 준비하고 있어요.
            </p>
          </section>
        ) : errorMessage ? (
          <section
            aria-live="polite"
            className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-amber-300 bg-amber-50 px-6 py-12 text-center"
          >
            <AlertCircle className="h-11 w-11 text-amber-600" aria-hidden="true" />
            <p className="text-[21px] leading-snug font-extrabold text-amber-950 sm:text-[23px]">
              {errorMessage}
            </p>
          </section>
        ) : recommendation ? (
          <section
            aria-label="추천 옷차림"
            className="rounded-3xl border-[3px] border-sky-500 bg-white p-5 shadow-md shadow-sky-900/10 sm:p-8"
          >
            {/* Card Header: Chosen Style Illustration + Name */}
            <div className="flex items-center gap-4 border-b border-sky-100 pb-5 sm:gap-5 sm:pb-6">
              <div className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <StyleIllustration styleId={styleOption.id} selected />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-sky-700 sm:text-[16px]">
                  {ageGroup} · {gender}
                </p>
                <h2 className="mt-0.5 text-[24px] leading-snug font-extrabold text-[#0F2942] sm:text-[28px]">
                  {styleOption.name}
                </h2>
                <p className="mt-1 text-[16px] font-medium text-slate-600">
                  {styleOption.description}
                </p>
              </div>
            </div>

            {/* Outfit Items: 겉옷, 상의, 하의, 신발, 소품 */}
            <ul className="divide-y divide-sky-100 py-2">
              {outfitRows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-start gap-3.5 py-4 sm:items-center sm:gap-4 sm:py-4.5"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-[24px]"
                  >
                    {row.emoji}
                  </span>
                  <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-4">
                    <span className="block text-[17px] font-extrabold text-[#0369A1] sm:w-20 sm:shrink-0 sm:text-[19px]">
                      {row.label}
                    </span>
                    <span className="mt-0.5 block text-[19px] leading-snug font-bold text-[#0F2942] sm:mt-0 sm:text-[20px]">
                      {row.value}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Bottom of Card: 💡 추천 이유 */}
            <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50/90 px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-[17px] font-extrabold text-[#0369A1] sm:text-[18px]">
                💡 추천 이유
              </p>
              <p className="mt-1.5 text-[18px] leading-relaxed font-semibold text-[#0F2942] sm:text-[20px]">
                {recommendation.reason}
              </p>
            </div>
          </section>
        ) : null}

        {/* Bottom Buttons: '다시 추천받기' & '처음으로' */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onRetryRecommend}
            className={`flex min-h-[62px] flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[20px] font-extrabold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:text-[21px] ${
              isLoading
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'cursor-pointer bg-sky-600 text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 active:scale-[0.99]'
            }`}
          >
            <RefreshCw className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
            <span className="whitespace-nowrap">다시 추천받기</span>
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onGoHome}
            className={`flex min-h-[62px] items-center justify-center gap-2 rounded-2xl border-2 px-6 py-4 text-[20px] font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:w-48 shrink-0 ${
              isLoading
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                : 'cursor-pointer border-sky-200 bg-white text-[#1E3A5F] hover:border-sky-400 hover:bg-sky-50 active:scale-[0.99]'
            }`}
          >
            <Home className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
            <span className="whitespace-nowrap">처음으로</span>
          </button>
        </div>
      </main>
    </div>
  );
};
