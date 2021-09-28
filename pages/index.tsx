import React from 'react'
import Head from 'next/head'
import MainWrapper from '../src/components/MainWrapper'
import { Theme } from '../src/utils/enums'
import { useForm } from 'react-hook-form'
import {
  Background,
  Button,
  Content,
  FormInputGroup,
  FormLogin,
  ImageLogo,
  Input,
  Label,
  Title,
} from './index.style'
import fotoIcUff from '../public/fotoicuff.jpg'
import logo from '../public/logo-ic-uff-branca.png'
import Image from 'next/image'

const Home: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    fetch('http://localhost:8080/')
  }

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false}>
        <Image src={fotoIcUff} layout="fill" objectFit="cover" />
        <Background>
          <Content>
            <ImageLogo>
              <Image src={logo} width="370" height="265" layout="fixed" />
            </ImageLogo>
            <Title>Sistema de Egressos</Title>
            <FormLogin>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormInputGroup>
                  <Input placeholder="Usuário" {...register('user', { required: true })} />
                  <Label htmlFor="user">Usuário</Label>
                </FormInputGroup>
                <FormInputGroup>
                  <Input
                    type="password"
                    placeholder="Senha"
                    {...register('password', { required: true })}
                  />
                  <Label htmlFor="password">Senha</Label>
                </FormInputGroup>
                <FormInputGroup>
                  <Button type="submit">Continuar</Button>
                </FormInputGroup>
              </form>
            </FormLogin>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Home
