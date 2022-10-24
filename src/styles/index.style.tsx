import styled from 'styled-components'
import { Grid } from '@mui/material'
import { theme } from './theme'

const fontFamily = 'font-family: Roboto, sans-serif'

export const Content = styled.div`
  //width: 100%;
  padding: 50px;
  //position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ImageLogo = styled.div`
  padding-top: 112px;
`

export const Column = styled.div`
  float: left;
  width: 50%;
`

export const Section = styled.div`
  width: ${({ width }: { width?: string }) => width ?? 100}%;
  padding-right: 10px;
  padding-bottom: 30px;
`

export const CheckboxLabel = styled.label`
  padding-left: 5px;
`

const alignCenter = `
align-content : center;
  flex-direction: column;
  flex-wrap: wrap;
`

export const Form = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  ${({ position }: { position?: string }) =>
    position === 'left' ? 'justify-content: left;' : alignCenter};
`

export const FormInputGroup = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 67px;
  margin-bottom: 11px;
`

export const TitleLogin = styled.h1`
  padding-top: 24px;
  padding-bottom: 54px;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 47px;

  color: ${theme.palette.primary.contrastText};
`

export const Title = styled.h1`
  padding-top: 20px;
  padding-bottom: 20px;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: ${theme.palette.primary.main};
`

export const PageWrapper = styled(Grid)`
  padding: 20px 0 50px 50px;
`

export const Label = styled.label`
  position: absolute;
  top: 16px;
  left: 20px;
  transition: all 0.3s ease;
  opacity: 0;
  color: ${theme.palette.primary.main};
  font-family: ${fontFamily};
  font-size: 12px;
  line-height: 14px;
`

export const Input = styled.input`
  display: block;
  width: 100%;
  //width: 300px;
  height: 48px;
  padding-left: 16px;
  transition: all 0.3s linear;
  border: 3px solid ${theme.palette.grey['500']};
  border-radius: 8px;
  background-color: ${theme.palette.primary.contrastText};
  color: ${theme.palette.primary.main};
  font-family: ${fontFamily};
  font-size: 20px;
  line-height: 23px;

  &:disabled {
    border: 3px solid #cbcbcb7c;
    background-color: #ffffff7f;
    color: ${theme.palette.primary.main};
  }

  &:disabled::placeholder {
    color: ${theme.palette.primary.main};
  }

  &:focus {
    outline: 0;
  }

  &:not(:placeholder-shown) {
    //padding-top: 26px;
    //padding-bottom: 14px;
    padding-left: 16px;
  }

  &:not(:placeholder-shown) + ${Label} {
    transform: translateY(-12px);
    opacity: 1;
  }

  &::placeholder {
    top: 0;
    color: #4b907e;
    font-size: 16px;
    font-style: normal;
    font-family: ${fontFamily};
    letter-spacing: 0.48px;
    line-height: 19px;
  }
`

export const Error = styled.p`
  height: 30px;
  margin-top: 5px;
  color: #55c32d;
  font-size: 12px;
  line-height: lh(12px, 14px);
`

export const Button = styled.button`
  width: 164px;
  height: 46px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: #4b907eff;
  opacity: 0.8;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 23px;
  color: #ffff;
  border: none;

  &:hover {
    opacity: 1;
  }
`

export const ButtonSecondary = styled.button`
  margin: 0 10px;
  width: 164px;
  height: 46px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: #ffff;
  opacity: 0.8;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 23px;
  color: #4b907eff;
  border: solid 2px #4b907eff;

  &:hover {
    opacity: 1;
  }
`

export const Background = styled.div`
  background: ${theme.palette.primary.main};
  opacity: 0.99;
  height: 100%;
  width: 100%;
`

export const Row = styled.div`
  padding-top: 15px;
`

const statusColor = {
  PENDING: '#e11818',
  UPDATED: '#5BAFC9',
  UPDATED_PARTIALLY: '#DCB552',
  UNKNOWN: '#808080D3',
}

export const Fields = styled.h1`
  padding-top: 5px;
  padding-bottom: 15px;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 24px;

  color: ${({ status }: { status?: string }) =>
    status ? statusColor[status] : theme.palette.primary.main};
`

export const Subtitle = styled.h1`
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 140px;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 47px;

  color: #0b6951b2;
`

export const ButtonLogin = styled.button`
  width: 154px;
  height: 46px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: #ffff;
  opacity: 0.8;
  font-family: ${fontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 23px;
  color: #4b907eff;
  border: none;

  &:hover {
    opacity: 1;
  }
`
