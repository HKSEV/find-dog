package com.hbk.entity;

import com.hbk.domain.VolunteerApplicationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 봉사 신청 (회원 1명이 모집 글 1개에 신청). 취소 후 다시 신청하면 새로 한 줄이 생김
@Entity
@Getter
@Setter
@Table(name = "volunteer_applications", indexes = @Index(name = "idx_volunteer_applications_post", columnList = "post_id, status"))
public class VolunteerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private VolunteerPost post;

    // 신청서에 적은 값 (회원 정보와 달라도 보호소에 이 값으로 전달)
    @Column(name = "applicant_name", nullable = false, length = 50)
    private String applicantName;

    @Column(name = "applicant_phone", nullable = false, length = 30)
    private String applicantPhone;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VolunteerApplicationStatus status = VolunteerApplicationStatus.CONFIRMED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
