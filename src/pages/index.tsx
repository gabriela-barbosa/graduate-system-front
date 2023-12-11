import React, { useEffect } from 'react'
import { Theme } from '@utils/enums'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { Button, MainWrapper, Input, showErrorToast } from '@components'

import { Background, Content, FormInputGroup, ImageLogo, TitleLogin } from '@styles/index.style'
import fotoIcUff from '@public/fotoicuff.jpg'
import logo from '@public/logo-ic-uff-branca.png'
import Image from 'next/image'
import { useAuth } from '@context/AuthProvider'
import styled from 'styled-components'
import { FormContainer } from 'react-hook-form-mui'
import { Box, FormControl } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Password } from '@components/Input'
import { redirectAccordingRole } from '@utils/functions'
import Head from 'next/head'

styled(FormInputGroup)`
  width: 320px;
`
interface FormProps {
  email: string
  password: string
}
const Home = () => {
  const formContext = useForm()
  const { user, login, currentRole } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (currentRole && user) redirectAccordingRole(currentRole, user.id, router)
  }, [currentRole])

  const onSubmit = async ({ email, password }: FormProps) => {
    try {
      await login(email, password)
    } catch (err) {
      showErrorToast('Email ou senha incorretos.')
    }
  }

  const getEmailErrorMessageByType = type => {
    switch (type) {
      case 'pattern':
        return 'Insira um email válido.'
      case 'required':
        return 'Digite o email.'
      default:
        return 'Campo inválido.'
    }
  }

  return (
    <>
      <Head>
        <title>Sistema Egressos</title>
      </Head>
      <MainWrapper hasHeader={false} themeName={Theme.gray} hasContent={false}>
        <Image
          alt={'Fotografia do IC UFF'}
          src={fotoIcUff}
          style={{ objectFit: 'cover', overflow: 'hidden' }}
          fill
          priority
        />
        <Background>
          <Content>
            <ImageLogo>
              <Image
                src={logo}
                width="370"
                height="265"
                priority
                fill={false}
                alt={'Logo ICC UFF'}
              />
            </ImageLogo>
            <TitleLogin>Sistema de Egressos</TitleLogin>
            <Box sx={{ width: '300px', backgroundColor: '#ffffffd6', borderRadius: 6, padding: 4 }}>
              <FormContainer formContext={formContext} onSuccess={onSubmit}>
                <Grid container direction={'column'} spacing={4} alignItems={'center'}>
                  <Grid height={100} width={'100%'}>
                    <FormControl fullWidth>
                      <Input
                        parseError={({ type }) => {
                          return getEmailErrorMessageByType(type)
                        }}
                        margin={'dense'}
                        type={'email'}
                        label={'Email'}
                        name={'email'}
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid height={100} width={'100%'}>
                    <FormControl fullWidth>
                      <Password
                        parseError={() => 'Digite a senha.'}
                        margin={'dense'}
                        name={'password'}
                        label={'Senha'}
                        required
                      />
                    </FormControl>
                  </Grid>
                  <Grid>
                    <FormControl>
                      <Button size={'large'} variant="contained" type="submit">
                        Continuar
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>
              </FormContainer>
            </Box>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Home
