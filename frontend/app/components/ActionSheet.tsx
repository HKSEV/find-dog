"use client";

import * as S from "@/assets/css/Style.styles";

export interface ActionSheetItem {
  label: string;
  danger?: boolean;
  onSelect: () => void;
}

// 💡 더보기(⋮) 메뉴: 아래에서 올라오는 버튼 목록 + 닫기
//    고르면 시트를 닫고 그 일을 함
export default function ActionSheet({items, onClose}: {items: ActionSheetItem[]; onClose: () => void}) {
  return (
    <S.ShareSheetOverlay onClick={onClose}>
      <S.ShareSheet role="dialog" aria-modal="true" aria-label="더보기 메뉴" onClick={(e) => e.stopPropagation()}>
        <S.ShareSheetHandle aria-hidden="true"/>
        <S.ActionSheetList>
          {items.map((item) => (
            <S.ActionSheetItem
            key={item.label}
            type="button"
            $danger={item.danger}
            onClick={() => {
              onClose();
              item.onSelect();
            }}>
              {item.label}
            </S.ActionSheetItem>
          ))}
        </S.ActionSheetList>
        <S.ShareCancelButton type="button" onClick={onClose}>닫기</S.ShareCancelButton>
      </S.ShareSheet>
    </S.ShareSheetOverlay>
  );
};
