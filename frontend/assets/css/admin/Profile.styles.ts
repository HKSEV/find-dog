"use client";

import Link from "next/link";
import styled from "styled-components";
import { coolGray } from "@/assets/css/admin/AdminBase.styles";

export const AdminAvatarImage = styled.img<{$large: boolean}>`
  display: block;
  width: ${({$large}) => ($large ? "88px" : "38px")};
  height: ${({$large}) => ($large ? "88px" : "38px")};
  flex-shrink: 0;
  border: 1px solid ${coolGray[200]};
  border-radius: 50%;
  object-fit: cover;
  background-color: ${coolGray[100]};
`;

export const AdminAvatarFallback = styled.span<{$large: boolean}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({$large}) => ($large ? "88px" : "38px")};
  height: ${({$large}) => ($large ? "88px" : "38px")};
  flex-shrink: 0;
  border: 1px solid ${coolGray[200]};
  border-radius: 50%;
  background-color: ${coolGray[100]};
  color: ${coolGray[600]};
  font-size: ${({$large}) => ($large ? "1.75rem" : "0.875rem")};
  font-weight: 650;
`;

export const AdminProfilePage = styled.main`
  width: 100%;
  max-width: 960px;
  padding: 8px 8px 32px;
  margin: 0 auto;
`;

export const AdminProfileTitle = styled.h1`
  margin: 0 0 8px;
  color: ${coolGray[800]};
  font-size: 1.75rem;
  font-weight: 700;
`;

export const AdminProfileDescription = styled.p`
  margin: 0 0 24px;
  color: ${coolGray[500]};
  font-size: 0.875rem;
`;

export const AdminProfileCard = styled.section`
  padding: 28px;
  border: 1px solid ${coolGray[200]};
  border-radius: 12px;
  background-color: #FFFFFF;
`;

export const AdminProfileIdentity = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${coolGray[200]};

  h2 {
    margin: 0 0 6px;
    color: ${coolGray[800]};
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: ${coolGray[500]};
    font-size: 0.875rem;
    overflow-wrap: anywhere;
  }
`;

export const AdminProfileDetails = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const AdminProfileField = styled.div`
  dt {
    margin-bottom: 6px;
    color: ${coolGray[500]};
    font-size: 0.8125rem;
  }

  dd {
    margin: 0;
    color: ${coolGray[800]};
    font-size: 0.9375rem;
    overflow-wrap: anywhere;
  }
`;

export const AdminProfileEmpty = styled.div`
  padding: 28px 0;
  color: ${coolGray[600]};
  line-height: 1.8;
`;

export const AdminProfileActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
`;

export const AdminProfileLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid ${coolGray[200]};
  border-radius: 7px;
  background-color: #FFFFFF;
  color: ${coolGray[700]};
  font-size: 0.8125rem;

  &:hover {
    background-color: ${coolGray[100]};
  }

  &:focus-visible {
    outline: 2px solid #4E73DF;
    outline-offset: 3px;
  }
`;

export const AdminProfileRetry = styled.button`
  min-height: 38px;
  padding: 8px 14px;
  border-radius: 7px;
  background-color: ${coolGray[800]};
  color: #FFFFFF;
  font-size: 0.8125rem;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #4E73DF;
    outline-offset: 3px;
  }
`;
