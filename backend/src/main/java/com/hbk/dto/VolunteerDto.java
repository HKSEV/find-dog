package com.hbk.dto;

import com.hbk.domain.VolunteerApplicationStatus;
import com.hbk.entity.VolunteerApplication;
import com.hbk.entity.VolunteerPost;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 💡 봉사 모집·신청 주고받는 값
public class VolunteerDto {

    // 모집 상태: OPEN(신청 가능), FULL(정원 참), CLOSED(날짜 지남 또는 관리자가 마감)
    public static String stateOf(VolunteerPost post, long appliedCount) {
        if (post.isClosed() || post.getActivityDate().isBefore(LocalDate.now())) return "CLOSED";
        if (appliedCount >= post.getCapacity()) return "FULL";
        return "OPEN";
    }

    // 모집 글 (목록·상세). myApplicationId는 상세에서 로그인한 본인이 신청했을 때만
    public record Post(Long id, String title, String content, String place,
                       LocalDate activityDate, String startTime, String endTime,
                       int capacity, long appliedCount, String state, boolean closed,
                       String imageUrl, Long myApplicationId, LocalDateTime createdAt) {
        public static Post of(VolunteerPost p, long appliedCount, Long myApplicationId) {
            return new Post(p.getId(), p.getTitle(), p.getContent(), p.getPlace(),
                    p.getActivityDate(), p.getStartTime(), p.getEndTime(),
                    p.getCapacity(), appliedCount, stateOf(p, appliedCount), p.isClosed(),
                    p.getImageUrl(), myApplicationId, p.getCreatedAt());
        }
    }

    // 관리자 등록·수정
    public record PostRequest(String title, String content, String place,
                              LocalDate activityDate, String startTime, String endTime,
                              Integer capacity, String imageUrl, Boolean closed) {
    }

    // 사용자 신청서
    public record ApplyRequest(String applicantName, String applicantPhone, String message) {
    }

    // 신청 (마이 > 봉사 신청 내역, 관리자 신청자 목록)
    public record Application(Long id, Long postId, String postTitle, String place,
                              LocalDate activityDate, String startTime, String endTime, String imageUrl,
                              String applicantName, String applicantPhone, String message,
                              String memberNickname, VolunteerApplicationStatus status,
                              boolean cancelable, LocalDateTime createdAt) {
        public static Application of(VolunteerApplication a) {
            VolunteerPost p = a.getPost();
            boolean cancelable = a.getStatus() == VolunteerApplicationStatus.CONFIRMED
                    && !p.getActivityDate().isBefore(LocalDate.now());
            return new Application(a.getId(), p.getId(), p.getTitle(), p.getPlace(),
                    p.getActivityDate(), p.getStartTime(), p.getEndTime(), p.getImageUrl(),
                    a.getApplicantName(), a.getApplicantPhone(), a.getMessage(),
                    a.getMember().getNickname(), a.getStatus(), cancelable, a.getCreatedAt());
        }
    }
}
