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
    //    내가 나간 대화방은 빼고
    //    메시지가 하나도 없는 대화방(채팅하기만 누르고 안 보낸 방)도 빼고: 글 상세에서 다시 채팅하기를 누르면 같은 방이 열림
    @Query("SELECT r FROM ChatRoom r WHERE r.lastMessageAt IS NOT NULL"
            + " AND ((r.owner.id = :memberId AND r.ownerLeft = false) OR (r.guest.id = :memberId AND r.guestLeft = false))"
            + " ORDER BY r.lastMessageAt DESC")
    List<ChatRoom> findMine(@Param("memberId") Long memberId);

    // 글을 지울 때 그 글의 대화방도 지움 (SQLite는 외래키 연쇄 삭제가 안 만들어져서 직접)
    @Modifying
    @Query("DELETE FROM ChatRoom r WHERE r.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);
}
