package com.hbk.config;

import com.hbk.domain.*;
import com.hbk.entity.*;
import com.hbk.repository.*;
import com.hbk.service.PasswordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// 화면 확인용 더미 데이터 (배포 DB는 비어서 시작하고, Render 무료 플랜은 재시작 때 DB가 초기화됨)
// DEMO_DATA=true 일 때만 동작하고, 테이블이 비어 있을 때만 넣음 (이미 글이 있으면 건드리지 않음)
// 사진은 프런트 public/img 의 dog1~3.jpg 를 프런트 주소로 연결 (서버 업로드 폴더가 지워져도 남음)
// dog1: 흰색 진돗개 믹스, dog2: 흰색·갈색 강아지, dog3: 흰색 바탕 갈색 얼룩 믹스견 (dog4는 dog3과 같은 사진)
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoDataInitializer implements ApplicationRunner {
    private final MemberRepository memberRepository;
    private final ShelterAnimalRepository shelterRepository;
    private final RecommendedAnimalRepository recommendedRepository;
    private final VolunteerPostRepository volunteerRepository;
    private final FellowNewsRepository fellowRepository;
    private final NeedHelpRepository helpRepository;
    private final AdoptionCampaignRepository campaignRepository;
    private final CommunityPostRepository communityRepository;
    private final MissingPostRepository missingRepository;
    private final PasswordService passwordService;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationRepository notificationRepository;
    private final AdoptionApplicationRepository adoptionRepository;
    private final VolunteerApplicationRepository volunteerApplicationRepository;

    // 💡 시연 계정 비밀번호 (Render 환경 변수 DEMO_PASSWORD). 비어 있으면 시연 계정도 로그인 못 하게 무작위
    //    저장소가 공개라 비밀번호를 코드에 적지 않음
    @Value("${app.demo-password:}")
    private String demoPassword;

    @Value("${app.demo-data:false}")
    private boolean enabled;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (!enabled) return;
        seedShelterAnimals();
        seedRecommendedAnimals();
        seedVolunteerPosts();
        seedFellowNews();
        seedNeedHelps();
        seedCampaigns();
        seedCommunityPosts();
        seedMissingPosts();
        seedDemoScenario();
        log.info("더미 데이터를 확인했습니다.");
    }

    // dog1.jpg ~ dog3.jpg 돌려쓰기
    private String dog(int index) {
        return frontendUrl.replaceAll("/+$", "") + "/img/dog" + ((index % 3) + 1) + ".jpg";
    }

    // 더미 글 작성자 (시연 계정만 DEMO_PASSWORD 로 로그인, 나머지는 무작위 비밀번호라 로그인 못 함)
    private Member demoMember(String email, String nickname, String name) {
        return demoMember(email, nickname, name, false);
    }

    private Member demoMember(String email, String nickname, String name, boolean canLogin) {
        return memberRepository.findByEmail(email).orElseGet(() -> {
            Member member = new Member();
            member.setEmail(email);
            member.setNickname(memberRepository.existsByNickname(nickname) ? nickname + UUID.randomUUID().toString().substring(0, 4) : nickname);
            boolean usePassword = canLogin && demoPassword != null && !demoPassword.isBlank();
            member.setPassword(passwordService.encode(usePassword ? demoPassword : UUID.randomUUID().toString()));
            member.setProvider("LOCAL");
            member.setName(name);
            member.setPhone("010-0000-0000");
            member.setUserType("GENERAL");
            return memberRepository.save(member);
        });
    }

    private void seedShelterAnimals() {
        if (shelterRepository.count() > 0) return;
        Object[][] rows = {
                {"백설", Gender.FEMALE, "진돗개 믹스", "서울특별시 종로구 사직동", "2살 정도 된 순한 아이예요. 사람을 좋아하고 산책할 때 줄을 잘 따라와요."},
                {"두부", Gender.MALE, "믹스견", "경기도 고양시 덕양구", "생후 6개월 정도 된 강아지예요. 호기심이 많고 장난감을 좋아해요."},
                {"구름", Gender.MALE, "포인터 믹스", "서울특별시 마포구 망원동", "활발하고 공놀이를 좋아해요. 넓은 공간에서 뛰어놀 수 있는 가족을 기다려요."},
                {"누리", Gender.FEMALE, "백구 믹스", "인천광역시 남동구", "겁이 조금 많지만 간식을 주면 금방 다가와요. 다른 강아지와도 잘 지내요."},
                {"솜이", Gender.UNKNOWN, "믹스견", "서울특별시 강서구 화곡동", "작고 조용한 아이예요. 안기는 걸 좋아해요."},
                {"호두", Gender.MALE, "믹스견", "경기도 성남시 분당구", "호기심이 많고 냄새 맡기를 좋아해요. 함께 산책을 즐길 가족을 찾아요."}
        };
        for (int i = 0; i < rows.length; i++) {
            shelterRepository.save(ShelterAnimal.builder()
                    .status(ShelterStatus.ACTIVE)
                    .name((String) rows[i][0])
                    .gender((Gender) rows[i][1])
                    .breed((String) rows[i][2])
                    .noticeNo("FD-2026-" + String.format("%05d", i + 1))
                    .regDate(LocalDate.now().minusDays(i * 2L))
                    .rescueLocation((String) rows[i][3])
                    .content((String) rows[i][4])
                    .imageUrl(dog(i))
                    .build());
        }
    }

    private void seedRecommendedAnimals() {
        if (recommendedRepository.count() > 0) return;
        String[][] rows = {
                {"서울시", "2023", "M", "6.5"},
                {"고양시", "2022", "F", "9.0"},
                {"강릉시", "2024", "F", "3.2"},
                {"인천시", "2021", "M", "12.0"}
        };
        for (int i = 0; i < rows.length; i++) {
            RecommendedAnimal animal = new RecommendedAnimal();
            animal.setSourceType("DIRECT");
            animal.setSourceUrl("");
            animal.setRegion(rows[i][0]);
            animal.setNoticeNo("FD-R-" + String.format("%04d", i + 1));
            animal.setBirthYear(rows[i][1]);
            animal.setGender(rows[i][2]);
            animal.setWeight(Double.parseDouble(rows[i][3]));
            animal.setImageUrl(dog(i + 1));
            recommendedRepository.save(animal);
        }
    }

    private void seedVolunteerPosts() {
        if (volunteerRepository.count() > 0) return;
        String[][] rows = {
                {"주말 보호소 산책 봉사", "보호 중인 강아지들과 근처 공원을 함께 걸어요. 처음 오셔도 담당자가 안내해 드려요.", "서울특별시 종로구 삼청로 30", "10:00", "12:00", "8"},
                {"견사 청소와 목욕 봉사", "견사 청소와 목욕을 도와주세요. 갈아입을 옷을 챙겨 오시면 좋아요.", "경기도 고양시 덕양구 고양대로 1955", "13:00", "16:00", "6"},
                {"입양 행사 진행 도우미", "입양 행사장에서 방문객 안내와 아이들 돌봄을 함께해요.", "서울특별시 마포구 월드컵로 240", "11:00", "15:00", "10"}
        };
        for (int i = 0; i < rows.length; i++) {
            VolunteerPost post = new VolunteerPost();
            post.setTitle(rows[i][0]);
            post.setContent(rows[i][1]);
            post.setPlace(rows[i][2]);
            post.setActivityDate(LocalDate.now().plusDays(7L * (i + 1)));
            post.setStartTime(rows[i][3]);
            post.setEndTime(rows[i][4]);
            post.setCapacity(Integer.parseInt(rows[i][5]));
            post.setImageUrl(dog(i + 2));
            volunteerRepository.save(post);
        }
    }

    private void seedFellowNews() {
        if (fellowRepository.count() > 0) return;
        String[][] rows = {
                {"이번 달 새 가족을 찾은 친구들", "이번 달에는 다섯 마리의 친구들이 새 가족을 만났어요. 함께 응원해 주신 모든 분께 감사드려요."},
                {"겨울맞이 보호소 단장 소식", "추운 날씨에 대비해 견사에 단열재와 새 담요를 준비했어요. 봉사자분들 덕분에 하루 만에 끝났어요."}
        };
        for (int i = 0; i < rows.length; i++) {
            FellowNews post = new FellowNews();
            post.setTitle(rows[i][0]);
            post.setContent(rows[i][1]);
            post.setImageUrl(dog(i));
            post.setVideoUrl("");
            post.setAttachmentUrl("");
            fellowRepository.save(post);
        }
    }

    private void seedNeedHelps() {
        if (helpRepository.count() > 0) return;
        String[][] rows = {
                {"사료와 패드가 부족해요", "보호 중인 아이들이 늘어 사료와 배변 패드가 빠르게 줄고 있어요. 작은 나눔도 큰 힘이 돼요."},
                {"임시 보호처를 찾아요", "치료를 마친 아이가 입양 전까지 지낼 임시 보호처를 찾고 있어요. 2~4주 정도 함께해 주실 분을 기다려요."}
        };
        for (int i = 0; i < rows.length; i++) {
            NeedHelp post = new NeedHelp();
            post.setTitle(rows[i][0]);
            post.setContent(rows[i][1]);
            post.setImageUrl(dog(i + 1));
            post.setVideoUrl("");
            post.setAttachmentUrl("");
            helpRepository.save(post);
        }
    }

    private void seedCampaigns() {
        if (campaignRepository.count() > 0) return;
        String[][] rows = {
                {"#사지말고입양하세요", "보호소 친구들에게 두 번째 가족이 되어 주세요", "입양은 한 생명에게 새로운 삶을 선물하는 일이에요. 보호소에서 가족을 기다리는 친구들을 만나 보세요."},
                {"#임시보호", "입양 전 잠깐의 집이 되어 주세요", "임시 보호는 보호소보다 편한 환경에서 아이가 사람과 지내는 법을 배우게 도와줘요."}
        };
        for (int i = 0; i < rows.length; i++) {
            AdoptionCampaign campaign = new AdoptionCampaign();
            campaign.setHashtag(rows[i][0]);
            campaign.setTitle(rows[i][1]);
            campaign.setContent(rows[i][2]);
            campaign.setThumbnailUrl(dog(i + 3));
            campaign.setMediaType("IMAGE");
            campaign.setMediaUrl("");
            campaignRepository.save(campaign);
        }
    }

    private void seedCommunityPosts() {
        if (communityRepository.count() > 0) return;
        Member author = demoMember("demo-story@finddog.local", "산책하는보리", "보리보호자");
        Object[][] rows = {
                {CommunityCategory.ADOPTION_REVIEW, "보리 입양 한 달 후기", "처음엔 숨기만 하던 보리가 이제는 현관에서 저를 기다려요. 입양을 고민하는 분들께 용기를 드리고 싶어요.", true},
                {CommunityCategory.RESCUE_STORY, "비 오는 날 만난 아이", "비를 맞고 떨던 아이를 구조해 보호소에 연결했어요. 지금은 건강을 되찾고 가족을 기다리고 있어요.", true},
                {CommunityCategory.QUESTION, "첫 산책은 언제부터 하면 좋을까요?", "입양한 지 일주일 됐어요. 아직 낯선 소리에 많이 놀라는데 산책은 언제부터 시작하면 좋을까요?", false},
                {CommunityCategory.FREE, "오늘 공원에서 만난 친구들", "날씨가 좋아서 공원에 강아지 친구들이 많았어요. 다들 즐거운 주말 보내세요.", false}
        };
        for (int i = 0; i < rows.length; i++) {
            CommunityPost post = new CommunityPost();
            post.setCategory((CommunityCategory) rows[i][0]);
            post.setTitle((String) rows[i][1]);
            post.setContent((String) rows[i][2]);
            post.setMediaUrls((Boolean) rows[i][3] ? new ArrayList<>(List.of(dog(i))) : new ArrayList<>());
            post.setAuthor(author);
            communityRepository.save(post);
        }
    }

    // 💡 시연 계정 (DEMO_PASSWORD 로 로그인)
    //    demo1: 콩이를 잃어버린 보호자 (실종 글 -> 전단지, 목격자와의 채팅, 근처 목격 알림)
    //    demo2: 사직공원에서 콩이를 본 목격자 (목격 글, 채팅, 입양·봉사 신청 내역)
    private static final String DEMO_OWNER = DemoAccounts.OWNER;
    private static final String DEMO_FINDER = DemoAccounts.FINDER;

    private void seedMissingPosts() {
        if (missingRepository.count() > 0) return;
        // 글마다 다른 회원이 쓴 것처럼 (같은 사람이 실종·목격을 다 올린 것처럼 보이지 않게)
        Member[] authors = {
                demoMember(DEMO_OWNER, "콩이찾는중", "콩이보호자", true),
                demoMember(DEMO_FINDER, "사직동주민", "목격자", true),
                demoMember("demo-haru@finddog.local", "하루언니", "하루보호자")
        };
        Object[][] rows = {
                {PostType.LOST, "콩이", "믹스견", "흰색·갈색", "수컷", "1", "4.5", "서울특별시 종로구 사직로 161", 37.5796, 126.9770, "노란 스카프를 하고 있어요. \"콩이야\" 하고 부르면 돌아봐요.", TimeOfDay.EVENING, 1},
                {PostType.FOUND, "", "믹스견", "흰색 갈색 얼룩", "수컷", "", "", "서울특별시 종로구 사직동 사직공원", 37.5757, 126.9688, "공원 근처에서 혼자 돌아다니던 아이를 보호하고 있어요. 목줄은 없었어요.", TimeOfDay.MORNING, 0},
                {PostType.LOST, "하루", "진돗개 믹스", "흰색", "암컷", "2", "11", "서울특별시 송파구 올림픽로 424", 37.5206, 127.1215, "분홍색 옷을 입고 있어요. 겁이 많아서 \"하루야\" 하고 부르며 천천히 다가가 주세요.", TimeOfDay.AFTERNOON, 3}
        };
        for (int i = 0; i < rows.length; i++) {
            MissingPost post = new MissingPost();
            post.setType((PostType) rows[i][0]);
            post.setPetName(((String) rows[i][1]).isBlank() ? null : (String) rows[i][1]);
            post.setBreed((String) rows[i][2]);
            post.setColor((String) rows[i][3]);
            post.setTitle(rows[i][2] + " · " + rows[i][3]);
            post.setGender((String) rows[i][4]);
            post.setAge((String) rows[i][5]);
            post.setWeight((String) rows[i][6]);
            post.setRescueLocation((String) rows[i][7]);
            post.setLat((Double) rows[i][8]);
            post.setLng((Double) rows[i][9]);
            post.setContent((String) rows[i][10]);
            post.setOccurredTime((TimeOfDay) rows[i][11]);
            post.setOccurredAt(LocalDate.now().minusDays((Integer) rows[i][12]).atStartOfDay());
            post.setMediaUrls(new ArrayList<>(List.of(dog(i + 1))));
            post.setStatus(PostStatus.MISSING);
            post.setAuthor(authors[i]);
            post.setCreatedAt(LocalDateTime.now().minusHours(i * 5L));
            missingRepository.save(post);
        }
    }

    // 💡 시연 장면: 콩이 보호자(demo1)와 목격자(demo2)가 채팅 중, 알림·신청 내역도 있는 상태
    private void seedDemoScenario() {
        if (chatRoomRepository.count() > 0) return;
        Member owner = memberRepository.findByEmail(DEMO_OWNER).orElse(null);
        Member finder = memberRepository.findByEmail(DEMO_FINDER).orElse(null);
        if (owner == null || finder == null) return;
        MissingPost lost = missingRepository.findByAuthorEmailOrderByIdDesc(DEMO_OWNER).stream().findFirst().orElse(null);
        MissingPost found = missingRepository.findByAuthorEmailOrderByIdDesc(DEMO_FINDER).stream().findFirst().orElse(null);
        if (lost == null) return;

        LocalDateTime now = LocalDateTime.now();
        ChatRoom room = new ChatRoom();
        room.setPost(lost);
        room.setOwner(owner);
        room.setGuest(finder);
        room.setCreatedAt(now.minusMinutes(50));
        room = chatRoomRepository.save(room);

        // 보낸 사람, 내용, 몇 분 전 (위치 메시지는 좌표 포함)
        Object[][] talk = {
                {finder, "안녕하세요! 오늘 아침 사직공원에서 노란 스카프 한 강아지를 봤어요.", 45, null},
                {finder, "사직공원 정문 근처", 44, new double[]{37.5757, 126.9688}},
                {owner, "정말요?! 콩이가 맞는 것 같아요. 혹시 지금도 거기 있나요?", 40, null},
                {finder, "네, 공원 관리사무소 앞에서 물을 주고 데리고 있어요. \"콩이야\" 하고 부르니까 돌아봤어요.", 35, null},
                {owner, "너무 감사해요! 지금 바로 갈게요. 20분 정도 걸릴 것 같아요.", 30, null},
                {finder, "천천히 오세요. 관리사무소 앞 벤치에 있을게요.", 5, null}
        };
        ChatMessage last = null;
        for (Object[] row : talk) {
            ChatMessage message = new ChatMessage();
            message.setRoom(room);
            message.setSender((Member) row[0]);
            message.setCreatedAt(now.minusMinutes((Integer) row[2]));
            if (row[3] != null) {
                double[] point = (double[]) row[3];
                message.setType("LOCATION");
                message.setLat(point[0]);
                message.setLng(point[1]);
            } else {
                message.setType("TEXT");
            }
            message.setContent((String) row[1]);
            last = chatMessageRepository.save(message);
        }
        room.setLastMessage(last.getContent());
        room.setLastMessageAt(last.getCreatedAt());
        room.setOwnerReadAt(now.minusMinutes(30)); // 보호자는 마지막 메시지를 아직 안 읽음 (빨간 숫자 1)
        room.setGuestReadAt(now);
        chatRoomRepository.save(room);

        // 보호자 알림: 근처 목격 제보 + 새 채팅 (안 읽음)
        if (found != null) {
            notice(owner, NotificationType.NEARBY, "NEARBY",
                    "'콩이' 실종 장소에서 0.8km 떨어진 곳에 목격 제보가 올라왔어요. 확인해 보세요.",
                    found.getMediaUrls() == null || found.getMediaUrls().isEmpty() ? null : found.getMediaUrls().get(0),
                    "/missing/detail/?id=" + found.getId());
        }
        notice(owner, NotificationType.CHAT, "CHAT", finder.getNickname() + ": " + last.getContent(),
                lost.getMediaUrls() == null || lost.getMediaUrls().isEmpty() ? null : lost.getMediaUrls().get(0),
                "/chat/room/?id=" + room.getId());

        // 목격자: 입양 신청(보호소 전달됨) + 봉사 신청(확정)
        ShelterAnimal animal = shelterRepository.findAll().stream().skip(1).findFirst().orElse(null);
        if (animal != null) {
            AdoptionApplication application = new AdoptionApplication();
            application.setMember(finder);
            application.setShelterAnimal(animal);
            application.setApplicantName(finder.getName());
            application.setApplicantPhone("01000000000");
            application.setHousingType(HousingType.APARTMENT);
            application.setHasPetExperience(true);
            application.setFamilyAgreed(true);
            application.setMessage("주말마다 산책을 함께할 수 있어요.");
            application.setStatus(ApplicationStatus.FORWARDED);
            adoptionRepository.save(application);
            String name = animal.getName() == null ? animal.getBreed() : animal.getName() + "(" + animal.getBreed() + ")";
            notice(finder, NotificationType.ADOPTION, "FORWARDED",
                    name + " 입양 신청서가 보호소에 전달됐어요. 보호소에서 곧 연락드려요.", animal.getImageUrl(), "/mypage/applications");
        }
        VolunteerPost volunteer = volunteerRepository.findAll().stream().findFirst().orElse(null);
        if (volunteer != null) {
            VolunteerApplication application = new VolunteerApplication();
            application.setMember(finder);
            application.setPost(volunteer);
            application.setApplicantName(finder.getName());
            application.setApplicantPhone("01000000000");
            application.setMessage("처음이지만 열심히 할게요.");
            volunteerApplicationRepository.save(application);
        }
    }

    private void notice(Member member, NotificationType type, String badge, String message, String imageUrl, String link) {
        Notification notification = new Notification();
        notification.setMember(member);
        notification.setType(type);
        notification.setBadge(badge);
        notification.setMessage(message);
        notification.setImageUrl(imageUrl);
        notification.setLink(link);
        notificationRepository.save(notification);
    }
}
