"use client";

import { useMemo, useSyncExternalStore } from "react";
import axios from "axios";

// 💡 내 동네 (이 기기에 저장). 지도 중심, 거리 표시, 가까운 순 정렬에 씀
//    http 사이트에서는 브라우저가 현재 위치(GPS)를 막아서, 동네·주소를 검색해 고르는 방식이 기본
//    https 사이트나 로컬에서는 "현재 위치로 설정"도 보여줌 (canUseCurrentLocation)
export interface MyArea {
  label: string;   // 짧은 이름 (예: 망원2동, 사직근린공원)
  address: string; // 전체 주소
  lat: number;
  lng: number;
}

const KEY = "myArea";
const CHANGE_EVENT = "myarea-change";

const readRaw = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
};

export const saveMyArea = (area: MyArea | null) => {
  try {
    if (area) localStorage.setItem(KEY, JSON.stringify(area));
    else localStorage.removeItem(KEY);
  } catch {
    // 저장 못 하면 이번 화면에서만 못 씀
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export function useMyArea(): MyArea | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => {
    if (!raw) return null;
    try {
      const area = JSON.parse(raw) as MyArea;
      return Number.isFinite(area.lat) && Number.isFinite(area.lng) ? area : null;
    } catch {
      return null;
    }
  }, [raw]);
};

// 두 지점 거리 (km, 하버사인)
export const distanceKm = (a: {lat: number; lng: number}, b: {lat: number; lng: number}) => {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

// "850m" / "1.2km" / "12km"
export const formatDistance = (km: number) => {
  if (km < 1) return `${Math.max(100, Math.round(km * 10) * 100)}m`;
  return km < 10 ? `${km.toFixed(1)}km` : `${Math.round(km)}km`;
};

// 동네·주소·장소 검색 (서버가 카카오 로컬 API를 대신 부름)
export const searchArea = async (query: string) =>
  (await axios.get<MyArea[]>("/api/geo/search", {params: {query}})).data;

// 좌표 -> 동네 이름
export const regionOf = async (lat: number, lng: number) =>
  (await axios.get<MyArea>("/api/geo/region", {params: {lat, lng}})).data;

export const canUseCurrentLocation = () =>
  typeof window !== "undefined" && window.isSecureContext && "geolocation" in navigator;
