package com.hbk.repository;

import com.hbk.entity.CommunityPostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CommunityPostLikeRepository extends JpaRepository<CommunityPostLike, Long> {
    Optional<CommunityPostLike> findByPostIdAndMemberId(Long postId, Long memberId);

    long countByPostId(Long postId);

    // 목록: 글마다 공감 수 [글 ID, 수]
    @Query("SELECT l.post.id, COUNT(l) FROM CommunityPostLike l WHERE l.post.id IN :postIds GROUP BY l.post.id")
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds);

    // 글을 지울 때 (SQLite는 외래키 연쇄 삭제가 없어서 직접)
    @Modifying
    @Query("DELETE FROM CommunityPostLike l WHERE l.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);

    // 탈퇴할 때 내가 누른 공감
    @Modifying
    @Query("DELETE FROM CommunityPostLike l WHERE l.member.id = :memberId")
    void deleteByMemberId(@Param("memberId") Long memberId);
}
