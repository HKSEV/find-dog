// 💡 공유 (카카오톡, 링크 복사, 휴대폰 기본 공유)
//    카카오 키는 지도와 같은 JavaScript 키 (frontend/.env.local 의 NEXT_PUBLIC_KAKAO_MAP_KEY)
//    카카오 개발자 콘솔 > 플랫폼 > Web 사이트 도메인에 이 사이트 주소가 있어야 카카오톡 공유가 됨
import { withBasePath } from "./deploymentPath";

// 카카오 SDK는 타입 정의가 없어서 필요한 만큼만 느슨하게 씀
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KakaoSdk = any;

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export interface ShareContent {
  title: string;
  description: string;
  imageUrl?: string; // 다른 사람이 열 수 있는 전체 주소 (http...)여야 카톡 카드에 사진이 나옴
  path: string;      // 이 사이트 안의 주소 (예: "/missing/detail/?id=3")
}

// 공유할 전체 주소 (예: http://heartbreakkid.co.kr/group/one/1/missing/detail/?id=3)
export const shareUrl = (path: string) => `${window.location.origin}${withBasePath(path)}`;

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
let loading: Promise<KakaoSdk> | null = null;

const loadKakaoSdk = (): Promise<KakaoSdk> => {
  if (window.Kakao?.Share) return Promise.resolve(window.Kakao);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = () => resolve(window.Kakao);
    script.onerror = () => {
      loading = null;
      reject(new Error("카카오톡 공유를 불러오지 못했어요."));
    };
    document.head.appendChild(script);
  });
  return loading;
};

// 카카오톡으로 보내기: 사진이 있으면 사진 카드, 없으면 글 카드
export const shareToKakao = async (content: ShareContent) => {
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  if (!key) throw new Error("카카오 키가 없어요. frontend/.env.local을 확인해 주세요.");
  const Kakao = await loadKakaoSdk();
  if (!Kakao.isInitialized()) Kakao.init(key);

  const url = shareUrl(content.path);
  const link = {mobileWebUrl: url, webUrl: url};
  const buttons = [{title: "자세히 보기", link}];

  if (content.imageUrl?.startsWith("http")) {
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {title: content.title, description: content.description, imageUrl: content.imageUrl, link},
      buttons
    });
  } else {
    Kakao.Share.sendDefault({
      objectType: "text",
      text: `${content.title}\n${content.description}`,
      link,
      buttons
    });
  }
};

// 링크 복사: http 사이트에서는 navigator.clipboard 를 못 쓰고, 브라우저가 막을 때도 있어서 예전 방식으로도 시도
export const copyLink = async (path: string) => {
  const url = shareUrl(path);
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch {
      // 아래 예전 방식으로 다시 시도
    }
  }
  const field = document.createElement("textarea");
  field.value = url;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(field);
  if (!copied) throw new Error("링크를 복사하지 못했어요.");
};

// 휴대폰 기본 공유창 (https 사이트 + 지원하는 기기에서만)
export const canNativeShare = () => typeof navigator !== "undefined" && typeof navigator.share === "function";

export const nativeShare = (content: ShareContent) =>
  navigator.share({title: content.title, text: content.description, url: shareUrl(content.path)});
