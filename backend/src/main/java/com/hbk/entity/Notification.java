package com.hbk.entity;

import com.hbk.domain.NotificationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// 회원 한 명에게 가는 알림 (예: 입양 신청이 보호소에 전달됐어요)
@Entity
@Getter
@Setter
@Table(name = "notifications", indexes = @Index(name = "idx_notifications_member", columnList = "member_id, id"))
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 받는 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    @Column(nullable = false, length = 255)
    private String message;

    // 누르면 갈 화면 (예: /mypage/applications)
    @Column(length = 255)
    private String link;

    // READ는 DB 예약어라 컬럼 이름은 is_read
    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
