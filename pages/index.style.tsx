import styled from 'styled-components'
import Image from 'next/image'

export const Content = styled.div`
  width: 100%;
  padding: 50px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ImageLogo = styled.div`
  padding-top: 112px;
`

export const FormLogin = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
`

export const FormInputGroup = styled.div`
  position: relative;
  width: 100%;
  height: 67px;
  margin-bottom: 11px;
`

export const Title = styled.h1`
  padding-top: 24px;
  padding-bottom: 54px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 40px;
  line-height: 47px;

  color: #ffffff;
`

export const Label = styled.label`
  position: absolute;
  top: 14px;
  left: 16px;
  transition: all 0.3s ease;
  opacity: 0;
  color: #4b907e;
  font-family: Roboto;
  font-size: 12px;
  line-height: 13px;
`

export const Input = styled.input`
  display: block;
  width: 300px;
  height: 48px;
  padding-left: 16px;
  transition: all 0.3s linear;
  border: 1px solid #4b907e;
  border-radius: 8px;
  background-color: #fff;
  color: #4b907e;
  font-family: Roboto;
  font-size: 16px;
  line-height: 18px;

  &:focus {
    outline: 0;
  }

  &:not(:placeholder-shown) {
    padding-top: 22.8px;
    padding-bottom: 14px;
    padding-left: 16px;
  }

  &:not(:placeholder-shown) + ${Label} {
    transform: translateY(-10px);
    opacity: 1;
  }

  &::placeholder {
    top: 0;
    color: #4b907e;
    font-size: 16px;
    font-style: normal;
    font-family: Roboto;
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
