"use client";
import { createGlobalStyle } from "styled-components";
import { SwiperBaseStyles } from "./common/SwiperBase.styles";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0 solid;
  }

  html, body {
    margin: 0; 
    padding: 0; 
    width: 100%; 
    height: 100%;

    /* 1. 폰트 안티앨리어싱 (글씨를 뚜렷하고 부드럽게 렌더링) */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    /* 2. 텍스트 렌더링 최적화 (자간 및 가독성 향상) */
    text-rendering: optimizeLegibility;

    /* 3. 눈의 피로도를 낮추고 명도 대비를 확보하는 기본 폰트 색상 */
    color: #333333; 

    /* (선택) 한글 가독성이 높은 시스템 폰트 스택 적용 예시 */
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-size: 16px;
    font-weight: 400;
  }

  html {
    line-height: 1.15;
  }

  body {
    line-height: 1.5;
    background-color: #6c757d;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: 500;
    line-height: 1.2;
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  label {
    display: inline-block;
    margin-bottom: 0.5rem;
  }

  button, input, optgroup, select, textarea, ::file-selector-button {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    font-feature-settings: inherit;
    font-variation-settings: inherit;
    letter-spacing: inherit;
    color: inherit;
    opacity: 1;
    background-color: transparent;
    border-radius: 0;
  }

  button, input {
    overflow: visible;
  }

  ::file-selector-button {
    box-sizing: border-box;
    border: 0 solid;
    padding: 0;
    margin-inline-end: 4px;
    appearance: button;
  }

  button, select {
    text-transform: none;
  }

  textarea {
    overflow: auto;
    resize: vertical;
  }

  hr {
    box-sizing: content-box;
    height: 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
    overflow: visible;
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    color: inherit;
  }

  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    vertical-align: middle;
  }

  img, video {
    max-width: 100%;
    height: auto;
  }

  svg {
    overflow: hidden;
  }

  strong, b {
    font-weight: bolder;
  }

  small {
    font-size: 80%;
  }

  sub, sup {
    position: relative;
    font-size: 75%;
    line-height: 0;
    vertical-align: baseline;
  }

  sub { bottom: -0.25em; }
  sup { top: -0.5em; }

  a {
    text-decoration: none; 
    color: inherit;
  }

  a:hover {
    color: #0056b3;
  }

  ol, ul, li {
    list-style: none; 
    margin: 0; 
    padding: 0;
  }

  ${SwiperBaseStyles}
`;
