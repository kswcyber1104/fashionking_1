import React, { useState } from 'react';
import { AlertCircle, Check, CheckCircle2, ChevronRight } from 'lucide-react';
import {
  AGE_GROUPS,
  AgeGroup,
  GENDER_OPTIONS,
  GenderOption,
  STYLE_OPTIONS,
  StyleId,
} from './types/profile';
import { BrandMark, StyleIllustration } from './components/StyleIllustrations';
import { WeatherScreen } from './components/WeatherScreen';
import { OutfitRecommendation, OutfitScreen } from './components/OutfitScreen';
import { fetchOutfitRecommendation } from './services/recommend';
import { WeatherData } from './services/weather';

interface MissingField {
  label: string;
  particle: '을' | '를';
  sectionId: string;
}

export default function App() {
  const [step, setStep] = useState<'profile' | 'weather' | 'outfit'>('profile');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleId | null>(null);

  const [weatherInfo, setWeatherInfo] = useState<{
    data: WeatherData;
    locationLabel: string;
  } | null>(null);
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState<string | null>(null);

  const missingFields: MissingField[] = [];
  if (!selectedAge) {
    missingFields.push({ label: '연령대', particle: '를', sectionId: 'section-age' });
  }
  if (!selectedGender) {
    missingFields.push({ label: '성별', particle: '을', sectionId: 'section-gender' });
  }
  if (!selectedStyle) {
    missingFields.push({
      label: '선호하는 옷 스타일',
      particle: '을',
      sectionId: 'section-style',
    });
  }

  const isComplete = missingFields.length === 0;
  const firstMissing = missingFields[0] ?? null;
  const selectedStyleObj = STYLE_OPTIONS.find((item) => item.id === selectedStyle) ?? null;

  const handleJumpToMissing = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;
    setStep('weather');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProfile = () => {
    setStep('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const requestRecommendationOnce = async (weatherData: WeatherData) => {
    if (isRecommending || !selectedAge || !selectedGender || !selectedStyleObj) return;

    setIsRecommending(true);
    setRecommendError(null);
    setRecommendation(null);

    try {
      const result = await fetchOutfitRecommendation({
        ageGroup: selectedAge,
        gender: selectedGender,
        styleName: selectedStyleObj.name,
        styleDescription: selectedStyleObj.description,
        currentTemp: weatherData.currentTemp,
        apparentTemp: weatherData.apparentTemp,
        conditionLabel: weatherData.conditionLabel,
        minTemp: weatherData.minTemp,
        maxTemp: weatherData.maxTemp,
        rainProbability: weatherData.rainProbability,
      });
      setRecommendation(result);
    } catch {
      setRecommendError('지금은 추천할 수 없어요. 잠시 후 다시 눌러 주세요');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleStartRecommend = (weatherData: WeatherData, locationLabel: string) => {
    setWeatherInfo({ data: weatherData, locationLabel });
    setStep('outfit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    void requestRecommendationOnce(weatherData);
  };

  const handleRetryRecommend = () => {
    if (!weatherInfo || isRecommending) return;
    void requestRecommendationOnce(weatherInfo.data);
  };

  const handleGoHome = () => {
    if (isRecommending) return;
    setStep('profile');
    setSelectedAge(null);
    setSelectedGender(null);
    setSelectedStyle(null);
    setWeatherInfo(null);
    setRecommendation(null);
    setRecommendError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = 3 - missingFields.length;

  if (step === 'weather') {
    return (
      <WeatherScreen onBack={handleBackToProfile} onRecommend={handleStartRecommend} />
    );
  }

  if (step === 'outfit' && selectedAge && selectedGender && selectedStyleObj && weatherInfo) {
    return (
      <OutfitScreen
        ageGroup={selectedAge}
        gender={selectedGender}
        styleOption={selectedStyleObj}
        weather={weatherInfo.data}
        locationLabel={weatherInfo.locationLabel}
        recommendation={recommendation}
        isLoading={isRecommending}
        errorMessage={recommendError}
        onRetryRecommend={handleRetryRecommend}
        onGoHome={handleGoHome}
      />
    );
  }

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
          <span className="text-[15px] font-semibold text-sky-700 whitespace-nowrap tabular-nums">
            {completedCount} / 3 선택됨
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-7 pb-14 sm:px-8 sm:pt-10 sm:pb-20">
        {/* Page Title Intro */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-1.5 text-[15px] font-bold tracking-wide text-sky-700">
            첫 화면 · 맞춤 설정
          </p>
          <h1 className="text-[32px] leading-tight font-extrabold tracking-tight text-[#0F2942] sm:text-[38px]">
            나에 대해
          </h1>
          <p className="mt-2.5 text-[18px] leading-relaxed text-slate-600 sm:text-[19px]">
            꼭 맞는 옷차림을 알려드리기 위해 몇 가지만 먼저 여쭤볼게요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-9 sm:space-y-11" noValidate>
          {/* Section 1: 연령대 */}
          <section
            id="section-age"
            aria-labelledby="heading-age"
            className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-sm shadow-sky-900/5 sm:p-7"
          >
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2
                id="heading-age"
                className="text-[22px] font-bold tracking-tight text-[#0F2942] sm:text-[24px]"
              >
                1. 연령대
              </h2>
              <span className="text-[15px] font-semibold text-sky-700 whitespace-nowrap">
                하나만 골라 주세요
              </span>
            </div>

            <div
              role="group"
              aria-labelledby="heading-age"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5"
            >
              {AGE_GROUPS.map((age) => {
                const isSelected = selectedAge === age;
                return (
                  <button
                    key={age}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedAge(age);
                    }}
                    className={`flex min-h-[60px] items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[19px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] sm:min-h-[64px] sm:text-[20px] ${
                      isSelected
                        ? 'border-[3px] border-sky-600 bg-sky-50 text-[#0369A1] shadow-sm'
                        : 'border-2 border-sky-100 bg-[#F8FCFF] text-[#1E3A5F] hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-5 w-5 shrink-0 stroke-[3] text-sky-600" aria-hidden="true" />
                    )}
                    <span className="whitespace-nowrap">{age}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: 성별 */}
          <section
            id="section-gender"
            aria-labelledby="heading-gender"
            className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-sm shadow-sky-900/5 sm:p-7"
          >
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2
                id="heading-gender"
                className="text-[22px] font-bold tracking-tight text-[#0F2942] sm:text-[24px]"
              >
                2. 성별
              </h2>
              <span className="text-[15px] font-semibold text-sky-700 whitespace-nowrap">
                하나만 골라 주세요
              </span>
            </div>

            <div
              role="group"
              aria-labelledby="heading-gender"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5"
            >
              {GENDER_OPTIONS.map((gender, index) => {
                const isSelected = selectedGender === gender;
                const isWideOnMobile = index === 2;
                return (
                  <button
                    key={gender}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedGender(gender);
                    }}
                    className={`flex min-h-[60px] items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[19px] font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:scale-[0.98] sm:min-h-[64px] sm:text-[20px] ${
                      isWideOnMobile ? 'col-span-2 sm:col-span-1' : ''
                    } ${
                      isSelected
                        ? 'border-[3px] border-sky-600 bg-sky-50 text-[#0369A1] shadow-sm'
                        : 'border-2 border-sky-100 bg-[#F8FCFF] text-[#1E3A5F] hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    {isSelected && (
                      <Check className="h-5 w-5 shrink-0 stroke-[3] text-sky-600" aria-hidden="true" />
                    )}
                    <span className="whitespace-nowrap">{gender}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: 선호하는 옷 스타일 */}
          <section
            id="section-style"
            aria-labelledby="heading-style"
            className="rounded-3xl border border-sky-200/90 bg-white p-5 shadow-sm shadow-sky-900/5 sm:p-7"
          >
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <h2
                id="heading-style"
                className="text-[22px] font-bold tracking-tight text-[#0F2942] sm:text-[24px]"
              >
                3. 선호하는 옷 스타일
              </h2>
              <span className="text-[15px] font-semibold text-sky-700 whitespace-nowrap">
                하나만 골라 주세요
              </span>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="heading-style"
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {STYLE_OPTIONS.map((style) => {
                const isSelected = selectedStyle === style.id;
                const inputId = `style-radio-${style.id}`;
                return (
                  <label
                    key={style.id}
                    htmlFor={inputId}
                    className={`group flex cursor-pointer items-center gap-4 rounded-2xl p-4 transition-all duration-150 select-none focus-within:ring-4 focus-within:ring-sky-300 active:scale-[0.99] sm:gap-5 sm:p-5 ${
                      isSelected
                        ? 'border-[3.5px] border-sky-600 bg-sky-50/90 shadow-md shadow-sky-600/15'
                        : 'border-2 border-sky-100 bg-[#F9FCFF] hover:border-sky-300 hover:bg-sky-50/40'
                    }`}
                  >
                    {/* Custom SVG Illustration */}
                    <div className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                      <StyleIllustration styleId={style.id} selected={isSelected} />
                    </div>

                    {/* Text Content */}
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-[20px] leading-snug font-extrabold sm:text-[21px] ${
                          isSelected ? 'text-[#0369A1]' : 'text-[#0F2942]'
                        }`}
                      >
                        {style.name}
                      </div>
                      <p className="mt-1.5 text-[16px] leading-snug font-medium text-slate-600 sm:text-[17px]">
                        {style.description}
                      </p>
                    </div>

                    {/* Radio Button */}
                    <div className="flex shrink-0 items-center justify-center pl-1">
                      <input
                        id={inputId}
                        type="radio"
                        name="preferredStyle"
                        value={style.id}
                        checked={isSelected}
                        onChange={() => {
                          setSelectedStyle(style.id);
                        }}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                          isSelected
                            ? 'border-[3px] border-sky-600 bg-white'
                            : 'border-2 border-slate-300 bg-white group-hover:border-sky-400'
                        }`}
                      >
                        {isSelected && <span className="h-3.5 w-3.5 rounded-full bg-sky-600" />}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Validation Guidance & Next Button */}
          <div className="space-y-4 pt-1">
            {firstMissing ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-amber-950"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" aria-hidden="true" />
                  <p className="text-[18px] font-bold sm:text-[19px]">
                    {firstMissing.label}
                    {firstMissing.particle} 골라 주세요
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJumpToMissing(firstMissing.sectionId)}
                  className="text-[16px] font-bold text-amber-800 underline underline-offset-4 hover:text-amber-950 whitespace-nowrap"
                >
                  바로 이동
                </button>
              </div>
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 rounded-2xl border-2 border-sky-300 bg-sky-50 px-5 py-4 text-[#0369A1]"
              >
                <CheckCircle2 className="h-6 w-6 shrink-0 text-sky-600" aria-hidden="true" />
                <p className="text-[18px] font-bold sm:text-[19px]">
                  모두 고르셨어요! 아래 &lsquo;다음&rsquo; 버튼을 눌러 주세요.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isComplete}
              className={`flex min-h-[64px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[21px] font-extrabold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 sm:text-[22px] ${
                isComplete
                  ? 'cursor-pointer bg-sky-600 text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700 active:scale-[0.99]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              }`}
            >
              <span>다음</span>
              <ChevronRight className="h-6 w-6 stroke-[2.5]" aria-hidden="true" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
