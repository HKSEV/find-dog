package com.hbk.dto;

import com.hbk.entity.Member;
import com.hbk.service.KakaoMemberService;

// 💡 마이 > 설정 > 정보 수정 (로그인한 본인 정보만)
public class MyAccountDto {

    // 내 정보 (비밀번호는 내려주지 않음)
    public record Response(String email, String nickname, String name, String phone,
                           String address, String profileImageUrl, String userType, String provider,
                           boolean signupCompleted) {
        public static Response of(Member m) {
            return new Response(m.getEmail(), m.getNickname(), m.getName(), m.getPhone(),
                    m.getAddress(), m.getProfileImageUrl(), m.getUserType(), m.getProvider(),
                    !KakaoMemberService.needsSignup(m));
        }
    }

    // 고칠 수 있는 값 (이메일·비밀번호·가입 유형은 여기서 못 바꿈)
    public record UpdateRequest(String nickname, String name, String phone, String address, String profileImageUrl) {
    }

    // 카카오로 처음 가입할 때 받는 추가 정보 (약관 동의 + 이름·휴대폰·닉네임)
    public record CompleteSignupRequest(String nickname, String name, String phone, String userType,
                                        Boolean agreed, Boolean marketingAgreed) {
    }
}
