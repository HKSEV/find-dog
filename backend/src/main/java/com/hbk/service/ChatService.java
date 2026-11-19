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
    private final com.hbk.repository.ChatReportRepository reportRepository;

    private static final java.util.Set<String> REASONS = java.util.Set.of("SPAM", "ABUSE", "FAKE", "PRIVACY", "ETC");

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
        // 나갔던 대화방이면 다시 목록에 (나가기 전 메시지는 계속 안 보임)
        if (room.isGuestLeft()) room.setGuestLeft(false);
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
        List<ChatDtos.Message> list = messageRepository.findAfterSince(room.getId(), afterId == null ? 0L : afterId, clearedAt(room, me), PageRequest.of(0, 200))
                .stream().map(message -> toMessage(message, me)).toList();
        markRead(room, me);
        return list;
    }

    public ChatDtos.Message send(Long roomId, ChatDtos.SendRequest request, String email){
        Member me = member(email);
        ChatRoom room = participantRoom(roomId, me);
        if (room.isBlocked()) throw bad("종료된 대화라 메시지를 보낼 수 없어요.");
        boolean iAmOwner = room.getOwner().getId().equals(me.getId());
        if (iAmOwner ? room.isOwnerLeft() : room.isGuestLeft()) throw bad("나간 대화방이에요.");
        if (iAmOwner ? room.isGuestLeft() : room.isOwnerLeft()) throw bad("상대가 대화방을 나가서 메시지를 보낼 수 없어요.");
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

    // 💡 대화방 나가기: 내 목록에서 빠지고 이전 메시지는 내게 안 보임. 상대는 더 이상 보낼 수 없음
    //    두 사람 모두 나갔고 신고가 없으면 대화를 완전히 지움 (신고된 대화는 운영팀 확인용으로 남김)
    public void leave(Long roomId, String email){
        Member me = member(email);
        ChatRoom room = participantRoom(roomId, me);
        LocalDateTime now = LocalDateTime.now();
        if (room.getOwner().getId().equals(me.getId())) {
            room.setOwnerLeft(true);
            room.setOwnerClearedAt(now);
            room.setOwnerReadAt(now);
        } else {
            room.setGuestLeft(true);
            room.setGuestClearedAt(now);
            room.setGuestReadAt(now);
        }
        if (room.isOwnerLeft() && room.isGuestLeft() && !reportRepository.existsByRoomId(room.getId())) {
            messageRepository.deleteByRoomId(room.getId());
            roomRepository.delete(room);
        }
    }

    // 💡 신고하기: 같은 사람이 다시 신고하면 사유·내용만 바꾸고 다시 "처리 전"으로
    public void report(Long roomId, ChatDtos.ReportRequest request, String email){
        Member me = member(email);
        ChatRoom room = participantRoom(roomId, me);
        String reason = request == null || request.reason() == null ? "" : request.reason();
        if (!REASONS.contains(reason)) throw bad("신고 사유를 골라 주세요.");
        String detail = request.detail() == null ? "" : request.detail().trim();
        if (detail.length() > 500) throw bad("자세한 내용은 500자 이내로 적어 주세요.");

        com.hbk.entity.ChatReport report = reportRepository.findByRoomIdAndReporterId(room.getId(), me.getId())
                .orElseGet(com.hbk.entity.ChatReport::new);
        report.setRoom(room);
        report.setReporter(me);
        report.setReason(reason);
        report.setDetail(detail.isEmpty() ? null : detail);
        report.setStatus("PENDING");
        report.setHandledAt(null);
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);
        if (Boolean.TRUE.equals(request.block())) room.setBlocked(true);
    }

    // 관리자: 신고 목록 (처리 전이 먼저)
    @Transactional(readOnly = true)
    public List<ChatDtos.AdminReport> adminReports(){
        return reportRepository.findAllForAdmin().stream().map(this::toAdminReport).toList();
    }

    // 관리자: 신고된 대화방의 메시지만 볼 수 있음
    @Transactional(readOnly = true)
    public List<ChatDtos.AdminMessage> adminReportMessages(Long reportId){
        com.hbk.entity.ChatReport report = adminReport(reportId);
        Long reporterId = report.getReporter().getId();
        return messageRepository.findAfter(report.getRoom().getId(), 0L, PageRequest.of(0, 500)).stream()
                .map(message -> new ChatDtos.AdminMessage(message.getId(), message.getSender().getNickname(),
                        message.getSender().getId().equals(reporterId), message.getType(), message.getContent(),
                        message.getLat(), message.getLng(), message.getCreatedAt()))
                .toList();
    }

    // 관리자: 처리 완료 / 문제 없음, 필요하면 대화 종료
    public ChatDtos.AdminReport adminHandle(Long reportId, ChatDtos.AdminHandleRequest request){
        com.hbk.entity.ChatReport report = adminReport(reportId);
        String status = request == null ? null : request.status();
        if (!"RESOLVED".equals(status) && !"DISMISSED".equals(status)) throw bad("처리 결과를 골라 주세요.");
        String note = request.note() == null ? "" : request.note().trim();
        if (note.length() > 255) throw bad("메모는 255자 이내로 적어 주세요.");
        report.setStatus(status);
        report.setAdminNote(note.isEmpty() ? null : note);
        report.setHandledAt(LocalDateTime.now());
        if (Boolean.TRUE.equals(request.closeRoom())) report.getRoom().setBlocked(true);
        return toAdminReport(report);
    }

    private com.hbk.entity.ChatReport adminReport(Long reportId){
        return reportRepository.findById(reportId == null ? -1 : reportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "신고를 찾을 수 없어요."));
    }

    private ChatDtos.AdminReport toAdminReport(com.hbk.entity.ChatReport report){
        ChatRoom room = report.getRoom();
        Member reporter = report.getReporter();
        Member reported = room.getOwner().getId().equals(reporter.getId()) ? room.getGuest() : room.getOwner();
        return new ChatDtos.AdminReport(report.getId(), room.getId(), report.getReason(), report.getDetail(), report.getStatus(),
                report.getAdminNote(), reporter.getNickname(), reported.getNickname(), postTitle(room.getPost()), room.isBlocked(),
                report.getCreatedAt(), report.getHandledAt());
    }

    // 관리자 대시보드: 대화방 수·만든 날짜만 (대화 내용·참여자는 보내지 않음)
    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> adminRoomSummaries(){
        return roomRepository.findAll().stream().map(room -> {
            java.util.Map<String, Object> row = new java.util.LinkedHashMap<>();
            row.put("id", room.getId());
            row.put("createdAt", room.getCreatedAt());
            return row;
        }).toList();
    }

    private static LocalDateTime clearedAt(ChatRoom room, Member me){
        return room.getOwner().getId().equals(me.getId()) ? room.getOwnerClearedAt() : room.getGuestClearedAt();
    }

    private ChatDtos.Room toRoom(ChatRoom room, Member me){
        MissingPost post = room.getPost();
        boolean iAmOwner = room.getOwner().getId().equals(me.getId());
        Member other = iAmOwner ? room.getGuest() : room.getOwner();
        // 나가기 전 마지막 메시지는 보여 주지 않음
        LocalDateTime cleared = clearedAt(room, me);
        boolean hideLast = cleared != null && room.getLastMessageAt() != null && !room.getLastMessageAt().isAfter(cleared);
        String image = post.getMediaUrls() == null || post.getMediaUrls().isEmpty() ? null : post.getMediaUrls().get(0);
        return new ChatDtos.Room(
                room.getId(), post.getId(), postTitle(post),
                post.getType() != null ? post.getType().name() : PostType.LOST.name(),
                post.getStatus() != null ? post.getStatus().name() : null,
                image,
                other.getNickname(), other.getProfileImageUrl(),
                iAmOwner, hideLast ? null : room.getLastMessage(), room.getLastMessageAt(), unread(room, me), room.isBlocked(),
                other.getId(), iAmOwner ? room.isGuestLeft() : room.isOwnerLeft());
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
