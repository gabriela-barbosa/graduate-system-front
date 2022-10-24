import styled from 'styled-components'
import { Input, Section } from '../../styles/index.style'

export const Content = styled.div`
  width: 90%;
  padding: 20px 50px 50px 50px;
  flex-direction: column;
  display: block;
  margin: 0 auto;
`

export const SectionEdit = styled(Section)`
  display: flex;
  flex-wrap: wrap;
`

export const Checkbox = styled.input``

export const Title = styled.h1`
  padding-top: 24px;
  padding-bottom: 30px;
  font-style: normal;
  font-weight: normal;
  font-size: 36px;
  line-height: 47px;

  color: rgba(11, 105, 81, 0.7);
`

export const Subtitle = styled.h2`
  padding-top: 0;
  padding-bottom: 20px;
  padding-right: 140px;
  font-style: normal;
  font-weight: normal;
  font-size: 22px;
  line-height: 47px;

  color: rgba(11, 105, 81, 0.7);
`

export const FormInputGroupEdit = styled.div`
  flex: 0 1 50%;
  position: relative;
  display: flex;
  justify-content: left;
  width: 100%;
  height: 67px;
`

export const LabelSelect = styled.label`
  position: absolute;
  top: 4px;
  left: 20px;
  transition: all 0.3s ease;
  opacity: 1;
  color: #4b907e;
  font-size: 12px;
  line-height: 14px;
`

export const Select = styled.select`
  display: block;
  width: 550px;
  height: 48px;
  padding-left: 12px;
  transition: all 0.3s linear;
  border: 3px solid #cbcbcb;
  border-radius: 8px;
  background-color: #fff;
  color: #4b907e;
  font-size: 20px;
  line-height: 23px;

  &:focus {
    outline: 0;
  }

  &:disabled {
    border: 3px solid #cbcbcb7c;
    background-color: #ffffff7f;
    color: #4b907e82;
  }

  // &:not(:placeholder-shown) + ${LabelSelect} {
  //   transform: translateY(-12px);
  //   opacity: 1;
  // }

  &::placeholder {
    top: 0;
    color: #4b907e;
    font-size: 16px;
    font-style: normal;
    letter-spacing: 0.48px;
    line-height: 19px;
  }
`

export const InputEditar = styled(Input)`
  width: 450px;
`

export const Button = styled.button`
  width: 164px;
  height: 46px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  background-color: #4b907eff;
  opacity: 0.8;
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

// export const Button2 = styled.button`
//   margin-right: 5%;
//   width: 164px;
//   height: 46px;
//   border-radius: 25px;
//   cursor: pointer;
//   transition: background-color 0.2s, color 0.2s;
//   background-color: #ffff;
//   opacity: 0.8;
//   font-family: Roboto;
//   font-style: normal;
//   font-weight: normal;
//   font-size: 17px;
//   line-height: 23px;
//   color: #4b907eff;
//   border: solid 2px;
//   &:hover {
//     opacity: 1;
//   }
// `
export const FormEditar = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: left;
`
