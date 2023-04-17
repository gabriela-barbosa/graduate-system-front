import { Fields, PageWrapper, Title } from '@styles/index.style'
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Button, Input, MainWrapper } from '@components'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Role, RoleTranslation, Theme } from '@utils/enums'
import { useRouter } from 'next/router'
import { User } from '@context/authContext'
import { Controller, useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

interface Props {
  user: User
}

const UserDetail = () => {
  const router = useRouter()

  const { id } = router.query

  const [user, setUser] = useState<User>()

  const roles = Object.keys(Role).filter(item => {
    return isNaN(Number(item))
  })
  const createUpdateUser = async user => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    }
    const result = await fetch(`${GRADUATE_API}/v1/register`, myInit as RequestInit)
    // if (result && result.status < 400) {
    // } else {
    // }
  }
  const formContext = useForm({
    defaultValues: useMemo(() => {
      return user
    }, [user]),
  })
  const { reset, control } = formContext

  const getUser = async () => {
    if (id !== 'criar') {
      const response = await fetch(`${GRADUATE_API}/v1/user/${id}`, { credentials: 'include' })
      if (response?.status < 400) {
        const newUser = await response.json()
        setUser(newUser)
        reset()
        return
      }
    }
    setUser(undefined)
  }
  const handleSubmit = async event => {
    event.preventDefault()
    const { name, email, roles } = event.target
    console.log(roles.value)
    const user = {
      id,
      name: name.value,
      email: email.value,
      roles: typeof roles.value === 'string' ? roles.value.split(',') : roles.value,
    }

    await createUpdateUser(user)
  }
  useEffect(() => {
    reset(user)
  }, [user])
  useEffect(() => {
    getUser()
  }, [])
  return (
    <MainWrapper themeName={Theme.white} hasContent hasHeader>
      <PageWrapper>
        <FormContainer formContext={formContext} onSuccess={handleSubmit}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>{id ? 'Editar' : 'Adicionar'} Usuário</Title>
            </Grid>
            <Grid item xs={12} minHeight={510}>
              <Grid container rowSpacing={4} columnSpacing={4}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Input required name={'name'} label={'Nome'} />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <Input required name={'email'} label={'Email'} />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor={'roles'}>Papel do Usuário</InputLabel>
                    <Controller
                      control={control}
                      name={'roles'}
                      render={({ field: { onChange, onBlur, name, value, ref } }) => (
                        <Select
                          multiple
                          onChange={onChange}
                          onBlur={onBlur}
                          name={name}
                          id={'roles'}
                          value={value ?? []}
                          ref={ref}
                          label={'Papel do Usuário'}
                        >
                          {roles.map(role => (
                            <MenuItem key={role} value={role}>
                              {RoleTranslation[role]}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button type={'submit'} size={'large'} variant={'contained'}>
                    Salvar
                  </Button>
                </Grid>
                <Grid item>
                  {/* <Button size={'large'} variant={'outlined'} onClick={onClickBack}> */}
                  {/*  Voltar */}
                  {/* </Button> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </FormContainer>
      </PageWrapper>
    </MainWrapper>
  )
}

export default UserDetail
