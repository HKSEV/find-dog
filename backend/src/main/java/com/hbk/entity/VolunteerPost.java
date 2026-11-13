package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 봉사 모집 글 (관리자가 등록). 정원까지 선착순으로 신청을 받음
@Entity
@Getter
@Setter
@Table(name = "volunteer_posts")
public class VolunteerPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // 봉사 장소 (예: 서울 마포구 ○○보호소)
    @Column(nullable = false, length = 255)
    private String place;

    // 봉사 날짜와 시간 ("10:00" 형식)
    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @Column(name = "start_time", nullable = false, length = 5)
    private String startTime;

    @Column(name = "end_time", nullable = false, length = 5)
    private String endTime;

    // 모집 인원
    @Column(nullable = false)
    private int capacity;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    // 관리자가 일찍 마감했는지 (날짜가 지나면 따로 바꾸지 않아도 마감으로 봄)
    @Column(nullable = false)
    private boolean closed = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
