package com.hbk.controller;

import com.hbk.dto.AdoptionApplicationRequestDto;
import com.hbk.service.AdoptionApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

// 입양 신청 (사용자). 모두 로그인 필요
@RestController
@RequestMapping("/api/adoption-applications")
@RequiredArgsConstructor
public class AdoptionApplicationController {

    private static final String LOGIN_REQUIRED = "로그인 정보가 없습니다. 다시 로그인해주세요.";

    private final AdoptionApplicationService service;

    // 신청서에 미리 채울 이름·연락처 (GET /api/adoption-applications/prefill)
    @GetMapping("/prefill")
    public ResponseEntity<?> getPrefill(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.getPrefill(principal.getName()));
    }

    // 입양 신청 (POST /api/adoption-applications)
    @PostMapping
    public ResponseEntity<?> apply(@RequestBody AdoptionApplicationRequestDto request, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.apply(request, principal.getName()));
    }

    // 내 신청 내역 (GET /api/adoption-applications/mine)
    @GetMapping("/mine")
    public ResponseEntity<?> getMine(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.getMine(principal.getName()));
    }

    // 신청 취소 (PATCH /api/adoption-applications/{id}/cancel)
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.cancel(id, principal.getName()));
    }

    // 서비스에서 던진 오류는 상태 코드와 한글 메시지 그대로 전달
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(LOGIN_REQUIRED);
    }
}
