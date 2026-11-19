package com.hbk.dto;

import java.time.LocalDateTime;

// 💡 실종·제보 글 신고
public class MissingPostReportDtos {
    // 회원: 신고하기
    public record ReportRequest(String reason, String detail) {}

    // 관리자: 신고 목록
    public record AdminReport(
            Long id, Long postId, String postTitle, String postType, String authorNickname, String reporterNickname,
            String reason, String detail, String status, String adminNote, LocalDateTime createdAt, LocalDateTime handledAt
    ) {}

    // 관리자: 처리 (status = RESOLVED / DISMISSED)
    public record AdminHandleRequest(String status, String note) {}
}
