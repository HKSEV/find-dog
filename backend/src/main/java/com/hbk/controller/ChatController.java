package com.hbk.controller;

import com.hbk.dto.ChatDtos;
import com.hbk.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Collections;
import java.util.List;
import java.util.Map;

// 💡 실종·목격 글 1:1 채팅 (로그인 필요)
@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    // POST /api/chats {postId} : 글에서 "채팅하기" (있으면 그 방)
    @PostMapping
    public ChatDtos.Room open(@RequestBody ChatDtos.OpenRequest request, Principal principal){
        return chatService.open(request.postId(), email(principal));
    }

    // GET /api/chats : 내 대화방 목록
    @GetMapping
    public List<ChatDtos.Room> myRooms(Principal principal){
        return chatService.myRooms(email(principal));
    }

    // GET /api/chats/unread-count : 안 읽은 메시지 수 (하단 탭)
    @GetMapping("/unread-count")
    public Map<String, Long> unread(Principal principal){
        return Map.of("count", chatService.unreadTotal(email(principal)));
    }

    // GET /api/chats/{id} : 대화방 정보 (위쪽 글 카드)
    @GetMapping("/{id}")
    public ChatDtos.Room room(@PathVariable Long id, Principal principal){
        return chatService.room(id, email(principal));
    }

    // GET /api/chats/{id}/messages?after=0 : after 뒤에 온 메시지 (읽음 처리)
    @GetMapping("/{id}/messages")
    public List<ChatDtos.Message> messages(@PathVariable Long id, @RequestParam(defaultValue = "0") Long after, Principal principal){
        return chatService.messages(id, after, email(principal));
    }

    // POST /api/chats/{id}/messages {type, content, lat, lng}
    @PostMapping("/{id}/messages")
    public ChatDtos.Message send(@PathVariable Long id, @RequestBody ChatDtos.SendRequest request, Principal principal){
        return chatService.send(id, request, email(principal));
    }

    // GET /api/chats/{id}/profile : 대화 상대 프로필
    @GetMapping("/{id}/profile")
    public ChatDtos.Profile profile(@PathVariable Long id, Principal principal){
        return chatService.otherProfile(id, email(principal));
    }

    // POST /api/chats/{id}/report {reason, detail, block}
    @PostMapping("/{id}/report")
    public Map<String, String> report(@PathVariable Long id, @RequestBody ChatDtos.ReportRequest request, Principal principal){
        chatService.report(id, request, email(principal));
        return Map.of("message", "신고했어요. 운영팀이 확인할게요.");
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handle(ResponseStatusException error){
        return ResponseEntity.status(error.getStatusCode()).body(Collections.singletonMap("message", error.getReason()));
    }

    private static String email(Principal principal){
        if (principal == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요해요.");
        return principal.getName();
    }
}
