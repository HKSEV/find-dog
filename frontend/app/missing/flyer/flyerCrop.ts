import type { CSSProperties } from "react";

// 💡 전단지 사진 맞추기 계산 (전단지 칸과 맞추기 화면이 같은 값을 써서 보이는 그대로 인쇄됨)
//    x, y: 칸 가운데에 올 사진 위의 점 (0~1), zoom: 1이면 사진 짧은 쪽이 칸에 꼭 맞음
export type FlyerCrop = {index: number; x: number; y: number; zoom: number};
export type NaturalSize = {width: number; height: number};

export const MAX_ZOOM = 3;

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
  const zoom = clamp(crop.zoom, 1, MAX_ZOOM);
  const {w, h} = drawnSize(size, zoom);
  return {...crop, zoom, x: clamp(crop.x, 50 / w, 1 - 50 / w), y: clamp(crop.y, 50 / h, 1 - 50 / h)};
};

// 칸 안 사진의 위치·크기 (칸 크기에 대한 %)
export const cropStyle = (crop: FlyerCrop, size: NaturalSize): CSSProperties => {
  const fitted = clampCrop(crop, size);
  const {w, h} = drawnSize(size, fitted.zoom);
  return {width: `${w}%`, height: `${h}%`, left: `${50 - fitted.x * w}%`, top: `${50 - fitted.y * h}%`};
};

// 끌어서 옮긴 만큼(px) x, y를 바꿈. boxPx: 맞추기 칸의 실제 크기
export const moveCrop = (crop: FlyerCrop, size: NaturalSize, dx: number, dy: number, boxPx: number): FlyerCrop => {
  const {w, h} = drawnSize(size, crop.zoom);
  return clampCrop({...crop, x: crop.x - (dx / boxPx) * (100 / w), y: crop.y - (dy / boxPx) * (100 / h)}, size);
};
