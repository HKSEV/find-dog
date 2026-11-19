package com.hbk.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
public class AdminRegistrationRequest {
    private String sourceType;
    private String sourceUrl;
    private String region;
    private String noticeNo;
    private String birthYear;
    private String gender;
    private Double weight;
    private String imageUrl;
    private String hashtag;
    private String title;
    private String content;
    private String thumbnailUrl;
    private String mediaType;
    private String mediaUrl;
    private String youtubeUrl;
    private String videoUrl;
    private String attachmentUrl;
    private String status;
    private String name; // 보호 동물 임시 이름 (선택)
    private String breed;
    private String rescueLocation;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate regDate;

    private MultipartFile imageFile;
}
