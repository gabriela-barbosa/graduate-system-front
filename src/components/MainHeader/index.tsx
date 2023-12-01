import Image from 'next/image'
import Link from 'next/link'
import { Header, Title, ProfileIcon } from './index.style'
import logo from '@public/logo-ic-uff-png.png'
import React from 'react'
import { useAuth } from '@context/AuthProvider'
import Router from 'next/router'
import { Role, RoleTranslation } from '@utils/enums'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import { Box, Divider, FormControl, InputLabel, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { Button, Grid, SelectMui } from '@components'
import Head from 'next/head'
import { getHomeUrlAccordingRole } from '@utils/functions'
import { Logout } from '@mui/icons-material'

const MainHeader: React.FC = () => {
  const { user, currentRole, logout, updateCurrentRole } = useAuth()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const open = Boolean(anchorEl)

  const onClickConfig = () => {
    Router.push('/gerenciamento')
  }

  const userNames = user?.name.split(' ')
  const userFirstAndSecondName = userNames
    ? userNames.length > 1
      ? userNames?.slice(0, 2).join(' ')
      : userNames[0]
    : ''

  return (
    <Grid item minWidth="1000px">
      <Header>
        <Head>
          <title>Sistema Egressos</title>
        </Head>
        <Grid container px={11} alignItems="center" height="100%" width="100%">
          <Box>
            <Link
              href={`${currentRole && user && getHomeUrlAccordingRole(currentRole, user.id)}`}
              passHref
            >
              <Image src={logo} width={108} alt="Logo IC-UFF" />
            </Link>
          </Box>

          <Grid item pl={3} alignSelf="center">
            <Title> Sistema de Egressos </Title>
          </Grid>
          <Grid item xs>
            <Grid container alignItems="center" justifyContent="flex-end">
              <Grid item pr={1}>
                <FormControl>
                  <InputLabel variant="standard" id="currentRoleLabel">
                    Papel do usuário
                  </InputLabel>
                  <SelectMui
                    sx={{ minWidth: '120px' }}
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
              <Grid item pl={2}>
                <ProfileIcon>
                  <AccountCircleIcon sx={{ fontSize: 50 }} />
                </ProfileIcon>
              </Grid>
              <Button
                variant="text"
                size="medium"
                sx={{ textTransform: 'none', fontSize: '16px' }}
                endIcon={<KeyboardArrowDownRoundedIcon />}
                onClick={handleClick}
              >
                {userFirstAndSecondName}
              </Button>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {currentRole === Role.ADMIN && (
                  <>
                    <MenuItem onClick={onClickConfig}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Gerenciamento
                    </MenuItem>
                    <Divider />
                  </>
                )}
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
              {/* {currentRole === Role.ADMIN && ( */}
              {/*  <Grid item pl={1}> */}
              {/*    <IconButton onClick={onClickConfig}> */}
              {/*      <SettingsIcon fontSize="large" /> */}
              {/*    </IconButton> */}
              {/*  </Grid> */}
              {/* )} */}
              {/* <Grid item pl={1}> */}
              {/*  <Button variant="outlined" color="info" size="small" onClick={logout} sx={{}}> */}
              {/*    Sair */}
              {/*  </Button> */}
              {/* </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Header>
    </Grid>
  )
}

export default MainHeader
