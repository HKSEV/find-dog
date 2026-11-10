package com.hbk.security;

public record AdminPrincipal(Long adminId, Long memberId, String email, String tokenId, long expiresAt) {
}
