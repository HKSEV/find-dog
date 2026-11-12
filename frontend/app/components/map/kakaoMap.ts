// 💡 카카오 지도 SDK 불러오기 (한 번만). 키는 frontend/.env.local 의 NEXT_PUBLIC_KAKAO_MAP_KEY
//    카카오 개발자 콘솔에서 이 사이트 주소(http://localhost:3000)를 등록해야 지도가 뜸

// 카카오 SDK는 타입 정의가 없어서 필요한 만큼만 느슨하게 씀
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KakaoNS = any;

declare global {
  interface Window {
    kakao?: KakaoNS;
  }
}

let loading: Promise<KakaoNS> | null = null;

export const loadKakaoMaps = (): Promise<KakaoNS> => {
  if (typeof window === "undefined") return Promise.reject(new Error("브라우저에서만 쓸 수 있어요."));
  if (window.kakao?.maps?.LatLng) return Promise.resolve(window.kakao);
  if (loading) return loading;

  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  if (!key) return Promise.reject(new Error("지도 키가 없어요. frontend/.env.local을 확인해 주세요."));

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = () => {
      loading = null;
      reject(new Error("지도를 불러오지 못했어요."));
    };
    document.head.appendChild(script);
  });
  return loading;
};

export interface MapPoint {
  lat: number;
  lng: number;
}

// 첫 화면 위치 (서울시청). 현재 위치를 쓸 수 없을 때
export const DEFAULT_CENTER: MapPoint = {lat: 37.5665, lng: 126.978};

// 상세·글쓰기에서 보여주는 반경 (집 위치가 정확히 드러나지 않게 핀 대신 원)
export const AREA_RADIUS_M = 300;

// 카카오맵 웹/앱에서 크게 보기 (길찾기도 여기서)
export const kakaoMapLink = (label: string, point: MapPoint) =>
  `https://map.kakao.com/link/map/${encodeURIComponent(label)},${point.lat},${point.lng}`;
