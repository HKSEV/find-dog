package com.hbk.controller;

import com.hbk.dto.AdminRegistrationRequest;
import com.hbk.service.AdminRegistrationService;
import com.hbk.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

@RestController
@RequestMapping("/api/admin/registrations")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class AdminRegistrationController {
    private final AdminRegistrationService registrationService;
    private final AdminService adminService;

    @GetMapping("/{source}/{id}")
    public Object getRegistration(@PathVariable String source, @PathVariable Long id, HttpServletRequest request) {
        requireAdmin(request);
        return registrationService.getRegistration(source, id);
    }

    @PutMapping("/{source}/{id}")
    public Object updateRegistration(
            @PathVariable String source,
            @PathVariable Long id,
            @ModelAttribute AdminRegistrationRequest data,
            HttpServletRequest request) {
        requireAdmin(request);
        return registrationService.updateRegistration(source, id, data);
    }

    @DeleteMapping("/{source}/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable String source, @PathVariable Long id, HttpServletRequest request) {
        requireAdmin(request);
        registrationService.deleteRegistration(source, id);
        return ResponseEntity.ok(Collections.singletonMap("message", "삭제가 완료되었습니다."));
    }

    private void requireAdmin(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || !(session.getAttribute("adminEmail") instanceof String email)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자로 다시 로그인해 주세요.");
        }

        try {
            adminService.getProfile(email);
        } catch (IllegalArgumentException e) {
            session.invalidate();
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 권한을 확인할 수 없습니다. 다시 로그인해 주세요.");
        }
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleRequestError(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode())
                .body(Collections.singletonMap("message", error.getReason()));
    }
}
