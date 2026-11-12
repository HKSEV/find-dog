package com.hbk.controller;

import com.hbk.domain.ApplicationStatus;
import com.hbk.dto.AdoptionApplicationResponseDto;
import com.hbk.dto.AdoptionApplicationStatusRequestDto;
import com.hbk.service.AdoptionApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// 입양 신청 (관리자). /api/admin/** 는 AdminRequestMatcher가 관리자 토큰을 요구함
// 처리 화면은 관리자 페이지에서 나중에 붙임
@RestController
@RequestMapping("/api/admin/adoption-applications")
@RequiredArgsConstructor
public class AdminAdoptionApplicationController {

    private final AdoptionApplicationService service;

    // 전체 신청 목록 (GET /api/admin/adoption-applications?status=RECEIVED)
    @GetMapping
    public List<AdoptionApplicationResponseDto> getAll(@RequestParam(required = false) ApplicationStatus status) {
        return service.getAll(status);
    }

    // 상태 바꾸기 (PATCH /api/admin/adoption-applications/{id}/status)
    // body: {"status": "FORWARDED" | "ADOPTED" | "REJECTED", "reason": "선택"}
    @PatchMapping("/{id}/status")
    public AdoptionApplicationResponseDto changeStatus(@PathVariable Long id, @RequestBody AdoptionApplicationStatusRequestDto request) {
        return service.changeStatus(id, request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }
}
