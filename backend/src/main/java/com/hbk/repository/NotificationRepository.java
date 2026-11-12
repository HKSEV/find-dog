package com.hbk.repository;

import com.hbk.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 알림 화면: 최근 50개
    List<Notification> findTop50ByMemberEmailOrderByIdDesc(String email);

    // 헤더 종 아이콘의 빨간 점
    boolean existsByMemberEmailAndReadFalse(String email);

    // 알림 화면을 열면 모두 읽음으로
    List<Notification> findByMemberEmailAndReadFalse(String email);
}
