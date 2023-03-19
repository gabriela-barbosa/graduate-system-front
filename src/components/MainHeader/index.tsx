import Image from 'next/image'
import Link from 'next/link'
import { Header, Cabecalho, Title, ProfileIcon, Texto, LogoutButton, EditIcon } from './index.style'
import logo from '../../../public/logo-ic-uff-verde.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useAuth } from '../../api/AuthProvider'
import { useRouter } from 'next/router'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Role } from '../../utils/enums'
import Grid from '@mui/material/Unstable_Grid2'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const MainHeader: React.FC = () => {
  const { user, setUser } = useAuth()
  const router = useRouter()
  const logout = async () => {
    const myInit: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    await fetch(`${GRADUATE_API}/v1/logout`, myInit)
    await router.push('/')
    setUser(null)
  }

  const onClickConfig = () => {
    router.push('/gerenciamento')
  }

  return (
    <Header>
      <Cabecalho>
        <Grid container spacing={2}>
          <Grid xs alignSelf="center">
            <Link href="/egressos" passHref>
              <a>
                <Image src={logo} alt="Logo IC-UFF" />
              </a>
            </Link>
          </Grid>

          <Grid xs={6} alignSelf="center">
            <Title> Sistema de Egressos </Title>
          </Grid>
          <Grid xs={4} xsOffset={1} alignSelf="center">
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid>
                <ProfileIcon>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </ProfileIcon>
              </Grid>
              <Grid>
                <Texto>Olá, {user?.name}!</Texto> <LogoutButton onClick={logout}>Sair</LogoutButton>
              </Grid>
              <Grid>
                {user?.roles === Role.ADMIN && (
                  <EditIcon onClick={onClickConfig}>
                    <SettingsIcon fontSize="large" />
                  </EditIcon>
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
