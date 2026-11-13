package com.hbk.controller;

import com.hbk.dto.VolunteerDto;
import com.hbk.service.VolunteerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// 봉사 모집 (관리자). /api/admin/** 는 AdminRequestMatcher가 관리자 토큰을 요구함
// 관리자 화면(등록·수정·마감·신청자 보기)은 관리자 페이지에서 붙임
@RestController
@RequestMapping("/api/admin/volunteers")
@RequiredArgsConstructor
public class AdminVolunteerController {

    private final VolunteerService service;

    // 전체 모집 글 (GET /api/admin/volunteers) - 지난 봉사도 포함, 최근 등록 순
    @GetMapping
    public List<VolunteerDto.Post> getAll() {
        return service.getAllForAdmin();
    }

    // 등록 (POST /api/admin/volunteers)
    // body: {"title","content","place","activityDate":"2026-11-20","startTime":"10:00","endTime":"12:00","capacity":5,"imageUrl","closed":false}
    @PostMapping
    public ResponseEntity<VolunteerDto.Post> create(@RequestBody VolunteerDto.PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    // 수정·마감 (PUT /api/admin/volunteers/{id}) - closed:true 로 일찍 마감
    @PutMapping("/{id}")
    public VolunteerDto.Post update(@PathVariable Long id, @RequestBody VolunteerDto.PostRequest request) {
        return service.update(id, request);
    }

    // 삭제 (DELETE /api/admin/volunteers/{id}) - 신청자가 있으면 409
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 신청자 목록 (GET /api/admin/volunteers/{id}/applications) - 취소한 사람도 포함, 신청 순
    @GetMapping("/{id}/applications")
    public List<VolunteerDto.Application> getApplicants(@PathVariable Long id) {
        return service.getApplicants(id);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }
}
