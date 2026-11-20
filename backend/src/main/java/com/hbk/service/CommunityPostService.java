package com.hbk.service;

import com.hbk.domain.CommunityCategory;
import com.hbk.dto.AdminMemberPostResponse;
import com.hbk.dto.CommunityDto;
import com.hbk.entity.CommunityPost;
import com.hbk.entity.Member;
import com.hbk.repository.CommunityPostRepository;
import com.hbk.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    private final com.hbk.repository.CommunityPostReportRepository reportRepository;
    private final com.hbk.repository.CommunityPostLikeRepository likeRepository;
    private final com.hbk.repository.CommunityCommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final NotificationService notificationService;

    private static final int MAX_COMMENT = 500;
    private static final int MAX_COMMENTS = 300;

    public List<CommunityDto.Post> getPage(CommunityCategory category, Long cursorId, int size) {
        int pageSize = Math.min(Math.max(size, 1), MAX_PAGE);
        return withCounts(postRepository.findPage(cursorId, category, PageRequest.of(0, pageSize)), false);
    }

    // 목록에 공감·댓글 수 붙이기 (글마다 따로 세지 않고 한 번에)
    private List<CommunityDto.Post> withCounts(List<CommunityPost> posts, boolean mine) {
        List<Long> ids = posts.stream().map(CommunityPost::getId).toList();
        java.util.Map<Long, Long> likes = ids.isEmpty() ? java.util.Map.of() : toMap(likeRepository.countByPostIds(ids));
        java.util.Map<Long, Long> comments = ids.isEmpty() ? java.util.Map.of() : toMap(commentRepository.countByPostIds(ids));
        return posts.stream()
                .map(p -> CommunityDto.Post.of(p, mine, likes.getOrDefault(p.getId(), 0L), comments.getOrDefault(p.getId(), 0L), false))
                .toList();
    }

    private static java.util.Map<Long, Long> toMap(List<Object[]> rows) {
        java.util.Map<Long, Long> map = new java.util.HashMap<>();
        rows.forEach(row -> map.put((Long) row[0], (Long) row[1]));
        return map;
    }

    // 💡 검색: 제목·내용에 검색어가 모두 들어간 글 (최신순, 커서로 이어 받기). 글 수가 많지 않아 서버에서 거름
    public List<CommunityDto.Post> search(CommunityCategory category, Long cursorId, int size, String keyword) {
        int pageSize = Math.min(Math.max(size, 1), MAX_PAGE);
        List<String> words = java.util.Arrays.stream(keyword.trim().toLowerCase().split("\\s+")).filter(w -> !w.isEmpty()).toList();
        return withCounts(postRepository.findPage(cursorId, category, PageRequest.of(0, 1000)).stream()
                .filter(p -> {
                    String text = (p.getTitle() + " " + p.getContent()).toLowerCase();
                    return words.stream().allMatch(text::contains);
                })
                .limit(pageSize)
                .toList(), false);
    }

    public CommunityDto.Post getPost(Long id, String viewerEmail) {
        CommunityPost post = findPost(id);
        Long viewerId = viewerId(viewerEmail);
        boolean liked = viewerId != null && likeRepository.findByPostIdAndMemberId(id, viewerId).isPresent();
        return CommunityDto.Post.of(post, isAuthor(post, viewerEmail),
                likeRepository.countByPostId(id), commentRepository.countByPostId(id), liked);
    }

    public List<CommunityDto.Post> getMine(String email) {
        return withCounts(postRepository.findByAuthorEmailOrderByIdDesc(email), true);
    }

    // 💡 공감(하트): 누르면 켜고, 다시 누르면 끔 (로그인 회원, 내 글에도 가능)
    @Transactional
    public CommunityDto.LikeResult setLike(Long id, boolean on, String email) {
        CommunityPost post = findPost(id);
        Member member = requireMember(email);
        var existing = likeRepository.findByPostIdAndMemberId(id, member.getId());
        if (on && existing.isEmpty()) {
            com.hbk.entity.CommunityPostLike like = new com.hbk.entity.CommunityPostLike();
            like.setPost(post);
            like.setMember(member);
            like.setCreatedAt(java.time.LocalDateTime.now());
            likeRepository.save(like);
        } else if (!on) {
            existing.ifPresent(likeRepository::delete);
        }
        likeRepository.flush();
        return new CommunityDto.LikeResult(on, likeRepository.countByPostId(id));
    }

    // 💡 댓글: 누구나 읽고, 로그인 회원이 씀. 오래된 순
    public List<CommunityDto.Comment> getComments(Long id, String viewerEmail) {
        findPost(id);
        Long viewerId = viewerId(viewerEmail);
        return commentRepository.findByPost(id, PageRequest.of(0, MAX_COMMENTS)).stream()
                .map(c -> CommunityDto.Comment.of(c, viewerId))
                .toList();
    }

    @Transactional
    public CommunityDto.Comment addComment(Long id, CommunityDto.CommentRequest request, String email) {
        CommunityPost post = findPost(id);
        Member member = requireMember(email);
        String content = request == null || request.content() == null ? "" : request.content().trim();
        if (content.isEmpty()) throw badRequest("댓글을 적어 주세요.");
        if (content.length() > MAX_COMMENT) throw badRequest("댓글은 " + MAX_COMMENT + "자까지 적을 수 있어요.");

        com.hbk.entity.CommunityComment comment = new com.hbk.entity.CommunityComment();
        comment.setPost(post);
        comment.setAuthor(member);
        comment.setContent(content);
        comment.setCreatedAt(java.time.LocalDateTime.now());
        commentRepository.save(comment);

        // 글쓴이에게 알림 (내 글에 단 댓글은 빼고). 읽기 전 알림은 글마다 하나만 남김
        if (!post.getAuthor().getId().equals(member.getId())) {
            String preview = content.length() > 40 ? content.substring(0, 40) + "…" : content;
            notificationService.notifyLatest(post.getAuthor(), com.hbk.domain.NotificationType.COMMENT, "COMMENT",
                    CommunityDto.Comment.of(comment, null).authorName() + "님이 댓글을 남겼어요: " + preview,
                    post.getMediaUrls().isEmpty() ? null : post.getMediaUrls().get(0),
                    "/story/detail/?id=" + post.getId());
        }
        return CommunityDto.Comment.of(comment, member.getId());
    }

    // 댓글 지우기: 쓴 사람만
    @Transactional
    public void deleteComment(Long id, Long commentId, String email) {
        com.hbk.entity.CommunityComment comment = commentRepository.findById(commentId)
                .filter(c -> c.getPost().getId().equals(id))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 댓글이에요."));
        Member member = requireMember(email);
        if (!comment.getAuthor().getId().equals(member.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내가 쓴 댓글만 지울 수 있어요.");
        }
        commentRepository.delete(comment);
    }

    private Long viewerId(String email) {
        return email == null ? null : memberRepository.findByEmail(email).map(Member::getId).orElse(null);
    }

    private Member requireMember(String email) {
        if (email == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요.");
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요."));
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
        com.hbk.config.DemoAccounts.blockFor(email, "글을 지울");
        CommunityPost post = findPost(id);
        requireAuthor(post, email, "지울");
        deleteChildren(post.getId());
        postRepository.delete(post);
    }

    public List<AdminMemberPostResponse> getAllForAdmin() {
        return postRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(post -> new AdminMemberPostResponse(post.getId(), post.getTitle(),
                        post.getCategory().name(), null, post.getCreatedAt()))
                .toList();
    }

    // [관리자] 운영 정책에 맞지 않는 글 지우기
    @Transactional
    public void deleteByAdmin(Long id) {
        CommunityPost post = findPost(id);
        deleteChildren(post.getId());
        postRepository.delete(post);
    }

    // 글에 딸린 신고·공감·댓글도 함께 지움 (SQLite 는 외래키 연쇄 삭제가 없어서 직접)
    private void deleteChildren(Long postId) {
        reportRepository.deleteByPostId(postId);
        likeRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);
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
            // 진짜 사진(PNG·JPG·GIF·WEBP)만, 파일 이름은 서버가 새로 지음 (ImageUploads)
            if (ImageUploads.extensionOf(file) == null) {
                throw badRequest("사진 파일(PNG, JPG, GIF, WEBP)만 올릴 수 있어요.");
            }
            try {
                urls.add(ImageUploads.save(file, "c" + i));
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
