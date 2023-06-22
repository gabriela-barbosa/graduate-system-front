import { Grid } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import Image, { StaticImageData } from 'next/image'

interface Props {
  onClick: () => void
  title: string
  subtitle: string
  icon: StaticImageData
  altImg: string
  color: string
}

export const CardTitle = styled.h3`
  color: rgba(11, 105, 81, 0.7);
`
const IconWrapper = styled.div`
  padding-top: 10px;
`
export const IconImage = ({ src, alt }) => (
  <IconWrapper>
    <Image fill={false} width={64} height={64} src={src} alt={alt}></Image>
  </IconWrapper>
)

export const colors = {
  red: '#b3404a',
  green: '#3bb54a',
  blue: '#4895ff',
  yellow: '#d1b534',
  purple: '#ab45de',
}

const Card = styled.div`
  border-left: ${({ color }) => (color ? `3px solid ${color}` : 'white')};
  border-radius: 5px;
  box-shadow: 7px 7px 13px 0 rgba(50, 50, 50, 0.22);
  padding: 30px;
  width: 450px;
  height: 260px;
  transition: all 0.3s ease-out;

  &:hover {
    transform: translateY(-5px);
    cursor: pointer;
  }
`

export const CardOptions = ({ onClick, title, subtitle, icon, color, altImg }: Props) => (
  <Card color={color} onClick={onClick}>
    <Grid container spacing={1} direction="column">
      <Grid item>
        <CardTitle>{title}</CardTitle>
      </Grid>
      <Grid item>
        <p>{subtitle}</p>
      </Grid>
      <Grid item>
        <IconImage src={icon} alt={altImg} />
      </Grid>
    </Grid>
  </Card>
)
