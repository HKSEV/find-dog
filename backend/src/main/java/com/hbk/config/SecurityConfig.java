package com.hbk.config; // 본인 패키지 경로에 맞게 확인

import com.hbk.security.JwtAuthenticationFilter;
import com.hbk.security.KakaoLoginHandlers;
import com.hbk.security.JwtTokenProvider;
import com.hbk.security.AdminJwtAuthenticationFilter;
import com.hbk.security.AdminRequestMatcher;
import com.hbk.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final AdminAuthService adminAuthService;
    private final KakaoLoginHandlers kakaoLoginHandlers;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new AdminJwtAuthenticationFilter(adminAuthService), UsernamePasswordAuthenticationFilter.class)
                // 카카오 로그인: /oauth2/authorization/kakao 로 시작해서 /login/oauth2/code/kakao 로 돌아옴
                .oauth2Login(oauth -> oauth
                        .successHandler(kakaoLoginHandlers.success())
                        .failureHandler(kakaoLoginHandlers.failure()))
                // 로그인 안 된 요청을 카카오 로그인으로 보내지 않고 예전처럼 403으로 응답
                .exceptionHandling(e -> e.authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(new AdminRequestMatcher()).hasRole("ADMIN")
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
