package com.hbk.controller;

import com.hbk.dto.AdminRegistrationRequest;
import com.hbk.service.AdminRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;

@RestController
@RequestMapping("/api/admin/registrations")
@CrossOrigin(origins = "${app.frontend-url}", allowCredentials = "true")
@RequiredArgsConstructor
public class AdminRegistrationController {
    private final AdminRegistrationService registrationService;

    @GetMapping("/{source}/{id}")
    public Object getRegistration(@PathVariable String source, @PathVariable Long id) {
        return registrationService.getRegistration(source, id);
    }

    @PutMapping("/{source}/{id}")
    public Object updateRegistration(
            @PathVariable String source,
            @PathVariable Long id,
            @ModelAttribute AdminRegistrationRequest data) {
        return registrationService.updateRegistration(source, id, data);
    }

    @DeleteMapping("/{source}/{id}")
    public ResponseEntity<?> deleteRegistration(@PathVariable String source, @PathVariable Long id) {
        try {
            registrationService.deleteRegistration(source, id);
        } catch (DataIntegrityViolationException error) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "연결된 데이터가 있어 삭제할 수 없습니다.");
        }
        return ResponseEntity.ok(Collections.singletonMap("message", "삭제가 완료되었습니다."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleRequestError(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode())
                .body(Collections.singletonMap("message", error.getReason()));
    }
}
