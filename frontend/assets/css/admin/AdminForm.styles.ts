import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
`;

export const Column = styled.div<{$md?: number; $lg?: number}>`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;

  ${({$md}) =>
    $md &&
    `
    @media (min-width: 768px) {
      flex: 0 0 ${($md / 12) * 100}%;
      max-width: ${($md / 12) * 100}%;
    }
  `}

  ${({$lg}) =>
    $lg &&
    `
    @media (min-width: 992px) {
      flex: 0 0 ${($lg / 12) * 100}%;
      max-width: ${($lg / 12) * 100}%;
    }
  `}
`;

export const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-wrap: break-word;
  background-color: #FFF;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
`;

export const CardHeader = styled.div`
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
`;

export const CardBody = styled.div`
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25rem;
`;

export const Control = styled.input`
  display: block;
  width: 100%;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #FFF;
  background-clip: padding-box;
  border: 1px solid #CED4DA;
  border-radius: 0.25rem;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &:focus {
    color: #495057;
    background-color: #FFF;
    border-color: #80BDFF;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: #6C757D;
    opacity: 1;
  }

  &:disabled {
    background-color: #E9ECEF;
    opacity: 1;
  }

  &:is(textarea) {
    height: auto;
  }
`;

export const Select = styled.select`
  max-width: 100%;
  font: inherit;
  color: inherit;
`;

export const CheckWrapper = styled.div<{$hasLabel?: boolean}>`
  position: ${({$hasLabel}) => ($hasLabel ? "relative" : "static")};
  display: ${({$hasLabel}) => ($hasLabel ? "block" : "contents")};
  padding-left: ${({$hasLabel}) => ($hasLabel ? "1.25rem" : "0")};
`;

export const CheckInput = styled.input`
  position: absolute;
  top: 0.3rem;
  left: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

export const CheckLabel = styled.label`
  margin-bottom: 0;
`;

export const Button = styled.button<{$variant?: "primary" | "warning"}>`
  display: inline-block;
  font-weight: 400;
  color: ${({$variant}) => ($variant === "warning" ? "#212529" : "#FFF")};
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: ${({$variant}) => ($variant === "warning" ? "#FFC107" : "#007BFF")};
  border: 1px solid ${({$variant}) => ($variant === "warning" ? "#FFC107" : "#007BFF")};
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${({$variant}) => ($variant === "warning" ? "#E0A800" : "#0069D9")};
    border-color: ${({$variant}) => ($variant === "warning" ? "#D39E00" : "#0062CC")};
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.5);
  }

  &:disabled {
    opacity: 0.65;
    cursor: default;
  }
`;
