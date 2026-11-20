package com.hbk.controller;

import com.hbk.dto.AdminMemberDtos;
import com.hbk.service.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

// 💡 관리자 > 회원 관리 (/api/admin/** 라 관리자 토큰 필요)
@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {
    private final AdminMemberService memberService;

    // GET /api/admin/members
    @GetMapping
    public List<AdminMemberDtos.Row> members(){
        return memberService.members();
    }

    // PATCH /api/admin/members/{id}/suspension {suspended, reason}
    @PatchMapping("/{id}/suspension")
    public AdminMemberDtos.Row suspend(@PathVariable Long id, @RequestBody AdminMemberDtos.SuspendRequest request){
        return memberService.suspend(id, request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleError(ResponseStatusException error){
        return ResponseEntity.status(error.getStatusCode()).body(Collections.singletonMap("message", error.getReason()));
    }
}
