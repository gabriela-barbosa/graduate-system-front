import { PageWrapper, Title } from '@styles/index.style'
import { Button, MainWrapper, Grid } from '@components'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { GraduateInfo, UserInfo as UserInfoComponent } from '@modules/User'
import { getAPIClient } from '@services/axios'
import { getUser, UserInfo } from '@modules/User/api'
import { Role } from '@utils/enums'
import { getInstitutionTypesOptions } from '@modules/Commons/api'
import { SelectItem } from '@utils/types'
import { transformBoolToNumber } from '@utils/functions'

const GRADUATE_API = process.env.GRADUATE_API

interface UserEdit {
  hasPostDoctorate?: number
  hasCNPQScholarship?: number
  hasFinishedDoctorateOnUFF?: number
  hasFinishedMasterDegreeOnUFF?: number
}

interface UserInfoEdit extends UserInfo, UserEdit {}

interface Props {
  user: UserInfo & UserEdit
  institutionTypes: SelectItem[]
}

const UserDetail = ({ user: useInfo, institutionTypes }: Props) => {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<UserInfoEdit>(useInfo)
  const isUserGraduate = user.user.roles.includes(Role.GRADUATE)
  const isUserAdvisor = user.user.roles.includes(Role.PROFESSOR)
  console.log('userInfo', useInfo)
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
        const graduateInfo = user.graduate
        currentUser.hasPostDoctorate = transformBoolToNumber(!!graduateInfo?.postDoctorate)
        currentUser.hasCNPQScholarship = transformBoolToNumber(
          !!graduateInfo?.cnpqScholarships.length
        )
        currentUser.hasFinishedDoctorateOnUFF = transformBoolToNumber(
          graduateInfo?.hasFinishedDoctorateOnUFF
        )
        currentUser.hasFinishedMasterDegreeOnUFF = transformBoolToNumber(
          graduateInfo?.hasFinishedMasterDegreeOnUFF
        )
        return currentUser
      }
    }, [user]),
  })
  const { reset, control } = formContext
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

  return (
    <MainWrapper>
      <FormContainer formContext={formContext} onSuccess={handleSubmit}>
        <PageWrapper container rowSpacing={2}>
          <Grid item xs={12}>
            <Title>{id ? 'Editar' : 'Adicionar'} Usuário</Title>
          </Grid>
          <Grid item xs={12}>
            <UserInfoComponent control={control} />
          </Grid>
          {isUserGraduate && (
            <Grid item xs={12} mt={5}>
              <GraduateInfo control={control} institutionTypes={institutionTypes} />
            </Grid>
          )}
          {isUserAdvisor && (
            <Grid item mt={5}>
              {/* <GraduateInfo control={control} /> */}
            </Grid>
          )}
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

export async function getServerSideProps(ctx) {
  const { id } = ctx.query

  const apiClient = getAPIClient(ctx)

  try {
    const user = await getUser(id, apiClient)
    const institutionTypes = await getInstitutionTypesOptions(apiClient)
    return {
      props: {
        user,
        institutionTypes,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
