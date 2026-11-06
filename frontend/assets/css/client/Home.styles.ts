import styled from "styled-components";
import { Grid } from "../common/Common.styles";

// 💡 홈 유튜브 / 펠로우 소식 / 도움이 필요해요 목록 (기존 MDBRow + MDBCol 대체)
export const HomeGrid = styled.div<{ $cols: number; $gap: string }>`
${Grid};
grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
column-gap: 30px;
row-gap: ${({ $gap }) => $gap};
padding-bottom: ${({ $gap }) => $gap};
`;
