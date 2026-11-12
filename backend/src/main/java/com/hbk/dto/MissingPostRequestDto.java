package com.hbk.dto;

import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;
import com.hbk.domain.TimeOfDay;
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
private TimeOfDay occurredTime; // 시간대 (EXACT면 occurredAt의 시:분이 정확한 시각)
private Double lat, lng; // 지도에서 고른 장소 좌표


}
