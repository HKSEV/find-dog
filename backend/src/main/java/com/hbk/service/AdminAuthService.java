package com.hbk.service;

import com.hbk.dto.AdminLoginResponse;
import com.hbk.entity.Admin;
import com.hbk.entity.AdminAccessToken;
import com.hbk.repository.AdminAccessTokenRepository;
import com.hbk.repository.AdminRepository;
import com.hbk.security.AdminJwtTokenProvider;
import com.hbk.security.AdminPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminAuthService {
    private final AdminService adminService;
    private final AdminRepository adminRepository;
    private final AdminAccessTokenRepository tokenRepository;
    private final AdminJwtTokenProvider tokenProvider;

    @Transactional
    public AdminLoginResponse login(String email, String password) {
        var response = adminService.authenticate(email, password);
        Admin admin = adminRepository.findByMemberEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("관리자 계정을 확인할 수 없습니다."));
        var issued = tokenProvider.createToken(admin);
        tokenRepository.deleteByExpiresAtLessThanEqual(System.currentTimeMillis());
        tokenRepository.save(new AdminAccessToken(issued.id(), admin.getId(), issued.expiresAt()));
        return new AdminLoginResponse(response.getName(), response.getMessage(), issued.token(),
                issued.expiresAt(), System.currentTimeMillis());
    }

    public AdminPrincipal authenticate(String token) {
        AdminPrincipal principal = tokenProvider.parseToken(token);
        AdminAccessToken activeToken = tokenRepository.findById(principal.tokenId())
                .orElseThrow(() -> new BadCredentialsException("종료된 관리자 로그인입니다."));
        Admin admin = adminRepository.findById(principal.adminId())
                .orElseThrow(() -> new BadCredentialsException("관리자 계정을 확인할 수 없습니다."));
        if (!activeToken.getAdminId().equals(admin.getId()) || activeToken.getExpiresAt() != principal.expiresAt()
                || activeToken.getExpiresAt() <= System.currentTimeMillis()
                || !admin.getMember().getId().equals(principal.memberId())
                || !admin.getMember().getEmail().equals(principal.email())) {
            throw new BadCredentialsException("관리자 로그인 정보를 확인할 수 없습니다.");
        }
        return principal;
    }

    @Transactional
    public AdminLoginResponse refresh(AdminPrincipal principal) {
        AdminAccessToken activeToken = tokenRepository.findByIdForUpdate(principal.tokenId())
                .orElseThrow(() -> new BadCredentialsException("종료된 관리자 로그인입니다."));
        Admin admin = adminRepository.findById(principal.adminId())
                .orElseThrow(() -> new BadCredentialsException("관리자 계정을 확인할 수 없습니다."));
        if (!activeToken.getAdminId().equals(principal.adminId()) || activeToken.getExpiresAt() != principal.expiresAt()
                || principal.expiresAt() <= System.currentTimeMillis()
                || !admin.getMember().getId().equals(principal.memberId())
                || !admin.getMember().getEmail().equals(principal.email())) {
            throw new BadCredentialsException("관리자 로그인 정보를 확인할 수 없습니다.");
        }
        var issued = tokenProvider.createToken(admin, principal.tokenId());
        activeToken.renew(issued.expiresAt());
        return new AdminLoginResponse(admin.getMember().getName(), "로그인 시간이 갱신되었습니다.", issued.token(),
                issued.expiresAt(), System.currentTimeMillis());
    }

    @Transactional
    public void logout(AdminPrincipal principal) {
        tokenRepository.deleteById(principal.tokenId());
    }
}
