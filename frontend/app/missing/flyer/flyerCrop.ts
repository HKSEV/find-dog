import type { CSSProperties } from "react";

// 💡 전단지 1:1 사진 칸에 사진을 꽉 채우는 계산 (사진 크기 조절 기능은 2026-11-21에 뺌)
//    x, y: 칸 가운데에 올 사진 위의 점 (0~1), zoom: 1이면 사진 짧은 쪽이 칸에 꼭 맞음
//    Safari에서 사진이 보이던 그리는 방식(칸 안에 사진을 띄워 위치를 정함)을 그대로 쓰려고 남겨 둠
export type FlyerCrop = {index: number; x: number; y: number; zoom: number};
export type NaturalSize = {width: number; height: number};

// 처음 값: 첫 사진, 가운데보다 조금 위 (세로 사진은 얼굴이 위쪽에 있어서)
export const DEFAULT_CROP: FlyerCrop = {index: 0, x: 0.5, y: 0.4, zoom: 1};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// 사진을 칸 크기의 몇 %로 그릴지
const drawnSize = (size: NaturalSize, zoom: number) => {
  const ratio = size.width / size.height;
  return ratio >= 1
    ? {w: 100 * ratio * zoom, h: 100 * zoom}
    : {w: 100 * zoom, h: (100 / ratio) * zoom};
};

// 칸 밖으로 빈 곳이 보이지 않게 x, y를 맞춤
export const clampCrop = (crop: FlyerCrop, size: NaturalSize): FlyerCrop => {
  const zoom = Math.max(1, crop.zoom);
  const {w, h} = drawnSize(size, zoom);
  return {...crop, zoom, x: clamp(crop.x, 50 / w, 1 - 50 / w), y: clamp(crop.y, 50 / h, 1 - 50 / h)};
};

// 칸 안 사진의 위치·크기 (칸 크기에 대한 %)
export const cropStyle = (crop: FlyerCrop, size: NaturalSize): CSSProperties => {
  const fitted = clampCrop(crop, size);
  const {w, h} = drawnSize(size, fitted.zoom);
  return {width: `${w}%`, height: `${h}%`, left: `${50 - fitted.x * w}%`, top: `${50 - fitted.y * h}%`};
};

