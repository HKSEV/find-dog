export const APP_BASE_PATH = "/group/one/1";

export const withBasePath = (path: string) => `${APP_BASE_PATH}${path}`;

// 백엔드 주소 (API, 업로드 사진, 카카오 로그인 시작)
// 배포 빌드(npm run build)는 Render 주소, 개발 서버는 로컬 8080
// 다른 주소를 쓰려면 .env.local 에 NEXT_PUBLIC_API_URL 을 넣음
const DEFAULT_API_BASE_URL = process.env.NODE_ENV === "production" ? "https://find-dog.onrender.com" : "http://localhost:8080";

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;
