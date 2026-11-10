package com.hbk.controller;

import com.hbk.dto.AdminRequest;
import com.hbk.security.AdminPrincipal;
import com.hbk.service.AdminAuthService;
import com.hbk.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;


import java.util.Collections;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
//이 클래스는 화면(HTML)을 뱉는 게 아니라,
// 데이터(JSON)만 깔끔하게 뱉는 전문 서빙 점원이야!" 라고 선언합니다.
@RequestMapping("/api/admin")
@RequiredArgsConstructor
//이 클래스는 화면(HTML)을 뱉는 게 아니라,
// 데이터(JSON)만 깔끔하게 뱉는 전문 서빙 점원이야!" 라고 선언합니다.
public class AdminController {

    //점원(Controller)이 주방장(Service)에게 일을
    // 시켜야 하므로 주방장 객체를 불러옵니다. (final은 절대 바뀌지 않는다는 뜻)
    private final AdminService adminService;
    private final AdminAuthService authService;

    @PostMapping("/login")
    //프론트엔드에게 상태 코드(200 성공, 401 실패 등)와 함께 데이터
    //?아무 박스나 다 된다는 뜻
    public ResponseEntity<?> login(@RequestBody AdminRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request.getEmail(), request.getPassword()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal AdminPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "관리자로 다시 로그인해 주세요."));
        }

        try {
            return ResponseEntity.ok()
                    .header("X-Admin-Expires-At", Long.toString(principal.expiresAt()))
                    .header("X-Server-Time", Long.toString(System.currentTimeMillis()))
                    .body(adminService.getProfile(principal.email()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal AdminPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "관리자로 다시 로그인해 주세요."));
        }
        authService.logout(principal);
        return ResponseEntity.ok(Collections.singletonMap("message", "로그아웃이 완료되었습니다."));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@AuthenticationPrincipal AdminPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "관리자로 다시 로그인해 주세요."));
        }
        try {
            return ResponseEntity.ok(authService.refresh(principal));
        } catch (BadCredentialsException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }
}
