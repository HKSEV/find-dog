package com.hbk.controller;

import com.hbk.domain.CommunityCategory;
import com.hbk.dto.AdminMemberPostResponse;
import com.hbk.dto.CommunityDto;
import com.hbk.service.CommunityPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

// 커뮤니티 회원 글. 목록·상세는 누구나, 쓰기·고치기·지우기는 로그인한 글쓴이만
@RestController
@RequiredArgsConstructor
public class CommunityPostController {

    private final CommunityPostService service;
    private final com.hbk.service.CommunityPostReportService reportService;

    // 목록 (GET /api/community-posts?category=QUESTION&cursorId=20&size=10) - 최신순
    @GetMapping("/api/community-posts")
    public List<CommunityDto.Post> getPage(@RequestParam(required = false) CommunityCategory category,
                                           @RequestParam(required = false) Long cursorId,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(required = false) String keyword) { // 검색어 (제목·내용, 띄어쓰기로 여러 개)
        if (keyword != null && !keyword.isBlank()) return service.search(category, cursorId, size, keyword);
        return service.getPage(category, cursorId, size);
    }

    // 상세 (GET /api/community-posts/{id}) - 로그인했으면 mine
    @GetMapping("/api/community-posts/{id}")
    public CommunityDto.Post getPost(@PathVariable Long id, Principal principal) {
        return service.getPost(id, principal != null ? principal.getName() : null);
    }

    // 내가 쓴 글 (GET /api/community-posts/mine)
    @GetMapping("/api/community-posts/mine")
    public ResponseEntity<?> getMine(Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.getMine(principal.getName()));
    }

    // 쓰기 (POST multipart: dto=JSON, files=사진 여러 장)
    @PostMapping("/api/community-posts")
    public ResponseEntity<?> create(@RequestPart("dto") CommunityDto.Request request,
                                    @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                    Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, files, principal.getName()));
    }

    // 고치기 (PUT multipart: dto.keepMediaUrls=남길 사진, files=새 사진)
    @PutMapping("/api/community-posts/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestPart("dto") CommunityDto.Request request,
                                    @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                    Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.update(id, request, files, principal.getName()));
    }

    // 💡 공감(하트): PUT 켜기 / DELETE 끄기 → {liked, likeCount}
    @PutMapping("/api/community-posts/{id}/like")
    public ResponseEntity<?> like(@PathVariable Long id, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.setLike(id, true, principal.getName()));
    }

    @DeleteMapping("/api/community-posts/{id}/like")
    public ResponseEntity<?> unlike(@PathVariable Long id, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.ok(service.setLike(id, false, principal.getName()));
    }

    // 💡 댓글: 목록(누구나), 쓰기·지우기(로그인)
    @GetMapping("/api/community-posts/{id}/comments")
    public List<CommunityDto.Comment> comments(@PathVariable Long id, Principal principal) {
        return service.getComments(id, principal != null ? principal.getName() : null);
    }

    @PostMapping("/api/community-posts/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody CommunityDto.CommentRequest request, Principal principal) {
        if (principal == null) return unauthorized();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addComment(id, request, principal.getName()));
    }

    @DeleteMapping("/api/community-posts/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @PathVariable Long commentId, Principal principal) {
        if (principal == null) return unauthorized();
        service.deleteComment(id, commentId, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/community-posts/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) return unauthorized();
        service.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/community-posts")
    public List<AdminMemberPostResponse> getAllForAdmin() {
        return service.getAllForAdmin();
    }

    // 💡 글 신고 (POST /api/community-posts/{id}/report {reason, detail}) - 로그인 필요, 내 글은 불가
    @PostMapping("/api/community-posts/{id}/report")
    public ResponseEntity<?> report(@PathVariable Long id, @RequestBody com.hbk.dto.MissingPostReportDtos.ReportRequest request, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요해요.");
        reportService.report(id, request, principal.getName());
        return ResponseEntity.ok(java.util.Map.of("message", "신고했어요. 운영팀이 확인할게요."));
    }

    // [관리자] 글 신고 목록 / 처리
    @GetMapping("/api/admin/community-posts/reports")
    public List<com.hbk.dto.MissingPostReportDtos.AdminReport> reports() {
        return reportService.adminReports();
    }

    @PatchMapping("/api/admin/community-posts/reports/{id}")
    public com.hbk.dto.MissingPostReportDtos.AdminReport handleReport(@PathVariable Long id, @RequestBody com.hbk.dto.MissingPostReportDtos.AdminHandleRequest request) {
        return reportService.adminHandle(id, request);
    }

    // [관리자] 글 지우기 (DELETE /api/admin/community-posts/{id}) - 관리자 토큰 필요
    @DeleteMapping("/api/admin/community-posts/{id}")
    public ResponseEntity<Void> deleteByAdmin(@PathVariable Long id) {
        service.deleteByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
    }
}
