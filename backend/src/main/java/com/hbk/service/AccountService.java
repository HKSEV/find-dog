package com.hbk.service;

import com.hbk.dto.MyAccountDto;
import com.hbk.entity.Member;
import com.hbk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

// 💡 비밀번호 바꾸기 · 회원 탈퇴 (마이 > 설정)
@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {
    private static final int MIN_PASSWORD = 8;

    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;
    private final PasswordService passwordService;
    private final MissingPostRepository missingPostRepository;
    private final MissingPostService missingPostService;
    private final CommunityPostRepository communityPostRepository;
    private final CommunityPostService communityPostService;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;
    private final AdoptionApplicationRepository adoptionRepository;
    private final VolunteerApplicationRepository volunteerRepository;
    private final NotificationRepository notificationRepository;

    // 이메일로 가입한 회원만 (카카오 가입은 비밀번호가 없음)
    public void changePassword(String email, MyAccountDto.PasswordRequest request) {
        com.hbk.config.DemoAccounts.blockFor(email, "비밀번호를 바꿀");
        Member member = member(email);
        if (KakaoMemberService.PROVIDER.equals(member.getProvider())) throw bad("카카오로 가입한 계정은 비밀번호가 없어요.");
        String current = request == null ? null : request.currentPassword();
        String next = request == null || request.newPassword() == null ? "" : request.newPassword();
        if (!passwordService.matches(member, current)) throw bad("지금 비밀번호가 맞지 않아요.");
        if (next.length() < MIN_PASSWORD) throw bad("새 비밀번호는 " + MIN_PASSWORD + "자 이상으로 적어 주세요.");
        if (next.equals(current)) throw bad("지금과 다른 비밀번호로 바꿔 주세요.");
        member.setPassword(passwordService.encode(next));
    }

    // 💡 회원 탈퇴: 내가 쓴 글·대화·신청·알림을 지우고, 회원 정보는 알아볼 수 없게 바꿔 둠
    //    (신고 기록 등 운영에 필요한 연결만 "탈퇴한 회원"으로 남김. 같은 이메일·카카오로 다시 가입할 수 있음)
    public void withdraw(String email, MyAccountDto.WithdrawRequest request) {
        com.hbk.config.DemoAccounts.blockFor(email, "탈퇴할");
        Member member = member(email);
        if (adminRepository.findByMemberEmail(email).isPresent()) throw bad("관리자 계정은 탈퇴할 수 없어요.");
        boolean kakao = KakaoMemberService.PROVIDER.equals(member.getProvider());
        if (!kakao && !passwordService.matches(member, request == null ? null : request.password())) {
            throw bad("비밀번호가 맞지 않아요.");
        }

        // 1) 내가 쓴 실종·제보 글 (그 글의 대화·신고도 함께), 이야기 글
        missingPostRepository.findByAuthorEmailOrderByIdDesc(email).forEach(post -> missingPostService.deletePost(post.getId(), email));
        communityPostRepository.findByAuthorEmailOrderByIdDesc(email).forEach(post -> communityPostService.delete(post.getId(), email));
        // 2) 남의 글로 시작한 대화는 나가기 (상대는 더 이상 보낼 수 없음, 둘 다 나가면 지워짐)
        chatRoomRepository.findMine(member.getId()).forEach(room -> chatService.leave(room.getId(), email));
        // 3) 입양·봉사 신청(이름·연락처가 들어 있음), 알림
        adoptionRepository.deleteAll(adoptionRepository.findByMemberEmailOrderByIdDesc(email));
        volunteerRepository.deleteAll(volunteerRepository.findByMemberEmailOrderByIdDesc(email));
        notificationRepository.deleteAll(notificationRepository.findTop50ByMemberEmailOrderByIdDesc(email));
        notificationRepository.deleteAll(notificationRepository.findByMemberEmailAndReadFalse(email));

        // 4) 회원 정보 지우기 (로그인 이메일·카카오 연결도 끊어서 이 계정으로는 다시 로그인할 수 없음)
        String tag = "탈퇴" + member.getId();
        member.setEmail("withdrawn-" + member.getId() + "@finddog.local");
        member.setNickname(tag);
        member.setName("탈퇴한 회원");
        member.setPhone("");
        member.setAddress(null);
        member.setProfileImageUrl(null);
        member.setPassword(passwordService.encode(UUID.randomUUID().toString()));
        member.setProvider("WITHDRAWN");
        member.setProviderId(null);
        member.setMarketingAgreed(false);
        member.setSuspended(true);
        member.setSuspendedReason("탈퇴한 계정");
        member.setWithdrawnAt(LocalDateTime.now());
    }

    private Member member(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요."));
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
