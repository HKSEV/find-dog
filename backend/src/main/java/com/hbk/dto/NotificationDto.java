package com.hbk.dto;

import com.hbk.domain.NotificationType;
import com.hbk.entity.Notification;

import java.time.LocalDateTime;

// 알림 화면에 내려주는 값
public record NotificationDto(
        Long id,
        NotificationType type,
        String badge,
        String message,
        String imageUrl,
        String link,
        boolean read,
        LocalDateTime createdAt
) {
    public static NotificationDto from(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getType(),
                notification.getBadge(),
                notification.getMessage(),
                notification.getImageUrl(),
                notification.getLink(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
