package com.hbk.service;

import com.hbk.domain.PostType;
import com.hbk.dto.MemberProfileDto;
import com.hbk.entity.Member;
import com.hbk.entity.MissingPost;
import com.hbk.repository.CommunityPostRepository;
import com.hbk.repository.MemberRepository;
import com.hbk.repository.MissingPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

// 💡 회원 공개 프로필: 누구나 볼 수 있는 정보만 (닉네임, 프로필 사진, 쓴 실종·제보 글과 커뮤니티 글 최근 20개씩)
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberProfileService {
    private static final int LIMIT = 20;

    private final MemberRepository memberRepository;
    private final MissingPostRepository missingPostRepository;
    private final CommunityPostRepository communityPostRepository;

    public MemberProfileDto profile(Long memberId){
        Member member = memberRepository.findById(memberId == null ? -1 : memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "탈퇴했거나 없는 회원이에요."));
        if (member.getWithdrawnAt() != null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "탈퇴했거나 없는 회원이에요.");
        String email = member.getEmail();
        List<MemberProfileDto.Post> missing = email == null ? List.of() : missingPostRepository.findByAuthorEmailOrderByIdDesc(email).stream()
                .limit(LIMIT)
                .map(post -> new MemberProfileDto.Post(post.getId(), missingTitle(post),
                        post.getType() != null ? post.getType().name() : PostType.LOST.name(),
                        post.getStatus() != null ? post.getStatus().name() : null,
                        firstImage(post.getMediaUrls()), post.getCreatedAt()))
                .toList();
        List<MemberProfileDto.Post> community = email == null ? List.of() : communityPostRepository.findByAuthorEmailOrderByIdDesc(email).stream()
                .limit(LIMIT)
                .map(post -> new MemberProfileDto.Post(post.getId(), post.getTitle(), post.getCategory().name(), null,
                        firstImage(post.getMediaUrls()), post.getCreatedAt()))
                .toList();
        return new MemberProfileDto(member.getId(), member.getNickname(), member.getProfileImageUrl(), missing, community);
    }

    // "하루 · 진돗개 믹스" (이름이 없으면 품종·제목)
    static String missingTitle(MissingPost post){
        String name = post.getPetName();
        String breed = Objects.toString(post.getBreed(), "");
        if (name != null && !name.isBlank()) return breed.isBlank() ? name : name + " · " + breed;
        if (!breed.isBlank()) return breed;
        return Objects.toString(post.getTitle(), "실종·제보 글");
    }

    private static String firstImage(List<String> urls){
        return urls == null || urls.isEmpty() ? null : urls.get(0);
    }
}
