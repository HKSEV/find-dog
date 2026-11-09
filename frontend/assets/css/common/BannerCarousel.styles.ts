import Image from "next/image";
import { Swiper } from "swiper/react";
import styled from "styled-components";

export const bannerColors = {adoption: "#E6F4F1", store: "#FFF3E0", campaign: "#F3E5F5"};

export const BannerSwiper = styled(Swiper)`
  && {
    width: 100%;
    height: 100%;
  }
`;

export const BannerImage = styled(Image)`
  && {
    width: auto;
  }
`;
