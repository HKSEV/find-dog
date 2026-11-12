package com.hbk.dto;

import com.hbk.domain.HousingType;
import lombok.Getter;
import lombok.Setter;

// 입양 신청서 작성 요청
@Getter
@Setter
public class AdoptionApplicationRequestDto {
    private Long shelterAnimalId;
    private String applicantName;
    private String applicantPhone;
    private HousingType housingType;
    private Boolean hasPetExperience;
    private Boolean familyAgreed;
    private String message;
    private Boolean agreeToShare; // 신청서를 보호소에 전달하는 데 동의 (필수)
}
