import styled from 'styled-components'
import { Theme } from '../../utils/enums'
import Image from 'next/image'

const theme = {
  gray: {
    backgroundColor: '#F8F3FF',
  },
  white: {
    backgroundColor: '#FFF',
  },
}

type AppProps = {
  themeName: Theme
}

export const ImageBackground = styled(Image)`
  background-color: rgba(11, 105, 81, 0.7);
  background-blend-mode: lighten;
`

export const Wrapper = styled.div<AppProps>`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: ${props => theme[props.themeName].backgroundColor};

  //@media screen and (min-width: 320px) and {
  //  position: absolute;
  //  top: 100%;
  //  left: 0;
  //  width: 100vh;
  //  height: 100vw;
  //  overflow: hidden;
  //  transform: rotate(-90deg);
  //  transform-origin: left top;
  //}
`

export const Content = styled.div`
  width: 100%;
  height: 100%;
  padding-right: 16px;
  padding-left: 16px;

  //@media (min-width: 360px) {
  //  width: 328px;
  //  margin: 0 auto;
  //  padding: 0;
  //}
`
