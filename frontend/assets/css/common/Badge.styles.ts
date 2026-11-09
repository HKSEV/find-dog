import styled from "styled-components";
import { ColorWhite, Flex, Fw600, Fw700 } from "./Common.styles";

interface StatusProps {
  status: string;
}

export const StatusBadge = styled.span<StatusProps>`
  background-color: ${(props) => (props.status === "실종" ? "#FF4D4F" : "#52C41A")};
  ${ColorWhite}${Fw700}
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
`;

export const BadgeGroup = styled.div`
  ${Flex}
  gap: 6px;
  margin-bottom: 6px;
`;

export const Badge = styled.span<{$type?: "status" | "female" | "male" | "unknown"}>`
  font-size: 0.7rem;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid;
  ${Fw600};
  ${({$type}) => {
    switch ($type) {
      case "status":
        return "color: #555; border-color: #CCC; background-color: #FFF;";
      case "female":
        return "color: #FF6B6B; border-color: #FF6B6B; background-color: #FFF;";
      case "male":
        return "color: #4A90E2; border-color: #4A90E2; background-color: #FFF;";
      case "unknown":
        return "color: #555; border-color: #CCC; background-color: #FFF;";
      default:
        return "color: #555; border-color: #CCC; background-color: #FFF;";
    }
  }}
`;
