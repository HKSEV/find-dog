"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Header from "@/app/components/Header";
import { DEFAULT_CENTER, KakaoNS, loadKakaoMaps } from "@/app/components/map/kakaoMap";
import { toImageUrl } from "../shelter/animalFormat";
import { formatWhen, missingTitle } from "../missing/missingFormat";
import type { MissingAnimal } from "../redux/missingSlice";
import type { Animal } from "../redux/shelterSlice";
import type { VolunteerPost } from "../volunteer/volunteerApi";
import * as S from "@/assets/css/Style.styles";

type Kind = keyof typeof S.MAP_PIN_COLORS;

interface Place {
  key: string;
  kind: Kind;
  lat: number;
  lng: number;
  title: string;
  meta: string;
  image?: string;
  href: string;
}

const kindLabel: Record<Kind, string> = {lost: "실종", found: "목격", animal: "보호 동물", volunteer: "봉사"};

// 위쪽 칩: 실종·제보(실종+목격), 입양·봉사(보호 동물+봉사) 묶음으로 고름 (마커 꼬리표로 세부 종류 구분)
type View = "all" | "missing" | "shelter";
const views: {key: View; label: string; kinds: Kind[]; color?: string}[] = [
  {key: "all", label: "전체", kinds: ["lost", "found", "animal", "volunteer"]},
  {key: "missing", label: "실종·제보", kinds: ["lost", "found"], color: S.MAP_PIN_COLORS.lost},
  {key: "shelter", label: "입양·봉사", kinds: ["animal", "volunteer"], color: S.MAP_PIN_COLORS.animal}
];
const kindsOf = (view: View) => views.find((item) => item.key === view)!.kinds;

// 주소 글자 -> 좌표 (카카오 주소 검색, 안 되면 장소 검색). 같은 주소는 이 탭에서 다시 찾지 않음
const geocode = (kakao: KakaoNS, query: string): Promise<{lat: number; lng: number} | null> => {
  const cacheKey = `fd-geo:${query}`;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return Promise.resolve(JSON.parse(cached));
  } catch {
    // 저장소를 못 쓰면 매번 찾음
  }
  const save = (point: {lat: number; lng: number} | null) => {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(point));
    } catch {
      // 저장 실패는 무시
    }
    return point;
  };
  const {Status} = kakao.maps.services;
  return new Promise((resolve) => {
    new kakao.maps.services.Geocoder().addressSearch(query, (result: {x: string; y: string}[], status: string) => {
      if (status === Status.OK && result[0]) return resolve(save({lat: Number(result[0].y), lng: Number(result[0].x)}));
      new kakao.maps.services.Places().keywordSearch(query, (places: {x: string; y: string}[], placeStatus: string) => {
        resolve(save(placeStatus === Status.OK && places[0] ? {lat: Number(places[0].y), lng: Number(places[0].x)} : null));
      });
    });
  });
};

// 같은 자리에 겹치는 마커는 조금씩 옆으로 비켜 놓음
const spread = (places: Place[]) => {
  const seen = new Map<string, number>();
  return places.map((place) => {
    const spot = `${place.lat.toFixed(4)},${place.lng.toFixed(4)}`;
    const count = seen.get(spot) ?? 0;
    seen.set(spot, count + 1);
    if (count === 0) return place;
    const angle = count * 2.4;
    return {...place, lat: place.lat + Math.sin(angle) * 0.0006 * Math.ceil(count / 6), lng: place.lng + Math.cos(angle) * 0.0008 * Math.ceil(count / 6)};
  });
};

// 💡 지도로 보기: 실종·목격 글(지도에서 고른 장소), 보호 동물(구조 장소), 봉사 모집(장소)을 사진 마커로
//    실종 글 위치는 서버가 약 100m 단위로 줄여서 줌 (정확한 집 위치가 드러나지 않게)
//    /map?view=missing (실종·제보에서) , /map?view=shelter (입양·봉사에서) 로 들어오면 그 묶음만 먼저 보여줌
export default function MapExplorePage() {
  return (
    <Suspense fallback={null}>
      <MapExplore/>
    </Suspense>
  );
};

