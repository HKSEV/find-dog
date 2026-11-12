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

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
    }
}
