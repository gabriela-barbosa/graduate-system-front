import React from 'react'
import { AppProps } from 'next/app'
import GlobalStyle from '../src/styles/global'
import { theme } from '@styles/theme'
import { AuthProvider } from '../src/api/AuthProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from '@mui/material'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}

export default MyApp
