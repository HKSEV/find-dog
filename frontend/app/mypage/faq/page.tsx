"use client";

import React from "react";
import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

// 💡 마이 > 자주 묻는 질문. 서버 없이 화면에 적어 둔 내용 (눌러서 펼침)
const faqs: {title: string; items: {q: string; a: string}[]}[] = [
  {
    title: "입양",
    items: [
      {q: "입양 신청은 어떻게 하나요?", a: "입양·봉사 > 입양에서 친구를 고른 뒤 상세 화면 아래 \"입양 신청하기\"를 눌러 신청서를 보내요. 운영팀이 확인해 보호소에 전달하고, 보호소에서 적어 주신 연락처로 직접 연락드려요."},
      {q: "신청이 어디까지 진행됐는지 알 수 있나요?", a: "보호소에 전달되거나 결과가 나오면 알림으로 알려 드려요. 마이 > 입양 신청 내역에서도 단계를 볼 수 있어요."},
      {q: "보낸 신청을 취소할 수 있나요?", a: "결과가 나오기 전까지는 마이 > 입양 신청 내역에서 취소할 수 있어요."}
    ]
  },
  {
    title: "봉사",
    items: [
      {q: "봉사는 어떻게 신청하나요?", a: "입양·봉사 > 봉사에서 원하는 날짜를 골라 신청해요. 선착순이라 신청하면 바로 확정되고, 정원이 차면 마감돼요."},
      {q: "못 가게 되면 어떻게 하나요?", a: "봉사 날까지 마이 > 봉사 신청 내역에서 취소해 주세요. 취소하면 다른 분이 그 자리에 신청할 수 있어요."}
    ]
  },
  {
    title: "실종·제보",
    items: [
      {q: "아이를 잃어버렸어요.", a: "실종·제보 탭의 글쓰기 버튼으로 실종 글을 올려 주세요. 사진, 잃어버린 장소와 때를 자세히 적을수록 찾기 쉬워요. 보호소에 들어왔을 수도 있으니 입양 탭의 보호소 공고도 함께 확인해 보세요."},
      {q: "길에서 본 아이를 알리고 싶어요.", a: "실종·제보 탭에서 \"목격 제보\"로 글을 올려 주세요. 본 장소와 때를 적어 주시면 보호자가 찾는 데 큰 도움이 돼요."},
      {q: "글쓴이에게 어떻게 연락하나요?", a: "로그인한 뒤 글 상세 화면 아래의 전화하기·문자 보내기 버튼을 눌러 주세요. 연락처는 로그인한 회원에게만 보여요."},
      {q: "아이를 찾았어요.", a: "내 글 상세 화면 아래 \"찾았어요\"를 눌러 주세요. 목록에 찾았어요로 표시되고 찾는 중인 글에서는 빠져요."}
    ]
  },
  {
    title: "계정",
    items: [
      {q: "닉네임이나 연락처를 바꾸고 싶어요.", a: "마이 > 오른쪽 위 설정 > 정보 수정에서 바꿀 수 있어요. 이메일은 바꿀 수 없어요."},
      {q: "관심 동물이 다른 기기에서 안 보여요.", a: "관심 동물(하트)은 지금 쓰는 기기에만 저장돼요. 다른 기기에서는 다시 눌러 주세요."}
    ]
  }
];

export default function FaqPage() {
  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="자주 묻는 질문"/>
        <S.HeaderOffset/>
        {faqs.map((group) => (
          <S.FaqGroup key={group.title}>
            <S.FaqGroupTitle>{group.title}</S.FaqGroupTitle>
            {group.items.map((item) => (
              <S.FaqItem key={item.q}>
                <summary>
                  <span>{item.q}</span>
                  <S.FaqChevron aria-hidden="true"/>
                </summary>
                <p>{item.a}</p>
              </S.FaqItem>
            ))}
          </S.FaqGroup>
        ))}
      </S.Container>
    </S.AppWrapper>
  );
};
