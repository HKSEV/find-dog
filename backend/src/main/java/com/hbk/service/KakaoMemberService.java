package com.hbk.service;

import com.hbk.entity.Member;
import com.hbk.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

// 카카오 로그인: 처음 온 회원은 만들고, 이미 있으면 그대로 돌려줌
@Service
@RequiredArgsConstructor
public class KakaoMemberService {

    public static final String PROVIDER = "KAKAO";
    private static final int NICKNAME_MAX = 20;

    private final MemberRepository memberRepository;

    @Transactional
    public Member findOrCreate(Map<String, Object> attributes) {
        String kakaoId = String.valueOf(attributes.get("id"));
        return memberRepository.findByProviderAndProviderId(PROVIDER, kakaoId)
                .orElseGet(() -> memberRepository.save(newMember(kakaoId, attributes)));
    }

    // 이름·휴대폰은 카카오가 주지 않아서 비워 두고, 추가 정보 화면에서 받음
    private Member newMember(String kakaoId, Map<String, Object> attributes) {
        Map<?, ?> profile = profileOf(attributes);

        Member member = new Member();
        member.setProvider(PROVIDER);
        member.setProviderId(kakaoId);
        // 로그인 토큰이 이메일을 쓰므로, 이메일이 없는 카카오 회원은 겹치지 않는 값을 넣어 둠
        member.setEmail("kakao_" + kakaoId + "@kakao.finddog");
        // 카카오 회원은 비밀번호로 로그인하지 않음 (아무도 모르는 값)
        member.setPassword(UUID.randomUUID().toString());
        member.setNickname(uniqueNickname(text(profile.get("nickname"))));
        member.setName("");
        member.setPhone("");
        member.setUserType("GENERAL");
        if (!Boolean.TRUE.equals(profile.get("is_default_image"))) {
            String image = text(profile.get("profile_image_url"));
            member.setProfileImageUrl(image.isEmpty() ? null : image.replaceFirst("^http://", "https://"));
        }
        return member;
    }

    private Map<?, ?> profileOf(Map<String, Object> attributes) {
        if (attributes.get("kakao_account") instanceof Map<?, ?> account
                && account.get("profile") instanceof Map<?, ?> profile) {
            return profile;
        }
        return Map.of();
    }

    private String uniqueNickname(String kakaoNickname) {
        String base = kakaoNickname.isEmpty() ? "회원" : kakaoNickname;
        if (base.length() > NICKNAME_MAX - 4) base = base.substring(0, NICKNAME_MAX - 4);
        if (!memberRepository.existsByNickname(base)) return base;
        String candidate;
        do {
            candidate = base + ThreadLocalRandom.current().nextInt(1000, 10000);
        } while (memberRepository.existsByNickname(candidate));
        return candidate;
    }

    private static String text(Object value) {
        return value == null ? "" : value.toString().trim();
    }

    // 이름·휴대폰을 아직 안 받은 카카오 회원
    public static boolean needsSignup(Member member) {
        return PROVIDER.equals(member.getProvider())
                && (member.getPhone() == null || member.getPhone().isBlank());
    }
}
