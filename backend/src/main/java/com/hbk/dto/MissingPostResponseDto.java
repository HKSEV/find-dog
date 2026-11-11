package com.hbk.dto;

import com.hbk.entity.MissingPost;

import lombok.Getter;
import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;


import java.time.LocalDateTime;
import java.util.List;

@Getter
public class MissingPostResponseDto {
private Long id;
private String title, content, breed, gender, age, weight, color, rescueLocation, authorName;
private PostStatus status;
private PostType type;
private LocalDateTime occurredAt;
private List<String> mediaUrls;
private LocalDateTime createdAt;

/*
데이터베이스에서 조회한 엔티티 객체(MissingPost)를 전달받아,
프론트엔드가 이해하기 쉬운 DTO 형태로 변환해 주는 생성자(Constructor)입니다.
* */

public MissingPostResponseDto(MissingPost post){
this.id = post.getId();
this.title = post.getTitle();
this.status =post.getStatus();
this.content = post.getContent();
this.breed = post.getBreed();
this.gender = post.getGender();
this.age = post.getAge();
this.weight = post.getWeight();
this.color = post.getColor();
this.rescueLocation = post.getRescueLocation();
// 목록은 누구나 볼 수 있어서 실명(getUsername) 대신 닉네임을 보여줌
this.authorName = post.getAuthor() != null && post.getAuthor().getNickname() != null && !post.getAuthor().getNickname().isBlank()
        ? post.getAuthor().getNickname()
        : "익명";
this.mediaUrls = post.getMediaUrls();
this.createdAt = post.getCreatedAt();
this.type = post.getType() != null ? post.getType() : PostType.LOST;
this.occurredAt = post.getOccurredAt();
}
}
