const RAW_API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').trim();
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '');

/**
 * Vercel 동일 도메인 배포 시에는 상대 경로('/api/...')를 사용하고,
 * 프론트엔드/백엔드를 분리 배포한 경우 VITE_API_BASE_URL 환경 변수를 사용합니다.
 */
export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
