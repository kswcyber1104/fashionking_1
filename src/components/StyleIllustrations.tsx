import React from 'react';
import { StyleId } from '../types/profile';

export const BrandMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="40" height="40" rx="12" fill="#0284C7" />
    {/* Crown motif */}
    <path
      d="M11 16.5L14.5 10.5L20 14.5L25.5 10.5L29 16.5H11Z"
      fill="#FDE047"
      stroke="#FEF9C3"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    {/* Hanger hook & shoulders */}
    <path
      d="M20 19.5V21.5M20 21.5L9.5 27.5C8.9 27.85 9.15 28.75 9.85 28.75H30.15C30.85 28.75 31.1 27.85 30.5 27.5L20 21.5Z"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StyleIllustration: React.FC<{ styleId: StyleId; selected?: boolean }> = ({
  styleId,
  selected = false,
}) => {
  const bgCircle = selected ? '#E0F2FE' : '#F0F9FF';

  switch (styleId) {
    case 'casual':
      return (
        <svg
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <rect width="96" height="96" rx="20" fill={bgCircle} />
          {/* Soft knit cardigan / sweater */}
          <path
            d="M32 24L20 33L16 54L26 57L29 41V72H67V41L70 57L80 54L76 33L64 24C60 28 54.5 30 48 30C41.5 30 36 28 32 24Z"
            fill="#38BDF8"
            stroke="#0369A1"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner cream t-shirt neckline */}
          <path
            d="M36 25C39 30 43.2 32 48 32C52.8 32 57 30 60 25"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Center placket & cozy buttons */}
          <line x1="48" y1="32" x2="48" y2="72" stroke="#0369A1" strokeWidth="2.2" />
          <circle cx="48" cy="41" r="2.2" fill="#FFFFFF" stroke="#0369A1" strokeWidth="1.5" />
          <circle cx="48" cy="51" r="2.2" fill="#FFFFFF" stroke="#0369A1" strokeWidth="1.5" />
          <circle cx="48" cy="61" r="2.2" fill="#FFFFFF" stroke="#0369A1" strokeWidth="1.5" />
          {/* Pockets */}
          <path
            d="M34 55H43V63C43 64.6 41.6 66 40 66H37C35.4 66 34 64.6 34 63V55Z"
            fill="#BAE6FD"
            stroke="#0369A1"
            strokeWidth="2"
          />
          <path
            d="M53 55H62V63C62 64.6 60.6 66 59 66H56C54.4 66 53 64.6 53 63V55Z"
            fill="#BAE6FD"
            stroke="#0369A1"
            strokeWidth="2"
          />
        </svg>
      );

    case 'neat':
      return (
        <svg
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <rect width="96" height="96" rx="20" fill={bgCircle} />
          {/* Crisp white inner shirt */}
          <path d="M36 22H60L62 72H34L36 22Z" fill="#FFFFFF" />
          {/* Tailored neat light jacket */}
          <path
            d="M35 23L20 31L16 58L26 60L30 40V73H46V38L35 23Z"
            fill="#0EA5E9"
            stroke="#0C4A6E"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path
            d="M61 23L76 31L80 58L70 60L66 40V73H50V38L61 23Z"
            fill="#0EA5E9"
            stroke="#0C4A6E"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Neat shirt collar */}
          <path
            d="M37 22L48 34L59 22"
            fill="#FFFFFF"
            stroke="#0C4A6E"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M48 34V73" stroke="#BAE6FD" strokeWidth="2" />
          {/* Subtle button details */}
          <circle cx="48" cy="45" r="2" fill="#0C4A6E" />
          <circle cx="48" cy="56" r="2" fill="#0C4A6E" />
        </svg>
      );

    case 'active':
      return (
        <svg
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <rect width="96" height="96" rx="20" fill={bgCircle} />
          {/* High-neck sporty windbreaker */}
          <path
            d="M37 21H59L61 27L76 34L81 55L71 58L66 41V73H30V41L25 58L15 55L20 34L35 27L37 21Z"
            fill="#0284C7"
            stroke="#0F2942"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Bright breathable chest stripe */}
          <path d="M30 43H66V51H30V43Z" fill="#7DD3FC" />
          {/* Stand-up collar & zipper */}
          <path
            d="M37 21H59V28C59 29.5 54 31 48 31C42 31 37 29.5 37 28V21Z"
            fill="#38BDF8"
            stroke="#0F2942"
            strokeWidth="2.2"
          />
          <line x1="48" y1="31" x2="48" y2="73" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
          {/* Zipper pull */}
          <rect x="45.5" y="34" width="5" height="7" rx="2" fill="#FDE047" stroke="#0F2942" strokeWidth="1.4" />
        </svg>
      );

    case 'classic':
      return (
        <svg
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <rect width="96" height="96" rx="20" fill={bgCircle} />
          {/* Structured classic coat / blazer */}
          <path
            d="M34 22L19 30L15 60L26 62L30 41V75H66V41L70 62L81 60L77 30L62 22L48 44L34 22Z"
            fill="#1E3A5F"
            stroke="#0F172A"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Inner light blouse / shirt V-neck */}
          <path d="M35 22H61L48 44L35 22Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          {/* Classic lapel */}
          <path
            d="M34 22L28 36L37 40L48 44"
            fill="#334155"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M62 22L68 36L59 40L48 44"
            fill="#334155"
            stroke="#0F172A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Warm gold-cream accent pocket square & buttons */}
          <path d="M55 46L60 42L62 47H55V46Z" fill="#FDE68A" />
          <circle cx="48" cy="54" r="2.3" fill="#E2E8F0" />
          <circle cx="48" cy="64" r="2.3" fill="#E2E8F0" />
        </svg>
      );
  }
};
