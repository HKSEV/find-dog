package com.hbk.controller;

import com.hbk.dto.AdminProfileResponse;
import com.hbk.dto.AdminRequest;
import com.hbk.dto.AdminResponse;
import com.hbk.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpSession;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AdminControllerTests {
    private AdminService service;
    private AdminController controller;

    @BeforeEach
    void setUp() {
        service = mock(AdminService.class);
        controller = new AdminController(service);
    }

    @Test
    void loginStoresAuthenticatedEmailAndRotatesSession() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        String previousId = request.getSession().getId();
        AdminRequest credentials = new AdminRequest();
        credentials.setEmail("admin@example.com");
        credentials.setPassword("password");
        when(service.authenticate("admin@example.com", "password"))
                .thenReturn(new AdminResponse("관리자", "로그인 성공"));

        var response = controller.login(credentials, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("admin@example.com", request.getSession(false).getAttribute("adminEmail"));
        assertEquals("관리자", request.getSession(false).getAttribute("adminName"));
        assertNotEquals(previousId, request.getSession(false).getId());
    }

    @Test
    void anonymousProfileRequestDoesNotCreateSession() {
        MockHttpServletRequest request = new MockHttpServletRequest();

        assertEquals(HttpStatus.UNAUTHORIZED, controller.getProfile(request).getStatusCode());
        assertNull(request.getSession(false));
        verifyNoInteractions(service);
    }

    @Test
    void profileUsesAuthenticatedSessionInsteadOfRequestParameters() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.getSession().setAttribute("adminEmail", "owner@example.com");
        request.addParameter("email", "other@example.com");
        AdminProfileResponse profile = new AdminProfileResponse(
                "회원", "닉네임", "owner@example.com", "01000000000", "/uploads/profile.png", "ADMIN", "운영"
        );
        when(service.getProfile("owner@example.com")).thenReturn(profile);

        var response = controller.getProfile(request);

        assertSame(profile, response.getBody());
        verify(service).getProfile("owner@example.com");
        verify(service, never()).getProfile("other@example.com");
    }

    @Test
    void removedAdminAccountInvalidatesSession() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpSession session = (MockHttpSession) request.getSession();
        session.setAttribute("adminEmail", "removed@example.com");
        when(service.getProfile("removed@example.com")).thenThrow(new IllegalArgumentException("관리자 계정 없음"));

        assertEquals(HttpStatus.UNAUTHORIZED, controller.getProfile(request).getStatusCode());
        assertTrue(session.isInvalid());
    }

    @Test
    void logoutInvalidatesSessionAndExpiresCookie() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpSession session = (MockHttpSession) request.getSession();
        session.setAttribute("adminEmail", "admin@example.com");

        var response = controller.logout(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(session.isInvalid());
        String cookie = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
        assertNotNull(cookie);
        assertTrue(cookie.contains("JSESSIONID="));
        assertTrue(cookie.contains("Max-Age=0"));
        assertTrue(cookie.contains("HttpOnly"));
        assertEquals(HttpStatus.OK, controller.logout(new MockHttpServletRequest()).getStatusCode());
    }
}
