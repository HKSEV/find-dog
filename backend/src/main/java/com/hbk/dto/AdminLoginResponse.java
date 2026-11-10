package com.hbk.dto;

public record AdminLoginResponse(String name, String message, String token, long expiresAt, long serverTime) {
}
