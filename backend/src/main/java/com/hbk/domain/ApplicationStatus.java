package com.hbk.domain;

// 입양 신청 상태
// 관리자(어서찾아주개 운영자)는 보호소가 아니므로, 운영자가 알 수 있는 단계만 둠
// 접수(RECEIVED) -> 보호소에 전달(FORWARDED) -> 입양 확정(ADOPTED) / 입양 불가(REJECTED)
// 신청자가 직접 취소하면 CANCELED
public enum ApplicationStatus {
    RECEIVED,
    FORWARDED,
    ADOPTED,
    REJECTED,
    CANCELED;

    // 아직 끝나지 않은 신청 (같은 동물에 중복 신청을 막을 때 사용)
    public boolean isActive() {
        return this == RECEIVED || this == FORWARDED;
    }
}
