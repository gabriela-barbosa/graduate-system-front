import React from 'react'
import { Routes, Theme } from '@utils/enums'

import { useRouter } from 'next/router'
import MainWrapper from '@components/MainWrapper'
import { PageWrapper, Title } from '@styles/index.style'
import Grid from '@mui/material/Grid'
import { CardOptions } from '@components'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded'
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded'
import { OverridableComponent } from '@mui/types'
import { Breadcrumbs } from '@components/Breadcrumbs'

interface OptionProps {
  title: string
  subtitle: string
  icon: OverridableComponent<any>
  onClick: () => void
}

const Select: React.FC = () => {
  const router = useRouter()

  const goToPage = (option: Routes) => {
    router.push(option)
  }

  const options: OptionProps[] = [
    {
      title: 'Configurar Programas',
      subtitle: 'Adicione, exclua ou edite um programa de pós-graduação.',
      icon: AccountBalanceRoundedIcon,
      onClick: () => goToPage(Routes.MANAGEMENT_CI_PROGRAMS),
    },
    {
      title: 'Configurar Instituições',
      subtitle: 'Adicione, exclua ou edite uma instituição.',
      icon: BusinessRoundedIcon,
      onClick: () => goToPage(Routes.MANAGEMENT_INSTITUTIONS),
    },
    {
      title: 'Configurar Tipo de Instituição',
      subtitle: 'Adicione, exclua ou edite um tipo de instituição.',
      icon: HomeWorkRoundedIcon,
      onClick: () => goToPage(Routes.MANAGEMENT_INSTITUTIONS_TYPES),
    },
    {
      title: 'Configurar Níveis CNPQ',
      subtitle: 'Adicione, exclua ou edite um nível CNPQ.',
      icon: SchoolRoundedIcon,
      onClick: () => goToPage(Routes.MANAGEMENT_CNPQ_LEVELS),
    },
    {
      title: 'Configurar Conteúdo dos Emails',
      subtitle: 'Adicione, exclua ou edite um email.',
      icon: EmailRoundedIcon,
      onClick: () => goToPage(Routes.MANAGEMENT_EMAILS),
    },
    {
      title: 'Configurar Usuários',
      subtitle: 'Adicione, exclua ou edite um usuário.',
      icon: ManageAccountsRoundedIcon,
      onClick: () => goToPage(Routes.MANAGEMENT_USERS),
    },
  ]

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper container rowSpacing={3}>
          <Grid item>
            <Breadcrumbs
              breadcrumbs={[
                { name: 'Listagem de Egressos', href: Routes.GRADUATES },
                { name: 'Gerenciamento' },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
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
