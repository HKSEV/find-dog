"use client";

import styled from "styled-components";
import { Absolute, Ohidden, Relative, W100, H100 } from "@/assets/css/common/CommonBase.styles";

export const RecommendImgBox = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 12px;
  ${Ohidden};
  ${Relative};
  background-color: #EEE;
  img {
    ${W100} height: 100%;
    object-fit: cover;
  }
  .play-icon {
    ${Absolute};
    bottom: 8px;
    left: 8px;
    color: rgba(255, 255, 255, 0.9);
  }
`;

// 💡 3. 이미지 박스 크기 고정 (좌측 배치)
export const AnimalImgBox = styled.div`
  width: 95px;
  height: 95px;
  border-radius: 10px;
  ${Ohidden};
  background-color: #EEE;
  flex-shrink: 0;
  img {
    ${W100};
    ${H100};
    object-fit: cover;
  }
`;

export const BlogImgWrap = styled.div`
  border: 1px solid #DDD;
  padding: 10px;
  text-align: center;
  position: relative;
`;

export const NoneImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: #999;
`;

export const BlogImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const MapPreview = styled.div`
  width: 100%;
  height: 400px;
  background-color: #EAEAEA;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  overflow: hidden;
`;
