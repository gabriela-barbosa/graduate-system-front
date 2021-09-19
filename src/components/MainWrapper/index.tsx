import { Wrapper, Content } from './index.style'
import React from 'react'
import { Theme } from '../../utils/enums'

type AppProps = {
  themeName: Theme
  hasContent: boolean
  children: React.ReactNode
}

const MainWrapper = ({ themeName, hasContent = true, children }: AppProps): JSX.Element => {
  return <Wrapper themeName={themeName}>{hasContent ? <Content>{children}</Content> : children}</Wrapper>
}
export default MainWrapper
