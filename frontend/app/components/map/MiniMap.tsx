"use client";

import React, { useEffect, useRef, useState } from "react";
import { AREA_RADIUS_M, MapPoint, kakaoMapLink, loadKakaoMaps } from "./kakaoMap";
import * as S from "@/assets/css/Style.styles";

// 💡 작은 지도 (보기만): 정확한 핀 대신 반경 300m 원. 누르면 카카오맵에서 크게 보기
export default function MiniMap({point, label}: {point: MapPoint; label: string}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !canvasRef.current) return;
        const center = new kakao.maps.LatLng(point.lat, point.lng);
        const map = new kakao.maps.Map(canvasRef.current, {center, level: 5, draggable: false, scrollwheel: false, disableDoubleClickZoom: true});
        new kakao.maps.Circle({
          map,
          center,
          radius: AREA_RADIUS_M,
          strokeWeight: 2,
          strokeColor: "#8a4e4b",
          strokeOpacity: 0.6,
          fillColor: "#8a4e4b",
          fillOpacity: 0.15
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [point.lat, point.lng]);

  return (
    <S.MiniMapBox href={kakaoMapLink(label, point)} target="_blank" rel="noopener noreferrer" aria-label={`${label} 근처를 카카오맵에서 보기`}>
      <S.MiniMapCanvas ref={canvasRef}/>
      {failed && <S.MapMessage>지도를 불러오지 못했어요</S.MapMessage>}
      <S.MiniMapHint>카카오맵에서 보기 ›</S.MiniMapHint>
    </S.MiniMapBox>
  );
};
