package com.hbk.controller;

import com.hbk.domain.CommunityCategory;
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

    // 목록 (GET /api/community-posts?category=QUESTION&cursorId=20&size=10) - 최신순
    @GetMapping("/api/community-posts")
    public List<CommunityDto.Post> getPage(@RequestParam(required = false) CommunityCategory category,
                                           @RequestParam(required = false) Long cursorId,
                                           @RequestParam(defaultValue = "10") int size) {
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

    @DeleteMapping("/api/community-posts/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) return unauthorized();
        service.delete(id, principal.getName());
        return ResponseEntity.noContent().build();
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
