package com.hbk.controller;

import com.hbk.dto.MemberProfileDto;
import com.hbk.service.MemberProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

// 💡 회원 공개 프로필 (로그인 없이도 볼 수 있음)
@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberProfileController {
    private final MemberProfileService profileService;

    // GET /api/members/{id}/profile
    @GetMapping("/{id}/profile")
    public MemberProfileDto profile(@PathVariable Long id){
        return profileService.profile(id);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleError(ResponseStatusException error){
        return ResponseEntity.status(error.getStatusCode()).body(Collections.singletonMap("message", error.getReason()));
    }
}
