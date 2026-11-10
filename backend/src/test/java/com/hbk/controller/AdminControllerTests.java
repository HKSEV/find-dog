package com.hbk.controller;

import com.hbk.dto.AdminLoginResponse;
import com.hbk.dto.AdminProfileResponse;
import com.hbk.dto.AdminRequest;
import com.hbk.security.AdminPrincipal;
import com.hbk.service.AdminAuthService;
import com.hbk.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTests {
    private AdminService service;
    private AdminAuthService authService;
    private AdminController controller;
    private final AdminPrincipal principal = new AdminPrincipal(1L, 2L, "owner@example.com", "token-id", 3600000L);

    @BeforeEach
    void setUp() {
        service = mock(AdminService.class);
        authService = mock(AdminAuthService.class);
        controller = new AdminController(service, authService);
    }

    @Test
    void loginReturnsIssuedTokenWithoutSessionCookie() {
        AdminRequest credentials = new AdminRequest();
        credentials.setEmail("admin@example.com");
        credentials.setPassword("password");
        var login = new AdminLoginResponse("관리자", "로그인 성공", "signed-token", 3600000L, 0L);
        when(authService.login("admin@example.com", "password")).thenReturn(login);

        var response = controller.login(credentials);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(login, response.getBody());
        assertNull(response.getHeaders().getFirst("Set-Cookie"));
    }

    @Test
    void anonymousProfileRequestIsRejected() {
        assertEquals(HttpStatus.UNAUTHORIZED, controller.getProfile(null).getStatusCode());
        verifyNoInteractions(service);
    }

    @Test
    void profileUsesVerifiedPrincipalAndReturnsSessionDeadline() {
        AdminProfileResponse profile = new AdminProfileResponse(
                "회원", "닉네임", "owner@example.com", "01000000000", "/uploads/profile.png", "ADMIN", "운영"
        );
        when(service.getProfile("owner@example.com")).thenReturn(profile);

        var response = controller.getProfile(principal);

        assertSame(profile, response.getBody());
        assertEquals("3600000", response.getHeaders().getFirst("X-Admin-Expires-At"));
        assertNotNull(response.getHeaders().getFirst("X-Server-Time"));
        verify(service).getProfile("owner@example.com");
    }

    @Test
    void removedAdminAccountIsRejected() {
        when(service.getProfile("owner@example.com")).thenThrow(new IllegalArgumentException("관리자 계정 없음"));

        assertEquals(HttpStatus.UNAUTHORIZED, controller.getProfile(principal).getStatusCode());
    }

    @Test
    void logoutRevokesVerifiedToken() {
        assertEquals(HttpStatus.OK, controller.logout(principal).getStatusCode());
        verify(authService).logout(principal);
        assertEquals(HttpStatus.UNAUTHORIZED, controller.logout(null).getStatusCode());
    }
}
