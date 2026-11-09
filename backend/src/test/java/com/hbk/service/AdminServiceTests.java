package com.hbk.service;

import com.hbk.entity.Admin;
import com.hbk.entity.Member;
import com.hbk.repository.AdminRepository;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminServiceTests {
    @Test
    void profileReturnsImageAndMemberInformationFromJoinedAccount() {
        AdminRepository repository = mock(AdminRepository.class);
        Member member = new Member();
        member.setName("김회원");
        member.setNickname("운영자");
        member.setEmail("owner@example.com");
        member.setProfileImageUrl("http://localhost:8080/uploads/signup-image.png");
        Admin admin = new Admin();
        admin.setMember(member);
        admin.setDepartment("운영");
        admin.setAdminLevel("ADMIN");
        when(repository.findByMemberEmail("owner@example.com")).thenReturn(Optional.of(admin));

        var profile = new AdminService(repository).getProfile("owner@example.com");

        assertEquals("김회원", profile.getName());
        assertEquals("owner@example.com", profile.getEmail());
        assertEquals(member.getProfileImageUrl(), profile.getProfileImageUrl());
        assertEquals("운영", profile.getDepartment());
    }

    @Test
    void profileRejectsAccountWithoutAdminPermission() {
        AdminRepository repository = mock(AdminRepository.class);
        when(repository.findByMemberEmail("member@example.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> new AdminService(repository).getProfile("member@example.com"));
    }
}
