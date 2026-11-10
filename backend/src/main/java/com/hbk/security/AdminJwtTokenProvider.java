package com.hbk.security;

import com.hbk.entity.Admin;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Duration;
import java.util.Date;
import java.util.UUID;

@Component
public class AdminJwtTokenProvider {
    public static final long VALIDITY_MILLIS = Duration.ofHours(1).toMillis();
    private final Key key;

    public AdminJwtTokenProvider(@Value("${jwt.secret}") String secret) {
        key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public IssuedToken createToken(Admin admin) {
        long issuedAt = System.currentTimeMillis() / 1000 * 1000;
        long expiresAt = issuedAt + VALIDITY_MILLIS;
        String id = UUID.randomUUID().toString();
        String token = Jwts.builder()
                .setIssuer("find-dog")
                .setAudience("find-dog-admin")
                .setSubject(admin.getMember().getEmail())
                .setId(id)
                .claim("adminId", admin.getId())
                .claim("memberId", admin.getMember().getId())
                .setIssuedAt(new Date(issuedAt))
                .setExpiration(new Date(expiresAt))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
        return new IssuedToken(token, id, expiresAt);
    }

    public AdminPrincipal parseToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .requireIssuer("find-dog")
                .requireAudience("find-dog-admin")
                .build()
                .parseClaimsJws(token)
                .getBody();
        Number adminId = claims.get("adminId", Number.class);
        Number memberId = claims.get("memberId", Number.class);
        if (adminId == null || memberId == null || claims.getId() == null || claims.getSubject() == null
                || claims.getExpiration() == null || claims.getIssuedAt() == null
                || claims.getExpiration().getTime() - claims.getIssuedAt().getTime() != VALIDITY_MILLIS) {
            throw new IllegalArgumentException("관리자 토큰 정보가 올바르지 않습니다.");
        }
        return new AdminPrincipal(adminId.longValue(), memberId.longValue(), claims.getSubject(),
                claims.getId(), claims.getExpiration().getTime());
    }

    public record IssuedToken(String token, String id, long expiresAt) {
    }
}
