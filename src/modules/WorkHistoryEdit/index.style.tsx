import styled from 'styled-components'
import { theme } from '@styles/theme'

export const Title = styled.h1`
  padding-top: 24px;
  padding-bottom: 30px;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: ${theme.palette.primary.main};
`

export const Subtitle = styled.h2`
  padding-top: 0;
  padding-bottom: 20px;
  padding-right: 140px;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 47px;

  color: ${theme.palette.primary.main};
`
