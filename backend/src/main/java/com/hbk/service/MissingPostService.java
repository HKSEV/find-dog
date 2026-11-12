package com.hbk.service;

import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;
import com.hbk.dto.MissingPostRequestDto;
import com.hbk.dto.MissingPostResponseDto;
import com.hbk.entity.Member;
import com.hbk.entity.MissingPost;
import com.hbk.repository.MemberRepository;
import com.hbk.repository.MissingPostRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissingPostService {

    private final MissingPostRepository missingPostRepository;
    private final MemberRepository memberRepository;

    public static final int MAX_PHOTOS = 5;

    // 실종 신고글 작성 (DTO, 사진 여러 장, 유저 이메일 수신)
    @Transactional
    public MissingPostResponseDto createPost(
            MissingPostRequestDto requestDto,
            List<MultipartFile> files,
            String username
    ){
        // 1. 현재 로그인한 유저의 이메일을 기반으로 DB에서 유저 정보를 조회
        Member member = memberRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 유저 입니다"));

        // 2. 사진을 서버에 저장하고 주소를 mediaUrls에 추가 (/uploads/... 는 WebMvcConfig가 내려줌)
        List<String> mediaUrls = new java.util.ArrayList<>();
        if (requestDto.getMediaUrls() != null) mediaUrls.addAll(requestDto.getMediaUrls());
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            try {
                // 여러 장을 같은 순간에 저장해도 겹치지 않게 순번을 붙이고, 파일 이름의 특수문자는 _로 바꿈
                String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo.jpg";
                String filename = System.currentTimeMillis() + "_" + i + "_" + original.replaceAll("[^A-Za-z0-9._-]", "_");
                String uploadDir = System.getProperty("user.dir") + "/uploads/";
                java.nio.file.Path path = java.nio.file.Paths.get(uploadDir + filename);

                java.nio.file.Files.createDirectories(path.getParent());
                java.nio.file.Files.write(path, file.getBytes());

                mediaUrls.add("/uploads/" + filename);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        requestDto.setMediaUrls(mediaUrls);

        PostType type = requestDto.getType() != null ? requestDto.getType() : PostType.LOST;

        // 시안에는 제목 칸이 없어서, 비어 있으면 품종과 털색·특징으로 만듦 (예: "비글 믹스 · 노란 스카프")
        String title = requestDto.getTitle();
        if (title == null || title.isBlank()) {
            String breed = requestDto.getBreed() != null && !requestDto.getBreed().isBlank() ? requestDto.getBreed() : "품종 모름";
            String color = requestDto.getColor();
            title = color != null && !color.isBlank() ? breed + " · " + color : breed;
        }

        MissingPost post = new MissingPost();
        post.setTitle(title);
        post.setContent(requestDto.getContent() != null ? requestDto.getContent() : "");
        post.setBreed(requestDto.getBreed());
        post.setGender(requestDto.getGender());
        post.setAge(requestDto.getAge());
        post.setWeight(requestDto.getWeight());
        post.setColor(requestDto.getColor());
        post.setRescueLocation(requestDto.getRescueLocation());
        post.setMediaUrls(requestDto.getMediaUrls());
        post.setStatus(PostStatus.MISSING);
        post.setType(type);
        post.setOccurredAt(requestDto.getOccurredAt());
        post.setAuthor(member);
        post.setCreatedAt(LocalDateTime.now());

        MissingPost savePost = missingPostRepository.save(post);
        System.out.println("========== [DB 저장 완료 ID: " + savePost.getId() + "] ==========");
        return new MissingPostResponseDto(savePost);
    }

    // 무한 스크롤 조회 (종류·상태로 거르기, null이면 전체)
    public List<MissingPostResponseDto> getPostByScroll(Long cursorId, int size, PostType type, PostStatus status){
        Pageable pageable = PageRequest.of(0, size);
        List<MissingPost> posts = missingPostRepository.findByFilter(cursorId, type, status, pageable);

        return posts.stream().map(MissingPostResponseDto::new)
                .collect(Collectors.toList());
    }

    // 내가 쓴 글 (마이 > 작성한 글)
    @Transactional(readOnly = true)
    public List<MissingPostResponseDto> getMyPosts(String email){
        return missingPostRepository.findByAuthorEmailOrderByIdDesc(email).stream()
                .map(MissingPostResponseDto::new)
                .collect(Collectors.toList());
    }

    // 글 하나 조회 (상세 화면). viewerEmail은 로그인 안 했으면 null
    @Transactional(readOnly = true)
    public MissingPostResponseDto getPost(Long id, String viewerEmail){
        MissingPost post = findPost(id);
        return new MissingPostResponseDto(post).markMine(isAuthor(post, viewerEmail));
    }

    private MissingPost findPost(Long id){
        return missingPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 글이에요."));
    }

    // 작성자가 없는 예전 글은 누구의 글도 아님
    private static boolean isAuthor(MissingPost post, String email){
        return email != null && post.getAuthor() != null && email.equals(post.getAuthor().getEmail());
    }

    private static void requireAuthor(MissingPost post, String email, String action){
        if (!isAuthor(post, email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내가 쓴 글만 " + action + "할 수 있어요.");
        }
    }

    // 글 수정 (본인 확인)
    @Transactional
    public MissingPostResponseDto updatePost(Long id, MissingPostRequestDto requestDto, String username){
        MissingPost post = findPost(id);
        requireAuthor(post, username, "수정");

        // 수정 내용 반영 (제목이 비면 기존 제목 유지, 사진은 그대로)
        if (requestDto.getTitle() != null && !requestDto.getTitle().isBlank()) {
            post.setTitle(requestDto.getTitle());
        }
        post.setContent(requestDto.getContent() != null ? requestDto.getContent() : "");
        if (requestDto.getType() != null) post.setType(requestDto.getType());
        post.setOccurredAt(requestDto.getOccurredAt());
        post.setBreed(requestDto.getBreed());
        post.setGender(requestDto.getGender());
        post.setAge(requestDto.getAge());
        post.setWeight(requestDto.getWeight());
        post.setColor(requestDto.getColor());
        post.setRescueLocation(requestDto.getRescueLocation());

        if (requestDto.getMediaUrls() != null && !requestDto.getMediaUrls().isEmpty()) {
            post.setMediaUrls(requestDto.getMediaUrls());
        }

        return new MissingPostResponseDto(post).markMine(true);
    }

    // 글 삭제 (본인 확인)
    @Transactional
    public void deletePost(Long id, String username){
        MissingPost post = findPost(id);
        requireAuthor(post, username, "삭제");

        missingPostRepository.delete(post);
    }

    // 완료 처리 (찾았을 경우 상태 변경)
    @Transactional
    public void completPost(Long id, String username){
        MissingPost post = findPost(id);
        requireAuthor(post, username, "변경");
        post.setStatus(PostStatus.COMPLETED);
    }
}