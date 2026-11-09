package com.hbk.service;

import com.hbk.domain.Gender;
import com.hbk.domain.ShelterStatus;
import com.hbk.dto.AdminRegistrationRequest;
import com.hbk.entity.*;
import com.hbk.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminRegistrationService {
    private final RecommendedAnimalRepository animalRepository;
    private final AdoptionCampaignRepository campaignRepository;
    private final YoutubePostRepository youtubeRepository;
    private final FellowNewsRepository fellowRepository;
    private final NeedHelpRepository helpRepository;
    private final ShelterAnimalRepository shelterRepository;

    public Object getRegistration(String source, Long id) {
        if (id == null || id <= 0) throw invalid("등록 항목 번호가 올바르지 않습니다.");
        return repository(source).findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "등록 항목을 찾을 수 없습니다. 목록을 새로고침해 주세요."));
    }

    @Transactional
    public Object updateRegistration(String source, Long id, AdminRegistrationRequest data) {
        Object record = getRegistration(source, id);
        switch (source) {
            case "animals" -> {
                RecommendedAnimal animal = (RecommendedAnimal) record;
                String sourceType = option(data.getSourceType(), "등록 출처", Set.of("DIRECT", "FACEBOOK", "INSTAGRAM"));
                animal.setSourceType(sourceType);
                animal.setSourceUrl(sourceType.equals("DIRECT") ? "" : required(data.getSourceUrl(), "SNS 주소", 500));
                animal.setRegion(required(data.getRegion(), "지역", 20));
                animal.setNoticeNo(required(data.getNoticeNo(), "공고번호", 100));
                animal.setBirthYear(required(data.getBirthYear(), "출생년도", 10));
                animal.setGender(option(data.getGender(), "성별", Set.of("M", "F")));
                if (data.getWeight() == null || !Double.isFinite(data.getWeight()) || data.getWeight() < 0) {
                    throw invalid("체중을 0 이상의 숫자로 입력해 주세요.");
                }
                animal.setWeight(data.getWeight());
                animal.setImageUrl(required(data.getImageUrl(), "동물 사진 URL", 1000));
            }
            case "campaigns" -> {
                AdoptionCampaign campaign = (AdoptionCampaign) record;
                String mediaType = option(data.getMediaType(), "미디어 형식", Set.of("IMAGE", "YOUTUBE", "DIRECT_VIDEO"));
                campaign.setHashtag(required(data.getHashtag(), "해시태그", 50));
                campaign.setTitle(required(data.getTitle(), "제목", 256));
                campaign.setContent(required(data.getContent(), "상세 내용", Integer.MAX_VALUE));
                campaign.setThumbnailUrl(required(data.getThumbnailUrl(), "썸네일 URL", 1000));
                campaign.setMediaType(mediaType);
                campaign.setMediaUrl(mediaType.equals("IMAGE") ? "" : required(data.getMediaUrl(), "동영상 주소", 1000));
            }
            case "youtubePosts" -> {
                YoutubePost post = (YoutubePost) record;
                post.setTitle(required(data.getTitle(), "제목", 256));
                post.setYoutubeUrl(required(data.getYoutubeUrl(), "유튜브 주소", 1000));
                post.setThumbnailUrl(required(data.getThumbnailUrl(), "썸네일 URL", 1000));
            }
            case "fellowNews" -> {
                FellowNews post = (FellowNews) record;
                post.setTitle(required(data.getTitle(), "제목", 256));
                post.setContent(required(data.getContent(), "상세 내용", Integer.MAX_VALUE));
                post.setImageUrl(required(data.getImageUrl(), "대표 이미지 URL", 1000));
                post.setVideoUrl(optional(data.getVideoUrl(), 1000));
                post.setAttachmentUrl(optional(data.getAttachmentUrl(), 1000));
            }
            case "needHelps" -> {
                NeedHelp post = (NeedHelp) record;
                post.setTitle(required(data.getTitle(), "제목", 256));
                post.setContent(required(data.getContent(), "상세 내용", Integer.MAX_VALUE));
                post.setImageUrl(required(data.getImageUrl(), "대표 이미지 URL", 1000));
                post.setVideoUrl(optional(data.getVideoUrl(), 1000));
                post.setAttachmentUrl(optional(data.getAttachmentUrl(), 1000));
            }
            case "shelterAnimals" -> {
                ShelterAnimal animal = (ShelterAnimal) record;
                animal.setStatus(ShelterStatus.valueOf(option(data.getStatus(), "공고 상태", Set.of("ACTIVE", "COMPLETED"))));
                animal.setGender(Gender.valueOf(option(data.getGender(), "성별", Set.of("UNKNOWN", "MALE", "FEMALE"))));
                animal.setBreed(required(data.getBreed(), "품종", 255));
                animal.setNoticeNo(required(data.getNoticeNo(), "공고번호", 255));
                if (data.getRegDate() == null) throw invalid("등록 날짜를 입력해 주세요.");
                animal.setRegDate(data.getRegDate());
                animal.setRescueLocation(required(data.getRescueLocation(), "구조 장소", 255));
                animal.setContent(required(data.getContent(), "상세 설명", Integer.MAX_VALUE));
                MultipartFile file = data.getImageFile();
                animal.setImageUrl(file != null && !file.isEmpty()
                        ? saveImage(file)
                        : required(data.getImageUrl(), "대표 사진", 1000));
            }
            default -> throw invalid("지원하지 않는 등록 항목입니다.");
        }
        return record;
    }

    @Transactional
    public void deleteRegistration(String source, Long id) {
        getRegistration(source, id);
        repository(source).deleteById(id);
    }

    private JpaRepository<?, Long> repository(String source) {
        return switch (source) {
            case "animals" -> animalRepository;
            case "campaigns" -> campaignRepository;
            case "youtubePosts" -> youtubeRepository;
            case "fellowNews" -> fellowRepository;
            case "needHelps" -> helpRepository;
            case "shelterAnimals" -> shelterRepository;
            default -> throw invalid("지원하지 않는 등록 항목입니다.");
        };
    }

    private String required(String value, String label, int maxLength) {
        if (value == null || value.isBlank()) throw invalid(label + " 항목을 입력해 주세요.");
        if (value.length() > maxLength) throw invalid(label + " 항목은 " + maxLength + "자 이내로 입력해 주세요.");
        return value;
    }

    private String optional(String value, int maxLength) {
        if (value == null) return "";
        if (value.length() > maxLength) throw invalid("주소는 " + maxLength + "자 이내로 입력해 주세요.");
        return value;
    }

    private String option(String value, String label, Set<String> options) {
        if (value == null || !options.contains(value)) throw invalid(label + " 항목을 다시 선택해 주세요.");
        return value;
    }

    private ResponseStatusException invalid(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private String saveImage(MultipartFile file) {
        if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
            throw invalid("이미지 파일을 선택해 주세요.");
        }
        String original = file.getOriginalFilename();
        String extension = original != null && original.contains(".") ? original.substring(original.lastIndexOf('.') + 1) : "";
        if (!Set.of("png", "jpg", "jpeg", "gif", "webp", "avif", "bmp").contains(extension.toLowerCase())) {
            throw invalid("PNG, JPG, GIF, WEBP, AVIF, BMP 이미지 파일을 선택해 주세요.");
        }
        Path target = Path.of(System.getProperty("user.dir"), "uploads", UUID.randomUUID() + "." + extension.toLowerCase());
        try {
            Files.createDirectories(target.getParent());
            file.transferTo(target);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "사진을 저장하지 못했습니다. 다시 시도해 주세요.", e);
        }
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status != STATUS_COMMITTED) {
                    try {
                        Files.deleteIfExists(target);
                    } catch (IOException ignored) {
                        // 저장에 실패한 새 파일만 정리하며 기존 사진은 유지합니다.
                    }
                }
            }
        });
        return "/uploads/" + target.getFileName();
    }
}
