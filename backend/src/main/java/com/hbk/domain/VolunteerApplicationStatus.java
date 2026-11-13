package com.hbk.domain;

// 봉사 신청 상태: 선착순이라 신청하면 바로 확정(CONFIRMED), 신청자가 취소하면 CANCELED
public enum VolunteerApplicationStatus {
    CONFIRMED,
    CANCELED
}
