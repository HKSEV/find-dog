"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarMonthOutlined as CalendarIcon,
  ChevronLeftRounded as PrevIcon,
  ChevronRightRounded as NextIcon
} from "@mui/icons-material";
import * as S from "@/assets/css/Style.styles";

export type TimeOfDay = "DAWN" | "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT" | "UNKNOWN" | "EXACT";

export interface WhenValue {
  date: string; // "2026-11-11" (필수)
  band: Exclude<TimeOfDay, "EXACT"> | ""; // 시간대 (안 골라도 됨)
  exactMode: boolean; // 정확한 시각을 적는 중
  exact: string; // "14:30"
}

export const emptyWhen: WhenValue = {date: "", band: "", exactMode: false, exact: ""};

export const bandOptions: {value: Exclude<TimeOfDay, "EXACT">; label: string}[] = [
  {value: "DAWN", label: "새벽"},
  {value: "MORNING", label: "오전"},
  {value: "AFTERNOON", label: "오후"},
  {value: "EVENING", label: "저녁"},
  {value: "NIGHT", label: "밤"},
  {value: "UNKNOWN", label: "모르겠어요"}
];

// 날짜 ↔ "YYYY-MM-DD" (기기 시간대 기준)
const pad = (n: number) => String(n).padStart(2, "0");
export const toDateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateKey(d);
};

// 서버로 보낼 값: occurredAt("2026-11-11T14:30" 또는 "...T00:00") + occurredTime
export const toOccurred = (value: WhenValue): {occurredAt: string | null; occurredTime: TimeOfDay | null} => {
  if (!value.date) return {occurredAt: null, occurredTime: null};
  if (value.exactMode && /^\d{2}:\d{2}$/.test(value.exact)) {
    return {occurredAt: `${value.date}T${value.exact}`, occurredTime: "EXACT"};
  };
  return {occurredAt: `${value.date}T00:00`, occurredTime: value.band || "UNKNOWN"};
};

// 서버에서 받은 값 → 입력 값 (수정 화면)
export const fromOccurred = (occurredAt?: string, occurredTime?: TimeOfDay | null): WhenValue => {
  if (!occurredAt) return emptyWhen;
  const date = occurredAt.substring(0, 10);
  const time = occurredAt.substring(11, 16);
  if (occurredTime === "EXACT" || (!occurredTime && time && time !== "00:00")) {
    return {date, band: "", exactMode: true, exact: time};
  };
  return {date, band: (occurredTime as WhenValue["band"]) || "", exactMode: false, exact: ""};
};

// "2026-11-11" → "11월 11일 (어제)"
const dateLabel = (key: string) => {
  const [, m, d] = key.split("-").map(Number);
  const rel = key === daysAgo(0) ? " (오늘)" : key === daysAgo(1) ? " (어제)" : key === daysAgo(2) ? " (그저께)" : "";
  return `${m}월 ${d}일${rel}`;
};

