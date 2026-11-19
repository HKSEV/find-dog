package com.hbk.controller;

import com.hbk.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
