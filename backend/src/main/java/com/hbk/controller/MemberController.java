package com.hbk.controller;

import com.hbk.dto.MemberResponseDto;
import com.hbk.entity.Member;
import com.hbk.repository.MemberRepository;
import com.hbk.security.JwtTokenProvider; // 👈 1. JWT 토큰 Provider 임포트 추가
import com.hbk.service.MyAccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor // 👈 2. 생성자 주입을 위해 롬복 어노테이션 추가
public class MemberController {

    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider; // 👈 3. 토큰 생성 주입

    // 1. 중복 체크 API (이메일)
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email){
        return ResponseEntity.ok(memberRepository.existsByEmail(email));
    }

    // 2. 중복 체크 API (닉네임)
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname){
        return ResponseEntity.ok(memberRepository.existsByNickname(nickname));
    }

    // 3. 회원가입 API
    //    받은 값 중 필요한 칸만 새 회원에 옮겨 담음 (id·provider 등을 보내 다른 회원을 덮어쓰거나 카카오 계정에 끼어들지 못하게)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Member request){
        String email = trim(request.getEmail());
        String nickname = trim(request.getNickname());
        String password = request.getPassword() == null ? "" : request.getPassword();
        String name = trim(request.getName());
        String phone = trim(request.getPhone()).replace("-", "");
        String userType = trim(request.getUserType());

        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") || email.length() > 100) return badRequest("이메일 형식을 확인해 주세요.");
        if (email.toLowerCase().endsWith("@kakao.finddog")) return badRequest("쓸 수 없는 이메일이에요.");
        if (password.length() < 8) return badRequest("비밀번호는 8자 이상이어야 해요.");
        if (nickname.isEmpty() || nickname.length() > 20) return badRequest("닉네임은 1~20자로 적어 주세요.");
        if (name.isEmpty()) return badRequest("이름을 적어 주세요.");
        if (!phone.matches("\\d{9,11}")) return badRequest("휴대폰 번호를 숫자로 적어 주세요.");
        if (!userType.equals("GENERAL") && !userType.equals("BUSINESS")) return badRequest("가입 유형을 골라 주세요.");
        if (memberRepository.existsByEmail(email)) return conflict("이미 가입된 이메일이에요.");
        if (memberRepository.existsByNickname(nickname)) return conflict("이미 누군가 쓰고 있는 닉네임이에요.");

        Member member = new Member();
        member.setEmail(email);
        member.setNickname(nickname);
        member.setPassword(password);
        member.setName(name);
        member.setPhone(phone);
        String address = trim(request.getAddress());
        member.setAddress(address.isEmpty() ? null : address);
        member.setUserType(userType);
        member.setMarketingAgreed(request.isMarketingAgreed());
        member.setProvider("LOCAL");
        member.setProfileImageUrl(MyAccountService.uploadedImageOrNull(request.getProfileImageUrl()));

        Member saved = memberRepository.save(member);
        // 비밀번호 등은 돌려주지 않음
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", saved.getId(), "email", saved.getEmail()));
    }

    private static String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private static ResponseEntity<String> badRequest(String message) {
        return ResponseEntity.badRequest().body(message);
    }

    private static ResponseEntity<String> conflict(String message) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
    }

    // 4. 로그인 API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Member loginData){
        Optional<Member> memberOpt = memberRepository.findByEmail(loginData.getEmail());

        if(memberOpt.isPresent()){
            Member member = memberOpt.get();

            if(member.getPassword().equals(loginData.getPassword())){
                String token = jwtTokenProvider.createToken(member.getEmail());

                // 💡 객체 직렬화 에러를 완벽하게 피하기 위해 단순한 키-값 구조로 전달합니다.
                Map<String, String> responseData = new HashMap<>();
                responseData.put("token", token);

                // 닉네임이 비어있을 경우를 대비한 안전 장치
                String nickname = (member.getNickname() != null && !member.getNickname().isEmpty())
                        ? member.getNickname()
                        : "회원";
                responseData.put("nickname", nickname);

                return ResponseEntity.ok(responseData);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("이메일 또는 비밀번호가 일치하지 않습니다");
    }

    // 5. 프로필 이미지 업로드 API (가입 전에도 쓰므로 로그인 없이 받음)
    //    사진 파일만, 이름은 서버가 새로 지음 (원래 파일 이름을 쓰지 않음)
    private static final Map<String, String> IMAGE_TYPES = Map.of(
            "image/png", "png", "image/jpeg", "jpg", "image/gif", "gif", "image/webp", "webp");

    @PostMapping("/upload-profile")
    public ResponseEntity<String> uploadProfile(@RequestParam("file") MultipartFile file){
        String extension = file.getContentType() == null ? null : IMAGE_TYPES.get(file.getContentType().toLowerCase());
        if (file.isEmpty() || extension == null) {
            return ResponseEntity.badRequest().body("사진 파일(PNG, JPG, GIF, WEBP)만 올릴 수 있어요.");
        }
        try{
            String filename = UUID.randomUUID() + "." + extension;
            Path path = Paths.get(System.getProperty("user.dir"), "uploads", filename);
            Files.createDirectories(path.getParent());
            file.transferTo(path);
            return ResponseEntity.ok("/uploads/" + filename);
        }catch(Exception e) {
            log.error("프로필 사진 저장 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사진을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
    }
}