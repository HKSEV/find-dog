package com.hbk.service;

import com.hbk.dto.AdminMemberDtos;
import com.hbk.entity.Member;
import com.hbk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

// 💡 관리자 > 회원 관리: 회원 목록(쓴 글·받은 신고 수), 이용 정지·해제
//    정지되면 로그인할 수 없고 가지고 있던 로그인도 바로 풀림 (JwtAuthenticationFilter)
@Service
@RequiredArgsConstructor
@Transactional
public class AdminMemberService {
    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;
    private final MissingPostRepository missingPostRepository;
    private final CommunityPostRepository communityPostRepository;
    private final MissingPostReportRepository postReportRepository;
    private final ChatReportRepository chatReportRepository;

    @Transactional(readOnly = true)
    public List<AdminMemberDtos.Row> members(){
        return memberRepository.findAll().stream()
                .sorted(Comparator.comparing(Member::getId).reversed())
                .map(this::toRow)
                .toList();
    }

    public AdminMemberDtos.Row suspend(Long memberId, AdminMemberDtos.SuspendRequest request){
        Member member = memberRepository.findById(memberId == null ? -1 : memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회원을 찾을 수 없어요."));
        boolean suspend = request != null && Boolean.TRUE.equals(request.suspended());
        if (suspend && isAdmin(member)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관리자 계정은 정지할 수 없어요.");
        String reason = request == null || request.reason() == null ? "" : request.reason().trim();
        if (suspend && reason.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "정지 사유를 적어 주세요.");
        if (reason.length() > 255) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "사유는 255자 이내로 적어 주세요.");
        member.setSuspended(suspend);
        member.setSuspendedReason(suspend ? reason : null);
        member.setSuspendedAt(suspend ? LocalDateTime.now() : null);
        return toRow(member);
    }

    private boolean isAdmin(Member member){
        return member.getEmail() != null && adminRepository.findByMemberEmail(member.getEmail()).isPresent();
    }

    private AdminMemberDtos.Row toRow(Member member){
        long reports = postReportRepository.countByPostAuthorId(member.getId()) + chatReportRepository.countReceived(member.getId());
        return new AdminMemberDtos.Row(member.getId(), member.getEmail(), member.getNickname(), member.getName(),
                maskPhone(member.getPhone()), member.getUserType(), member.getProvider(), isAdmin(member),
                missingPostRepository.countByAuthorId(member.getId()), communityPostRepository.countByAuthorId(member.getId()),
                reports, member.isSuspended(), member.getSuspendedReason(), member.getSuspendedAt());
    }

    // 010-1234-5678 -> 010-****-5678
    private static String maskPhone(String phone){
        if (phone == null) return null;
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() < 8) return "****";
        return digits.substring(0, 3) + "-****-" + digits.substring(digits.length() - 4);
    }
}
