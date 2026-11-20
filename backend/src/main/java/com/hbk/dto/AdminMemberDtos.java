package com.hbk.dto;

import java.time.LocalDateTime;

// 💡 관리자 > 회원 관리
public class AdminMemberDtos {
    // 목록 한 줄 (연락처는 가운데를 가림)
    public record Row(
            Long id, String email, String nickname, String name, String phone, String userType, String provider,
            boolean admin, long missingPosts, long communityPosts, long reportsReceived,
            boolean suspended, String suspendedReason, LocalDateTime suspendedAt,
            boolean withdrawn       // 탈퇴한 회원 (개인정보는 지워져 있음)
    ) {}

    // 이용 정지 / 해제
    public record SuspendRequest(Boolean suspended, String reason) {}
}
