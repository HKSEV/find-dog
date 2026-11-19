package com.hbk.service;

import com.hbk.entity.Member;
import com.hbk.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

// 💡 회원·관리자 비밀번호 암호화와 확인
//    예전에 평문으로 저장된 회원(로컬 DB 등)은 로그인에 성공하는 순간 암호화해서 다시 저장함
@Service
@RequiredArgsConstructor
public class PasswordService {
    // BCrypt 로 저장된 값 모양 ($2a$10$ + 53자)
    private static final Pattern BCRYPT = Pattern.compile("^\\$2[aby]?\\$\\d{2}\\$[./A-Za-z0-9]{53}$");

    private final PasswordEncoder encoder;
    private final MemberRepository memberRepository;

    public String encode(String raw) {
        return encoder.encode(raw);
    }

    public boolean matches(Member member, String raw) {
        String stored = member.getPassword();
        if (raw == null || raw.isEmpty() || stored == null) return false;
        if (BCRYPT.matcher(stored).matches()) return encoder.matches(raw, stored);

        // 평문으로 저장된 예전 회원: 맞으면 바로 암호화해서 바꿔 둠
        if (!stored.equals(raw)) return false;
        member.setPassword(encoder.encode(raw));
        memberRepository.save(member);
        return true;
    }
}
