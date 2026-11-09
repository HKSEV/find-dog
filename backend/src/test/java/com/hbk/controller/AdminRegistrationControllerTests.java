package com.hbk.controller;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:admin-test.properties")
class AdminRegistrationControllerTests {
    @Autowired
    private MockMvc mvc;
    @Autowired
    private JdbcTemplate jdbc;

    private MockHttpSession session;
    private final List<Path> uploadedFiles = new ArrayList<>();

    @BeforeEach
    void setUp() {
        clearRecords();
        jdbc.update("insert into member (id, email, nickname, password, name, phone, user_type, marketing_agreed) values (1, 'admin-test@example.com', 'admin_test', 'test', '관리자', '01000000000', 'ADMIN', false)");
        jdbc.update("insert into admins (id, member_id, admin_level) values (1, 1, 'ADMIN')");
        session = new MockHttpSession();
        session.setAttribute("adminEmail", "admin-test@example.com");
        session.setAttribute("adminName", "관리자");
    }

    @AfterEach
    void tearDown() throws Exception {
        clearRecords();
        for (Path file : uploadedFiles) Files.deleteIfExists(file);
        uploadedFiles.clear();
    }

    @ParameterizedTest
    @ValueSource(strings = {"animals", "campaigns", "youtubePosts", "fellowNews", "needHelps", "shelterAnimals"})
    void existingRecordCanBeLoadedUpdatedAndDeleted(String source) throws Exception {
        seed(source);
        String url = url(source, 1);
        mvc.perform(get(url).session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.id").value(1));
        mvc.perform(update(source, values()).session(session))
                .andExpect(status().isOk()).andExpect(jsonPath("$." + labelField(source)).value("수정 항목"));
        mvc.perform(get(url).session(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$." + labelField(source)).value("수정 항목"));
        mvc.perform(delete(url).session(session)).andExpect(status().isOk()).andExpect(jsonPath("$.message").value("삭제가 완료되었습니다."));
        mvc.perform(get(url).session(session)).andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(strings = {"animals", "campaigns", "youtubePosts", "fellowNews", "needHelps", "shelterAnimals"})
    void anonymousRequestsCannotReadChangeOrDeleteRecords(String source) throws Exception {
        seed(source);
        mvc.perform(get(url(source, 1))).andExpect(status().isUnauthorized());
        mvc.perform(update(source, values())).andExpect(status().isUnauthorized());
        mvc.perform(delete(url(source, 1))).andExpect(status().isUnauthorized());
        mvc.perform(get(url(source, 1)).session(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$." + labelField(source)).value("원본 항목"));
    }

    @ParameterizedTest
    @ValueSource(strings = {"animals", "campaigns", "youtubePosts", "fellowNews", "needHelps", "shelterAnimals"})
    void missingRecordReturnsNotFoundForEveryOperation(String source) throws Exception {
        mvc.perform(get(url(source, 999)).session(session)).andExpect(status().isNotFound());
        mvc.perform(multipart(HttpMethod.PUT, url(source, 999)).params(values()).session(session)).andExpect(status().isNotFound());
        mvc.perform(delete(url(source, 999)).session(session)).andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(strings = {"animals", "campaigns", "youtubePosts", "fellowNews", "needHelps", "shelterAnimals"})
    void invalidInputRollsBackEarlierFieldChanges(String source) throws Exception {
        seed(source);
        MultiValueMap<String, String> data = values();
        String invalidField = switch (source) {
            case "campaigns", "youtubePosts" -> "thumbnailUrl";
            case "shelterAnimals" -> "content";
            default -> "imageUrl";
        };
        data.set(invalidField, "");
        mvc.perform(update(source, data).session(session)).andExpect(status().isBadRequest());
        mvc.perform(get(url(source, 1)).session(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$." + labelField(source)).value("원본 항목"));
    }

    @Test
    void equalIdsInDifferentPostTypesDoNotAffectEachOther() throws Exception {
        seed("youtubePosts");
        seed("fellowNews");
        mvc.perform(update("youtubePosts", values()).session(session)).andExpect(status().isOk());
        mvc.perform(delete(url("youtubePosts", 1)).session(session)).andExpect(status().isOk());
        mvc.perform(get(url("fellowNews", 1)).session(session)).andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("원본 항목"));
    }

    @Test
    void revokedAdminCannotDeleteAndSessionIsInvalidated() throws Exception {
        seed("animals");
        jdbc.update("delete from admins");
        mvc.perform(delete(url("animals", 1)).session(session)).andExpect(status().isUnauthorized());
        assertTrue(session.isInvalid());
        assertEquals(1, jdbc.queryForObject("select count(*) from recommended_animals", Integer.class));
    }

    @Test
    void unknownSourceIsRejected() throws Exception {
        mvc.perform(delete(url("members", 1)).session(session)).andExpect(status().isBadRequest());
    }

    @Test
    void shelterPhotoCanBeReplacedWithUploadedImage() throws Exception {
        seed("shelterAnimals");
        byte[] image = Base64.getDecoder().decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jY1kAAAAASUVORK5CYII=");
        MockMultipartFile file = new MockMultipartFile("imageFile", "photo.png", "image/png", image);
        mvc.perform(update("shelterAnimals", values()).file(file).session(session)).andExpect(status().isOk());
        String path = jdbc.queryForObject("select image_url from shelter_animals where id = 1", String.class);
        assertNotNull(path);
        assertTrue(path.startsWith("/uploads/"));
        Path saved = Path.of(System.getProperty("user.dir"), path.substring(1));
        uploadedFiles.add(saved);
        assertArrayEquals(image, Files.readAllBytes(saved));
    }

    @Test
    void nonImageUploadDoesNotChangeShelterRecord() throws Exception {
        seed("shelterAnimals");
        MockMultipartFile file = new MockMultipartFile("imageFile", "file.txt", "text/plain", new byte[]{1});
        mvc.perform(update("shelterAnimals", values()).file(file).session(session)).andExpect(status().isBadRequest());
        assertEquals("원본 항목", jdbc.queryForObject("select notice_no from shelter_animals where id = 1", String.class));
    }

    private MockMultipartHttpServletRequestBuilder update(String source, MultiValueMap<String, String> data) {
        if (source.equals("animals")) data.set("gender", "M");
        MockMultipartHttpServletRequestBuilder request = multipart(HttpMethod.PUT, url(source, 1));
        request.params(data);
        return request;
    }

    private String url(String source, int id) {
        return "/api/admin/registrations/" + source + "/" + id;
    }

    private String labelField(String source) {
        return source.equals("animals") || source.equals("shelterAnimals") ? "noticeNo" : "title";
    }

    private MultiValueMap<String, String> values() {
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("sourceType", "DIRECT");
        data.add("region", "서울");
        data.add("noticeNo", "수정 항목");
        data.add("birthYear", "2024");
        data.add("gender", "MALE");
        data.add("weight", "5.5");
        data.add("imageUrl", "https://example.com/updated.png");
        data.add("hashtag", "#입양홍보");
        data.add("title", "수정 항목");
        data.add("content", "수정된 상세 내용");
        data.add("thumbnailUrl", "https://example.com/updated.png");
        data.add("mediaType", "IMAGE");
        data.add("youtubeUrl", "https://www.youtube.com/watch?v=abcdefghijk");
        data.add("videoUrl", "");
        data.add("attachmentUrl", "");
        data.add("status", "COMPLETED");
        data.add("breed", "푸들");
        data.add("regDate", "2026-11-09");
        data.add("rescueLocation", "서울");
        return data;
    }

    private void seed(String source) {
        switch (source) {
            case "animals" -> jdbc.update("insert into recommended_animals (id, source_type, region, notice_no, birth_year, gender, weight, image_url) values (1, 'DIRECT', '서울', '원본 항목', '2023', 'M', 5.0, 'https://example.com/original.png')");
            case "campaigns" -> jdbc.update("insert into adoption_campaign (campaign_id, hashtag, title, cont_bdy, media_type, thumbnail_url, insert_dt) values (1, '#입양홍보', '원본 항목', '원본 내용', 'IMAGE', 'https://example.com/original.png', CURRENT_TIMESTAMP)");
            case "youtubePosts" -> jdbc.update("insert into youtube_post (id, title, youtube_url, thumbnail_url, insert_dt) values (1, '원본 항목', 'https://youtu.be/abcdefghijk', 'https://example.com/original.png', CURRENT_TIMESTAMP)");
            case "fellowNews" -> jdbc.update("insert into fellow_news (id, title, content, image_url, insert_dt) values (1, '원본 항목', '원본 내용', 'https://example.com/original.png', CURRENT_TIMESTAMP)");
            case "needHelps" -> jdbc.update("insert into need_help (id, title, content, image_url, insert_dt) values (1, '원본 항목', '원본 내용', 'https://example.com/original.png', CURRENT_TIMESTAMP)");
            case "shelterAnimals" -> jdbc.update("insert into shelter_animals (id, status, gender, breed, notice_no, reg_date, rescue_location, content, image_url, created_at) values (1, 'ACTIVE', 'UNKNOWN', '푸들', '원본 항목', '2026-11-01', '서울', '원본 내용', '/uploads/original.png', CURRENT_TIMESTAMP)");
        }
    }

    private void clearRecords() {
        for (String table : List.of("recommended_animals", "adoption_campaign", "youtube_post", "fellow_news", "need_help", "shelter_animals", "admins", "member")) {
            jdbc.update("delete from " + table);
        }
    }
}
