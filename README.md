# 패션왕 (Vercel Serverless + Vite React SPA)

연령대·성별·선호 스타일과 현재 위치 날씨를 바탕으로 오늘의 옷차림 1가지를 추천해 주는 웹 애플리케이션입니다.
Vercel의 정적 SPA 호스팅(`dist/`)과 Serverless Functions(`/api/*`) 구조로 바로 배포할 수 있도록 구성되어 있습니다.

## 1. 프로젝트 구조

```text
├── api/
│   ├── recommend.ts        # Vercel Serverless Function (POST /api/recommend - Gemini AI 프록시)
│   └── weather.ts          # Vercel Serverless Function (GET /api/weather - 날씨 API 프록시)
├── lib/
│   ├── cors.ts             # CORS 헤더 및 OPTIONS Preflight 처리 유틸
│   ├── recommend.ts        # @google/genai 호출 및 응답 스키마 검증 (서버 전용)
│   └── weather.ts          # Open-Meteo / wttr.in / MET Norway 통합 조회 (서버 전용)
├── src/
│   ├── components/         # UI 컴포넌트 (OutfitScreen, WeatherScreen, StyleIllustrations)
│   ├── data/               # 대한민국 시·도 및 서울 동/구 좌표 데이터
│   ├── services/           # 프론트엔드 API 클라이언트 (api.ts, recommend.ts, weather.ts)
│   ├── types/              # 프로필/스타일 TypeScript 타입 정의
│   ├── App.tsx             # 메인 화면 흐름 제어
│   └── main.tsx            # React 엔트리포인트
├── server.ts               # 로컬 통합 개발/실행 서버 (Express + Vite 미들웨어)
├── vercel.json             # Vercel 빌드 및 SPA 라우팅(/api/* 제외) 설정
├── package.json            # Node.js >=22.x 엔진 및 스크립트 설정
└── .env.example            # 환경 변수 예시 파일
```

## 2. Vercel 대시보드 환경 변수 설정

Vercel 대시보드에서 **Project > Settings > Environment Variables**로 이동해 아래 변수를 등록하세요.

| 변수 이름 | 필수 여부 | 설명 |
| --- | --- | --- |
| `GEMINI_API_KEY` | **필수** | Google AI Studio에서 발급받은 Gemini API 키입니다. `api/recommend.ts` 서버리스 함수 내부의 `process.env.GEMINI_API_KEY`로만 읽히며 브라우저 번들에는 절대 포함되지 않습니다. (**`VITE_` 접두사를 붙이지 마세요.**) |
| `ALLOWED_ORIGIN` | 선택 | CORS 허용 출처입니다. 기본값은 `*`이며, 특정 도메인만 허용하려면 `https://your-app.vercel.app`처럼 입력합니다(쉼표로 복수 지정 가능). |
| `VITE_API_BASE_URL` | 선택 | 프론트엔드와 `/api/*`를 같은 Vercel 프로젝트에 배포할 때는 **비워 두세요**(상대 경로 `/api/...` 자동 사용). 백엔드를 별도 도메인에 배포한 경우에만 입력합니다. |

> **참고 (Vercel Node.js 버전):** `package.json`에 `"engines": { "node": ">=22.x" }`가 설정되어 있어 Vercel 빌드 및 Serverless Runtime이 Node.js 22.x 환경에서 실행됩니다.

## 3. 로컬 실행 및 검증

```bash
# 1) .env.example을 복사하여 .env 파일 생성 후 GEMINI_API_KEY 입력
cp .env.example .env

# 2) 의존성 설치
npm install

# 3) 로컬 개발 서버 실행 (포트 3000)
npm run dev

# 4) 타입 체크 및 프로덕션 빌드 확인
npm run lint
npm run build
```

## 4. Vercel 배포 방법

1. 이 저장소를 GitHub/GitLab/Bitbucket에 푸시한 뒤 Vercel에서 **Add New > Project**로 연결합니다.
2. Framework Preset이 **Vite**로 자동 감지되며, `vercel.json`에 의해 `npm run build` 실행 후 `dist` 디렉터리와 `api/*.ts` 서버리스 함수가 함께 배포됩니다.
3. 환경 변수 `GEMINI_API_KEY`를 등록한 뒤 **Deploy**를 클릭합니다.
4. 또는 Vercel CLI를 사용할 경우:
   ```bash
   npx vercel env add GEMINI_API_KEY
   npx vercel --prod
   ```
