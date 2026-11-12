package com.hbk.entity;

import com.hbk.domain.ApplicationStatus;
import com.hbk.domain.HousingType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 입양 신청서 (보호 동물 1마리에 대한 회원 1명의 신청)
@Entity
@Getter
@Setter
@Table(name = "adoption_applications")
public class AdoptionApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 신청한 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 신청한 보호 동물
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_animal_id", nullable = false)
    private ShelterAnimal shelterAnimal;

    // 신청서 내용 (회원 정보와 달라도 신청서에 적은 값을 보호소에 전달)
    @Column(name = "applicant_name", nullable = false, length = 50)
    private String applicantName;

    @Column(name = "applicant_phone", nullable = false, length = 30)
    private String applicantPhone;

    @Enumerated(EnumType.STRING)
    @Column(name = "housing_type", nullable = false, length = 20)
    private HousingType housingType;

    @Column(name = "has_pet_experience", nullable = false)
    private boolean hasPetExperience;

    @Column(name = "family_agreed", nullable = false)
    private boolean familyAgreed;

    @Column(columnDefinition = "TEXT")
    private String message;

    // 진행 상태와 운영자가 남긴 사유 (예: "다른 가족과 입양이 확정됐어요")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.RECEIVED;

    @Column(name = "status_reason", length = 255)
    private String statusReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
