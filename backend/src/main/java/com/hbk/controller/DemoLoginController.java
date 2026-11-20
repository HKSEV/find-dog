package com.hbk.controller;

import com.hbk.config.DemoAccounts;
import com.hbk.entity.Member;
import com.hbk.repository.MemberRepository;
import com.hbk.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 💡 시연 로그인 (홈 로고를 길게 누르면): 비밀번호 없이 시연 계정으로 들어감
//    데모 데이터를 켠 서버(DEMO_DATA=true)에서만 동작, 그 밖에는 없는 주소처럼 404
@RestController
@RequestMapping("/api/members/demo-login")
@RequiredArgsConstructor
public class DemoLoginController {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.demo-data:false}")
    private boolean demoEnabled;

    // POST /api/members/demo-login {role: "owner" | "finder"}
    @PostMapping
    public ResponseEntity<?> login(@RequestBody(required = false) Map<String, String> body) {
        if (!demoEnabled) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("시연 계정을 쓸 수 없어요.");
        String email = "finder".equals(body == null ? null : body.get("role")) ? DemoAccounts.FINDER : DemoAccounts.OWNER;
        Member member = memberRepository.findByEmail(email).orElse(null);
        if (member == null || member.isSuspended()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("시연 계정을 쓸 수 없어요.");
        return ResponseEntity.ok(Map.of(
                "token", jwtTokenProvider.createToken(email),
                "nickname", member.getNickname(),
                "email", email));
    }
}
