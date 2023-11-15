import React from 'react'
import { Theme } from '@utils/enums'
import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/router'
import MainWrapper from '@components/MainWrapper'
import { PageWrapper, Title } from '@styles/index.style'
import { Grid, SvgIconTypeMap } from '@mui/material'
import { CardOptions } from '@components'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import { OverridableComponent } from '@mui/types'
enum ManagementLinks {
  PROGRAM = 'programasic',
  INSTITUTION_TYPE = 'tiposdeinstituicao',
  CNPQ_LEVELS = 'niveiscnpq',
  CONFIG_EMAIL = 'emails',
  CONFIG_USER = 'usuarios',
  CONFIG_INSTITUTION = 'instituicoes',
}

interface OptionProps {
  title: string
  subtitle: string
  icon: OverridableComponent<SvgIconTypeMap>
  onClick: () => void
}

const Select: React.FC = () => {
  const router = useRouter()

  const goToPage = (option: ManagementLinks) => {
    router.push(`gerenciamento/${option}`)
  }

  const options: OptionProps[] = [
    {
      title: 'Configurar Programas',
      subtitle: 'Adicione, exclua ou edite um programa de pós-graduação.',
      icon: AccountBalanceRoundedIcon,
      onClick: () => goToPage(ManagementLinks.PROGRAM),
    },
    {
      title: 'Configurar Instituições',
      subtitle: 'Adicione, exclua ou edite uma instituição.',
      icon: BusinessRoundedIcon,
      onClick: () => goToPage(ManagementLinks.CONFIG_INSTITUTION),
    },
    {
      title: 'Configurar Tipo de Instituição',
      subtitle: 'Adicione, exclua ou edite um tipo de instituição.',
      icon: HomeWorkRoundedIcon,
      onClick: () => goToPage(ManagementLinks.INSTITUTION_TYPE),
    },
    {
      title: 'Configurar Níveis CNPQ',
      subtitle: 'Adicione, exclua ou edite um nível CNPQ.',
      icon: SchoolRoundedIcon,
      onClick: () => goToPage(ManagementLinks.CNPQ_LEVELS),
    },
    {
      title: 'Configurar Conteúdo do Email',
      subtitle: 'Adicione, exclua ou edite um email.',
      icon: EmailRoundedIcon,
      onClick: () => goToPage(ManagementLinks.CONFIG_EMAIL),
    },
    {
      title: 'Configurar Usuários',
      subtitle: 'Adicione, exclua ou edite um usuário.',
      icon: ManageAccountsRoundedIcon,
      onClick: () => goToPage(ManagementLinks.CONFIG_USER),
    },
  ]

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper container rowSpacing={3}>
          <Grid item>
            <Title>Gerenciamento de opções</Title>
          </Grid>

          <Grid item>
            <Grid container spacing={8}>
              {options.map(({ title, subtitle, icon, onClick }, index) => (
                <Grid item key={index}>
                  <CardOptions
                    onClick={onClick}
                    IconComponent={icon}
                    subtitle={subtitle}
                    title={title}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </PageWrapper>
      </MainWrapper>
    </>
  )
}

export default Select
