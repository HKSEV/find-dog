"use client";

import React, { useRef } from "react";
import { FlyerCrop, MAX_ZOOM, NaturalSize, clampCrop, moveCrop } from "./flyerCrop";
import { showToast } from "@/app/components/Toast";
import * as S from "@/assets/css/Style.styles";

const ZOOM_STEP = 0.2;

// 💡 전단지 사진 맞추기
//    FlyerPhotoDrag: 미리보기 사진 위에 겹쳐서 바로 끌어 옮기기 (키보드: 화살표로 옮기기, +/- 로 확대·축소)
//    FlyerZoomBar: 전단지 아래 조절 줄 (사진 바꾸기 · − · 확대 막대 · +)
//    둘 다 전단지(data-flyer) 밖이라 인쇄·이미지 저장에는 찍히지 않음. 글의 원본 사진은 그대로

type CropProps = {
  size: NaturalSize | null; // 지금 고른 사진의 원래 크기 (불러오기 전이면 null)
  crop: FlyerCrop;
  onChange: (crop: FlyerCrop) => void;
};

const zoomed = (crop: FlyerCrop, size: NaturalSize, zoom: number) => clampCrop({...crop, zoom}, size);

export function FlyerPhotoDrag({rect, size, crop, onChange}: CropProps & {
  rect: {left: number; top: number; size: number}; // 미리보기에서 사진 칸 위치·크기 (화면 px)
}) {
  const dragRef = useRef<{x: number; y: number} | null>(null);

  const move = (dx: number, dy: number) => size && onChange(moveCrop(crop, size, dx, dy, rect.size));

  const handleKey = (e: React.KeyboardEvent) => {
    if (!size) return;
    const step = 6;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => move(step, 0),
      ArrowRight: () => move(-step, 0),
      ArrowUp: () => move(0, step),
      ArrowDown: () => move(0, -step),
      "+": () => onChange(zoomed(crop, size, crop.zoom + ZOOM_STEP)),
      "=": () => onChange(zoomed(crop, size, crop.zoom + ZOOM_STEP)),
      "-": () => onChange(zoomed(crop, size, crop.zoom - ZOOM_STEP))
    };
    const action = keys[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  };

  return (
    <S.FlyerPhotoOverlay
    style={{left: rect.left, top: rect.top, width: rect.size, height: rect.size}}
    tabIndex={0}
    role="application"
    aria-label="전단지 사진 위치 맞추기. 끌거나 화살표로 옮기고 +, - 로 확대해요"
    onKeyDown={handleKey}
    onPointerDown={(e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {x: e.clientX, y: e.clientY};
    }}
    onPointerMove={(e) => {
      const last = dragRef.current;
      if (!last) return;
      move(e.clientX - last.x, e.clientY - last.y);
      dragRef.current = {x: e.clientX, y: e.clientY};
    }}
    onPointerUp={() => (dragRef.current = null)}
    onPointerCancel={() => (dragRef.current = null)}/>
  );
};

export function FlyerZoomBar({photoCount, size, crop, onChange}: CropProps & {photoCount: number}) {
  const zoomTo = (zoom: number) => size && onChange(zoomed(crop, size, zoom));

  // 사진 바꾸기: 다음 사진으로 (한 장이면 안내만)
  const nextPhoto = () => {
    if (photoCount < 2) {
      showToast("글에 올린 사진이 한 장이라 바꿀 사진이 없어요");
      return;
    };
    onChange({index: (crop.index + 1) % photoCount, x: 0.5, y: 0.4, zoom: 1});
  };

  return (
    <S.FlyerPhotoTools role="group" aria-label="전단지 사진 크기 조절">
      <button type="button" aria-label={`다른 사진으로 (${crop.index + 1}/${Math.max(photoCount, 1)})`} title="다른 사진으로" onClick={nextPhoto}>
        <S.FlyerPhotoSwapIcon aria-hidden="true"/>
      </button>
      <button type="button" aria-label="축소" disabled={!size || crop.zoom <= 1} onClick={() => zoomTo(crop.zoom - ZOOM_STEP)}>
        <S.FlyerZoomOutIcon aria-hidden="true"/>
      </button>
      <input
      type="range"
      aria-label="사진 확대"
      min={1}
      max={MAX_ZOOM}
      step={0.01}
      value={crop.zoom}
      disabled={!size}
      onChange={(e) => zoomTo(Number(e.target.value))}/>
      <button type="button" aria-label="확대" disabled={!size || crop.zoom >= MAX_ZOOM} onClick={() => zoomTo(crop.zoom + ZOOM_STEP)}>
        <S.FlyerZoomInIcon aria-hidden="true"/>
      </button>
    </S.FlyerPhotoTools>
  );
};