const exactLabel = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${pad(m)}`;
};

interface Props {
  label: string; // "잃어버린 때" / "발견한 때"
  value: WhenValue;
  error?: string;
  // 항상 최신 값을 기준으로 바꾸도록 바꿀 부분만 넘김 (빠르게 연달아 눌러도 앞 선택이 사라지지 않게)
  onChange: (update: (prev: WhenValue) => WhenValue) => void;
}

// 💡 잃어버린 때 / 발견한 때: 날짜는 칩(오늘·어제·그저께·날짜 고르기)으로 꼭 고르고,
//    시간은 시간대 칩(모르겠어요 포함)이나 정확한 시각. 연도는 화면에 안 보이고 저장할 때 자동
export default function WhenPicker({label, value, error, onChange}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const patch = (part: Partial<WhenValue>) => onChange((prev) => ({...prev, ...part}));
  const quick = [{label: "오늘", key: daysAgo(0)}, {label: "어제", key: daysAgo(1)}, {label: "그저께", key: daysAgo(2)}];
  const isQuick = quick.some((q) => q.key === value.date);

  const summary = value.date
    ? `${dateLabel(value.date)} ${value.exactMode && value.exact ? exactLabel(value.exact) : bandOptions.find((b) => b.value === value.band)?.label.replace("모르겠어요", "(시간 모름)") ?? ""}`.trim()
    : "";

  // 정확한 시각 입력 (오전/오후 + 시 + 분)
  const [ampm, hour, minute] = useMemo(() => {
    if (!value.exact) return ["PM", "", ""];
    const [h, m] = value.exact.split(":").map(Number);
    return [h < 12 ? "AM" : "PM", String(h % 12 || 12), pad(m)];
  }, [value.exact]);

  const setExact = (nextAmPm: string, nextHour: string, nextMinute: string) => {
    const h = Number(nextHour);
    const m = Number(nextMinute || "0");
    if (!nextHour || Number.isNaN(h) || h < 1 || h > 12 || Number.isNaN(m) || m < 0 || m > 59) {
      patch({exact: ""});
      return;
    };
    const h24 = nextAmPm === "AM" ? h % 12 : (h % 12) + 12;
    patch({exact: `${pad(h24)}:${pad(m)}`});
  };

  return (
    <S.WriteField>
      <S.WriteLabel as="span" id="when-label">{label}</S.WriteLabel>
      <S.WhenChips role="radiogroup" aria-labelledby="when-label">
        {quick.map((q) => (
          <S.WhenChip key={q.key} type="button" role="radio" aria-checked={value.date === q.key} $checked={value.date === q.key} onClick={() => patch({date: q.key})}>
            {q.label}
          </S.WhenChip>
        ))}
        <S.WhenChip type="button" role="radio" aria-checked={Boolean(value.date) && !isQuick} $checked={Boolean(value.date) && !isQuick} onClick={() => setSheetOpen(true)}>
          <CalendarIcon aria-hidden="true"/>
          {value.date && !isQuick ? dateLabel(value.date) : "날짜 고르기"}
        </S.WhenChip>
      </S.WhenChips>
      {error && <S.WriteError>{error}</S.WriteError>}

      {!value.exactMode ? (
        <>
          <S.WhenSubLabel id="when-band-label">대략 몇 시쯤이었나요? (선택)</S.WhenSubLabel>
          <S.WhenChips role="radiogroup" aria-labelledby="when-band-label">
            {bandOptions.map((b) => (
              <S.WhenChip
              key={b.value}
              type="button"
              role="radio"
              aria-checked={value.band === b.value}
              $checked={value.band === b.value}
              onClick={() => patch({band: value.band === b.value ? "" : b.value})}>
                {b.label}
              </S.WhenChip>
            ))}
          </S.WhenChips>
          <S.WhenLink type="button" onClick={() => patch({exactMode: true})}>정확한 시각 적기 ›</S.WhenLink>
        </>
      ) : (
        <>
          <S.WhenSubLabel>시각</S.WhenSubLabel>
          <S.WhenExact>
            <S.WhenAmPm role="group" aria-label="오전·오후">
              <button type="button" aria-pressed={ampm === "AM"} onClick={() => setExact("AM", hour, minute)}>오전</button>
              <button type="button" aria-pressed={ampm === "PM"} onClick={() => setExact("PM", hour, minute)}>오후</button>
            </S.WhenAmPm>
            <input inputMode="numeric" aria-label="시" placeholder="시" maxLength={2} defaultValue={hour} onChange={(e) => setExact(ampm, e.target.value, minute)}/>
            <span>:</span>
            <input inputMode="numeric" aria-label="분" placeholder="분" maxLength={2} defaultValue={minute} onChange={(e) => setExact(ampm, hour || "", e.target.value)}/>
          </S.WhenExact>
          <S.WhenLink type="button" onClick={() => patch({exactMode: false, exact: ""})}>시간대로 고르기 ›</S.WhenLink>
        </>
      )}

      {summary && <S.WhenSummary>{summary}</S.WhenSummary>}

      {sheetOpen && (
        <CalendarSheet
        selected={value.date}
        onClose={() => setSheetOpen(false)}
        onPick={(key) => {
          patch({date: key});
          setSheetOpen(false);
        }}/>
      )}
    </S.WriteField>
  );
};

// 월·일만 고르는 달력 (오늘 이후는 못 고름, 연도는 지난해로 넘어갈 때만 표시)
function CalendarSheet({selected, onPick, onClose}: {selected: string; onPick: (key: string) => void; onClose: () => void}) {
  const today = new Date();
  const todayKey = toDateKey(today);
  const start = selected ? new Date(`${selected}T00:00`) : today;
  const [month, setMonth] = useState(new Date(start.getFullYear(), start.getMonth(), 1));
  const [picked, setPicked] = useState(selected || "");

  const isThisMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
  const firstWeekday = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)];
  const title = `${month.getFullYear() !== today.getFullYear() ? `${month.getFullYear()}년 ` : ""}${month.getMonth() + 1}월`;
  const pickedLabel = picked ? `${Number(picked.substring(5, 7))}월 ${Number(picked.substring(8, 10))}일` : "";

  return (
    <S.WhenSheetOverlay onClick={onClose}>
      <S.WhenSheet role="dialog" aria-modal="true" aria-label="날짜 고르기" onClick={(e) => e.stopPropagation()}>
        <S.WhenSheetHandle/>
        <S.WhenMonthHead>
          <button type="button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><PrevIcon/></button>
          {title}
          <button type="button" aria-label="다음 달" disabled={isThisMonth} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><NextIcon/></button>
        </S.WhenMonthHead>
        <S.WhenGrid>
          {["일", "월", "화", "수", "목", "금", "토"].map((w) => <S.WhenWeekday key={w}>{w}</S.WhenWeekday>)}
          {cells.map((day, i) => {
            if (!day) return <S.WhenDayCell key={`e${i}`}/>;
            const key = toDateKey(new Date(month.getFullYear(), month.getMonth(), day));
            return (
              <S.WhenDayCell key={key}>
                <S.WhenDay
                type="button"
                $selected={picked === key}
                $today={key === todayKey}
                disabled={key > todayKey}
                aria-pressed={picked === key}
                aria-label={`${month.getMonth() + 1}월 ${day}일`}
                onClick={() => setPicked(key)}>
                  {day}
                </S.WhenDay>
              </S.WhenDayCell>
            );
          })}
        </S.WhenGrid>
        <S.WhenSheetNote>오늘 이후 날짜는 고를 수 없어요</S.WhenSheetNote>
        <S.WriteSubmit type="button" disabled={!picked} onClick={() => onPick(picked)}>
          {picked ? `${pickedLabel}로 할게요` : "날짜를 골라 주세요"}
        </S.WriteSubmit>
      </S.WhenSheet>
    </S.WhenSheetOverlay>
  );
};
