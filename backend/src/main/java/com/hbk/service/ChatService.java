package com.hbk.service;

import com.hbk.domain.PostType;
import com.hbk.dto.ChatDtos;
import com.hbk.entity.ChatMessage;
import com.hbk.entity.ChatRoom;
import com.hbk.entity.Member;
import com.hbk.entity.MissingPost;
import com.hbk.repository.ChatMessageRepository;
import com.hbk.repository.ChatRoomRepository;
import com.hbk.repository.MemberRepository;
import com.hbk.repository.MissingPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

// 💡 실종·목격 글 1:1 채팅 (전화번호를 알리지 않고 앱 안에서 연락)
//    대화방은 글 하나 + 연락한 사람 한 명마다 하나. 새 메시지는 화면이 몇 초마다 물어봄(afterId 이후)
@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {
    private static final int MAX_TEXT = 1000;

    private final ChatRoomRepository roomRepository;
    private final ChatMessageRepository messageRepository;
    private final MemberRepository memberRepository;
    private final MissingPostRepository postRepository;

    // 글에서 "채팅하기": 이미 있으면 그 대화방, 없으면 새로 만듦
    public ChatDtos.Room open(Long postId, String email){
        Member me = member(email);
        MissingPost post = postRepository.findById(postId == null ? -1 : postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제됐거나 없는 글이에요."));
        Member owner = post.getAuthor();
        if (owner == null) throw bad("연락할 수 없는 글이에요.");
        if (owner.getId().equals(me.getId())) throw bad("내 글에는 채팅을 시작할 수 없어요.");

        ChatRoom room = roomRepository.findByPostIdAndGuestId(post.getId(), me.getId()).orElseGet(() -> {
            ChatRoom created = new ChatRoom();
            created.setPost(post);
            created.setOwner(owner);
            created.setGuest(me);
            created.setCreatedAt(LocalDateTime.now());
            created.setGuestReadAt(LocalDateTime.now());
            return roomRepository.save(created);
        });
        return toRoom(room, me);
    }

    @Transactional(readOnly = true)
    public List<ChatDtos.Room> myRooms(String email){
        Member me = member(email);
        return roomRepository.findMine(me.getId()).stream().map(room -> toRoom(room, me)).toList();
    }

    @Transactional(readOnly = true)
    public ChatDtos.Room room(Long roomId, String email){
        Member me = member(email);
        return toRoom(participantRoom(roomId, me), me);
    }

    // afterId 뒤의 메시지 (처음엔 0). 읽은 것으로 표시
    public List<ChatDtos.Message> messages(Long roomId, Long afterId, String email){
        Member me = member(email);
        ChatRoom room = participantRoom(roomId, me);
        List<ChatDtos.Message> list = messageRepository.findAfter(room.getId(), afterId == null ? 0L : afterId, PageRequest.of(0, 200))
                .stream().map(message -> toMessage(message, me)).toList();
        markRead(room, me);
        return list;
    }

    public ChatDtos.Message send(Long roomId, ChatDtos.SendRequest request, String email){
        Member me = member(email);
        ChatRoom room = participantRoom(roomId, me);
        String type = request == null || request.type() == null ? "TEXT" : request.type();
        String content = request == null || request.content() == null ? "" : request.content().trim();

        ChatMessage message = new ChatMessage();
        message.setRoom(room);
        message.setSender(me);
        message.setCreatedAt(LocalDateTime.now());
        if ("LOCATION".equals(type)) {
            Double lat = request.lat(), lng = request.lng();
            if (lat == null || lng == null || lat < 32 || lat > 39.5 || lng < 124 || lng > 132) throw bad("지도에서 위치를 다시 골라 주세요.");
            if (content.length() > 100) throw bad("위치 설명은 100자 이내로 적어 주세요.");
            message.setType("LOCATION");
            message.setLat(lat);
            message.setLng(lng);
            message.setContent(content);
            room.setLastMessage("📍 위치를 보냈어요");
        } else {
            if (content.isEmpty()) throw bad("메시지를 적어 주세요.");
            if (content.length() > MAX_TEXT) throw bad("메시지는 " + MAX_TEXT + "자 이내로 적어 주세요.");
            message.setType("TEXT");
            message.setContent(content);
            room.setLastMessage(content.length() > 200 ? content.substring(0, 200) : content);
        }
        room.setLastMessageAt(message.getCreatedAt());
        markRead(room, me);
        return toMessage(messageRepository.save(message), me);
    }

    // 하단 탭 채팅 빨간 숫자
    @Transactional(readOnly = true)
    public long unreadTotal(String email){
        Member me = member(email);
        return roomRepository.findMine(me.getId()).stream().mapToLong(room -> unread(room, me)).sum();
    }

    private ChatDtos.Room toRoom(ChatRoom room, Member me){
        MissingPost post = room.getPost();
        boolean iAmOwner = room.getOwner().getId().equals(me.getId());
        Member other = iAmOwner ? room.getGuest() : room.getOwner();
        String image = post.getMediaUrls() == null || post.getMediaUrls().isEmpty() ? null : post.getMediaUrls().get(0);
        return new ChatDtos.Room(
                room.getId(), post.getId(), postTitle(post),
                post.getType() != null ? post.getType().name() : PostType.LOST.name(),
                post.getStatus() != null ? post.getStatus().name() : null,
                image,
                other.getNickname(), other.getProfileImageUrl(),
                iAmOwner, room.getLastMessage(), room.getLastMessageAt(), unread(room, me));
    }

    private static String postTitle(MissingPost post){
        String name = post.getPetName();
        String breed = Objects.toString(post.getBreed(), "");
        if (name != null && !name.isBlank()) return breed.isBlank() ? name : name + " · " + breed;
        return post.getTitle() != null && !post.getTitle().isBlank() ? post.getTitle() : breed;
    }

    private ChatDtos.Message toMessage(ChatMessage message, Member me){
        return new ChatDtos.Message(message.getId(), message.getSender().getId().equals(me.getId()), message.getType(),
                message.getContent(), message.getLat(), message.getLng(), message.getCreatedAt());
    }

    private long unread(ChatRoom room, Member me){
        boolean iAmOwner = room.getOwner().getId().equals(me.getId());
        return messageRepository.countUnread(room.getId(), me.getId(), iAmOwner ? room.getOwnerReadAt() : room.getGuestReadAt());
    }

    private static void markRead(ChatRoom room, Member me){
        if (room.getOwner().getId().equals(me.getId())) room.setOwnerReadAt(LocalDateTime.now());
        else room.setGuestReadAt(LocalDateTime.now());
    }

    // 대화방에 들어있는 사람만 (아니면 없는 방처럼 404)
    private ChatRoom participantRoom(Long roomId, Member me){
        ChatRoom room = roomRepository.findById(roomId == null ? -1 : roomId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "대화방을 찾을 수 없어요."));
        boolean joined = room.getOwner().getId().equals(me.getId()) || room.getGuest().getId().equals(me.getId());
        if (!joined) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "대화방을 찾을 수 없어요.");
        return room;
    }

    private Member member(String email){
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "다시 로그인해 주세요."));
    }

    private static ResponseStatusException bad(String message){
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
