package com.hbk.config;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

// 💡 시연 계정 (홈 로고를 길게 눌러 들어가는 체험 계정)
//    누구나 들어올 수 있어서, 시연 장면이 망가지는 일(탈퇴·비밀번호 변경·글 삭제·찾았어요)은 막음
public final class DemoAccounts {
    private DemoAccounts() {}

    public static final String OWNER = "demo1@finddog.local";  // 콩이를 잃어버린 보호자
    public static final String FINDER = "demo2@finddog.local"; // 사직공원에서 콩이를 본 목격자

    public static boolean isDemo(String email) {
        return OWNER.equals(email) || FINDER.equals(email);
    }

    // 시연 계정이면 400 (안내 문구)
    public static void blockFor(String email, String action) {
        if (isDemo(email)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "시연 계정에서는 " + action + " 수 없어요.");
    }
}
