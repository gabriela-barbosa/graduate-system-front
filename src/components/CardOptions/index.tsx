import { Grid, SvgIconTypeMap, Typography } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { OverridableComponent } from '@mui/types'

interface Props {
  onClick: () => void
  title: string
  subtitle: string
  IconComponent: OverridableComponent<SvgIconTypeMap>
}

export const CardTitle = styled.h3`
  font-weight: normal;
  color: ${({ theme }) => theme.palette.primary.main};
`
const IconWrapper = styled.div`
  padding-top: 10px;
`
export const IconImage = ({ src, alt }) => (
  <IconWrapper>
    <Image fill={false} width={64} height={64} src={src} alt={alt}></Image>
  </IconWrapper>
)

const Card = styled.div`
  border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 5px;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  padding: 30px;
  width: 450px;
  height: 260px;
  transition: all 0.3s ease-out;

  &:hover {
    border-left: 3px solid ${({ theme }) => theme.palette.primary.dark};
    transform: translateY(-4px);
    cursor: pointer;
  }
`

export const CardOptions = ({ onClick, title, subtitle, IconComponent }: Props) => (
  <Card onClick={onClick}>
    <Grid container spacing={1} direction="column">
      <Grid item>
        <CardTitle>{title}</CardTitle>
      </Grid>
      <Grid item>
        <Typography>{subtitle}</Typography>
      </Grid>
      <Grid item>
        <IconComponent sx={{ height: '70px', width: 'auto' }} color={'primary'} />
      </Grid>
    </Grid>
  </Card>
)
