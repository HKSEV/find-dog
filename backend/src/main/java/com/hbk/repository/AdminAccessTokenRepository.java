package com.hbk.repository;

import com.hbk.entity.AdminAccessToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminAccessTokenRepository extends JpaRepository<AdminAccessToken, String> {
    void deleteByExpiresAtLessThanEqual(long expiresAt);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select accessToken from AdminAccessToken accessToken where accessToken.id = :id")
    Optional<AdminAccessToken> findByIdForUpdate(@Param("id") String id);
}
