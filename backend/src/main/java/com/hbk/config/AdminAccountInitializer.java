package com.hbk.config;

import com.hbk.entity.Admin;
import com.hbk.entity.Member;
import com.hbk.repository.AdminRepository;
import com.hbk.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// 서버가 켜질 때 관리자 계정을 준비함 (배포 DB는 비어서 시작하기 때문)
// ADMIN_EMAIL, ADMIN_PASSWORD 환경 변수가 둘 다 있을 때만 동작 (로컬은 비워두면 아무 일도 안 함)
// - 그 이메일 회원이 없으면: 회원을 새로 만들고 관리자로 등록
// - 회원이 있으면: 비밀번호는 그대로 두고 관리자로만 등록
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {
    private final MemberRepository memberRepository;
    private final AdminRepository adminRepository;

    @Value("${app.admin.email:}")
    private String email;

    @Value("${app.admin.password:}")
    private String password;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (email.isBlank() || password.isBlank()) return;
        String adminEmail = email.trim();
        if (adminRepository.findByMemberEmail(adminEmail).isPresent()) return;

        Member member = memberRepository.findByEmail(adminEmail).orElseGet(() -> {
            Member created = new Member();
            created.setEmail(adminEmail);
            created.setNickname(memberRepository.existsByNickname("관리자") ? "관리자" + System.currentTimeMillis() % 10000 : "관리자");
            created.setPassword(password);
            created.setName("관리자");
            created.setPhone("010-0000-0000");
            created.setUserType("GENERAL");
            return memberRepository.save(created);
        });

        Admin admin = new Admin();
        admin.setMember(member);
        admin.setAdminLevel("SUPER");
        admin.setDepartment("운영");
        adminRepository.save(admin);
        log.info("관리자 계정을 준비했습니다.");
    }
}
