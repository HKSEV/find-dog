package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// 💡 이야기 글 공감(하트): 글 하나에 회원 한 명이 한 번 (다시 누르면 취소)
@Entity
@Getter
@Setter
@Table(name = "community_post_likes", uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "member_id"}))
public class CommunityPostLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
