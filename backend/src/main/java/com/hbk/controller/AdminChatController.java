package com.hbk.controller;

import com.hbk.service.ChatService;
import lombok.RequiredArgsConstructor;
import com.hbk.dto.ChatDtos;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

import java.util.List;
import java.util.Map;

// 💡 관리자: 채팅 현황 (대화방 수 집계용, 내용은 보지 않음). /api/admin/** 는 관리자 토큰 필요
@RestController
@RequestMapping("/api/admin/chats")
@RequiredArgsConstructor
public class AdminChatController {
    private final ChatService chatService;

    // GET /api/admin/chats : [{id, createdAt}]
    @GetMapping
    public List<Map<String, Object>> summaries(){
        return chatService.adminRoomSummaries();
    }

    // GET /api/admin/chats/reports : 신고 목록 (처리 전이 먼저)
    @GetMapping("/reports")
    public List<ChatDtos.AdminReport> reports(){
        return chatService.adminReports();
    }

    // GET /api/admin/chats/reports/{id}/messages : 신고된 대화 내용
    @GetMapping("/reports/{id}/messages")
    public List<ChatDtos.AdminMessage> reportMessages(@PathVariable Long id){
        return chatService.adminReportMessages(id);
    }

    // PATCH /api/admin/chats/reports/{id} {status, closeRoom, note}
    @PatchMapping("/reports/{id}")
    public ChatDtos.AdminReport handle(@PathVariable Long id, @RequestBody ChatDtos.AdminHandleRequest request){
        return chatService.adminHandle(id, request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleError(ResponseStatusException error){
        return ResponseEntity.status(error.getStatusCode()).body(Collections.singletonMap("message", error.getReason()));
    }
}
