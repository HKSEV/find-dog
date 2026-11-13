package com.hbk.service;

import com.hbk.dto.MyAccountDto;
import com.hbk.entity.Member;
import com.hbk.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyAccountService {

    private final MemberRepository memberRepository;

    public MyAccountDto.Response getMe(String email) {
        return MyAccountDto.Response.of(findMember(email));
    }

    @Transactional
    public MyAccountDto.Response updateMe(String email, MyAccountDto.UpdateRequest request) {
        Member member = findMember(email);

        String nickname = trim(request.nickname());
        String name = trim(request.name());
        String phone = trim(request.phone()).replace("-", "");

        if (nickname.isEmpty()) throw badRequest("닉네임을 적어 주세요.");
        if (nickname.length() > 20) throw badRequest("닉네임은 20자까지 쓸 수 있어요.");
        if (!nickname.equals(member.getNickname()) && memberRepository.existsByNickname(nickname)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 누군가 쓰고 있는 닉네임이에요.");
        }
        if (name.isEmpty()) throw badRequest("이름을 적어 주세요.");
        if (!phone.matches("\\d{9,11}")) throw badRequest("휴대폰 번호를 숫자로 적어 주세요.");

        String address = trim(request.address());
        if (address.length() > 500) throw badRequest("주소가 너무 길어요.");

        member.setNickname(nickname);
        member.setName(name);
        member.setPhone(phone);
        member.setAddress(address.isEmpty() ? null : address);
        // 사진: null이면 그대로, ""이면 지움, 값이 있으면 바꿈
        if (request.profileImageUrl() != null) {
            String url = request.profileImageUrl().trim();
            member.setProfileImageUrl(url.isEmpty() ? null : url);
        }
        return MyAccountDto.Response.of(member);
    }

    // 카카오 첫 가입: 약관 동의와 이름·휴대폰을 받아 가입을 마침
    @Transactional
    public MyAccountDto.Response completeSignup(String email, MyAccountDto.CompleteSignupRequest request) {
        Member member = findMember(email);
        if (!KakaoMemberService.needsSignup(member)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 가입을 마쳤어요.");
        }
        if (!Boolean.TRUE.equals(request.agreed())) throw badRequest("필수 약관에 모두 동의해 주세요.");
        String userType = trim(request.userType());
        if (!userType.equals("GENERAL") && !userType.equals("BUSINESS")) throw badRequest("가입 유형을 골라 주세요.");

        member.setUserType(userType);
        member.setMarketingAgreed(Boolean.TRUE.equals(request.marketingAgreed()));
        return updateMe(email, new MyAccountDto.UpdateRequest(request.nickname(), request.name(), request.phone(), null, null));
    }

    private Member findMember(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요."));
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }
}
