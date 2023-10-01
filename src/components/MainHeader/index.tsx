import Image from 'next/image'
import Link from 'next/link'
import { Header, Cabecalho, Title, ProfileIcon, Texto, LogoutButton } from './index.style'
import logo from '@public/logo-ic-uff-png.png'
import React from 'react'
import { useAuth } from '@context/AuthProvider'
import Router from 'next/router'
import { Role, RoleTranslation } from '@utils/enums'
import Grid from '@mui/material/Unstable_Grid2'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { FormControl, IconButton, InputLabel, MenuItem } from '@mui/material'
import { SelectMui } from '@components'
import Head from 'next/head'
import { getHomeUrlAccordingRole } from '@utils/functions'

const MainHeader: React.FC = () => {
  const { user, currentRole, logout, updateCurrentRole } = useAuth()
  const onClickConfig = () => {
    Router.push('/gerenciamento')
  }

  const userFirstName = user?.name.replace(/ .*/, '')

  return (
    <Header>
      <Head>
        <title>Sistema Egressos</title>
      </Head>
      <Cabecalho>
        <Grid container spacing={2}>
          <Grid xs alignSelf="center">
            <Link
              href={`${currentRole && user && getHomeUrlAccordingRole(currentRole, user.id)}`}
              passHref
            >
              <Image src={logo} width={108} alt="Logo IC-UFF" />
            </Link>
          </Grid>

          <Grid xs={6} alignSelf="center">
            <Title> Sistema de Egressos </Title>
          </Grid>
          <Grid xs={4} xsOffset={1} alignSelf="center">
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid>
                <FormControl>
                  <InputLabel id="currentRoleLabel">Papel</InputLabel>
                  <SelectMui
                    labelId={'currentRoleLabel'}
                    id={'currentRole'}
                    name={'currentRole'}
                    label={'Papel'}
                    value={currentRole || ''}
                    onChange={async event => {
                      if (event.target.value) {
                        const role = Role[event.target.value as keyof typeof Role]
                        updateCurrentRole(role)
                      }
                    }}
                  >
                    {user?.roles.map((role, index) => (
                      <MenuItem key={index} value={role}>
                        {RoleTranslation[role]}
                      </MenuItem>
                    ))}
                  </SelectMui>
                </FormControl>
              </Grid>
              <Grid>
                <ProfileIcon>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </ProfileIcon>
              </Grid>
              <Grid>
                <Texto>Olá, {userFirstName}!</Texto>{' '}
                <LogoutButton onClick={logout}>Sair</LogoutButton>
              </Grid>

              <Grid>
                {currentRole === Role.ADMIN && (
                  <IconButton onClick={onClickConfig}>
                    <SettingsIcon fontSize="large" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Cabecalho>
    </Header>
  )
}

export default MainHeader
