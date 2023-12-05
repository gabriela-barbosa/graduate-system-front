import { PageWrapper, Title } from '@styles/index.style'
import { Button, MainWrapper, Grid } from '@components'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { User } from '@context/AuthContext'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { GraduateInfo, UserInfo } from '@modules/User'

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
      body: JSON.stringify(user),
    }
    await fetch(`${GRADUATE_API}/v1/register`, myInit as RequestInit)
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
    <MainWrapper>
      <FormContainer formContext={formContext} onSuccess={handleSubmit}>
        <PageWrapper container rowSpacing={2}>
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
        </PageWrapper>
      </FormContainer>
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
