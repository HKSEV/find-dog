package com.hbk.repository;

import com.hbk.entity.ChatReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatReportRepository extends JpaRepository<ChatReport, Long> {
    Optional<ChatReport> findByRoomIdAndReporterId(Long roomId, Long reporterId);

    boolean existsByRoomId(Long roomId);

    // 회원 관리: 이 회원이 대화에서 받은 신고 수 (상대가 신고한 것)
    @Query("SELECT COUNT(r) FROM ChatReport r WHERE r.reporter.id <> :memberId AND (r.room.owner.id = :memberId OR r.room.guest.id = :memberId)")
    long countReceived(@Param("memberId") Long memberId);

    // 처리 안 된 신고가 먼저, 그다음 최신순
    @Query("SELECT r FROM ChatReport r ORDER BY CASE WHEN r.status = 'PENDING' THEN 0 ELSE 1 END, r.id DESC")
    List<ChatReport> findAllForAdmin();

    // 글을 지울 때 그 글 대화방들의 신고도 지움
    @Modifying
    @Query("DELETE FROM ChatReport r WHERE r.room.id IN (SELECT c.id FROM ChatRoom c WHERE c.post.id = :postId)")
    void deleteByPostId(@Param("postId") Long postId);
}
