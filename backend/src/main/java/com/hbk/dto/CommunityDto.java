package com.hbk.dto;

import com.hbk.domain.CommunityCategory;
import com.hbk.entity.CommunityPost;

import java.time.LocalDateTime;
import java.util.List;

// 💡 커뮤니티 회원 글 주고받는 값
public class CommunityDto {

    // 목록·상세. authorName은 닉네임 (실명 대신), mine은 상세에서 내가 쓴 글인지
    public record Post(Long id, CommunityCategory category, String title, String content,
                       List<String> mediaUrls, String authorName, String authorImageUrl,
                       boolean mine, LocalDateTime createdAt, LocalDateTime updatedAt) {
        public static Post of(CommunityPost p, boolean mine) {
            String nickname = p.getAuthor().getNickname();
            return new Post(p.getId(), p.getCategory(), p.getTitle(), p.getContent(),
                    List.copyOf(p.getMediaUrls()),
                    nickname != null && !nickname.isBlank() ? nickname : "익명",
                    p.getAuthor().getProfileImageUrl(),
                    mine, p.getCreatedAt(), p.getUpdatedAt());
        }
    }

    // 쓰기·고치기 (multipart의 "dto" 부분). keepMediaUrls: 고칠 때 남겨 둘 기존 사진
    public record Request(CommunityCategory category, String title, String content, List<String> keepMediaUrls) {
    }
}
