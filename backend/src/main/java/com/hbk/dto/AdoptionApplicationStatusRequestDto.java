package com.hbk.dto;

import com.hbk.domain.ApplicationStatus;
import lombok.Getter;
import lombok.Setter;

// 관리자가 신청 상태를 바꿀 때 (사유는 선택)
@Getter
@Setter
public class AdoptionApplicationStatusRequestDto {
    private ApplicationStatus status;
    private String reason;
}
