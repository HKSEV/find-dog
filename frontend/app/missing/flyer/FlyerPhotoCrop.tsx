"use client";

import React, { useRef } from "react";
import { toImageUrl } from "../../shelter/animalFormat";
import { FlyerCrop, MAX_ZOOM, NaturalSize, clampCrop, cropStyle, moveCrop } from "./flyerCrop";
import * as S from "@/assets/css/Style.styles";

// 💡 전단지 사진 맞추기: 사진이 여러 장이면 고르고, 정사각 틀 안에서 끌어 옮기거나 확대
//    글의 원본 사진은 그대로 두고 전단지에만 적용
//    키보드: 틀에 들어가 화살표로 옮기기, +/- 로 확대·축소
export default function FlyerPhotoCrop({photos, src, size, crop, onChange}: {
  photos: string[];          // 글의 사진 주소들
  src?: string;              // 지금 고른 사진 (전단지와 같은 주소)
  size: NaturalSize | null;  // 지금 고른 사진의 원래 크기 (불러오기 전이면 null)
  crop: FlyerCrop;
  onChange: (crop: FlyerCrop) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{x: number; y: number} | null>(null);

  if (photos.length === 0) return null;

  const move = (dx: number, dy: number) => {
    if (!size || !boxRef.current) return;
    onChange(moveCrop(crop, size, dx, dy, boxRef.current.clientWidth));
  };

  const zoomTo = (zoom: number) => size && onChange(clampCrop({...crop, zoom}, size));

  const handleKey = (e: React.KeyboardEvent) => {
    const step = 10;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => move(step, 0),
      ArrowRight: () => move(-step, 0),
      ArrowUp: () => move(0, step),
      ArrowDown: () => move(0, -step),
      "+": () => zoomTo(crop.zoom + 0.1),
      "=": () => zoomTo(crop.zoom + 0.1),
      "-": () => zoomTo(crop.zoom - 0.1)
    };
    const action = keys[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  };

  return (
    <S.FlyerCropSection aria-labelledby="flyer-crop-title">
      <S.FlyerCropTitle id="flyer-crop-title">사진 맞추기</S.FlyerCropTitle>
      <S.FlyerCropNote>끌어서 얼굴이 가운데 오게 옮기고, 아래 막대로 확대해요. 전단지에만 적용돼요.</S.FlyerCropNote>

      {photos.length > 1 && (
        <S.FlyerCropThumbs role="group" aria-label="전단지에 넣을 사진">
          {photos.map((url, index) => (
            <S.FlyerCropThumb
            key={url}
            type="button"
            $active={crop.index === index}
            aria-pressed={crop.index === index}
            aria-label={`사진 ${index + 1}`}
            onClick={() => onChange({index, x: 0.5, y: 0.4, zoom: 1})}>
              {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 못 씀 */}
              <img src={toImageUrl(url)} alt=""/>
            </S.FlyerCropThumb>
          ))}
        </S.FlyerCropThumbs>
      )}

      <S.FlyerCropBox
      ref={boxRef}
      tabIndex={0}
      role="application"
      aria-label="사진 위치 맞추기. 화살표로 옮기고 +, - 로 확대해요"
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
      onPointerCancel={() => (dragRef.current = null)}>
        {src && size && <S.FlyerCropImg src={src} alt="" draggable={false} style={cropStyle(crop, size)}/>}
      </S.FlyerCropBox>

      <S.FlyerCropZoom>
        확대
        <input
        type="range"
        min={1}
        max={MAX_ZOOM}
        step={0.01}
        value={crop.zoom}
        disabled={!size}
        onChange={(e) => zoomTo(Number(e.target.value))}/>
      </S.FlyerCropZoom>
    </S.FlyerCropSection>
  );
};
