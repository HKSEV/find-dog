package com.hbk.dto;

import java.time.LocalDateTime;

public record AdminMemberPostResponse(Long id, String title, String category, String status, LocalDateTime createdAt) {
}
