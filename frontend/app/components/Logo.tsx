"use client";
import * as S from "@/assets/css/Style.styles";
import { colors } from "@/assets/css/client/theme";

interface LogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

export default function Logo({width = 150, height = 36, className, onClick}: LogoProps) {
  // 이미지에서 추출한 따뜻한 캬라멜 브라운 색상과 이목구비 색상
  const brownColor = colors.logo;
  const featureColor = colors.logoFeature;

  // 💡 viewBox는 실제 그려지는 내용(왼쪽 귀 -2.5 ~ 글자 끝 약 144)에 맞춤
  //    (예전 0 0 180 36은 오른쪽이 비어 있어서 가운데 정렬하면 로고가 왼쪽으로 치우쳐 보였음)
  //    글자 크기는 탭·서브 헤더 제목과 같은 20px
  return (
    <S.LogoSvg
    width={width}
    height={height}
    viewBox="-3 0 150 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    $cursor={onClick ? "pointer" : "default"}>
      {/* --- 1. 강아지 심볼 영역 (36x36) --- */}
      <g transform="translate(0, 0)">
        {/* 흰색 얼굴 바탕 (흰 헤더에서도 얼굴이 보이게 앞발처럼 갈색 테두리) */}
        <ellipse cx="18" cy="18" rx="14" ry="13" fill={colors.white} stroke={brownColor} strokeWidth="1.5"/>

        {/* 왼쪽 귀 (아래로 쳐진 둥근 형태) */}
        <ellipse cx="8" cy="14" rx="6.5" ry="11" transform="rotate(-25 8 14)" fill={brownColor}/>

        {/* 오른쪽 귀 (아래로 쳐진 둥근 형태) */}
        <ellipse cx="28" cy="14" rx="6.5" ry="11" transform="rotate(25 28 14)" fill={brownColor}/>

        {/* 눈 (세로로 약간 긴 타원형) */}
        <ellipse cx="14" cy="16" rx="1.5" ry="2.2" fill={featureColor}/>
        <ellipse cx="22" cy="16" rx="1.5" ry="2.2" fill={featureColor}/>

        {/* 코 (가로로 약간 넙적한 타원형) */}
        <ellipse cx="18" cy="20" rx="3" ry="2" fill={featureColor}/>

        {/* 왼쪽 앞발 (동그란 테두리) */}
        <circle cx="12.5" cy="31" r="5.5" fill={colors.white} stroke={brownColor} strokeWidth="1.5"/>

        {/* 오른쪽 앞발 (동그란 테두리) */}
        <circle cx="23.5" cy="31" r="5.5" fill={colors.white} stroke={brownColor} strokeWidth="1.5"/>
      </g>

      {/* --- 2. 텍스트 영역 --- */}
      {/* 글씨 색상을 귀 색상(brownColor)과 동일하게 적용 */}
      <text
      x="44"
      y="25.5"
      fontFamily="Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
      fontWeight="800"
      fontSize="20"
      fill={brownColor}
      letterSpacing="-0.5">
        어서찾아주개
      </text>
    </S.LogoSvg>
  );
};
