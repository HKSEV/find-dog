package com.hbk.controller;

import com.hbk.dto.AdminMemberPostResponse;
import com.hbk.service.MissingPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/missing-posts")
@RequiredArgsConstructor
public class AdminMissingPostController {

    private final MissingPostService service;

    @GetMapping
    public List<AdminMemberPostResponse> getAll() {
        return service.getAllForAdmin();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException error) {
        return ResponseEntity.status(error.getStatusCode()).body(error.getReason());
    }
}
