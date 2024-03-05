import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  MainWrapper,
  Password,
  showErrorToast,
  showSuccessToast,
  Link as MuiLink,
  Typography,
} from '@components'
import { Background, Content, FormInputGroup, ImageLogo, TitleLogin } from '@styles/index.style'
import fotoIcUff from '@public/fotoicuff.jpg'
import logo from '@public/logo-ic-uff-branca.png'
import Image from 'next/image'
import { useAuth } from '@context/AuthProvider'
import styled from 'styled-components'
import { FormContainer } from 'react-hook-form-mui'
import { redirectAccordingRole } from '@utils/functions'
import { sendResetPasswordEmail } from '@modules/Login/api'

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
  const [email, setEmail] = useState('')

  const router = useRouter()

  useEffect(() => {
    if (currentRole && user) redirectAccordingRole(currentRole, user.id, router)
  }, [currentRole])

  const onSubmit = async ({ email, password }: FormProps) => {
    try {
      await login(email, password)
    } catch (err) {
      console.log('error', err)
      if (err.response?.status === 401) return showErrorToast('Email ou senha incorretos.')
      return showErrorToast('Ocorreu um erro ao fazer login. Tente novamente mais tarde.')
    }
  }

  const getEmailErrorMessageByType = (type: string) => {
    switch (type) {
      case 'pattern':
        return 'Insira um email válido.'
      case 'required':
        return 'Digite o email.'
      default:
        return 'Campo inválido.'
    }
  }

  const handleOnClickForgotPassword = async () => {
    try {
      if (!email || email === '') {
        showErrorToast('Digite o email para recuperar a senha ou fazer o primeiro acesso.')
        return
      }
      await sendResetPasswordEmail(email)
      showSuccessToast(
        'Foi enviado um email com um link para alteração/criação de senha. Verifique sua caixa de entrada.'
      )
    } catch (e) {
      showErrorToast(e.response.data)
    }
  }

  return (
    <MainWrapper hasHeader={false} hasContent={false}>
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
            <Image src={logo} width="370" height="265" priority fill={false} alt={'Logo ICC UFF'} />
          </ImageLogo>
          <TitleLogin>Sistema de Egressos</TitleLogin>
          <Box sx={{ width: '320px', backgroundColor: '#ffffffd6', borderRadius: 6, padding: 4 }}>
            <FormContainer formContext={formContext} onSuccess={onSubmit}>
              <Grid container direction={'column'} spacing={4} alignItems={'center'}>
                <Grid item height={100} width={'100%'}>
                  <FormControl fullWidth>
                    <Input
                      parseError={({ type }) => {
                        return getEmailErrorMessageByType(type)
                      }}
                      margin={'dense'}
                      type={'email'}
                      label={'Email'}
                      name={'email'}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item height={100} width={'100%'}>
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
                <Grid item xs={12}>
                  <MuiLink
                    component={Typography}
                    align="center"
                    fontSize={'16px'}
                    alignContent={'center'}
                    onClick={handleOnClickForgotPassword}
                    sx={{ cursor: 'pointer' }}
                  >
                    Esqueci minha senha ou primeiro acesso.
                  </MuiLink>
                </Grid>
                <Grid item>
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
  )
}

export default Home