function MapExplore() {
  const searchParams = useSearchParams();
  const startView = searchParams.get("view");
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoNS>(null);
  const overlaysRef = useRef<{place: Place; overlay: KakaoNS; element: HTMLButtonElement}[]>([]);
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [filter, setFilter] = useState<View>(startView === "missing" || startView === "shelter" ? startView : "all");
  const firstViewRef = useRef(filter); // 처음 지도 범위를 맞출 묶음 (칩을 바꿔도 다시 맞추지 않음)
  const listHref = startView === "missing" ? "/missing" : startView === "shelter" ? "/shelter" : null; // 헤더 "목록" 버튼
  const [selected, setSelected] = useState<Place | null>(null);
  const [message, setMessage] = useState("불러오는 중이에요");

  // 지도와 데이터를 불러와서 마커 정보 만들기
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const kakao = await loadKakaoMaps();
        if (!alive || !canvasRef.current) return;
        mapRef.current = new kakao.maps.Map(canvasRef.current, {center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng), level: 8});

        const [missing, animals, volunteers] = await Promise.all([
          axios.get<MissingAnimal[]>("/api/missing-posts", {params: {size: 200, status: "MISSING"}}).then((r) => r.data).catch(() => []),
          axios.get<Animal[]>("/api/shelter-animals").then((r) => r.data).catch(() => []),
          axios.get<VolunteerPost[]>("/api/volunteers").then((r) => r.data).catch(() => [])
        ]);

        const list: Place[] = missing
          .filter((post) => post.lat != null && post.lng != null)
          .map((post) => ({
            key: `m${post.id}`,
            kind: post.type === "FOUND" ? "found" : "lost",
            lat: post.lat!,
            lng: post.lng!,
            title: missingTitle(post),
            meta: [formatWhen(post.occurredAt, post.occurredTime), post.rescueLocation].filter(Boolean).join(" · "),
            image: toImageUrl(post.mediaUrls?.[0]),
            href: `/missing/detail/?id=${post.id}`
          }));

        // 보호 동물·봉사는 주소 글자만 있어서 좌표를 찾아서 붙임 (못 찾으면 빼고)
        const located = await Promise.all([
          ...animals.filter((animal) => animal.status === "ACTIVE" && animal.rescueLocation).map(async (animal): Promise<Place | null> => {
            const point = await geocode(kakao, animal.rescueLocation);
            return point && {
              key: `a${animal.id}`,
              kind: "animal",
              ...point,
              title: animal.breed,
              meta: `${animal.rescueLocation}에서 구조`,
              image: toImageUrl(animal.imageUrl),
              href: `/shelter/detail/?id=${animal.id}`
            };
          }),
          ...volunteers.filter((post) => post.state !== "CLOSED" && post.place).map(async (post): Promise<Place | null> => {
            const point = await geocode(kakao, post.place);
            return point && {
              key: `v${post.id}`,
              kind: "volunteer",
              ...point,
              title: post.title,
              meta: `${post.activityDate.slice(5).replace("-", ".")} ${post.startTime}~${post.endTime} · ${post.place}`,
              image: toImageUrl(post.imageUrl ?? undefined),
              href: `/volunteer/detail/?id=${post.id}`
            };
          })
        ]);
        if (!alive) return;
        setPlaces(spread([...list, ...located.filter((place): place is Place => place !== null)]));
      } catch {
        if (alive) setMessage("지도를 불러오지 못했어요");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 마커 그리기 (사진 동그라미 + 종류 꼬리표) 후 모두 보이게 맞춤
  useEffect(() => {
    const map = mapRef.current;
    const kakao = typeof window !== "undefined" ? window.kakao : null;
    if (!map || !kakao || !places) return;

    const bounds = new kakao.maps.LatLngBounds();
    overlaysRef.current = places.map((place) => {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "fd-pin";
      element.style.setProperty("--pin-color", S.MAP_PIN_COLORS[place.kind]);
      element.setAttribute("aria-label", `${kindLabel[place.kind]}: ${place.title}`);
      const tag = document.createElement("span");
      tag.className = "fd-pin-tag";
      tag.textContent = kindLabel[place.kind];
      if (place.image) {
        const img = document.createElement("img");
        img.src = place.image;
        img.alt = "";
        img.loading = "lazy";
        element.appendChild(img);
      } else {
        const empty = document.createElement("span");
        empty.className = "fd-pin-empty";
        empty.textContent = "사진 없음";
        element.appendChild(empty);
      }
      element.appendChild(tag);
      element.addEventListener("click", () => setSelected(place));

      const position = new kakao.maps.LatLng(place.lat, place.lng);
      bounds.extend(position);
      const overlay = new kakao.maps.CustomOverlay({position, content: element, yAnchor: 1, clickable: true});
      overlay.setMap(map);
      return {place, overlay, element};
    });
    // 처음 보여줄 묶음의 마커가 모두 보이게 (없으면 전체 기준)
    const firstKinds = kindsOf(firstViewRef.current);
    const firstBounds = new kakao.maps.LatLngBounds();
    places.filter((place) => firstKinds.includes(place.kind)).forEach((place) => firstBounds.extend(new kakao.maps.LatLng(place.lat, place.lng)));
    if (!firstBounds.isEmpty()) map.setBounds(firstBounds, 60, 40, 120, 40);
    else if (places.length > 0) map.setBounds(bounds, 60, 40, 120, 40);

    const close = () => setSelected(null);
    kakao.maps.event.addListener(map, "click", close);
    return () => {
      kakao.maps.event.removeListener(map, "click", close);
      overlaysRef.current.forEach(({overlay}) => overlay.setMap(null));
      overlaysRef.current = [];
    };
  }, [places]);

  // 고른 종류만 보이게, 고른 마커는 크게
  useEffect(() => {
    const map = mapRef.current;
    overlaysRef.current.forEach(({place, overlay, element}) => {
      overlay.setMap(kindsOf(filter).includes(place.kind) ? map : null);
      element.classList.toggle("is-selected", selected?.key === place.key);
    });
  }, [filter, selected, places]);

  const counts = useMemo(() => {
    const result = {} as Record<View, number>;
    views.forEach((view) => (result[view.key] = places?.filter((place) => view.kinds.includes(place.kind)).length ?? 0));
    return result;
  }, [places]);

  const status = places === null ? message : places.length === 0 ? "지도에 표시할 글이 아직 없어요" : "";
  const visibleSelected = selected && kindsOf(filter).includes(selected.kind) ? selected : null;

  return (
    <S.AppWrapper>
      <S.MapPinStyle/>
      <S.Container>
        <Header
        title={startView === "missing" ? "실종·제보 지도" : startView === "shelter" ? "입양·봉사 지도" : "지도로 보기"}
        action={listHref ? (
          // 💡 들어온 목록으로 돌아가기 (목록의 "지도" 버튼과 같은 자리)
          <S.HeaderPillButton as={Link} href={listHref}>
            <S.ListEntryIcon aria-hidden="true"/>목록
          </S.HeaderPillButton>
        ) : undefined}/>
        <S.HeaderOffset/>
        <S.MapPage>
          <S.MapCanvas ref={canvasRef}/>

          <S.MapFilters role="radiogroup" aria-label="보여줄 종류">
            {views.map((item) => (
              <S.MapFilterChip
              key={item.key}
              type="button"
              role="radio"
              aria-checked={filter === item.key}
              $active={filter === item.key}
              $color={item.color}
              onClick={() => {
                setFilter(item.key);
                setSelected(null);
              }}>
                {item.color && <i aria-hidden="true"/>}
                {item.label} {counts[item.key] ?? 0}
              </S.MapFilterChip>
            ))}
          </S.MapFilters>

          {status && <S.MapStatus role="status">{status}</S.MapStatus>}

          {visibleSelected && (
            <S.MapCard as={Link} href={visibleSelected.href}>
              {visibleSelected.image ? <S.MapCardThumb src={visibleSelected.image} alt=""/> : <S.MapCardThumb as="span"/>}
              <S.MapCardBody>
                <small style={{backgroundColor: S.MAP_PIN_COLORS[visibleSelected.kind]}}>{kindLabel[visibleSelected.kind]}</small>
                <strong>{visibleSelected.title}</strong>
                <p>{visibleSelected.meta}</p>
              </S.MapCardBody>
              <S.MapCardChevron aria-hidden="true"/>
            </S.MapCard>
          )}
        </S.MapPage>
      </S.Container>
    </S.AppWrapper>
  );
};
