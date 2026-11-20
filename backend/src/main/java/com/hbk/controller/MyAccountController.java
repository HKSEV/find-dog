package com.hbk.controller;

import com.hbk.dto.MyAccountDto;
import com.hbk.service.MyAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;

// 내 정보 조회·수정 (마이 > 설정 > 정보 수정). 로그인 필요
@RestController
@RequestMapping("/api/members/me")
@RequiredArgsConstructor
public class MyAccountController {

    private final MyAccountService service;
    private final com.hbk.service.AccountService accountService;

    @GetMapping
    public ResponseEntity<?> getMe(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.getMe(principal.getName()));
    }

    @PutMapping
    public ResponseEntity<?> updateMe(@RequestBody MyAccountDto.UpdateRequest request, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.updateMe(principal.getName(), request));
    }

    // 비밀번호 바꾸기 (PUT /api/members/me/password {currentPassword, newPassword})
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody MyAccountDto.PasswordRequest request, Principal principal) {
        if (principal == null) return unauthorized();
        accountService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(java.util.Map.of("message", "비밀번호를 바꿨어요."));
    }

    // 회원 탈퇴 (POST /api/members/me/withdraw {password}) - 카카오 가입은 password 없이
    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody(required = false) MyAccountDto.WithdrawRequest request, Principal principal) {
        if (principal == null) return unauthorized();
        accountService.withdraw(principal.getName(), request);
        return ResponseEntity.ok(java.util.Map.of("message", "탈퇴했어요. 그동안 함께해 주셔서 고마워요."));
    }

    // 카카오 첫 가입 추가 정보
    @PostMapping("/complete-signup")
    public ResponseEntity<?> completeSignup(@RequestBody MyAccountDto.CompleteSignupRequest request, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.completeSignup(principal.getName(), request));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
    }
}
