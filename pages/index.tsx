import React, { useEffect } from 'react'
import { Role, Theme } from '@utils/enums'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { Button, MainWrapper, Input } from '@components'

import { Background, Content, FormInputGroup, ImageLogo, TitleLogin } from '@styles/index.style'
import fotoIcUff from '../public/fotoicuff.jpg'
import logo from '../public/logo-ic-uff-branca.png'
import Image from 'next/image'
import { useAuth } from '../src/api/AuthProvider'
import styled from 'styled-components'
import { FormContainer } from 'react-hook-form-mui'
import { Box, FormControl } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Password } from '@components/Input'
import { User } from '@context/authContext'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API
styled(FormInputGroup)`
  width: 320px;
`
const Home: React.FC = () => {
  const formContext = useForm()
  const router = useRouter()
  const { user, setUser } = useAuth()
  const redirectAccordingRole = async (user: User) => {
    if (user?.roles.some(role => role === Role.PROFESSOR || role === Role.ADMIN)) {
      await router.push(`/egressos`)
      return
    }
    if (user?.roles.includes(Role.GRADUATE)) await router.push(`/historico/${user.id}`)
  }

  useEffect(() => {
    redirectAccordingRole(user)
  }, [user])

  const onSubmit = async body => {
    const myInit: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }
    const result = await fetch(`${GRADUATE_API}/v1/login`, myInit)
    if (result.status === 200) {
      const response = await fetch(`${GRADUATE_API}/v1/user`, {
        credentials: 'include',
      })
      const profile = await response.json()
      const currentRole =
        profile.roles.find(role => role === Role.ADMIN) ??
        profile.roles.find(role => role === Role.PROFESSOR) ??
        profile.roles.find(role => role === Role.GRADUATE)
      setUser({ ...profile, currentRole })
      await redirectAccordingRole(profile)
    }
  }

  const getEmailErrorMessageByType = type => {
    switch (type) {
      case 'pattern':
        return 'Insira um emails válido.'
      case 'required':
        return 'Digite o emails.'
    }
  }

  return (
    <>
      <MainWrapper hasHeader={false} themeName={Theme.gray} hasContent={false}>
        <Image
          crossOrigin={'anonymous'}
          src={fotoIcUff}
          layout="fill"
          objectFit="cover"
          priority={true}
        />
        <Background>
          <Content>
            <ImageLogo>
              <Image
                crossOrigin={'anonymous'}
                src={logo}
                width="370"
                height="265"
                layout="fixed"
                priority={true}
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
