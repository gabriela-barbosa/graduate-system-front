import { PageWrapper, Title } from '@styles/index.style'
import { Grid } from '@mui/material'
import { Button, MainWrapper } from '@components'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Theme } from '@utils/enums'
import { useRouter } from 'next/router'
import { User } from '@context/authContext'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import UserInfo from '../../../src/modules/User/UserInfo'
import GraduateInfo from '../../../src/modules/User/GraduateInfo'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

interface Props {
  user: User
}

const UserDetail = () => {
  const router = useRouter()

  const { id } = router.query

  const [user, setUser] = useState<User>()

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
      if (user) {
        const currentUser = user
        if (user.graduate?.postDoctorate) {
          currentUser.graduate.hasPostDoctorate = true
        } else if (user.graduate?.postDoctorate == null) {
          currentUser.graduate.hasPostDoctorate = 'unknown'
        }

        if (user.graduate?.cnpqScholarship.length) {
          currentUser.graduate.hasCNPQScholarship = true
        } else if (user.graduate?.postDoctorate == null) {
          currentUser.graduate.hasPostDoctorate = 'unknown'
        }

        if (user.graduate?.hasFinishedDoctorateOnUFF === null) {
          currentUser.graduate.hasFinishedDoctorateOnUFF = 'unknown'
        }

        if (user.graduate?.hasFinishedMasterDegreeOnUFF === null) {
          currentUser.graduate.hasFinishedMasterDegreeOnUFF = 'unknown'
        }
        console.log(currentUser)
        return currentUser
      }
    }, [user]),
  })
  const { reset, control, getValues } = formContext

  const getUser = async id => {
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
    const user = {
      id,
      name: name.value,
      email: email.value,
      roles: typeof roles.value === 'string' ? roles.value.split(',') : roles.value,
    }

    await createUpdateUser(user)
  }

  const onClickBack = () => {
    router.push('/gerenciamento/usuarios')
  }

  useEffect(() => {
    reset(user)
  }, [user])
  useEffect(() => {
    id && getUser(id)
  }, [])
  return (
    <MainWrapper themeName={Theme.white} hasContent hasHeader>
      <PageWrapper>
        <FormContainer formContext={formContext} onSuccess={handleSubmit}>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>{id ? 'Editar' : 'Adicionar'} Usuário</Title>
            </Grid>
            <Grid item>
              <UserInfo control={control} />
            </Grid>
            <Grid item>
              <GraduateInfo control={control} />
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button type={'submit'} size={'large'} variant={'contained'}>
                    Salvar
                  </Button>
                </Grid>
                <Grid item>
                  <Button size={'large'} variant={'outlined'} onClick={onClickBack}>
                    Voltar
                  </Button>
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
