package com.hbk.service;

import com.hbk.domain.PostStatus;
import com.hbk.domain.PostType;
import com.hbk.dto.AdminMemberPostResponse;
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
import org.springframework.data.domain.Sort;
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

    public List<AdminMemberPostResponse> getAllForAdmin() {
        return missingPostRepository.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .map(post -> new AdminMemberPostResponse(post.getId(), post.getTitle(),
                        post.getType() == null ? PostType.LOST.name() : post.getType().name(),
                        post.getStatus().name(), post.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void deleteByAdmin(Long id) {
        missingPostRepository.delete(findPost(id));
    }

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
        //    화면이 보낸 사진 주소는 받지 않음 (아무 주소나 글에 넣지 못하게)
        List<String> mediaUrls = new java.util.ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사진 파일만 올릴 수 있어요.");
            }
            try {
                // 여러 장을 같은 순간에 저장해도 겹치지 않게 순번을 붙이고, 파일 이름의 특수문자는 _로 바꿈
                String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo.jpg";
                String filename = System.currentTimeMillis() + "_" + i + "_" + original.replaceAll("[^A-Za-z0-9._-]", "_");
                java.nio.file.Path path = java.nio.file.Paths.get(System.getProperty("user.dir"), "uploads", filename);

                java.nio.file.Files.createDirectories(path.getParent());
                java.nio.file.Files.write(path, file.getBytes());

                mediaUrls.add("/uploads/" + filename);
            } catch (Exception e) {
                // 사진 없이 글만 올라가지 않게 멈춤
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "사진을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
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
        post.setPetName(petName(requestDto.getPetName()));
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
        post.setOccurredTime(requestDto.getOccurredTime());
        setLocation(post, requestDto);
        post.setAuthor(member);
        post.setCreatedAt(LocalDateTime.now());

        MissingPost savePost = missingPostRepository.save(post);
        return new MissingPostResponseDto(savePost);
    }

    // 무한 스크롤 조회 (종류·상태로 거르기, null이면 전체)
    public List<MissingPostResponseDto> getPostByScroll(Long cursorId, int size, PostType type, PostStatus status, String keyword){
        List<String> words = keyword == null ? List.of()
                : java.util.Arrays.stream(keyword.trim().toLowerCase().split("\\s+")).filter(word -> !word.isEmpty()).toList();
        if (words.isEmpty()) {
            Pageable pageable = PageRequest.of(0, size);
            return missingPostRepository.findByFilter(cursorId, type, status, pageable).stream()
                    .map(MissingPostResponseDto::new)
                    .collect(Collectors.toList());
        }

        // 💡 검색: 이름·품종·털색·장소·제목·내용 중 어디에든 검색어가 모두 들어간 글 (예: "망원동 푸들")
        //    글 수가 많지 않아 거른 목록을 받아서 서버에서 한 번 더 거름 (최신순, 커서는 그대로)
        Pageable candidates = PageRequest.of(0, SEARCH_SCAN_LIMIT);
        return missingPostRepository.findByFilter(cursorId, type, status, candidates).stream()
                .filter(post -> matchesAll(post, words))
                .limit(size)
                .map(MissingPostResponseDto::new)
                .collect(Collectors.toList());
    }

    private static final int SEARCH_SCAN_LIMIT = 1000;

    private static boolean matchesAll(MissingPost post, List<String> words){
        String text = String.join(" ",
                java.util.Objects.toString(post.getPetName(), ""),
                java.util.Objects.toString(post.getBreed(), ""),
                java.util.Objects.toString(post.getColor(), ""),
                java.util.Objects.toString(post.getRescueLocation(), ""),
                java.util.Objects.toString(post.getTitle(), ""),
                java.util.Objects.toString(post.getContent(), ""),
                java.util.Objects.toString(post.getGender(), "")).toLowerCase();
        return words.stream().allMatch(text::contains);
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
        boolean mine = isAuthor(post, viewerEmail);
        return new MissingPostResponseDto(post)
                .markMine(mine)
                .withContactPhone(contactPhoneFor(post, viewerEmail, mine));
    }

    // 💡 근처 글: 실종 글이면 근처 목격 제보, 목격 글이면 근처 실종 신고
    //    지도 좌표가 있는 찾는 중인 글 중 NEARBY_KM 안, 날짜가 앞뒤로 맞는 것만 가까운 순으로 (최대 NEARBY_LIMIT개)
    //    - 실종 글: 잃어버린 날 하루 전부터 본 목격 제보
    //    - 목격 글: 본 날 하루 뒤까지 잃어버린 실종 신고
    private static final double NEARBY_KM = 3.0;
    private static final int NEARBY_LIMIT = 5;
    private static final int NEARBY_DAYS = 30;

    public List<MissingPostResponseDto> getNearbyPosts(Long id){
        MissingPost post = findPost(id);
        if (post.getLat() == null || post.getLng() == null) return List.of();
        PostType mineType = post.getType() != null ? post.getType() : PostType.LOST;
        PostType wanted = mineType == PostType.LOST ? PostType.FOUND : PostType.LOST;
        LocalDateTime base = post.getOccurredAt() != null ? post.getOccurredAt() : post.getCreatedAt();

        return missingPostRepository.findNearbyCandidates(id).stream()
                .filter(other -> (other.getType() != null ? other.getType() : PostType.LOST) == wanted)
                .filter(other -> withinDays(base, other, wanted))
                .map(other -> new Object[]{other, distanceKm(post.getLat(), post.getLng(), other.getLat(), other.getLng())})
                .filter(pair -> (double) pair[1] <= NEARBY_KM)
                .sorted(java.util.Comparator.comparingDouble(pair -> (double) pair[1]))
                .limit(NEARBY_LIMIT)
                .map(pair -> new MissingPostResponseDto((MissingPost) pair[0]).withDistanceKm((double) pair[1]))
                .toList();
    }

    // 날짜가 맞는지: 목격은 잃어버린 날 하루 전 이후, 실종은 본 날 하루 뒤 이전 (둘 다 30일 안)
    private static boolean withinDays(LocalDateTime base, MissingPost other, PostType wanted){
        LocalDateTime when = other.getOccurredAt() != null ? other.getOccurredAt() : other.getCreatedAt();
        if (base == null || when == null) return true;
        long days = java.time.Duration.between(base, when).toDays();
        return wanted == PostType.FOUND
                ? !when.isBefore(base.minusDays(1)) && days <= NEARBY_DAYS
                : !when.isAfter(base.plusDays(1)) && days >= -NEARBY_DAYS;
    }

    // 두 좌표 사이 거리 (km, 지구를 공으로 본 하버사인 공식)
    private static double distanceKm(double lat1, double lng1, double lat2, double lng2){
        double dLat = Math.toRadians(lat2 - lat1), dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // 작성자 휴대폰은 로그인한 다른 회원에게만, 아직 찾는 중인 글에만 알려줌 (아무나 번호를 모으지 못하게)
    private static String contactPhoneFor(MissingPost post, String viewerEmail, boolean mine){
        if (viewerEmail == null || mine || post.getStatus() == PostStatus.COMPLETED || post.getAuthor() == null) return null;
        String phone = post.getAuthor().getPhone();
        return phone == null || phone.isBlank() ? null : phone.replaceAll("[^0-9]", "");
    }

    private MissingPost findPost(Long id){
        return missingPostRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 글이에요."));
    }

    // 이름은 앞뒤 공백을 빼고 30자까지 (비어 있으면 저장 안 함)
    private static String petName(String value){
        if (value == null || value.isBlank()) return null;
        String name = value.trim();
        if (name.length() > 30) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이름은 30자 이내로 적어 주세요.");
        return name;
    }

    // 작성자가 없는 예전 글은 누구의 글도 아님
    // 좌표는 둘 다 있고 한국 근처 범위일 때만 저장 (아니면 지도 없음)
    private static void setLocation(MissingPost post, MissingPostRequestDto dto){
        Double lat = dto.getLat(), lng = dto.getLng();
        boolean valid = lat != null && lng != null && lat >= 32 && lat <= 39.5 && lng >= 124 && lng <= 132;
        post.setLat(valid ? lat : null);
        post.setLng(valid ? lng : null);
    }

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
        post.setOccurredTime(requestDto.getOccurredTime());
        setLocation(post, requestDto);
        post.setPetName(petName(requestDto.getPetName()));
        post.setBreed(requestDto.getBreed());
        post.setGender(requestDto.getGender());
        post.setAge(requestDto.getAge());
        post.setWeight(requestDto.getWeight());
        post.setColor(requestDto.getColor());
        post.setRescueLocation(requestDto.getRescueLocation());

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