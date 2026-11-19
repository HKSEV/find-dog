package com.hbk.repository;

import com.hbk.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByPostIdAndGuestId(Long postId, Long guestId);

    // 내가 글쓴이거나 연락한 사람인 대화방 (최근 대화 순)
    @Query("SELECT r FROM ChatRoom r WHERE r.owner.id = :memberId OR r.guest.id = :memberId"
            + " ORDER BY COALESCE(r.lastMessageAt, r.createdAt) DESC")
    List<ChatRoom> findMine(@Param("memberId") Long memberId);

    // 글을 지울 때 그 글의 대화방도 지움 (SQLite는 외래키 연쇄 삭제가 안 만들어져서 직접)
    @Modifying
    @Query("DELETE FROM ChatRoom r WHERE r.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);
}
