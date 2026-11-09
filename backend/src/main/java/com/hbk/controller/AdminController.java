package com.hbk.controller;

import com.hbk.dto.AdminRequest;
import com.hbk.dto.AdminResponse;
import com.hbk.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/login")
    //프론트엔드에게 상태 코드(200 성공, 401 실패 등)와 함께 데이터
    //?아무 박스나 다 된다는 뜻
    public ResponseEntity<?> login(@RequestBody AdminRequest request, HttpServletRequest httpRequest) {
        try {
            AdminResponse response = adminService.authenticate(
                    request.getEmail(),
                    request.getPassword()
            );

            // 인증된 관리자 계정을 세션에 저장하고 세션 ID를 갱신합니다.
            HttpSession session = httpRequest.getSession(true);
            httpRequest.changeSessionId();
            session.setAttribute("adminName", response.getName());
            session.setAttribute("adminEmail", request.getEmail());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("adminEmail") instanceof String email)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "관리자로 다시 로그인해 주세요."));
        }

        try {
            return ResponseEntity.ok(adminService.getProfile(email));
        } catch (IllegalArgumentException e) {
            session.invalidate();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        String path = request.getContextPath().isEmpty() ? "/" : request.getContextPath();
        ResponseCookie cookie = ResponseCookie.from("JSESSIONID", "")
                .path(path)
                .httpOnly(true)
                .sameSite("Lax")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Collections.singletonMap("message", "로그아웃이 완료되었습니다."));
    }
}
