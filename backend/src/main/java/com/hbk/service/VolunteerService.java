package com.hbk.service;

import com.hbk.domain.VolunteerApplicationStatus;
import com.hbk.dto.VolunteerDto;
import com.hbk.entity.Member;
import com.hbk.entity.VolunteerApplication;
import com.hbk.entity.VolunteerPost;
import com.hbk.repository.MemberRepository;
import com.hbk.repository.VolunteerApplicationRepository;
import com.hbk.repository.VolunteerPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

// 💡 봉사 모집과 신청. 선착순이라 신청하면 바로 확정되고, 정원이 차면 마감
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VolunteerService {

    private static final VolunteerApplicationStatus CONFIRMED = VolunteerApplicationStatus.CONFIRMED;
    private static final Pattern TIME = Pattern.compile("^([01]\\d|2[0-3]):[0-5]\\d$");

    private final VolunteerPostRepository postRepository;
    private final VolunteerApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;

    // ===== 사용자 =====

    // 오늘 이후 봉사 (가까운 날짜 순)
    public List<VolunteerDto.Post> getUpcoming() {
        List<VolunteerPost> posts = postRepository.findByActivityDateGreaterThanEqualOrderByActivityDateAscStartTimeAscIdAsc(LocalDate.now());
        Map<Long, Long> counts = countConfirmed(posts);
        return posts.stream().map(p -> VolunteerDto.Post.of(p, counts.getOrDefault(p.getId(), 0L), null)).toList();
    }

    // 상세. 로그인했으면 내 신청 id도 같이
    public VolunteerDto.Post getPost(Long id, String viewerEmail) {
        VolunteerPost post = findPost(id);
        Long myApplicationId = viewerEmail == null ? null
                : applicationRepository.findFirstByPostIdAndMemberEmailAndStatus(id, viewerEmail, CONFIRMED)
                        .map(VolunteerApplication::getId).orElse(null);
        return VolunteerDto.Post.of(post, applicationRepository.countByPostIdAndStatus(id, CONFIRMED), myApplicationId);
    }

    // 신청 (선착순 바로 확정)
    @Transactional
    public VolunteerDto.Application apply(Long postId, VolunteerDto.ApplyRequest request, String email) {
        // 💡 글 잠금이 이 트랜잭션의 첫 조회여야 함
        //    MariaDB(REPEATABLE READ)는 첫 일반 조회 때 읽기 시점을 고정해서, 잠금 전에 다른 걸 먼저 읽으면
        //    앞사람이 막 넣은 신청이 인원 수에 안 보여 정원을 넘길 수 있음
        VolunteerPost post = postRepository.findByIdForUpdate(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 봉사예요."));
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요."));

        if (applicationRepository.findFirstByPostIdAndMemberEmailAndStatus(postId, email, CONFIRMED).isPresent()) {
            throw conflict("이미 신청한 봉사예요. 마이 > 봉사 신청 내역에서 확인할 수 있어요.");
        }
        String state = VolunteerDto.stateOf(post, applicationRepository.countByPostIdAndStatus(postId, CONFIRMED));
        if (state.equals("CLOSED")) throw conflict("모집이 끝난 봉사예요.");
        if (state.equals("FULL")) throw conflict("아쉽지만 정원이 다 찼어요.");

        String name = trim(request.applicantName());
        String phone = trim(request.applicantPhone());
        String message = trim(request.message());
        if (name.isEmpty()) throw badRequest("이름을 적어 주세요.");
        if (name.length() > 50) throw badRequest("이름이 너무 길어요.");
        if (!phone.replaceAll("[^0-9]", "").matches("\\d{9,11}")) throw badRequest("연락처를 숫자로 적어 주세요.");
        if (message.length() > 500) throw badRequest("한마디는 500자까지 적을 수 있어요.");

        VolunteerApplication application = new VolunteerApplication();
        application.setMember(member);
        application.setPost(post);
        application.setApplicantName(name);
        application.setApplicantPhone(phone.replaceAll("[^0-9]", ""));
        application.setMessage(message.isEmpty() ? null : message);
        application.setStatus(CONFIRMED);
        return VolunteerDto.Application.of(applicationRepository.save(application));
    }

    public List<VolunteerDto.Application> getMine(String email) {
        return applicationRepository.findByMemberEmailOrderByIdDesc(email).stream().map(VolunteerDto.Application::of).toList();
    }

    // 취소 (봉사 날짜가 지나기 전까지)
    @Transactional
    public VolunteerDto.Application cancel(Long id, String email) {
        VolunteerApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "없는 신청이에요."));
        if (!application.getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내 신청만 취소할 수 있어요.");
        }
        if (!VolunteerDto.Application.of(application).cancelable()) throw conflict("이미 끝났거나 취소한 신청이에요.");
        application.setStatus(VolunteerApplicationStatus.CANCELED);
        return VolunteerDto.Application.of(application);
    }

    // ===== 관리자 =====

    public List<VolunteerDto.Post> getAllForAdmin() {
        List<VolunteerPost> posts = postRepository.findAllByOrderByIdDesc();
        Map<Long, Long> counts = countConfirmed(posts);
        return posts.stream().map(p -> VolunteerDto.Post.of(p, counts.getOrDefault(p.getId(), 0L), null)).toList();
    }

    @Transactional
    public VolunteerDto.Post create(VolunteerDto.PostRequest request) {
        VolunteerPost post = new VolunteerPost();
        fill(post, request, 0);
        return VolunteerDto.Post.of(postRepository.save(post), 0, null);
    }

    @Transactional
    public VolunteerDto.Post update(Long id, VolunteerDto.PostRequest request) {
        VolunteerPost post = findPost(id);
        long applied = applicationRepository.countByPostIdAndStatus(id, CONFIRMED);
        fill(post, request, applied);
        return VolunteerDto.Post.of(post, applied, null);
    }

    // 신청자가 있으면 지우지 않고 마감으로 바꾸게 함 (신청 내역이 사라지지 않게)
    @Transactional
    public void delete(Long id) {
        VolunteerPost post = findPost(id);
        if (applicationRepository.countByPostIdAndStatus(id, CONFIRMED) > 0) {
            throw conflict("신청한 사람이 있어서 지울 수 없어요. 마감으로 바꿔 주세요.");
        }
        applicationRepository.deleteAll(applicationRepository.findByPostIdOrderByIdAsc(id)); // 취소된 신청만 남아 있음
        postRepository.delete(post);
    }

    public List<VolunteerDto.Application> getApplicants(Long postId) {
        findPost(postId);
        return applicationRepository.findByPostIdOrderByIdAsc(postId).stream().map(VolunteerDto.Application::of).toList();
    }

    // ===== 공통 =====

    private void fill(VolunteerPost post, VolunteerDto.PostRequest r, long applied) {
        String title = trim(r.title());
        String place = trim(r.place());
        String start = trim(r.startTime());
        String end = trim(r.endTime());
        if (title.isEmpty() || title.length() > 100) throw badRequest("제목을 100자 안으로 적어 주세요.");
        if (place.isEmpty() || place.length() > 255) throw badRequest("장소를 적어 주세요.");
        if (r.activityDate() == null) throw badRequest("봉사 날짜를 골라 주세요.");
        if (!TIME.matcher(start).matches() || !TIME.matcher(end).matches()) throw badRequest("시간은 10:00 형식으로 적어 주세요.");
        if (start.compareTo(end) >= 0) throw badRequest("끝나는 시간이 시작 시간보다 늦어야 해요.");
        if (r.capacity() == null || r.capacity() < 1 || r.capacity() > 500) throw badRequest("모집 인원은 1~500명으로 적어 주세요.");
        if (r.capacity() < applied) throw badRequest("이미 " + applied + "명이 신청해서 그보다 적게 줄일 수 없어요.");

        post.setTitle(title);
        post.setContent(trim(r.content()));
        post.setPlace(place);
        post.setActivityDate(r.activityDate());
        post.setStartTime(start);
        post.setEndTime(end);
        post.setCapacity(r.capacity());
        String imageUrl = trim(r.imageUrl());
        post.setImageUrl(imageUrl.isEmpty() ? null : imageUrl);
        post.setClosed(Boolean.TRUE.equals(r.closed()));
    }

    private Map<Long, Long> countConfirmed(List<VolunteerPost> posts) {
        Map<Long, Long> counts = new HashMap<>();
        if (posts.isEmpty()) return counts;
        for (Object[] row : applicationRepository.countByPostIds(posts.stream().map(VolunteerPost::getId).toList(), CONFIRMED)) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return counts;
    }

    private VolunteerPost findPost(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 봉사예요."));
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private static ResponseStatusException conflict(String message) {
        return new ResponseStatusException(HttpStatus.CONFLICT, message);
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }
}
