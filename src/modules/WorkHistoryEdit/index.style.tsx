import styled from 'styled-components'

export const Content = styled.div`
  width: 90%;
  padding: 20px 50px 50px 50px;
  flex-direction: column;
  display: block;
  margin: 0 auto;
`

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
