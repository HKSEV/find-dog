package com.hbk.domain;

// 실종·목격 시간대 (정확한 시각을 모를 때 대략으로 고름)
// EXACT: occurredAt에 시:분까지 정확히 적은 경우, UNKNOWN: 시간을 모름
public enum TimeOfDay {
    DAWN,      // 새벽 (0~6시)
    MORNING,   // 오전 (6~12시)
    AFTERNOON, // 오후 (12~18시)
    EVENING,   // 저녁 (18~21시)
    NIGHT,     // 밤 (21~24시)
    UNKNOWN,
    EXACT
}
