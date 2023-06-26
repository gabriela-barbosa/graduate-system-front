import React from 'react'
import GlobalStyle from '@styles/global'
import { theme } from '@styles/theme'
import { AuthProvider } from '@context/AuthProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import RoutingComponent from '@components/RoutingComponent'
import NextNProgress from 'nextjs-progressbar'

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <NextNProgress color={theme.palette.primary.main} />
          <RoutingComponent Component={Component} pageProps={pageProps} />
        </AuthProvider>
        <GlobalStyle />
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default MyApp
