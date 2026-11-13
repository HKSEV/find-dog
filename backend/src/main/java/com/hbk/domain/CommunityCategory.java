package com.hbk.domain;

// 커뮤니티 회원 글 분류 (보호소 소식·영상은 관리자 글이라 여기 없음)
public enum CommunityCategory {
    FREE,            // 자유 이야기 (일상, 그 밖의 이야기)
    ADOPTION_REVIEW, // 입양 후기
    RESCUE_STORY,    // 구조 이야기
    QUESTION         // 질문
}
