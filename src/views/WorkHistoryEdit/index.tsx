import React, { Fragment, useEffect, useMemo, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Roles, Theme } from '../../utils/enums'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Checkbox,
  FormInputGroupEdit,
  InputEditar,
  LabelSelect,
  SectionEdit,
  Select,
  Subtitle,
  Title,
} from './index.style'
import { useAuth } from '../../api/AuthProvider'
import { useRouter } from 'next/router'
import {
  Button,
  ButtonSecondary,
  CheckboxLabel,
  Form,
  FormInputGroup,
  Label,
  Section,
} from '../../styles/index.style'
import { FormType } from './types'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const WorkHistory = () => {
  const [graduateInfo, setGraduateInfo] = useState<FormType>()
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState(false)
  const [hasCNPQScholarship, setHasCNPQScholarship] = useState(false)
  const [hasPostDoctorate, setHasPostDoctorate] = useState(false)
  const [institutionTypes, setInstitutionTypes] = useState([])
  const [cnpqLevels, setCNPQLevels] = useState([])
  const router = useRouter()

  const { user } = useAuth()

  const { graduateid, historyid } = router.query

  useEffect(() => {
    console.warn('graduateInfo', graduateInfo)
  }, [graduateInfo])

  const { register, handleSubmit, reset } = useForm({
    defaultValues: useMemo(() => {
      return graduateInfo
    }, [graduateInfo]),
  })

  useEffect(() => {
    // console.log('Reset')
    reset(graduateInfo)
  }, [graduateInfo])

  useEffect(() => {
    const getInstitutionTypes = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
        credentials: 'include',
      })
      const result = await response.json()
      setInstitutionTypes(result)
    }
    const getCNPQLevels = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
        credentials: 'include',
      })
      const result = await response.json()
      setCNPQLevels(result)
    }
    const getGraduateAndWorkHistoryInfo = async () => {
      if (historyid) {
        const response = await fetch(`${GRADUATE_API}/v1/workhistory/${historyid}`, {
          credentials: 'include',
        })
        if (response.status === 200) {
          const result = await response.json()
          setGraduateInfo(result)
          const { institution, postDoctorate, cnpqLevelId } = result
          if (institution) setHasInstitutionalLink(true)
          if (postDoctorate) setHasPostDoctorate(true)
          if (cnpqLevelId) setHasCNPQScholarship(true)
        }
      } else {
        try {
          console.warn(graduateid)
          const response = await fetch(`${GRADUATE_API}/v1/workhistory/graduate/${graduateid}`, {
            credentials: 'include',
          })
          console.warn(response)

          if (response.status === 200) {
            const result = await response.json()
            console.log(result)

            setGraduateInfo(result)
            const { institution, postDoctorate, cnpqLevelId } = result
            if (institution) setHasInstitutionalLink(true)
            if (postDoctorate) setHasPostDoctorate(true)
            if (cnpqLevelId) setHasCNPQScholarship(true)
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
          console.error(e)
        }
      }
    }
    getInstitutionTypes()
    getCNPQLevels()
    getGraduateAndWorkHistoryInfo()
  }, [])

  // const validate = data => {}

  const onSend = async data => {
    const {
      email,
      institution,
      position,
      postDoctorate,
      cnpqLevelId,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
    } = data

    const body: FormType = {
      email: graduateInfo?.email,
      position: position ?? graduateInfo?.position,
      hasFinishedDoctorateOnUFF:
        hasFinishedDoctorateOnUFF ?? graduateInfo?.hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF:
        hasFinishedMasterDegreeOnUFF ?? graduateInfo?.hasFinishedMasterDegreeOnUFF,
    }
    console.warn('primeiro', body)
    if (hasInstitutionalLink)
      body.institution = {
        name: institution.name ?? graduateInfo?.institution?.name,
        type: institution.type ?? graduateInfo?.institution?.type,
      }
    if (hasPostDoctorate) body.postDoctorate = postDoctorate ?? graduateInfo?.postDoctorate
    if (hasCNPQScholarship) body.cnpqLevelId = cnpqLevelId ?? graduateInfo?.cnpqLevelId
    if (email !== graduateInfo.email) {
      body.newEmail = email
    }
    console.warn('segundo', body)
    console.warn('data', data)

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
      toast.success('Salvo com sucesso!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } else {
      toast.error('Ocorreu algum problema.', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }
  return (
    <>
      <MainWrapper themeName={Theme.white}>
        <Title>Registro de Histórico do Egresso</Title>
        <form onSubmit={handleSubmit(onSend)}>
          <Form>
            <div>
              <Subtitle>Informações pessoais</Subtitle>
              <SectionEdit>
                <FormInputGroupEdit>
                  <InputEditar
                    placeholder="E-mail"
                    type="email"
                    title="Digite um e-mail válido."
                    pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
                    {...register('email', { required: true })}
                  />
                  <Label htmlFor="email">E-mail</Label>
                </FormInputGroupEdit>
              </SectionEdit>
            </div>

            <div>
              <Subtitle>Informações sobre vínculo institucional</Subtitle>
              <Section>
                <Checkbox
                  type="checkbox"
                  id="institutionalLink"
                  checked={hasInstitutionalLink}
                  onChange={() => setHasInstitutionalLink(!hasInstitutionalLink)}
                />
                <CheckboxLabel htmlFor="institutionalLink">
                  Possui vínculo institucional
                </CheckboxLabel>
              </Section>
              <Fragment>
                <SectionEdit>
                  <FormInputGroupEdit>
                    <InputEditar
                      placeholder="Nome da instituição"
                      {...register('institution.name')}
                      disabled={!hasInstitutionalLink}
                    />
                    <Label htmlFor="institutionName">Nome da instituição</Label>
                  </FormInputGroupEdit>
                  <FormInputGroupEdit>
                    <LabelSelect htmlFor="institutionType">Tipo de Instituição</LabelSelect>
                    <Select {...register('institution.type')} disabled={!hasInstitutionalLink}>
                      {institutionTypes.map((institutionType: any) => (
                        <option key={institutionType.id} value={institutionType.id}>
                          {institutionType.name}
                        </option>
                      ))}
                    </Select>
                  </FormInputGroupEdit>
                  <FormInputGroupEdit>
                    <InputEditar
                      name="position"
                      placeholder="Cargo"
                      pattern="[^0-9]*"
                      title="O campo deve possuir apenas letras."
                      disabled={!hasInstitutionalLink}
                      {...register('position')}
                    />
                    <Label>Cargo</Label>
                  </FormInputGroupEdit>
                </SectionEdit>
              </Fragment>
            </div>

            <div>
              <Subtitle>Informações acadêmicas</Subtitle>
            </div>
            <Section>
              <Checkbox
                type="checkbox"
                id="hasPostDoctorate"
                checked={hasPostDoctorate}
                onChange={() => setHasPostDoctorate(!hasPostDoctorate)}
              />
              <CheckboxLabel htmlFor="hasPostDoctorate">Possui pós-doutorado?</CheckboxLabel>
            </Section>
            <Fragment>
              <SectionEdit>
                <FormInputGroupEdit>
                  <InputEditar
                    placeholder="Nome da instituição"
                    name="postDoctorate.name"
                    disabled={!hasPostDoctorate}
                    {...register('postDoctorate.name')}
                  />
                  <Label htmlFor="postDoctorate.name">Nome da instituição</Label>
                </FormInputGroupEdit>
                <FormInputGroupEdit>
                  <LabelSelect htmlFor="postDoctorate.type">Tipo de Instituição</LabelSelect>
                  <Select
                    name="postDoctorate.type"
                    disabled={!hasPostDoctorate}
                    {...register('postDoctorate.type')}
                  >
                    {institutionTypes.map((institutionType: any) => (
                      <option key={institutionType.id} value={institutionType.id}>
                        {institutionType.name}
                      </option>
                    ))}
                  </Select>
                </FormInputGroupEdit>
              </SectionEdit>
            </Fragment>
            <Section>
              <Checkbox
                type="checkbox"
                id="hasCNPQScholarship"
                checked={hasCNPQScholarship}
                onChange={() => setHasCNPQScholarship(!hasCNPQScholarship)}
              />
              <CheckboxLabel htmlFor="hasCNPQScholarship">Possui Bolsa CNPQ?</CheckboxLabel>
            </Section>
            <Fragment>
              <SectionEdit>
                <FormInputGroupEdit>
                  <LabelSelect htmlFor="cnpqLevelId">Bolsa CNPQ</LabelSelect>
                  <Select
                    name="cnpqLevelId"
                    disabled={!hasCNPQScholarship}
                    {...register('cnpqLevelId')}
                  >
                    {cnpqLevels.map((level: any) => (
                      <option key={level.id} value={level.id}>
                        {level.level}
                      </option>
                    ))}
                  </Select>
                </FormInputGroupEdit>
              </SectionEdit>
            </Fragment>
            {user.role === Roles.ADMIN && (
              <Fragment>
                <Section>
                  <Checkbox
                    type="checkbox"
                    id="hasFinishedDoctorateOnUFF"
                    name="hasFinishedDoctorateOnUFF"
                    {...register('hasFinishedDoctorateOnUFF')}
                  />
                  <CheckboxLabel htmlFor="hasFinishedDoctorateOnUFF">
                    Concluiu o doutorado no PGC/UFF?
                  </CheckboxLabel>
                </Section>
                <Section>
                  <Checkbox
                    type="checkbox"
                    id="hasFinishedMasterDegreeOnUFF"
                    name="hasFinishedMasterDegreeOnUFF"
                    {...register('hasFinishedMasterDegreeOnUFF')}
                  />
                  <CheckboxLabel htmlFor="hasFinishedMasterDegreeOnUFF">
                    Concluiu o mestrado no PGC ou CAA - UFF ?
                  </CheckboxLabel>
                </Section>
              </Fragment>
            )}

            <FormInputGroup>
              <ButtonSecondary onClick={() => router.push(`/egressos`)}>Voltar</ButtonSecondary>
              <Button type="submit">Enviar</Button>
              <ToastContainer position="bottom-center" />
            </FormInputGroup>
          </Form>
        </form>
      </MainWrapper>
    </>
  )
}

export default WorkHistory
