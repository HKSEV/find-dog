package com.hbk.controller;

import com.hbk.dto.VolunteerDto;
import com.hbk.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

// 봉사 모집·신청 (사용자). 목록·상세는 누구나, 신청·내역·취소는 로그인 필요
@RestController
@RequiredArgsConstructor
public class VolunteerController {

    private final VolunteerService service;

    // 오늘 이후 봉사 (GET /api/volunteers)
    @GetMapping("/api/volunteers")
    public List<VolunteerDto.Post> getUpcoming() {
        return service.getUpcoming();
    }

    // 상세 (GET /api/volunteers/{id}). 로그인했으면 myApplicationId 포함
    @GetMapping("/api/volunteers/{id}")
    public VolunteerDto.Post getPost(@PathVariable Long id, Principal principal) {
        return service.getPost(id, principal != null ? principal.getName() : null);
    }

    // 신청 (POST /api/volunteers/{id}/applications)
    @PostMapping("/api/volunteers/{id}/applications")
    public ResponseEntity<?> apply(@PathVariable Long id, @RequestBody VolunteerDto.ApplyRequest request, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.apply(id, request, principal.getName()));
    }

    // 내 신청 내역 (GET /api/volunteer-applications/mine)
    @GetMapping("/api/volunteer-applications/mine")
    public ResponseEntity<?> getMine(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.getMine(principal.getName()));
    }

    // 취소 (PATCH /api/volunteer-applications/{id}/cancel)
    @PatchMapping("/api/volunteer-applications/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.cancel(id, principal.getName()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
    }
}
