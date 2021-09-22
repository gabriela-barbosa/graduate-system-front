import React from 'react'
import Head from 'next/head'
import MainWrapper from '../src/components/MainWrapper'
import { Theme } from '../src/utils/enums'
import { useForm } from 'react-hook-form'
import { Content, FormInputGroup, FormLogin, ImageLogo, Input, Label, Title } from './index.style'
import { ImageBackground } from '../src/components/MainWrapper/index.style'
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

  const onSubmit = data => console.log(data)

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false}>
        <ImageBackground src={fotoIcUff} layout="fill" objectFit="cover" />
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
                <Input placeholder="Senha" {...register('password', { required: true })} />
                <Label htmlFor="password">Senha</Label>
              </FormInputGroup>
              <input type="submit" />
            </form>
          </FormLogin>
        </Content>
      </MainWrapper>
    </>
  )
}

export default Home
