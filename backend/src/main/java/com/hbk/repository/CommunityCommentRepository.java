package com.hbk.repository;

import com.hbk.entity.CommunityComment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {
    // 오래된 순 (대화처럼 아래로 이어지게)
    @Query("SELECT c FROM CommunityComment c JOIN FETCH c.author WHERE c.post.id = :postId ORDER BY c.id ASC")
    List<CommunityComment> findByPost(@Param("postId") Long postId, Pageable pageable);

    long countByPostId(Long postId);

    // 목록: 글마다 댓글 수 [글 ID, 수]
    @Query("SELECT c.post.id, COUNT(c) FROM CommunityComment c WHERE c.post.id IN :postIds GROUP BY c.post.id")
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);

    @Modifying
    @Query("DELETE FROM CommunityComment c WHERE c.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

    // 탈퇴할 때 내가 쓴 댓글
    @Modifying
    @Query("DELETE FROM CommunityComment c WHERE c.author.id = :memberId")
    void deleteByAuthorId(@Param("memberId") Long memberId);
}
