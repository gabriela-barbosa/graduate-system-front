import React, { useEffect, useMemo, useState } from 'react'
import { Button, MainWrapper, toast } from '@components'
import { Theme } from '@utils/enums'
import { useForm } from 'react-hook-form'
import 'react-toastify/dist/ReactToastify.css'

import { Title } from './index.style'
import { useAuth } from '../../api/AuthProvider'
import { useRouter } from 'next/router'
import { PageWrapper } from '@styles/index.style'
import { Grid } from '@mui/material'
import { FormContainer } from 'react-hook-form-mui'
import { PersonalInfo } from '@views/WorkHistoryEdit/components/PersonalInfo'
import { InstitutionalLinkInfo } from '@views/WorkHistoryEdit/components/InstitutionalLinkInfo'
import { AcademicInfo } from '@views/WorkHistoryEdit/components/AcademicInfo'
import { getCNPQLevels, getInstitutionTypes } from '@views/WorkHistoryEdit/api'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const WorkHistory = () => {
  const [graduateInfo, setGraduateInfo] = useState<any>()
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState<boolean | null>(null)
  const [hasCNPQScholarship, setHasCNPQScholarship] = useState<boolean | null>(null)
  const [hasPostDoctorate, setHasPostDoctorate] = useState<boolean | null>(null)
  const [institutionTypes, setInstitutionTypes] = useState([])
  const [cnpqLevels, setCNPQLevels] = useState([])

  const router = useRouter()

  const { user } = useAuth()

  const { graduateid, historyid } = router.query

  const formContext = useForm({
    defaultValues: useMemo(() => {
      return graduateInfo
    }, [graduateInfo]),
  })
  const { reset } = formContext

  useEffect(() => {
    reset(graduateInfo)
  }, [graduateInfo])

  useEffect(() => {
    const getGraduateAndWorkHistoryInfo = async () => {
      if (historyid) {
        const response = await fetch(`${GRADUATE_API}/v1/workhistory/${historyid}`, {
          credentials: 'include',
        })
        if (response.status === 200) {
          const result = await response.json()
          const {
            email,
            institutionName,
            institutionType,
            position,
            postDoctorateName,
            postDoctorateType,
            cnpqId,
            hasFinishedDoctorateOnUFF,
            hasFinishedMasterDegreeOnUFF,
          } = result

          setGraduateInfo({
            cnpqLevelId: cnpqId ?? 0,
            email,
            institutionType: institutionType ?? 0,
            institutionName: institutionName ?? '',
            position: position ?? '',
            postDoctorateName: postDoctorateName ?? '',
            postDoctorateType: postDoctorateType ?? 0,
            hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF === 'true',
            hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF === 'true',
          })
          if (institutionType) setHasInstitutionalLink(true)
          if (postDoctorateType) setHasPostDoctorate(true)
          if (cnpqId) setHasCNPQScholarship(true)
        }
      } else {
        try {
          const response = await fetch(`${GRADUATE_API}/v1/workhistory/graduate/${graduateid}`, {
            credentials: 'include',
          })

          if (response.status === 200) {
            const result = await response.json()

            const {
              email,
              institutionName,
              institutionType,
              position,
              postDoctorateName,
              postDoctorateType,
              cnpqId,
              hasFinishedDoctorateOnUFF,
              hasFinishedMasterDegreeOnUFF,
            } = result

            setGraduateInfo({
              cnpqLevelId: cnpqId ?? 0,
              email,
              institutionType: institutionType ?? 0,
              institutionName: institutionName ?? '',
              position: position ?? '',
              postDoctorateName: postDoctorateName ?? '',
              postDoctorateType: postDoctorateType ?? 0,
              hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF === 'true',
              hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF === 'true',
            })
            if (institutionType) setHasInstitutionalLink(true)
            if (postDoctorateType) setHasPostDoctorate(true)
            if (cnpqId) setHasCNPQScholarship(true)
          } else if (response.status === 404) {
            const response = await fetch(`${GRADUATE_API}/v1/graduate/${graduateid}`, {
              credentials: 'include',
            })
            if (response.status === 200) {
              const result = await response.json()

              setGraduateInfo({ email: result.user.email })
            }
          }
        } catch (e) {
          console.error('sdfsdfsdfsdfsdfsdf', e)
        }
      }
    }

    getInstitutionTypes().then(types => setInstitutionTypes(types))
    getCNPQLevels().then(levels => setCNPQLevels(levels))
    getGraduateAndWorkHistoryInfo()
  }, [])

  const onSend = async data => {
    const {
      email,
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
      position: position ?? graduateInfo?.position,
      hasFinishedDoctorateOnUFF: hasFinishedDoctorateOnUFF
        ? hasFinishedDoctorateOnUFF === 'true'
        : graduateInfo?.hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF: hasFinishedMasterDegreeOnUFF
        ? hasFinishedMasterDegreeOnUFF === 'true'
        : graduateInfo?.hasFinishedMasterDegreeOnUFF,
    }
    if (hasInstitutionalLink)
      body.institution = {
        name: institutionName ?? graduateInfo?.institution?.name,
        type: institutionType ?? graduateInfo?.institution?.type,
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
      method: historyid ? 'PUT' : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }

    const result = await fetch(
      `${GRADUATE_API}/v1/workhistory${historyid ? `/${historyid}` : ''}`,
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
                      institutionTypes={institutionTypes}
                      hasInstitutionalLink={hasInstitutionalLink}
                      setHasInstitutionalLink={setHasInstitutionalLink}
                      handleSetValue={handleSetValue}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AcademicInfo
                      currentRole={user.currentRole}
                      cnpqLevels={cnpqLevels}
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

export default WorkHistory
