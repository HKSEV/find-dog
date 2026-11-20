package com.hbk.domain;

// 알림 종류
//   ADOPTION: 입양 신청 진행 (보호소 전달·입양 확정·입양 불가)
//   CHAT: 새 채팅 메시지 (대화방마다 안 읽은 알림 하나만 남기고 최신 메시지로 바꿈)
//   NEARBY: 내 실종 글 근처에 목격 제보가 올라옴
//   REPORT: 내가 한 신고를 운영팀이 처리함
public enum NotificationType {
    ADOPTION, CHAT, NEARBY, REPORT
}
