package com.hbk.repository;

import com.hbk.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // afterId 보다 뒤에 온 메시지 (처음엔 afterId = 0)
    @Query("SELECT m FROM ChatMessage m WHERE m.room.id = :roomId AND m.id > :afterId ORDER BY m.id ASC")
    List<ChatMessage> findAfter(@Param("roomId") Long roomId, @Param("afterId") Long afterId, Pageable pageable);

    // 글을 지울 때 그 글 대화방들의 메시지도 지움
    @Modifying
    @Query("DELETE FROM ChatMessage m WHERE m.room.id IN (SELECT r.id FROM ChatRoom r WHERE r.post.id = :postId)")
    void deleteByPostId(@Param("postId") Long postId);

    // 안 읽은 수: 상대가 보낸 메시지 중 내가 읽은 시각 뒤에 온 것
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.room.id = :roomId AND m.sender.id <> :memberId"
            + " AND (:readAt IS NULL OR m.createdAt > :readAt)")
    long countUnread(@Param("roomId") Long roomId, @Param("memberId") Long memberId, @Param("readAt") LocalDateTime readAt);
}
