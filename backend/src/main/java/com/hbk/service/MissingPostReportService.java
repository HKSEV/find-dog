package com.hbk.service;

import com.hbk.dto.MissingPostReportDtos;
import com.hbk.entity.Member;
import com.hbk.entity.MissingPost;
import com.hbk.entity.MissingPostReport;
import com.hbk.repository.MemberRepository;
import com.hbk.repository.MissingPostReportRepository;
import com.hbk.repository.MissingPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

// 💡 실종·제보 글 신고 (회원이 신고 -> 관리자가 확인 후 처리 완료 / 문제 없음, 필요하면 관리자 화면에서 글 삭제)
@Service
@RequiredArgsConstructor
@Transactional
public class MissingPostReportService {
    private static final Set<String> REASONS = Set.of("SPAM", "ABUSE", "FAKE", "PRIVACY", "ETC");

    private final MissingPostReportRepository reportRepository;
    private final MissingPostRepository postRepository;
    private final MemberRepository memberRepository;
    private final NotificationService notificationService;

    public void report(Long postId, MissingPostReportDtos.ReportRequest request, String email){
        Member me = memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요해요."));
        MissingPost post = postRepository.findById(postId == null ? -1 : postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 글이에요."));
        if (post.getAuthor() != null && post.getAuthor().getId().equals(me.getId())) throw bad("내 글은 신고할 수 없어요.");
        String reason = request == null || request.reason() == null ? "" : request.reason();
        if (!REASONS.contains(reason)) throw bad("신고 사유를 골라 주세요.");
        String detail = request.detail() == null ? "" : request.detail().trim();
        if (detail.length() > 500) throw bad("자세한 내용은 500자 이내로 적어 주세요.");

        MissingPostReport report = reportRepository.findByPostIdAndReporterId(post.getId(), me.getId()).orElseGet(MissingPostReport::new);
        report.setPost(post);
        report.setReporter(me);
        report.setReason(reason);
        report.setDetail(detail.isEmpty() ? null : detail);
        report.setStatus("PENDING");
        report.setAdminNote(null); // 다시 신고하면 예전 처리 메모는 지움
        report.setHandledAt(null);
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);
    }

    @Transactional(readOnly = true)
    public List<MissingPostReportDtos.AdminReport> adminReports(){
        return reportRepository.findAllForAdmin().stream().map(MissingPostReportService::toAdmin).toList();
    }

    public MissingPostReportDtos.AdminReport adminHandle(Long reportId, MissingPostReportDtos.AdminHandleRequest request){
        MissingPostReport report = reportRepository.findById(reportId == null ? -1 : reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "신고를 찾을 수 없어요."));
        String status = request == null ? null : request.status();
        if (!"RESOLVED".equals(status) && !"DISMISSED".equals(status)) throw bad("처리 결과를 골라 주세요.");
        String note = request.note() == null ? "" : request.note().trim();
        if (note.length() > 255) throw bad("메모는 255자 이내로 적어 주세요.");
        report.setStatus(status);
        report.setAdminNote(note.isEmpty() ? null : note);
        report.setHandledAt(LocalDateTime.now());
        // 신고한 회원에게 처리 결과 알림
        String title = MemberProfileService.missingTitle(report.getPost());
        notificationService.notify(report.getReporter(), com.hbk.domain.NotificationType.REPORT, status,
                "RESOLVED".equals(status)
                        ? "신고하신 '" + title + "' 글을 확인하고 조치했어요. 알려 주셔서 고마워요."
                        : "신고하신 '" + title + "' 글을 확인했지만 운영 정책 위반은 찾지 못했어요.",
                null, "/missing/detail/?id=" + report.getPost().getId());
        return toAdmin(report);
    }

    private static MissingPostReportDtos.AdminReport toAdmin(MissingPostReport report){
        MissingPost post = report.getPost();
        return new MissingPostReportDtos.AdminReport(report.getId(), post.getId(), MemberProfileService.missingTitle(post),
                post.getType() != null ? post.getType().name() : "LOST",
                post.getAuthor() != null ? post.getAuthor().getNickname() : "익명",
                report.getReporter().getNickname(), report.getReason(), report.getDetail(), report.getStatus(),
                report.getAdminNote(), report.getCreatedAt(), report.getHandledAt());
    }

    private static ResponseStatusException bad(String message){
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
