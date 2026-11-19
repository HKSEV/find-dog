package com.hbk.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;

// 💡 실종·목격 글 하나에 대한 1:1 대화방 (글쓴이 owner <-> 연락한 사람 guest)
//    전화번호를 서로 알리지 않고 앱 안에서 연락하게. 글이 지워지면 대화방도 같이 지워짐
@Entity
@Getter
@Setter
@Table(name = "chat_rooms", uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "guest_id"}))
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private MissingPost post;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private Member owner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guest_id", nullable = false)
    private Member guest;

    @Column(name = "last_message", length = 200)
    private String lastMessage;

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    // 각자 마지막으로 읽은 시각 (그 뒤에 온 상대 메시지 = 안 읽음)
    @Column(name = "owner_read_at")
    private LocalDateTime ownerReadAt;

    @Column(name = "guest_read_at")
    private LocalDateTime guestReadAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 차단·종료된 대화 (신고하며 차단했거나 관리자가 종료). 이후 메시지를 보낼 수 없음
    @Column(nullable = false)
    private boolean blocked = false;

    // 💡 대화방 나가기: 나간 사람 목록에서 빠지고, 상대는 더 이상 메시지를 보낼 수 없음
    //    clearedAt 이전 메시지는 그 사람에게 안 보임 (같은 글로 다시 채팅하면 새 대화처럼)
    @Column(name = "owner_left", nullable = false)
    private boolean ownerLeft = false;

    @Column(name = "guest_left", nullable = false)
    private boolean guestLeft = false;

    @Column(name = "owner_cleared_at")
    private LocalDateTime ownerClearedAt;

    @Column(name = "guest_cleared_at")
    private LocalDateTime guestClearedAt;
}
