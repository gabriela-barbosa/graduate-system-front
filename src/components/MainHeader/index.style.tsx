import styled from 'styled-components'
import { rem } from 'polished'

export const Header = styled.header`
  width: 100%;
  padding-top: ${rem('24px')};
  border-bottom: 3px solid rgba(11, 105, 81, 0.7);
`
export const Cabecalho = styled.div`
  width: 90%;
  display: block;
  margin: 0 auto;
  padding-left: 50px;
`
export const Title = styled.h1`
  padding: 14px 0px 26px 30px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: rgba(11, 105, 81, 0.7);
`

export const Icon = styled.h1`
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 47px;

  color: rgba(11, 105, 81, 0.7);
`

export const Texto = styled.h4`
  color: rgba(11, 105, 81, 0.7);
`

export default Header;
