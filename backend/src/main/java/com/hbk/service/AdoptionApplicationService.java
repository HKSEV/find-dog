package com.hbk.service;

import com.hbk.domain.ApplicationStatus;
import com.hbk.domain.NotificationType;
import com.hbk.domain.ShelterStatus;
import com.hbk.dto.AdoptionApplicationRequestDto;
import com.hbk.dto.AdoptionApplicationResponseDto;
import com.hbk.dto.AdoptionApplicationStatusRequestDto;
import com.hbk.entity.AdoptionApplication;
import com.hbk.entity.Member;
import com.hbk.entity.ShelterAnimal;
import com.hbk.repository.AdoptionApplicationRepository;
import com.hbk.repository.MemberRepository;
import com.hbk.repository.ShelterAnimalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdoptionApplicationService {

    private static final Set<ApplicationStatus> ACTIVE = Set.of(ApplicationStatus.RECEIVED, ApplicationStatus.FORWARDED);
    private static final String AUTO_REJECT_REASON = "다른 가족과 입양이 확정됐어요";

    private final AdoptionApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;
    private final ShelterAnimalRepository shelterAnimalRepository;
    private final NotificationService notificationService;

    // 신청서 첫 화면에 미리 채울 값 (로그인한 회원의 이름·연락처)
    public Map<String, String> getPrefill(String email) {
        Member member = findMember(email);
        return Map.of(
                "name", member.getName() != null ? member.getName() : "",
                "phone", member.getPhone() != null ? member.getPhone() : ""
        );
    }

    // 입양 신청
    @Transactional
    public AdoptionApplicationResponseDto apply(AdoptionApplicationRequestDto request, String email) {
        Member member = findMember(email);

        if (request.getShelterAnimalId() == null) throw badRequest("신청할 동물이 없어요.");
        ShelterAnimal animal = shelterAnimalRepository.findById(request.getShelterAnimalId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공고가 끝났거나 없는 친구예요."));
        if (animal.getStatus() != ShelterStatus.ACTIVE) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 입양이 끝난 친구예요.");
        }
        if (applicationRepository.existsByMemberEmailAndShelterAnimalIdAndStatusIn(email, animal.getId(), ACTIVE)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 이 친구에게 신청했어요. 마이 > 입양 신청 내역에서 확인할 수 있어요.");
        }

        String name = trim(request.getApplicantName());
        String phone = trim(request.getApplicantPhone());
        if (name.isEmpty()) throw badRequest("이름을 적어 주세요.");
        if (name.length() > 50) throw badRequest("이름이 너무 길어요.");
        if (phone.isEmpty()) throw badRequest("연락처를 적어 주세요.");
        if (phone.length() > 30) throw badRequest("연락처가 너무 길어요.");
        if (request.getHousingType() == null) throw badRequest("주거 형태를 골라 주세요.");
        if (request.getHasPetExperience() == null) throw badRequest("반려동물을 키워 본 적이 있는지 골라 주세요.");
        if (request.getFamilyAgreed() == null) throw badRequest("가족 동의 여부를 골라 주세요.");
        if (!Boolean.TRUE.equals(request.getAgreeToShare())) throw badRequest("신청서를 보호소에 전달하는 데 동의해 주세요.");

        AdoptionApplication application = new AdoptionApplication();
        application.setMember(member);
        application.setShelterAnimal(animal);
        application.setApplicantName(name);
        application.setApplicantPhone(phone);
        application.setHousingType(request.getHousingType());
        application.setHasPetExperience(request.getHasPetExperience());
        application.setFamilyAgreed(request.getFamilyAgreed());
        application.setMessage(trim(request.getMessage()));
        application.setStatus(ApplicationStatus.RECEIVED);

        return new AdoptionApplicationResponseDto(applicationRepository.save(application));
    }

    // 내 신청 내역
    public List<AdoptionApplicationResponseDto> getMine(String email) {
        return applicationRepository.findByMemberEmailOrderByIdDesc(email).stream()
                .map(AdoptionApplicationResponseDto::new)
                .toList();
    }

    // 신청 취소 (본인, 아직 진행 중일 때만)
    @Transactional
    public AdoptionApplicationResponseDto cancel(Long id, String email) {
        AdoptionApplication application = findApplication(id);
        if (!application.getMember().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "내 신청만 취소할 수 있어요.");
        }
        if (!application.getStatus().isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 끝난 신청은 취소할 수 없어요.");
        }
        application.setStatus(ApplicationStatus.CANCELED);
        application.setStatusReason(null);
        return new AdoptionApplicationResponseDto(application);
    }

    // [관리자] 전체 신청 목록 (status를 주면 그 상태만)
    public List<AdoptionApplicationResponseDto> getAll(ApplicationStatus status) {
        List<AdoptionApplication> applications = status == null
                ? applicationRepository.findAllByOrderByIdDesc()
                : applicationRepository.findByStatusOrderByIdDesc(status);
        return applications.stream().map(AdoptionApplicationResponseDto::new).toList();
    }

    // [관리자] 상태 바꾸기
    // 운영자가 보호소에 전달하면 FORWARDED, 보호소 결과를 듣고 ADOPTED / REJECTED
    // ADOPTED가 되면 동물 공고를 COMPLETED로 바꾸고, 같은 동물의 다른 진행 중 신청은 REJECTED로 정리
    @Transactional
    public AdoptionApplicationResponseDto changeStatus(Long id, AdoptionApplicationStatusRequestDto request) {
        ApplicationStatus next = request.getStatus();
        if (next == null) throw badRequest("바꿀 상태를 골라 주세요.");
        if (next == ApplicationStatus.CANCELED || next == ApplicationStatus.RECEIVED) {
            throw badRequest("관리자는 보호소에 전달, 입양 확정, 입양 불가로만 바꿀 수 있어요.");
        }

        AdoptionApplication application = findApplication(id);
        if (!application.getStatus().isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 끝난 신청이에요.");
        }

        String reason = trim(request.getReason());
        if (reason.length() > 255) throw badRequest("사유는 255자까지 적을 수 있어요.");
        application.setStatus(next);
        application.setStatusReason(reason.isEmpty() ? null : reason);
        notifyApplicant(application);

        if (next == ApplicationStatus.ADOPTED) {
            ShelterAnimal animal = application.getShelterAnimal();
            animal.setStatus(ShelterStatus.COMPLETED);
            applicationRepository.findByShelterAnimalIdAndStatusIn(animal.getId(), ACTIVE).stream()
                    .filter(other -> !other.getId().equals(application.getId()))
                    .forEach(other -> {
                        other.setStatus(ApplicationStatus.REJECTED);
                        other.setStatusReason(AUTO_REJECT_REASON);
                        notifyApplicant(other);
                    });
        }
        return new AdoptionApplicationResponseDto(application);
    }

    // 관리자가 상태를 바꾸면 신청한 회원에게 알림 (누르면 마이 > 입양 신청 내역)
    private void notifyApplicant(AdoptionApplication application) {
        ShelterAnimal shelterAnimal = application.getShelterAnimal();
        String breed = shelterAnimal.getBreed();
        String animal = breed == null || breed.isBlank() ? "보호 동물" : breed;
        String message = switch (application.getStatus()) {
            case FORWARDED -> animal + " 입양 신청서가 보호소에 전달됐어요. 보호소에서 곧 연락드려요.";
            case ADOPTED -> animal + " 입양이 확정됐어요. 새 가족이 된 걸 축하해요!";
            case REJECTED -> animal + " 입양 신청이 이번에는 어려워졌어요."
                    + (application.getStatusReason() != null ? " (" + application.getStatusReason() + ")" : "");
            default -> null;
        };
        if (message != null) {
            notificationService.notify(
                    application.getMember(),
                    NotificationType.ADOPTION,
                    application.getStatus().name(),
                    message,
                    shelterAnimal.getImageUrl(),
                    "/mypage/applications"
            );
        }
    }

    private Member findMember(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 정보가 없습니다. 다시 로그인해주세요."));
    }

    private AdoptionApplication findApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "없는 신청이에요."));
    }

    private static ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }
}
