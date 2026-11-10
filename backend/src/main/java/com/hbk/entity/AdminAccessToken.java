package com.hbk.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin_access_tokens")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AdminAccessToken {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private Long adminId;

    @Column(nullable = false)
    private long expiresAt;

    public void renew(long expiresAt) {
        this.expiresAt = expiresAt;
    }
}
