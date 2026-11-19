package com.hbk.controller;

import com.hbk.dto.AdminMemberPostResponse;
import com.hbk.service.MissingPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/missing-posts")
@RequiredArgsConstructor
public class AdminMissingPostController {

    private final MissingPostService service;
    private final com.hbk.service.MissingPostReportService reportService;

    @GetMapping
    public List<AdminMemberPostResponse> getAll() {
        return service.getAllForAdmin();
    }

    // GET /api/admin/missing-posts/reports : 글 신고 목록 (처리 전이 먼저)
    @GetMapping("/reports")
    public List<com.hbk.dto.MissingPostReportDtos.AdminReport> reports() {
        return reportService.adminReports();
    }

    // PATCH /api/admin/missing-posts/reports/{id} {status, note}
    @PatchMapping("/reports/{id}")
    public com.hbk.dto.MissingPostReportDtos.AdminReport handleReport(@PathVariable Long id, @RequestBody com.hbk.dto.MissingPostReportDtos.AdminHandleRequest request) {
        return reportService.adminHandle(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(error.getReason());
    }
}
