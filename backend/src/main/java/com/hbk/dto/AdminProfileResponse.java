package com.hbk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AdminProfileResponse {
    private String name;
    private String nickname;
    private String email;
    private String phone;
    private String profileImageUrl;
    private String adminLevel;
    private String department;
}
