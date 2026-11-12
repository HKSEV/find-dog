package com.hbk.dto;

import com.hbk.domain.ApplicationStatus;
import com.hbk.domain.HousingType;
import com.hbk.entity.AdoptionApplication;
import com.hbk.entity.ShelterAnimal;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 입양 신청 응답 (신청자 본인과 관리자에게만 내려감)
@Getter
public class AdoptionApplicationResponseDto {
    private final Long id;
    private final ApplicationStatus status;
    private final String statusReason;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    // 신청서 내용
    private final String applicantName;
    private final String applicantPhone;
    private final HousingType housingType;
    private final boolean hasPetExperience;
    private final boolean familyAgreed;
    private final String message;

    // 신청한 동물 요약 (화면에서 사진·이름을 바로 보여주려고)
    private final Long animalId;
    private final String animalBreed;
    private final String animalGender;
    private final String animalImageUrl;
    private final String animalNoticeNo;
    private final LocalDate animalRegDate;
    private final String animalRescueLocation;

    public AdoptionApplicationResponseDto(AdoptionApplication application) {
        this.id = application.getId();
        this.status = application.getStatus();
        this.statusReason = application.getStatusReason();
        this.createdAt = application.getCreatedAt();
        this.updatedAt = application.getUpdatedAt();
        this.applicantName = application.getApplicantName();
        this.applicantPhone = application.getApplicantPhone();
        this.housingType = application.getHousingType();
        this.hasPetExperience = application.isHasPetExperience();
        this.familyAgreed = application.isFamilyAgreed();
        this.message = application.getMessage();

        ShelterAnimal animal = application.getShelterAnimal();
        this.animalId = animal.getId();
        this.animalBreed = animal.getBreed();
        this.animalGender = animal.getGender() != null ? animal.getGender().name() : null;
        this.animalImageUrl = animal.getImageUrl();
        this.animalNoticeNo = animal.getNoticeNo();
        this.animalRegDate = animal.getRegDate();
        this.animalRescueLocation = animal.getRescueLocation();
    }
}
