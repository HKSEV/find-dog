package com.hbk.dto;

import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class MissingPostRequestDto {
private String title, content, breed, gender, age, weight, color,
    rescueLocation;
private List<String> mediaUrls;
private PostType type; // LOST / FOUND (비어 있으면 LOST)
private LocalDateTime occurredAt; // 잃어버린 때 / 발견한 때 (예: 2026-11-11T14:30)


}
