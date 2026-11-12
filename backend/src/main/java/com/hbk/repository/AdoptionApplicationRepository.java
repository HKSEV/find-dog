package com.hbk.repository;

import com.hbk.domain.ApplicationStatus;
import com.hbk.entity.AdoptionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AdoptionApplicationRepository extends JpaRepository<AdoptionApplication, Long> {

    // 내 신청 내역 (최신순)
    List<AdoptionApplication> findByMemberEmailOrderByIdDesc(String email);

    // 같은 동물에 아직 진행 중인 내 신청이 있는지 (중복 신청 막기)
    boolean existsByMemberEmailAndShelterAnimalIdAndStatusIn(String email, Long shelterAnimalId, Collection<ApplicationStatus> statuses);

    // 관리자 목록 (최신순, 상태로 거르기)
    List<AdoptionApplication> findAllByOrderByIdDesc();

    List<AdoptionApplication> findByStatusOrderByIdDesc(ApplicationStatus status);

    // 입양이 확정되면 같은 동물의 다른 진행 중 신청을 정리할 때 사용
    List<AdoptionApplication> findByShelterAnimalIdAndStatusIn(Long shelterAnimalId, Collection<ApplicationStatus> statuses);
}
