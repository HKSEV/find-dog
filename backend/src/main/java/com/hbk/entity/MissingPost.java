package com.hbk.entity;

import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.catalina.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "missing_posts")
public class MissingPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status = PostStatus.MISSING;

    // 잃어버렸어요(LOST) / 발견했어요(FOUND). 예전 글은 비어 있어서 LOST로 봄
    @Enumerated(EnumType.STRING)
    private PostType type;

    // 잃어버린 때 / 발견한 때
    private LocalDateTime occurredAt;

    private String breed;
    private String gender;
    private String age;
    private String weight;
    private String color;
    private String rescueLocation;

    @ElementCollection
    private List<String> mediaUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Member author;

    private LocalDateTime createdAt;
    private LocalDateTime updateAt;


}
