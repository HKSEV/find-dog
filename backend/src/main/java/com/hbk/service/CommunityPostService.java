package com.hbk.service;

import com.hbk.domain.CommunityCategory;
import com.hbk.dto.CommunityDto;
import com.hbk.entity.CommunityPost;
import com.hbk.entity.Member;
import com.hbk.repository.CommunityPostRepository;
import com.hbk.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

// 💡 커뮤니티 회원 글 (입양 후기, 구조 이야기, 질문). 쓰기·고치기·지우기는 글쓴이만
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityPostService {

    public static final int MAX_PHOTOS = 5;
    private static final int MAX_PAGE = 30;

    private final CommunityPostRepository postRepository;
    private final MemberRepository memberRepository;

    public List<CommunityDto.Post> getPage(CommunityCategory category, Long cursorId, int size) {
        int pageSize = Math.min(Math.max(size, 1), MAX_PAGE);
        return postRepository.findPage(cursorId, category, PageRequest.of(0, pageSize)).stream()
                .map(p -> CommunityDto.Post.of(p, false))
                .toList();
    }

    public CommunityDto.Post getPost(Long id, String viewerEmail) {
        CommunityPost post = findPost(id);
        return CommunityDto.Post.of(post, isAuthor(post, viewerEmail));
    }

    public List<CommunityDto.Post> getMine(String email) {
        return postRepository.findByAuthorEmailOrderByIdDesc(email).stream().map(p -> CommunityDto.Post.of(p, true)).toList();
    }

    @Transactional
    public CommunityDto.Post create(CommunityDto.Request request, List<MultipartFile> files, String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요."));
        CommunityPost post = new CommunityPost();
        post.setAuthor(member);
        fill(post, request);
        post.setMediaUrls(new ArrayList<>(savePhotos(files, 0)));
        return CommunityDto.Post.of(postRepository.save(post), true);
    }

    // 고치기: 남겨 둔 기존 사진(이 글의 사진만) + 새로 올린 사진
    @Transactional
    public CommunityDto.Post update(Long id, CommunityDto.Request request, List<MultipartFile> files, String email) {
        CommunityPost post = findPost(id);
        requireAuthor(post, email, "고칠");
        fill(post, request);

        List<String> keep = request.keepMediaUrls() == null ? List.of()
                : request.keepMediaUrls().stream().filter(post.getMediaUrls()::contains).distinct().toList();
        List<String> media = new ArrayList<>(keep);
        media.addAll(savePhotos(files, keep.size()));
        post.getMediaUrls().clear();
        post.getMediaUrls().addAll(media);
        return CommunityDto.Post.of(post, true);
    }

    @Transactional
    public void delete(Long id, String email) {
        CommunityPost post = findPost(id);
        requireAuthor(post, email, "지울");
        postRepository.delete(post);
    }

    // [관리자] 운영 정책에 맞지 않는 글 지우기
    @Transactional
    public void deleteByAdmin(Long id) {
        postRepository.delete(findPost(id));
    }

    private void fill(CommunityPost post, CommunityDto.Request r) {
        String title = r.title() == null ? "" : r.title().trim();
        String content = r.content() == null ? "" : r.content().trim();
        if (r.category() == null) throw badRequest("분류를 골라 주세요.");
        if (title.isEmpty()) throw badRequest("제목을 적어 주세요.");
        if (title.length() > 100) throw badRequest("제목은 100자까지 적을 수 있어요.");
        if (content.isEmpty()) throw badRequest("내용을 적어 주세요.");
        if (content.length() > 5000) throw badRequest("내용은 5000자까지 적을 수 있어요.");
        post.setCategory(r.category());
        post.setTitle(title);
        post.setContent(content);
    }

    // 사진 저장 (/uploads/... 는 WebMvcConfig가 내려줌). 이미지가 아니면 거절
    private List<String> savePhotos(List<MultipartFile> files, int alreadyKept) {
        List<MultipartFile> photos = files == null ? List.of() : files.stream().filter(f -> f != null && !f.isEmpty()).toList();
        if (alreadyKept + photos.size() > MAX_PHOTOS) throw badRequest("사진은 최대 " + MAX_PHOTOS + "장까지 올릴 수 있어요.");

        List<String> urls = new ArrayList<>();
        for (int i = 0; i < photos.size(); i++) {
            MultipartFile file = photos.get(i);
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw badRequest("사진 파일만 올릴 수 있어요.");
            }
            try {
                String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo.jpg";
                String filename = System.currentTimeMillis() + "_c" + i + "_" + original.replaceAll("[^A-Za-z0-9._-]", "_");
                Path path = Paths.get(System.getProperty("user.dir"), "uploads", filename);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                urls.add("/uploads/" + filename);
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "사진을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
            }
        }
        return urls;
    }

    private CommunityPost findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 글이에요."));
    }

    private static boolean isAuthor(CommunityPost post, String email) {
        return email != null && email.equals(post.getAuthor().getEmail());
    }

    private static void requireAuthor(CommunityPost post, String email, String action) {
        if (!isAuthor(post, email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내가 쓴 글만 " + action + " 수 있어요.");
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
