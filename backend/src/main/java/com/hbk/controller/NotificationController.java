package com.hbk.controller;

import com.hbk.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

// 내 알림 (홈 헤더 종 아이콘 > 알림 화면). 로그인 필요
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    // 최근 알림 50개 (최신순)
    @GetMapping
    public ResponseEntity<?> getMine(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.getMine(principal.getName()));
    }

    // 안 읽은 알림이 있는지 (종 아이콘 빨간 점)
    @GetMapping("/unread")
    public ResponseEntity<?> hasUnread(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(Map.of("hasUnread", service.hasUnread(principal.getName())));
    }

    // 알림 화면을 열면 모두 읽음
    @PatchMapping("/read-all")
    public ResponseEntity<?> readAll(Principal principal) {
        if (principal == null) return unauthorized();
        service.readAll(principal.getName());
        return ResponseEntity.noContent().build();
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
    }
}
