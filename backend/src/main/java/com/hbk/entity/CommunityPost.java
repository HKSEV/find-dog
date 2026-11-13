package com.hbk.entity;

import com.hbk.domain.CommunityCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// 커뮤니티 회원 글 (입양 후기, 구조 이야기, 질문). 사진은 최대 5장
@Entity
@Getter
@Setter
@Table(name = "community_posts", indexes = @Index(name = "idx_community_posts_category", columnList = "category, id"))
public class CommunityPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // varchar로 둠: MariaDB enum 컬럼으로 만들면 분류를 늘릴 때 ddl-auto가 컬럼을 고치지 못해 저장이 실패함
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30, columnDefinition = "varchar(30)")
    private CommunityCategory category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 올린 순서대로 (첫 장이 목록 썸네일)
    @ElementCollection
    @CollectionTable(name = "community_post_media_urls", joinColumns = @JoinColumn(name = "post_id"))
    @OrderColumn(name = "sort_order")
    @Column(name = "url", length = 500)
    private List<String> mediaUrls = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member author;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
