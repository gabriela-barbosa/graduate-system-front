import React, { useEffect, useMemo } from 'react'
import { Button, MainWrapper, showSavedToast, showErrorToast, Grid, Breadcrumbs } from '@components'
import { Role, Routes, Theme, USER_TOKEN_NAME } from '@utils/enums'
import { useForm } from 'react-hook-form'

import { useAuth } from '@context/AuthProvider'
import { useRouter } from 'next/router'
import { PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import {
  AcademicInfo,
  Fields,
  getGraduateInfoAndWorkHistory,
  GraduateWorkHistoriesInfo,
  InstitutionalLinkInfo,
  PersonalInfo,
} from '@modules/WorkHistoryEdit'
import { getAPIClient } from '@services/axios'
import nookies from 'nookies'
import { SelectItem } from '@utils/types'
import { getCNPQLevelsOptions, getInstitutionTypesOptions } from '@modules/Commons/api'

interface Props {
  cnpqLevels: SelectItem[]
  graduateInfo: GraduateWorkHistoriesInfo
  hasCurrentCNPQScholarship: number
  hasCurrentWorkHistory: number
  hasPostDoctorate: number
  institutionTypes: SelectItem[]
}

const GraduateInfo = ({
  cnpqLevels,
  graduateInfo,
  hasCurrentCNPQScholarship,
  hasCurrentWorkHistory,
  hasPostDoctorate,
  institutionTypes,
}: Props) => {
  const router = useRouter()
  const { currentRole } = useAuth()
  const formContext = useForm({
    defaultValues: useMemo(() => {
      return {
        ...graduateInfo,
        cnpqScholarships: [],
        currentCNPQScholarships: [],
        currentInstitutionalLinks: [],
        hasCurrentCNPQScholarship,
        hasCurrentWorkHistory,
        hasPostDoctorate,
        institutionalLinks: [],
        postDoctorate: {
          id: graduateInfo.postDoctorate?.id,
          startedAt: graduateInfo.postDoctorate?.startedAt,
          endedAt: graduateInfo.postDoctorate?.endedAt,
          institution: {
            id: graduateInfo.postDoctorate?.institution?.id,
            name: graduateInfo.postDoctorate?.institution?.name,
            typeId: graduateInfo.postDoctorate?.institution?.typeId,
          },
        },
        workHistories: [],
      }
    }, [graduateInfo]),
  })
  const { reset, control } = formContext

  const transformNumberToValue = (n: number) => (n === 1 ? true : n === 0 ? false : undefined)

  useEffect(() => {
    reset({
      ...graduateInfo,
      cnpqScholarships: [],
      currentCNPQScholarships: [],
      currentInstitutionalLinks: [],
      hasCurrentCNPQScholarship,
      hasCurrentWorkHistory,
      hasPostDoctorate,
      institutionalLinks: [],
      postDoctorate: {
        id: graduateInfo.postDoctorate?.id,
        startedAt: graduateInfo.postDoctorate?.startedAt,
        endedAt: graduateInfo.postDoctorate?.endedAt,
        institution: {
          id: graduateInfo.postDoctorate?.institution?.id,
          name: graduateInfo.postDoctorate?.institution?.name,
          typeId: graduateInfo.postDoctorate?.institution?.typeId,
        },
      },
      workHistories: [],
    })
  }, [graduateInfo])

  const onSend = async data => {
    const {
      graduateId,
      graduateName,
      email,
      postDoctorate,
      successCase,
      cnpqScholarships,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
      hasCurrentWorkHistory,
      hasCurrentCNPQScholarship,
      hasPostDoctorate,
      institutionalLinks,
    } = data

    const body = {
      cnpqScholarships,
      email,
      graduateName,
      hasCurrentCNPQScholarship: transformNumberToValue(hasCurrentCNPQScholarship),
      hasCurrentWorkHistory: transformNumberToValue(hasCurrentWorkHistory),
      hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF
        ? hasFinishedDoctorateOnUFF === 'true'
        : graduateInfo?.hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF
        ? hasFinishedMasterDegreeOnUFF === 'true'
        : graduateInfo?.hasFinishedMasterDegreeOnUFF,
      hasPostDoctorate: transformNumberToValue(hasPostDoctorate),
      postDoctorate: hasPostDoctorate === 1 ? postDoctorate : null,
      successCase,
      workHistories: institutionalLinks,
    }

    const apiClient = getAPIClient()

    try {
      await apiClient.post(`v1/work-history?graduateId=${graduateId}`, { ...body })
      showSavedToast()
    } catch (err) {
      showErrorToast('Ocorreu algum erro.')
    }
  }

  // const handleGetOnChangeValue = ({ target }) => {
  //   const { value } = target
  //   switch (value) {
  //     case 'true':
  //       return true
  //     case 'false':
  //       return false
  //     default:
  //       return null
  //   }
  // }

  // const handleSetValue = (event, setFunction) => {
  //   const value = handleGetOnChangeValue(event)
  //   setFunction(value)
  // }

  return (
    <MainWrapper themeName={Theme.white}>
      <PageWrapper container spacing={3}>
        {currentRole !== Role.GRADUATE && (
          <Grid item>
            <Breadcrumbs
              breadcrumbs={[
                { name: 'Listagem de Egressos', href: Routes.GRADUATES },
                { name: 'Histórico do Egressos' },
              ]}
            />
          </Grid>
        )}
        <Grid item xs={12}>
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
                  control={control}
                  graduateInfo={graduateInfo}
                  institutionTypes={institutionTypes}
                />
              </Grid>
              <Grid item xs={12}>
                <AcademicInfo
                  control={control}
                  cnpqLevels={cnpqLevels}
                  graduateInfo={graduateInfo}
                  institutionTypes={institutionTypes}
                />
              </Grid>
              <Grid item xs={12} alignSelf={'center'}>
                <Grid container justifyContent={'center'} columnSpacing={3}>
                  {currentRole !== Role.GRADUATE ? (
                    <Grid item>
                      <Button
                        size={'large'}
                        variant="outlined"
                        onClick={() => router.push(`/egressos`)}
                      >
                        Voltar
                      </Button>
                    </Grid>
                  ) : null}

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
      </PageWrapper>
    </MainWrapper>
  )
}

export async function getServerSideProps(ctx) {
  const { userId } = ctx.query
  const apiClient = getAPIClient(ctx)
  const cookies = nookies.get(ctx)

  if (!cookies[USER_TOKEN_NAME]) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const promises = [
    getGraduateInfoAndWorkHistory(apiClient, userId),
    getInstitutionTypesOptions(apiClient),
    getCNPQLevelsOptions(apiClient),
  ]

  const response = await Promise.all(promises)

  const someResult = response.some(item => 'response' in item && item.response?.status === 403)
  if (someResult)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  const [graduateInfo, institutionTypes, cnpqLevels] = response

  const graduateInfoParsed = graduateInfo as GraduateWorkHistoriesInfo

  const getIfHasField = (field: Fields) => {
    return graduateInfoParsed.pendingFields.includes(field)
      ? -1
      : graduateInfoParsed.emptyFields.includes(field)
      ? 0
      : 1
  }

  const hasCurrentCNPQScholarship = getIfHasField(Fields.CNPQ_SCHOLARSHIP)
  const hasPostDoctorate = getIfHasField(Fields.POST_DOCTORATE)
  const hasCurrentWorkHistory = getIfHasField(Fields.WORK_HISTORY)

  return {
    props: {
      graduateInfo,
      institutionTypes,
      cnpqLevels,
      hasCurrentCNPQScholarship,
      hasPostDoctorate,
      hasCurrentWorkHistory,
    },
  }
}

export default GraduateInfo
