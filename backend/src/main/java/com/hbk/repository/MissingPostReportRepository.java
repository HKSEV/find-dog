package com.hbk.repository;

import com.hbk.entity.MissingPostReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MissingPostReportRepository extends JpaRepository<MissingPostReport, Long> {
    Optional<MissingPostReport> findByPostIdAndReporterId(Long postId, Long reporterId);

    // 처리 안 된 신고가 먼저, 그다음 최신순
    @Query("SELECT r FROM MissingPostReport r ORDER BY CASE WHEN r.status = 'PENDING' THEN 0 ELSE 1 END, r.id DESC")
    List<MissingPostReport> findAllForAdmin();

    // 회원 관리: 이 회원의 글이 받은 신고 수
    long countByPostAuthorId(Long authorId);

    // 글을 지울 때 그 글의 신고도 지움
    @Modifying
    @Query("DELETE FROM MissingPostReport r WHERE r.post.id = :postId")
    void deleteByPostId(@Param("postId") Long postId);
}
