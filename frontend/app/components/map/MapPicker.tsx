"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CloseRounded as CloseIcon,
  LocationOnRounded as PinIcon,
  MyLocationRounded as LocateIcon
} from "@mui/icons-material";
import { DEFAULT_CENTER, KakaoNS, MapPoint, loadKakaoMaps } from "./kakaoMap";
import * as S from "@/assets/css/Style.styles";

export interface PickedPlace extends MapPoint {
  address: string; // 핀 위치의 주소 (장소 칸에 채움)
}

interface Props {
  initial?: MapPoint | null;
  onSelect: (place: PickedPlace) => void;
  onClose: () => void;
}

type SearchResult = {name: string; address: string; lat: number; lng: number};

// 💡 전체 화면 위치 고르기: 가운데 핀은 고정, 지도를 움직여 맞춤
//    위: 닫기 + 장소·주소 검색 / 오른쪽 아래: 현재 위치 / 아래: 지금 주소 + "이 위치로 할게요"
export default function MapPicker({initial, onSelect, onClose}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoNS>(null);
  const kakaoRef = useRef<KakaoNS>(null);
  const [address, setAddress] = useState("");
  const [center, setCenter] = useState<MapPoint>(initial ?? DEFAULT_CENTER);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState("");

  // 지도 만들기
  useEffect(() => {
    let cancelled = false;
    loadKakaoMaps()
      .then((kakao) => {
        if (cancelled || !canvasRef.current) return;
        kakaoRef.current = kakao;
        const start = initial ?? DEFAULT_CENTER;
        const map = new kakao.maps.Map(canvasRef.current, {center: new kakao.maps.LatLng(start.lat, start.lng), level: 4});
        mapRef.current = map;
        const geocoder = new kakao.maps.services.Geocoder();

        // 지도를 멈출 때마다 가운데 좌표의 주소를 찾아서 보여줌
        const updateAddress = () => {
          const c = map.getCenter();
          const point = {lat: c.getLat(), lng: c.getLng()};
          setCenter(point);
          geocoder.coord2Address(point.lng, point.lat, (result: KakaoNS[], status: string) => {
            if (status !== kakao.maps.services.Status.OK || !result[0]) {
              setAddress("");
              return;
            };
            const road = result[0].road_address?.address_name;
            setAddress(road || result[0].address?.address_name || "");
          });
        };
        kakao.maps.event.addListener(map, "idle", updateAddress);
        updateAddress();

        // 처음 고르는 거면 현재 위치에서 시작 (허락한 경우만)
        if (!initial && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => map.setCenter(new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude)),
            () => {},
            {timeout: 5000}
          );
        };
      })
      .catch((error: Error) => setMessage(error.message));
    return () => {
      cancelled = true;
    };
  }, [initial]);

  // Esc로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const moveTo = (point: MapPoint) => {
    const kakao = kakaoRef.current;
    if (!kakao || !mapRef.current) return;
    mapRef.current.setLevel(3);
    mapRef.current.setCenter(new kakao.maps.LatLng(point.lat, point.lng));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // 바깥 화면의 form 제출로 번지지 않게
    const kakao = kakaoRef.current;
    const word = keyword.trim();
    if (!kakao || !word) return;
    new kakao.maps.services.Places().keywordSearch(word, (data: KakaoNS[], status: string) => {
      if (status !== kakao.maps.services.Status.OK) {
        setResults([]);
        setMessage("찾는 장소가 없어요. 다른 이름으로 찾아보세요.");
        return;
      };
      setMessage("");
      setResults(data.slice(0, 8).map((place) => ({
        name: place.place_name,
        address: place.road_address_name || place.address_name,
        lat: Number(place.y),
        lng: Number(place.x)
      })));
    });
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setMessage("이 기기에서는 현재 위치를 쓸 수 없어요.");
      return;
    };
    navigator.geolocation.getCurrentPosition(
      (pos) => moveTo({lat: pos.coords.latitude, lng: pos.coords.longitude}),
      () => setMessage("현재 위치를 가져오지 못했어요. 위치 권한을 확인해 주세요."),
      {timeout: 8000}
    );
  };

  return (
    <S.PickerOverlay role="dialog" aria-modal="true" aria-label="지도에서 장소 고르기">
      <S.PickerCanvas ref={canvasRef}/>

      <S.PickerTop>
        <S.PickerIconButton type="button" aria-label="닫기" onClick={onClose}><CloseIcon/></S.PickerIconButton>
        <S.PickerSearch onSubmit={handleSearch} role="search">
          <input
          type="search"
          aria-label="장소·주소 검색"
          placeholder="장소·주소 검색"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            if (!e.target.value) setResults([]);
          }}/>
          {results.length > 0 && (
            <S.PickerResults>
              {results.map((place) => (
                <li key={`${place.name}-${place.lat}-${place.lng}`}>
                  <button
                  type="button"
                  onClick={() => {
                    moveTo(place);
                    setResults([]);
                  }}>
                    <strong>{place.name}</strong>
                    <small>{place.address}</small>
                  </button>
                </li>
              ))}
            </S.PickerResults>
          )}
        </S.PickerSearch>
      </S.PickerTop>

      <S.PickerPin aria-hidden="true"><PinIcon/></S.PickerPin>
      <S.PickerLocate type="button" aria-label="현재 위치로" onClick={handleLocate}><LocateIcon/></S.PickerLocate>

      <S.PickerSheet>
        <strong>{address || "주소를 찾는 중이에요"}</strong>
        <small>{message || "지도를 움직여 핀을 맞춰 주세요. 다른 사람에게는 이 근처(약 300m)로만 보여요."}</small>
        <S.WriteSubmit type="button" disabled={!address} onClick={() => onSelect({...center, address})}>
          이 위치로 할게요
        </S.WriteSubmit>
      </S.PickerSheet>
    </S.PickerOverlay>
  );
};
