"use client";

import { useEffect, useState } from "react";
import { loadKakaoMaps, KakaoNS } from "@/app/components/map/kakaoMap";
import { areaFromAddress } from "../missingFormat";
import * as S from "@/assets/css/Style.styles";

export type SuggestedPlace = {name: string; area: string; lat: number; lng: number};

// 검색어: 끝에 붙은 "근처·앞·옆" 같은 말은 빼고 장소 이름만
const toQuery = (text: string) => text.trim().replace(/\s*(근처|부근|주변|앞|옆|뒤|건너편|쪽)$/, "").trim();

// 💡 장소를 글로만 적고 지도를 안 골랐을 때: 그 이름으로 장소를 찾아 "여기가 맞나요?" 제안
//    저절로 넣지 않고 고른 경우만 지도에 표시 (같은 이름이 여러 곳일 수 있어서)
export default function PlaceSuggest({text, onPick}: {text: string; onPick: (place: SuggestedPlace) => void}) {
  const query = toQuery(text);
  const [found, setFound] = useState<{query: string; places: SuggestedPlace[]}>({query: "", places: []});

  useEffect(() => {
    if (query.length < 2) return;
    let alive = true;
    // 다 적을 때까지 기다렸다가 찾기
    const timer = setTimeout(() => {
      loadKakaoMaps()
        .then((kakao: KakaoNS) => {
          new kakao.maps.services.Places().keywordSearch(query, (data: KakaoNS[], status: string) => {
            if (!alive) return;
            const places = status === kakao.maps.services.Status.OK
              ? data.slice(0, 3).map((place) => ({
                name: place.place_name as string,
                area: areaFromAddress(place.address_name),
                lat: Number(place.y),
                lng: Number(place.x)
              }))
              : [];
            setFound({query, places});
          });
        })
        .catch(() => {});
    }, 600);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query]);

  if (query.length < 2 || found.query !== query || found.places.length === 0) return null;

  return (
    <S.PlaceSuggest>
      <p>지도에도 표시할까요? 맞는 곳을 고르면 지도가 함께 보여요.</p>
      <ul>
        {found.places.map((place) => (
          <li key={`${place.name}-${place.lat}-${place.lng}`}>
            <button type="button" onClick={() => onPick(place)}>
              <strong>{place.name}</strong>
              <small>{place.area}</small>
            </button>
          </li>
        ))}
      </ul>
    </S.PlaceSuggest>
  );
};
