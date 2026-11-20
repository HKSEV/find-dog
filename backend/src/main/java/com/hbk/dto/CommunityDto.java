package com.hbk.dto;

import com.hbk.domain.CommunityCategory;
import com.hbk.entity.CommunityComment;
import com.hbk.entity.CommunityPost;
import com.hbk.entity.Member;

import java.time.LocalDateTime;
import java.util.List;

// 💡 커뮤니티 회원 글 주고받는 값
public class CommunityDto {

    // 목록·상세. authorName은 닉네임 (실명 대신), mine은 상세에서 내가 쓴 글인지
    //    likeCount·commentCount: 공감·댓글 수, liked: 내가 공감했는지 (상세에서 로그인했을 때만)
    public record Post(Long id, CommunityCategory category, String title, String content,
                       List<String> mediaUrls, String authorName, String authorImageUrl, Long authorId,
                       boolean mine, LocalDateTime createdAt, LocalDateTime updatedAt,
                       long likeCount, long commentCount, boolean liked) {
        public static Post of(CommunityPost p, boolean mine) {
            return of(p, mine, 0, 0, false);
        }

        public static Post of(CommunityPost p, boolean mine, long likeCount, long commentCount, boolean liked) {
            return new Post(p.getId(), p.getCategory(), p.getTitle(), p.getContent(),
                    List.copyOf(p.getMediaUrls()),
                    nicknameOf(p.getAuthor()),
                    p.getAuthor().getProfileImageUrl(),
                    p.getAuthor().getId(), // 글쓴이 프로필 (/profile/?id=)
                    mine, p.getCreatedAt(), p.getUpdatedAt(), likeCount, commentCount, liked);
        }
    }

    // 댓글. mine: 내가 쓴 댓글인지 (지우기 버튼)
    public record Comment(Long id, String content, String authorName, String authorImageUrl, Long authorId,
                          boolean mine, LocalDateTime createdAt) {
        public static Comment of(CommunityComment c, Long viewerId) {
            return new Comment(c.getId(), c.getContent(), nicknameOf(c.getAuthor()), c.getAuthor().getProfileImageUrl(),
                    c.getAuthor().getId(), viewerId != null && viewerId.equals(c.getAuthor().getId()), c.getCreatedAt());
        }
    }

    public record CommentRequest(String content) {
    }

    // 공감 누른 뒤: 지금 상태와 수
    public record LikeResult(boolean liked, long likeCount) {
    }

    private static String nicknameOf(Member member) {
        String nickname = member.getNickname();
        return nickname != null && !nickname.isBlank() ? nickname : "익명";
    }

    // 쓰기·고치기 (multipart의 "dto" 부분). keepMediaUrls: 고칠 때 남겨 둘 기존 사진
    public record Request(CommunityCategory category, String title, String content, List<String> keepMediaUrls) {
    }
}
