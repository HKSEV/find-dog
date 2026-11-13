package com.hbk.security;

import com.hbk.entity.Member;
import com.hbk.service.KakaoMemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

// 카카오 로그인이 끝나면 우리 토큰을 만들어 프런트 /oauth/kakao 로 보냄
// 토큰은 # 뒤에 붙여서 서버 로그나 Referer 에 남지 않게 함
@Slf4j
@Component
@RequiredArgsConstructor
public class KakaoLoginHandlers {

    private final KakaoMemberService kakaoMemberService;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthenticationSuccessHandler success() {
        return (HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.Authentication authentication) -> {
            Member member;
            try {
                OAuth2User kakaoUser = (OAuth2User) authentication.getPrincipal();
                member = kakaoMemberService.findOrCreate(kakaoUser.getAttributes());
            } catch (RuntimeException e) {
                // 회원 저장 실패 등: 서버 오류 화면 대신 로그인 화면으로
                log.error("카카오 회원 처리 실패", e);
                if (request.getSession(false) != null) request.getSession(false).invalidate();
                response.sendRedirect(frontendUrl + "/login?error=kakao");
                return;
            }
            String token = jwtTokenProvider.createToken(member.getEmail());

            // 카카오 로그인용 세션은 더 쓰지 않음 (우리 서비스는 토큰으로 로그인 유지)
            if (request.getSession(false) != null) request.getSession(false).invalidate();

            response.sendRedirect(frontendUrl + "/oauth/kakao#token=" + encode(token)
                    + "&nickname=" + encode(member.getNickname())
                    + "&signup=" + (KakaoMemberService.needsSignup(member) ? "1" : "0"));
        };
    }

    // 동의 취소, 키 오류 등은 로그인 화면으로 돌려보냄
    public AuthenticationFailureHandler failure() {
        return (request, response, exception) -> {
            if (request.getSession(false) != null) request.getSession(false).invalidate();
            response.sendRedirect(frontendUrl + "/login?error=kakao");
        };
    }

    private static String encode(String value) throws IOException {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
