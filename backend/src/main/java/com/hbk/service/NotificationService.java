package com.hbk.service;

import com.hbk.domain.NotificationType;
import com.hbk.dto.NotificationDto;
import com.hbk.entity.Member;
import com.hbk.entity.Notification;
import com.hbk.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // 다른 서비스에서 알림을 남길 때 (같은 트랜잭션 안에서 저장)
    @Transactional
    public void notify(Member member, NotificationType type, String badge, String message, String imageUrl, String link) {
        if (member == null) return;
        Notification notification = new Notification();
        notification.setMember(member);
        notification.setType(type);
        notification.setBadge(badge);
        notification.setImageUrl(imageUrl != null && imageUrl.length() > 500 ? null : imageUrl);
        notification.setMessage(message.length() > 255 ? message.substring(0, 255) : message);
        notification.setLink(link);
        notificationRepository.save(notification);
    }

    // 💡 채팅 알림: 그 대화방의 안 읽은 알림은 지우고 최신 메시지로 하나만 남김 (메시지마다 알림이 쌓이지 않게)
    @Transactional
    public void notifyLatest(Member member, NotificationType type, String badge, String message, String imageUrl, String link) {
        if (member == null) return;
        notificationRepository.deleteAll(notificationRepository.findByMemberIdAndLinkAndReadFalse(member.getId(), link));
        notify(member, type, badge, message, imageUrl, link);
    }

    // 그 화면을 열었으면 (예: 대화방) 그곳으로 가는 알림은 읽음으로
    @Transactional
    public void readLink(Member member, String link) {
        if (member == null) return;
        notificationRepository.findByMemberIdAndLinkAndReadFalse(member.getId(), link).forEach(n -> n.setRead(true));
    }

    public List<NotificationDto> getMine(String email) {
        return notificationRepository.findTop50ByMemberEmailOrderByIdDesc(email).stream()
                .map(NotificationDto::from)
                .toList();
    }

    public boolean hasUnread(String email) {
        return notificationRepository.existsByMemberEmailAndReadFalse(email);
    }

    @Transactional
    public void readAll(String email) {
        notificationRepository.findByMemberEmailAndReadFalse(email).forEach(n -> n.setRead(true));
    }
}
