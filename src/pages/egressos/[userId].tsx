import React, { useEffect, useMemo, useState } from 'react'
import { Button, MainWrapper, toast } from '@components'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'

import { useAuth } from '@context/AuthProvider'
import { useRouter } from 'next/router'
import { PageWrapper, Title } from '@styles/index.style'
import { Grid } from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'
import {
  PersonalInfo,
  AcademicInfo,
  getInstitutionTypes,
  getGraduateInfoAndWorkHistory,
  GraduateWorkHistoriesInfo,
  getCNPQLevels,
  InstitutionalLinkInfo,
} from '@modules/WorkHistoryEdit'
import { getAPIClient } from '../../services/axios'
import { parseCookies } from 'nookies'
import { SelectItem } from '@utils/types'

const GRADUATE_API = process.env.GRADUATE_API

interface Props {
  graduateInfo: GraduateWorkHistoriesInfo
  institutionTypes: SelectItem[]
  cnpqLevels: SelectItem[]
}

const GraduateInfo = ({ graduateInfo, institutionTypes, cnpqLevels }: Props) => {
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState<boolean | null>(null)
  const [hasCNPQScholarship, setHasCNPQScholarship] = useState<boolean | null>(null)
  const [hasPostDoctorate, setHasPostDoctorate] = useState<boolean | null>(null)

  const router = useRouter()

  const { user } = useAuth()

  const { graduateId } = router.query

  const formContext = useForm({
    defaultValues: useMemo(() => {
      return graduateInfo
    }, [graduateInfo]),
  })
  const { reset } = formContext

  useEffect(() => {
    reset(graduateInfo)
  }, [graduateInfo])

  const onSend = async data => {
    const {
      email,
      successCase,
      institutionName,
      institutionType,
      position,
      postDoctorateName,
      postDoctorateType,
      cnpqId,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
    } = data

    console.warn(data)

    const body: any = {
      email,
      successCase,
      hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF
        ? hasFinishedDoctorateOnUFF === 'true'
        : graduateInfo?.hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF
        ? hasFinishedMasterDegreeOnUFF === 'true'
        : graduateInfo?.hasFinishedMasterDegreeOnUFF,
    }
    if (hasPostDoctorate)
      body.postDoctorate =
        postDoctorateName || postDoctorateType
          ? { name: postDoctorateName, type: postDoctorateType }
          : graduateInfo?.postDoctorate
    if (hasCNPQScholarship) body.cnpqLevelId = cnpqId ?? graduateInfo?.cnpqLevelId
    if (email !== graduateInfo.email) {
      body.newEmail = email
    }

    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }

    const result = await fetch(
      `${GRADUATE_API}/v1/work-history?graduateId=${graduateId}`,
      myInit as RequestInit
    )
    if (result.status === 201 || result.status === 204) {
      toast.success('Salvo com sucesso!')
    } else {
      toast.error('Ocorreu algum problema.')
    }
  }

  const handleGetOnChangeValue = ({ target }) => {
    const { value } = target
    switch (value) {
      case 'true':
        return true
      case 'false':
        return false
      default:
        return null
    }
  }

  const handleSetValue = (event, setFunction) => {
    const value = handleGetOnChangeValue(event)
    setFunction(value)
  }

  return (
    <MainWrapper themeName={Theme.white}>
      <PageWrapper spacing={2} container>
        <Grid item>
          <Grid container spacing={3}>
            <Grid item>
              <Title>Registro de Histórico do Egresso</Title>
            </Grid>
            <Grid item>
              <FormContainer formContext={formContext} onSuccess={onSend}>
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <PersonalInfo />
                  </Grid>
                  <Grid item xs={12}>
                    <InstitutionalLinkInfo
                      graduateInfo={graduateInfo}
                      institutionTypes={institutionTypes}
                      hasInstitutionalLink={hasInstitutionalLink}
                      setHasInstitutionalLink={setHasInstitutionalLink}
                      handleSetValue={handleSetValue}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AcademicInfo
                      cnpqLevels={cnpqLevels}
                      graduateInfo={graduateInfo}
                      currentRole={user?.currentRole}
                      hasCNPQScholarship={hasCNPQScholarship}
                      setHasCNPQScholarship={setHasCNPQScholarship}
                      institutionTypes={institutionTypes}
                      hasPostDoctorate={hasPostDoctorate}
                      setHasPostDoctorate={setHasPostDoctorate}
                      handleSetValue={handleSetValue}
                    />
                  </Grid>
                  <Grid item xs={12} alignSelf={'center'}>
                    <Grid container justifyContent={'center'} columnSpacing={3}>
                      <Grid item>
                        <Button
                          size={'large'}
                          variant="outlined"
                          onClick={() => router.push(`/egressos`)}
                        >
                          Voltar
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button size={'large'} variant="contained" type="submit">
                          Enviar
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </FormContainer>
            </Grid>
          </Grid>
        </Grid>
      </PageWrapper>
    </MainWrapper>
  )
}

export async function getServerSideProps(ctx) {
  const { userId } = ctx.query
  const apiClient = getAPIClient(ctx)
  const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const promises = [
    getGraduateInfoAndWorkHistory(apiClient, userId),
    getInstitutionTypes(apiClient),
    getCNPQLevels(apiClient),
  ]

  const [graduateInfo, institutionTypes, cnpqLevels] = await Promise.all(promises)

  return {
    props: {
      graduateInfo,
      institutionTypes,
      cnpqLevels,
    },
  }
}

export default GraduateInfo
