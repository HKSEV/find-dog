"use client";

import React, { useEffect, useRef, useState } from "react";
import { MyArea, canUseCurrentLocation, regionOf, saveMyArea, searchArea } from "@/lib/myArea";
import { showToast } from "./Toast";
import * as S from "@/assets/css/Style.styles";

// 💡 내 동네 설정 시트: 동네·주소·장소 검색 -> 골라서 이 기기에 저장
//    https(또는 로컬)에서는 "현재 위치로 설정" 버튼도 보여줌
export default function AreaSheet({current, onClose}: {current: MyArea | null; onClose: () => void}) {
  const [text, setText] = useState("");
  const [results, setResults] = useState<MyArea[] | null>(null); // null: 아직 검색 안 함
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const locatable = canUseCurrentLocation();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 입력을 멈추면(0.3초) 검색
  useEffect(() => {
    const query = text.trim();
    if (!query) return;
    let alive = true;
    const timer = setTimeout(() => {
      setSearching(true);
      searchArea(query)
        .then((list) => alive && setResults(list))
        .catch(() => alive && setResults([]))
        .finally(() => alive && setSearching(false));
    }, 300);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [text]);

  const pick = (area: MyArea) => {
    saveMyArea(area);
    showToast(`내 동네를 ${area.label}(으)로 설정했어요`);
    onClose();
  };

  const useCurrentLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        regionOf(coords.latitude, coords.longitude)
          .then((area) => pick({...area, lat: coords.latitude, lng: coords.longitude}))
          .catch(() => showToast("현재 위치의 동네를 찾지 못했어요. 검색으로 골라 주세요."))
          .finally(() => setLocating(false));
      },
      () => {
        setLocating(false);
        showToast("위치 권한이 없어요. 검색으로 골라 주세요.");
      },
      {enableHighAccuracy: false, timeout: 8000, maximumAge: 60000}
    );
  };

  const shown = text.trim() ? results : null;

  return (
    <S.AreaOverlay onClick={onClose}>
      <S.AreaSheet role="dialog" aria-modal="true" aria-labelledby="area-sheet-title" onClick={(e) => e.stopPropagation()}>
        <S.AreaHandle aria-hidden="true"/>
        <S.AreaTitle id="area-sheet-title">내 동네 설정</S.AreaTitle>
        <S.AreaNote>
          {current ? `지금은 ${current.label} 기준이에요. ` : ""}동네 이름, 주소, 가까운 장소로 찾아 주세요. 이 기기에만 저장돼요.
        </S.AreaNote>

        <S.SearchField>
          <S.HeaderSearchIcon aria-hidden="true"/>
          <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          aria-label="동네 검색"
          placeholder="예: 망원동, 사직공원"
          value={text}
          onChange={(e) => setText(e.target.value)}/>
          {text && (
            <S.SearchClearButton type="button" aria-label="검색어 지우기" onClick={() => setText("")}>
              <S.SearchClearIcon/>
            </S.SearchClearButton>
          )}
        </S.SearchField>

        {locatable && (
          <S.AreaActionButton type="button" onClick={useCurrentLocation} disabled={locating}>
            <S.AreaLocateIcon aria-hidden="true"/>{locating ? "위치 찾는 중..." : "현재 위치로 설정"}
          </S.AreaActionButton>
        )}

        {shown === null ? null : searching && shown.length === 0 ? (
          <S.AreaEmpty>찾는 중이에요</S.AreaEmpty>
        ) : shown.length === 0 ? (
          <S.AreaEmpty>찾는 동네가 없어요. 다른 이름으로 검색해 보세요.</S.AreaEmpty>
        ) : (
          <S.AreaResults>
            {shown.map((area) => (
              <li key={`${area.label}-${area.lat}-${area.lng}`}>
                <S.AreaResult type="button" onClick={() => pick(area)}>
                  <strong>{area.label}</strong>
                  <span>{area.address}</span>
                </S.AreaResult>
              </li>
            ))}
          </S.AreaResults>
        )}

        {current && !text && (
          <S.AreaActionButton
          type="button"
          onClick={() => {
            saveMyArea(null);
            showToast("내 동네 설정을 지웠어요");
            onClose();
          }}>
            설정 지우기
          </S.AreaActionButton>
        )}
      </S.AreaSheet>
    </S.AreaOverlay>
  );
};
