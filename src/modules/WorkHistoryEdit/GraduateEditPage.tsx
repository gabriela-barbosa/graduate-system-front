import React, { useEffect, useMemo } from 'react'
import { Button, MainWrapper, showSavedToast, showErrorToast, Grid, Breadcrumbs } from '@components'
import { Role, Routes, Theme } from '@utils/enums'
import { useForm } from 'react-hook-form'

import { useAuth } from '@context/AuthProvider'
import { useRouter } from 'next/router'
import { PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import {
  AcademicInfo,
  GraduateWorkHistoriesInfo,
  InstitutionalLinkInfo,
  PersonalInfo,
} from '@modules/WorkHistoryEdit'
import { getAPIClient } from '@services/axios'
import { SelectItem } from '@utils/types'
import { transformNumberToValue } from '@utils/functions'

interface Props {
  cnpqLevels: SelectItem[]
  graduateInfo: GraduateWorkHistoriesInfo
  hasCurrentCNPQScholarship: number
  hasCurrentWorkHistory: number
  hasPostDoctorate: number
  institutionTypes: SelectItem[]
}

const GraduateForm = ({
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
                        onClick={() => router.push(Routes.GRADUATES)}
                      >
                        Voltar
                      </Button>
                    </Grid>
                  ) : null}

                  <Grid item>
                    <Button size={'large'} variant="contained" type="submit">
                      Salvar
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
export default GraduateForm
