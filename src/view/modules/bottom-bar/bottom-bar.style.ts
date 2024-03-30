import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const BottomBarStyled = styled.div(({ theme }) => css`
  display: flex;
  align-items: center;

  background-color: ${theme.colorFillQuaternary};

  height: 25px;
  padding: 0 10px;

  border-top: 1px solid ${theme.colorBorder};

  font-family: ${theme.fontFamily};
  font-size: ${theme.fontSize}px;
  color: ${theme.colorText};
`)

export const LeftSectionStyled = styled.div`
  display: flex;
  justify-content: flex-start;

  flex: 1;
`

export const RightSectionStyled = styled.div`
  display: flex;
  justify-content: flex-end;

  flex: 1;
`
