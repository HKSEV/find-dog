package com.hbk.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hbk.security.AdminJwtTokenProvider;
import com.hbk.security.JwtTokenProvider;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Base64;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:admin-test.properties")
class AdminAuthenticationTests {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private JdbcTemplate jdbc;
    @Autowired
    private JwtTokenProvider memberTokenProvider;
    @Value("${jwt.secret}")
    private String secret;

    private final ObjectMapper mapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        clearAccounts();
        jdbc.update("insert into member (id, email, nickname, password, name, phone, user_type, marketing_agreed) values (1, 'jwt-admin@example.com', 'jwt_admin', 'test-password', '관리자', '01000000000', 'ADMIN', false)");
        jdbc.update("insert into admins (id, member_id, admin_level) values (1, 1, 'ADMIN')");
    }

    @AfterEach
    void tearDown() {
        clearAccounts();
    }

    @Test
    void loginIssuesExactlyOneHourTokenWithoutCreatingHttpSession() throws Exception {
        var result = mvc.perform(post("/api/admin/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"jwt-admin@example.com\",\"password\":\"test-password\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.token").isString())
                .andExpect(header().doesNotExist("Set-Cookie")).andReturn();
        JsonNode response = mapper.readTree(result.getResponse().getContentAsString());
        JsonNode claims = mapper.readTree(Base64.getUrlDecoder().decode(response.get("token").asText().split("\\.")[1]));
        assertEquals(3600L, claims.get("exp").asLong() - claims.get("iat").asLong());
        assertEquals("find-dog-admin", claims.get("aud").asText());
        assertEquals(response.get("expiresAt").asLong(), claims.get("exp").asLong() * 1000);
        assertTrue(response.get("expiresAt").asLong() > response.get("serverTime").asLong());
        assertNull(result.getRequest().getSession(false));
        assertEquals(1, jdbc.queryForObject("select count(*) from admin_access_tokens", Integer.class));
    }

    @Test
    void profileUsesSignedIdentityAndKeepsOriginalExpiration() throws Exception {
        JsonNode login = login();
        mvc.perform(get("/api/admin/profile").param("email", "another@example.com").header("Authorization", bearer(login)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.email").value("jwt-admin@example.com"))
                .andExpect(header().string("X-Admin-Expires-At", login.get("expiresAt").asText()))
                .andExpect(header().exists("X-Server-Time")).andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void incorrectPasswordDoesNotIssueToken() throws Exception {
        mvc.perform(post("/api/admin/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"jwt-admin@example.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.token").doesNotExist());
        assertEquals(0, jdbc.queryForObject("select count(*) from admin_access_tokens", Integer.class));
    }

    @Test
    void legacySessionDoesNotAuthorizeAdminRequests() throws Exception {
        MockHttpSession session = new MockHttpSession();
        session.setAttribute("adminEmail", "jwt-admin@example.com");
        session.setAttribute("adminName", "관리자");
        mvc.perform(get("/api/admin/profile").session(session)).andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @ValueSource(strings = {"/api/%61dmin/registrations/animals/1", "/api/admin/registrations/animals/1;ignored=1"})
    void alternatePathEncodingCannotBypassAuthentication(String path) throws Exception {
        var result = mvc.perform(delete(java.net.URI.create(path))).andReturn();
        assertTrue(result.getResponse().getStatus() == 400 || result.getResponse().getStatus() == 401);
    }

    @Test
    void memberTokenCannotAuthorizeEvenAnAdminAccount() throws Exception {
        String token = memberTokenProvider.createToken("jwt-admin@example.com");
        mvc.perform(get("/api/admin/profile").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized()).andExpect(header().string("WWW-Authenticate", "Bearer"));
    }

    @Test
    void expiredTokenIsRejectedByServer() throws Exception {
        String token = signedToken(-1000, "find-dog-admin", 1L);
        mvc.perform(get("/api/admin/profile").header("Authorization", "Bearer " + token)).andExpect(status().isUnauthorized());
    }

    @Test
    void signatureTamperingIsRejected() throws Exception {
        String token = login().get("token").asText();
        String[] parts = token.split("\\.");
        parts[1] = Base64.getUrlEncoder().withoutPadding().encodeToString("{\"sub\":\"another@example.com\"}".getBytes());
        mvc.perform(get("/api/admin/profile").header("Authorization", "Bearer " + String.join(".", parts)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenWithWrongPurposeOrAccountCannotBeUsed() throws Exception {
        for (String token : new String[]{signedToken(3600000, "find-dog-member", 1L), signedToken(3600000, "find-dog-admin", 2L)}) {
            mvc.perform(get("/api/admin/profile").header("Authorization", "Bearer " + token)).andExpect(status().isUnauthorized());
        }
    }

    @Test
    void removedAdminPermissionInvalidatesExistingToken() throws Exception {
        String authorization = bearer(login());
        jdbc.update("delete from admins");
        mvc.perform(get("/api/admin/profile").header("Authorization", authorization)).andExpect(status().isUnauthorized());
    }

    @Test
    void logoutRevokesOnlyItsOwnTokenAndPreventsReplay() throws Exception {
        String first = bearer(login());
        String second = bearer(login());
        mvc.perform(post("/api/admin/logout").header("Authorization", first)).andExpect(status().isOk());
        mvc.perform(get("/api/admin/profile").header("Authorization", first)).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/profile").header("Authorization", second)).andExpect(status().isOk());
        assertEquals(1, jdbc.queryForObject("select count(*) from admin_access_tokens", Integer.class));
    }

    @ParameterizedTest
    @ValueSource(strings = {"/api/animals/recommended", "/api/animals/parse-link", "/api/campaigns", "/api/youtube", "/api/fellow-news", "/api/need-help", "/api/shelter-animals"})
    void allAdminRegistrationRequestsRequireAdminToken(String path) throws Exception {
        mvc.perform(post(path).contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post(path).header("Authorization", "Bearer " + memberTokenProvider.createToken("jwt-admin@example.com"))
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @ValueSource(strings = {"/api/animals/recommended", "/api/campaigns", "/api/youtube", "/api/fellow-news", "/api/need-help", "/api/shelter-animals"})
    void publicListsRemainAvailableWithoutAdminLogin(String path) throws Exception {
        mvc.perform(get(path)).andExpect(status().isOk());
    }

    private JsonNode login() throws Exception {
        var result = mvc.perform(post("/api/admin/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"jwt-admin@example.com\",\"password\":\"test-password\"}"))
                .andExpect(status().isOk()).andReturn();
        return mapper.readTree(result.getResponse().getContentAsString());
    }

    private String bearer(JsonNode login) {
        return "Bearer " + login.get("token").asText();
    }

    private String signedToken(long remaining, String audience, long memberId) {
        long expiresAt = System.currentTimeMillis() / 1000 * 1000 + remaining;
        String id = UUID.randomUUID().toString();
        jdbc.update("insert into admin_access_tokens (id, admin_id, expires_at) values (?, 1, ?)", id, expiresAt);
        return Jwts.builder().setIssuer("find-dog").setAudience(audience).setSubject("jwt-admin@example.com")
                .setId(id).claim("adminId", 1L).claim("memberId", memberId)
                .setIssuedAt(new Date(expiresAt - AdminJwtTokenProvider.VALIDITY_MILLIS)).setExpiration(new Date(expiresAt))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)), SignatureAlgorithm.HS256).compact();
    }

    private void clearAccounts() {
        jdbc.update("delete from admin_access_tokens");
        jdbc.update("delete from admins");
        jdbc.update("delete from member");
    }
}
