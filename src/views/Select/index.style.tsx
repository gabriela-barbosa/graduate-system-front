import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

export const colors = {
  red: '#b3404a',
  green: '#3bb54a',
  blue: '#4895ff',
}

export const Card = styled.div`
  border-left: ${({ color }) => (color ? `3px solid ${colors[color]}` : 'white')};
  border-radius: 5px;
  box-shadow: 7px 7px 13px 0 rgba(50, 50, 50, 0.22);
  padding: 30px;
  //margin: 20px;
  width: 450px;
  height: 260px;
  transition: all 0.3s ease-out;

  &:hover {
    transform: translateY(-5px);
    cursor: pointer;
  }
`

export const CardTitle = styled.h3`
  color: rgba(11, 105, 81, 0.7);
`
const IconWrapper = styled.div`
  padding-top: 10px;
`
export const IconImage = ({ src, alt }) => (
  <IconWrapper>
    <Image layout="fixed" width={64} height={64} src={src} alt={alt}></Image>
  </IconWrapper>
)
