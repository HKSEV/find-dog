package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// 💡 채팅 신고: 대화방 하나를 참여자 한 명이 신고 (같은 사람이 다시 신고하면 내용만 바뀜)
//    관리자는 신고된 대화방만 내용을 볼 수 있음
@Entity
@Getter
@Setter
@Table(name = "chat_reports", uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "reporter_id"}))
public class ChatReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom room;

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
