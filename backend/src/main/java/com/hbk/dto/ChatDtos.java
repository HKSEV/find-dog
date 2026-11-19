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
            long unread
    ) {}

    public record Message(Long id, boolean mine, String type, String content, Double lat, Double lng, LocalDateTime createdAt) {}

    public record SendRequest(String type, String content, Double lat, Double lng) {}

    public record OpenRequest(Long postId) {}
}
