package com.hbk.repository;

import com.hbk.domain.VolunteerApplicationStatus;
import com.hbk.entity.VolunteerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerApplicationRepository extends JpaRepository<VolunteerApplication, Long> {

    long countByPostIdAndStatus(Long postId, VolunteerApplicationStatus status);

    // 목록에서 글마다 확정 인원 (글 id, 인원)
    @Query("select a.post.id, count(a) from VolunteerApplication a " +
            "where a.status = :status and a.post.id in :postIds group by a.post.id")
    List<Object[]> countByPostIds(@Param("postIds") Collection<Long> postIds, @Param("status") VolunteerApplicationStatus status);

    // 상세에서 내가 이미 신청했는지
    Optional<VolunteerApplication> findFirstByPostIdAndMemberEmailAndStatus(Long postId, String email, VolunteerApplicationStatus status);

    // 마이 > 봉사 신청 내역 (최신순)
    List<VolunteerApplication> findByMemberEmailOrderByIdDesc(String email);

    // 관리자: 글 하나의 신청자 (신청 순)
    List<VolunteerApplication> findByPostIdOrderByIdAsc(Long postId);
}
