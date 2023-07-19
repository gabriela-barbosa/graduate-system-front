import { PageWrapper, Title } from '@styles/index.style'
import { Grid } from '@mui/material'
import { Button, MainWrapper } from '@components'
import React, { useEffect, useMemo, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { Theme } from '@utils/enums'
import { useRouter } from 'next/router'
import { User } from '@context/AuthContext'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import UserInfo from '@modules/User/UserInfo'
import GraduateInfo from '@modules/User/GraduateInfo'

const GRADUATE_API = process.env.GRADUATE_API

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
    await fetch(`${GRADUATE_API}/v1/register`, myInit as RequestInit)
    // if (result && result.status < 400) {
    // } else {
    // }
  }
  const formContext = useForm({
    defaultValues: useMemo(() => {
      if (user) {
        const currentUser = user
        if (currentUser.graduate?.postDoctorate) {
          currentUser.graduate.hasPostDoctorate = true
        } else if (currentUser.graduate && currentUser.graduate?.postDoctorate == null) {
          currentUser.graduate.hasPostDoctorate = 'unknown'
        }

        if (currentUser.graduate?.cnpqScholarship.length) {
          currentUser.graduate.hasCNPQScholarship = true
        } else if (currentUser.graduate && currentUser.graduate?.postDoctorate == null) {
          currentUser.graduate.hasPostDoctorate = 'unknown'
        }

        if (currentUser.graduate?.hasFinishedDoctorateOnUFF === null) {
          currentUser.graduate.hasFinishedDoctorateOnUFF = 'unknown'
        }

        if (currentUser.graduate?.hasFinishedMasterDegreeOnUFF === null) {
          currentUser.graduate.hasFinishedMasterDegreeOnUFF = 'unknown'
        }
        return currentUser
      }
    }, [user]),
  })
  const { reset, control } = formContext

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

// export async function getServerSideProps(ctx) {
//   const { id } = ctx.query
//
//
//   const apiClient = getAPIClient(ctx)
//
//   const promises = [getCourses(apiClient), getInstitutionTypes(apiClient), getCNPQLevels(apiClient)]
//
//   const [courses, institutionTypes, cnpqLevels] = await Promise.all(promises)
//
//   return {
//     props: {
//       courses,
//       institutionTypes,
//       cnpqLevels,
//     },
//   }
// }
