import React from 'react'
import styled from 'styled-components'
import { Grid, Typography } from '@mui/material'
import { theme } from './theme'

const fontFamily = 'font-family: Roboto, sans-serif'

export const Content = styled.div`
  padding: 50px;
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
export const Label = styled.p`
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 16px;
  line-height: 24px;

  color: ${({ color = theme.palette.text.secondary }) => color};
`
export const ErrorMessage = styled.p`
  padding-left: 24px;
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 15px;
  line-height: 24px;

  color: #cb0000;
`

export const Error = styled.p`
  height: 30px;
  margin-top: 5px;
  color: #55c32d;
  font-size: 12px;
  line-height: lh(12px, 14px);
`

export const Background = styled.div`
  background: rgba(11, 105, 81, 0.7);
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

export const Fields = styled.p`
  padding-top: 5px;
  padding-bottom: 15px;
  font-size: 16px;
  line-height: 24px;

  color: ${({ status }: { status?: string }) =>
    status ? statusColor[status] : theme.palette.primary.main};
`

export const TypographyTableCell = ({
  children,
  status,
  width = '250px',
}: {
  children: string
  status?: string
  width?: string
}) => (
  <Typography
    sx={{
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      maxWidth: width,
      borderStyle: 'border-box',
      paddingTop: '5px',
      paddingBottom: '15px',
      fontSize: '16px',
      lineHeight: '24px',
      color: status ? statusColor[status] : theme.palette.primary.main,
    }}
  >
    {children}
  </Typography>
)

export const Subtitle = styled.h1`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
