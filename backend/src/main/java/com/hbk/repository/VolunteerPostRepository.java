package com.hbk.repository;

import com.hbk.entity.VolunteerPost;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerPostRepository extends JpaRepository<VolunteerPost, Long> {

    // 사용자 목록: 오늘 이후 봉사만, 가까운 날짜 순
    List<VolunteerPost> findByActivityDateGreaterThanEqualOrderByActivityDateAscStartTimeAscIdAsc(LocalDate from);

    // 관리자 목록: 최근 등록 순
    List<VolunteerPost> findAllByOrderByIdDesc();

    // 신청할 때 글을 잠가서 두 사람이 동시에 마지막 자리를 가져가지 않게
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from VolunteerPost p where p.id = :id")
    Optional<VolunteerPost> findByIdForUpdate(@Param("id") Long id);
}
