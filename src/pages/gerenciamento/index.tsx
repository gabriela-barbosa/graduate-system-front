import React from 'react'
import { Theme } from '@utils/enums'
import 'react-toastify/dist/ReactToastify.css'
import money from '@public/foto1.png'
import settings from '@public/foto2.jpg'
import article from '@public/foto3.png'
import email from '@public/email.png'
import user from '@public/user.png'

import { useRouter } from 'next/router'
import MainWrapper from '@components/MainWrapper'
import { PageWrapper, Title } from '@styles/index.style'
import { Grid } from '@mui/material'
import { CardOptions, colors } from '@components'

enum ManagementLinks {
  PROGRAM = 'programasic',
  INSTITUTION_TYPE = 'tiposdeinstituicao',
  CNPQ_LEVELS = 'niveiscnpq',
  CONFIG_EMAIL = 'emails',
  CONFIG_USER = 'usuarios',
  CONFIG_INSTITUTION = 'instituicoes',
}

const Select: React.FC = () => {
  const router = useRouter()

  const goToPage = (option: ManagementLinks) => {
    router.push(`gerenciamento/${option}`)
  }

  const options = [
    {
      title: 'Configurar Programas',
      subtitle: 'Adicione, exclua ou edite um programa de pós-graduação.',
      icon: money,
      altImg: 'money',
      color: colors.green,
      onClick: () => goToPage(ManagementLinks.PROGRAM),
    },
    {
      title: 'Configurar Instituições',
      subtitle: 'Adicione, exclua ou edite uma instituição.',
      icon: user,
      altImg: 'user',
      color: colors.purple,
      onClick: () => goToPage(ManagementLinks.CONFIG_INSTITUTION),
    },
    {
      title: 'Configurar Tipo de Instituição',
      subtitle: 'Adicione, exclua ou edite um tipo de instituição.',
      icon: settings,
      altImg: 'settings',
      color: colors.red,
      onClick: () => goToPage(ManagementLinks.INSTITUTION_TYPE),
    },
    {
      title: 'Configurar Níveis CNPQ',
      subtitle: 'Adicione, exclua ou edite um nível CNPQ.',
      icon: article,
      altImg: 'article',
      color: colors.blue,
      onClick: () => goToPage(ManagementLinks.CNPQ_LEVELS),
    },
    {
      title: 'Configurar Conteúdo do Email',
      subtitle: 'Adicione, exclua ou edite um email.',
      icon: email,
      altImg: 'email',
      color: colors.yellow,
      onClick: () => goToPage(ManagementLinks.CONFIG_EMAIL),
    },
    {
      title: 'Configurar Usuários',
      subtitle: 'Adicione, exclua ou edite um usuário.',
      icon: user,
      altImg: 'user',
      color: colors.purple,
      onClick: () => goToPage(ManagementLinks.CONFIG_USER),
    },
  ]

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper>
          <Title>Gerenciamento de opções</Title>
          <br></br>
          <br></br>
          <Grid container spacing={8}>
            {options.map(({ title, subtitle, icon, altImg, color, onClick }, index) => (
              <Grid item key={index}>
                <CardOptions
                  color={color}
                  onClick={onClick}
                  altImg={altImg}
                  icon={icon}
                  subtitle={subtitle}
                  title={title}
                />
              </Grid>
            ))}
          </Grid>
        </PageWrapper>
      </MainWrapper>
    </>
  )
}

export default Select
