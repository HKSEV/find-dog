package com.hbk.repository;

import com.hbk.entity.AdminAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminAccessTokenRepository extends JpaRepository<AdminAccessToken, String> {
    void deleteByExpiresAtLessThanEqual(long expiresAt);
}
