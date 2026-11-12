package com.hbk.controller;

import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;
import com.hbk.dto.MissingPostRequestDto;
import com.hbk.dto.MissingPostResponseDto;
import com.hbk.service.MissingPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/missing-posts")
@RequiredArgsConstructor
public class MissingPostController {

    private final MissingPostService service;

    // 1. 실종 신고 글 작성 API (DTO와 파일, 로그인 유저 정보를 서비스로 전달)
    @PostMapping
    public ResponseEntity<?> createPost(
            @RequestPart("dto") MissingPostRequestDto requestDto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "files", required = false) List<MultipartFile> files, // 사진 여러 장 (최대 5장)
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
        }

        // 예전 방식(file 1장)과 새 방식(files 여러 장)을 함께 받음
        List<MultipartFile> uploads = new java.util.ArrayList<>();
        if (file != null && !file.isEmpty()) uploads.add(file);
        if (files != null) files.stream().filter(f -> f != null && !f.isEmpty()).forEach(uploads::add);
        if (uploads.size() > MissingPostService.MAX_PHOTOS) {
            return ResponseEntity.badRequest().body("사진은 최대 " + MissingPostService.MAX_PHOTOS + "장까지 올릴 수 있어요.");
        }

        MissingPostResponseDto response = service.createPost(requestDto, uploads, principal.getName());
        return ResponseEntity.ok(response);
    }

    // 2. 무한 스크롤 조회 API (GET /api/missing-posts?cursorId=10&size=10)
    //    거르기: type=LOST|FOUND (실종/목격), status=MISSING|COMPLETED (찾는 중/찾았어요)
    @GetMapping
    public ResponseEntity<List<MissingPostResponseDto>> getPosts(
            @RequestParam(required = false) Long cursorId,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) PostType type,
            @RequestParam(required = false) PostStatus status
    ){
        List<MissingPostResponseDto> posts = service.getPostByScroll(cursorId, size, type, status);
        return ResponseEntity.ok(posts);
    }

    // 내가 쓴 글 API (GET /api/missing-posts/mine) - 마이 > 작성한 글
    @GetMapping("/mine")
    public ResponseEntity<?> getMyPosts(Principal principal){
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
        }
        return ResponseEntity.ok(service.getMyPosts(principal.getName()));
    }

    // 글 하나 조회 API (GET /api/missing-posts/{id}) - 상세 화면
    //    로그인했으면 mine(내 글인지)을 같이 알려줌
    @GetMapping("/{id}")
    public ResponseEntity<MissingPostResponseDto> getPost(@PathVariable Long id, Principal principal){
        return ResponseEntity.ok(service.getPost(id, principal != null ? principal.getName() : null));
    }

    // 3. 글 수정 API (PUT /api/missing-posts/{id})
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestBody MissingPostRequestDto requestDto,
            Principal principal){
        if (principal == null) return unauthorized();
        MissingPostResponseDto response = service.updatePost(id, requestDto, principal.getName());
        return ResponseEntity.ok(response);
    }

    // 4. 글 삭제 API (DELETE /api/missing-posts/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long id, Principal principal
    ) {
        if (principal == null) return unauthorized();
        service.deletePost(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    // 5. 완료 처리 API (PATCH /api/missing-posts/{id}/complete)
    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completePost(
            @PathVariable Long id,
            Principal principal
    ) {
        if (principal == null) return unauthorized();
        service.completPost(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    // 서비스에서 던진 오류(없는 글 404, 남의 글 403 등)는 상태 코드와 한글 메시지 그대로
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
    }

    private static ResponseEntity<String> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 정보가 없습니다. 다시 로그인해주세요.");
    }
}