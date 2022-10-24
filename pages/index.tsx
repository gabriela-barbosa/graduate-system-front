import React, { useEffect } from 'react'
import MainWrapper from '../src/components/MainWrapper'
import { Roles, Theme } from '../src/utils/enums'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import {
  Background,
  ButtonLogin,
  Content,
  Form,
  FormInputGroup,
  ImageLogo,
  Input,
  Label,
  TitleLogin,
} from '../src/styles/index.style'
import fotoIcUff from '../public/fotoicuff.jpg'
import logo from '../public/logo-ic-uff-branca.png'
import Image from 'next/image'
import { useAuth } from '../src/api/AuthProvider'
import styled from 'styled-components'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const FormInputGroupLoginFields = styled(FormInputGroup)`
  width: 320px;
`

const Home: React.FC = () => {
  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const { user, setUser } = useAuth()
  const redirectAccordingRole = async user => {
    switch (user?.role) {
      case Roles.GRADUATE: {
        await router.push(`/historico/${user.id}`)
        break
      }
      case Roles.PROFESSOR: {
        await router.push(`/egressos`)
        break
      }
      case Roles.ADMIN: {
        await router.push(`/egressos`)
        break
      }
    }
  }

  useEffect(() => {
    redirectAccordingRole(user)
  }, [user])

  const onSubmit = async body => {
    console.warn(body)
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
      setUser(profile)
      await redirectAccordingRole(profile)
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form>
                <FormInputGroupLoginFields>
                  <Input placeholder="Email" {...register('email', { required: true })} />
                  <Label htmlFor="email">Email</Label>
                </FormInputGroupLoginFields>
                <FormInputGroupLoginFields>
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...register('password', { required: true })}
                  />
                  <Label htmlFor="password">Senha</Label>
                </FormInputGroupLoginFields>
                <a>
                  <FormInputGroupLoginFields>
                    <ButtonLogin type="submit">Continuar</ButtonLogin>
                  </FormInputGroupLoginFields>
                </a>
              </Form>
            </form>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Home
