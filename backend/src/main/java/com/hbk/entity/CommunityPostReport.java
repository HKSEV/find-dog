package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// 💡 이야기(커뮤니티) 글 신고: 글 하나를 회원 한 명이 신고 (같은 사람이 다시 신고하면 내용만 바뀜)
@Entity
@Getter
@Setter
@Table(name = "community_post_reports", uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "reporter_id"}))
public class CommunityPostReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id", nullable = false)
    private Member reporter;

    @Column(nullable = false, length = 20)
    private String reason; // SPAM / ABUSE / FAKE / PRIVACY / ETC

    @Column(length = 500)
    private String detail;

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING / RESOLVED / DISMISSED

    @Column(name = "admin_note", length = 255)
    private String adminNote;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "handled_at")
    private LocalDateTime handledAt;
}
