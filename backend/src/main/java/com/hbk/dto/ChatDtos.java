package com.hbk.dto;

import java.time.LocalDateTime;

// 💡 채팅 주고받는 값들
public final class ChatDtos {
    private ChatDtos() {}

    // 대화방 목록·대화방 위쪽 글 카드
    public record Room(
            Long id,
            Long postId,
            String postTitle,     // 이름 · 품종 (목격 글은 품종 · 털색)
            String postType,      // LOST / FOUND
            String postStatus,    // MISSING / COMPLETED
            String postImage,     // 글 첫 사진 (/uploads/...)
            String otherNickname, // 상대 닉네임
            String otherImage,    // 상대 프로필 사진
            boolean iAmOwner,     // 내가 글쓴이인지
            String lastMessage,
            LocalDateTime lastMessageAt,
            long unread,
            boolean blocked,      // 차단·종료된 대화 (메시지를 보낼 수 없음)
            Long otherId,         // 상대 프로필 보기 (/profile/?id=)
            boolean otherLeft     // 상대가 대화방을 나감 (메시지를 보낼 수 없음)
    ) {}

    public record Message(Long id, boolean mine, String type, String content, Double lat, Double lng, LocalDateTime createdAt) {}

    public record SendRequest(String type, String content, Double lat, Double lng) {}

    public record OpenRequest(Long postId) {}

    // 신고하기 (block = true 면 이 대화를 바로 차단)
    public record ReportRequest(String reason, String detail, Boolean block) {}

    // 관리자: 신고 목록
    public record AdminReport(
            Long id, Long roomId, String reason, String detail, String status, String adminNote,
            String reporterNickname, String reportedNickname, String postTitle, boolean roomBlocked,
            LocalDateTime createdAt, LocalDateTime handledAt
    ) {}

    // 관리자: 신고된 대화 내용 (보낸 사람 닉네임 포함)
    public record AdminMessage(Long id, String senderNickname, boolean fromReporter, String type, String content, Double lat, Double lng, LocalDateTime createdAt) {}

    // 관리자: 처리 (status = RESOLVED / DISMISSED, closeRoom = 대화 종료)
    public record AdminHandleRequest(String status, Boolean closeRoom, String note) {}
}
