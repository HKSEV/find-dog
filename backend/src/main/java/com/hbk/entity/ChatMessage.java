package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

// 💡 대화방 메시지: 글(TEXT) 또는 위치(LOCATION, 지도에서 고른 좌표 + 설명)
@Entity
@Getter
@Setter
@Table(name = "chat_messages", indexes = @Index(name = "idx_chat_messages_room", columnList = "room_id, id"))
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false)
    private Member sender;

    @Column(nullable = false, length = 10)
    private String type; // TEXT / LOCATION

    @Column(columnDefinition = "TEXT")
    private String content;

    private Double lat;
    private Double lng;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
