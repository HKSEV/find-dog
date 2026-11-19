package com.hbk.dto;

import java.time.LocalDateTime;
import java.util.List;

// 💡 회원 공개 프로필 (글 상세의 글쓴이, 채팅 상대): 닉네임·사진·쓴 글만 (실명·연락처·이메일은 없음)
public record MemberProfileDto(Long id, String nickname, String image, List<Post> missingPosts, List<Post> communityPosts) {
    // kind: 실종·제보 글은 LOST / FOUND, 커뮤니티 글은 카테고리
    public record Post(Long id, String title, String kind, String status, String image, LocalDateTime createdAt) {}
}
