import React, { Fragment, useEffect, useMemo, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Theme } from '../../utils/enums'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Button,
  Title,
  Checkbox,
  FormInputGroupEdit,
  Select,
  Subtitle,
  LabelSelect,
  SectionEdit,
  InputEditar, ButtonSecondary,
} from './index.style'
import { useAuth } from '../../api/AuthProvider'
import { useRouter } from 'next/router'
import {
  FormInputGroup,
  Form,
  CheckboxLabel,
  Section,
  Label,
} from '../../styles/index.style'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const WorkHistory = () => {
  const [graduateInfo, setGraduateInfo] = useState()
  const notify = (event) => console.log('bora', event)
  const salvoSucesso = () => toast("Salvo com sucesso!");
  const enviadoSucesso = () => toast("Enviado com sucesso!");
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState(false)
  const [hasCNPQScholarship, setHasCNPQScholarship] = useState(false)
  const [hasPostDoctorate, setHasPostDoctorate] = useState(false)
  const [institutionTypes, setInstitutionTypes] = useState([])
  const [cnpqLevels, setCNPQLevels] = useState([])
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return graduateInfo;
    }, [graduateInfo])
  })

  useEffect(() => {
    console.log('Reset');
    reset(graduateInfo);
  }, [graduateInfo]);

  const changeHasCNPQScholarship = () => {
    setHasCNPQScholarship(!hasCNPQScholarship)
    if (hasCNPQScholarship) {
      setValue('cnpqLevelId', null)
    }
  }

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
        const result = await response.json()
        setGraduateInfo(result)
        const {
          institution,
          postDoctorate,
          cnpqLevelId,
        } = result
        if (institution)
          setHasInstitutionalLink(true)
        if (postDoctorate)
          setHasPostDoctorate(true)
        if (cnpqLevelId)
          setHasCNPQScholarship(true)
      }
    }
    getInstitutionTypes()
    getCNPQLevels()
    getGraduateAndWorkHistoryInfo()
  }, [])

  const validate = (data) => {

  }

  const onSend = async (data) => {
    const {
      email,
      institution,
      position,
      postDoctorate,
      cnpqLevelId,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
    } = data


    const body = {
      email: graduateInfo?.email,
      position,
      hasFinishedDoctorateOnUFF,
      hasFinishedMasterDegreeOnUFF,
    }
    if (hasInstitutionalLink)
      body['institution'] = institution
    if (hasPostDoctorate)
      body['postDoctorate'] = postDoctorate
    if (hasCNPQScholarship)
      body['cnpqLevelId'] = cnpqLevelId
    if (email !== graduateInfo.email) {
      body['newEmail'] = email
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

    const result = await fetch(`${GRADUATE_API}/v1/${historyid ? `workhistory/${historyid}` : 'graduate'}`, myInit)
    if (result.status === 201 || result.status === 204) {
      toast.success('Salvo com sucesso!', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      toast.error('Ocorreu algum problema.', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }
  const onSaveDraft = data => {
    console.log('boraaaaanakndskdnaksdnasa', data)
  }
  const { user } = useAuth()
  const router = useRouter()
  const { userid, historyid } = router.query


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
                    defaultValue={graduateInfo?.email}
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
                  defaultChecked={!!(graduateInfo?.institution)}
                  checked={!!(graduateInfo?.institution)}
                  onChange={() => setHasInstitutionalLink(!hasInstitutionalLink)}
                />
                <CheckboxLabel htmlFor="institutionalLink">
                  Possui vínculo institucional
                </CheckboxLabel>
              </Section>
              {hasInstitutionalLink && (
                <Fragment>
                  <SectionEdit>
                    <FormInputGroupEdit>
                      <InputEditar
                        placeholder="Nome da instituição"
                        defaultValue={graduateInfo?.institution?.name}
                        {...register('institution.name')}
                      />
                      <Label htmlFor="institution.name">Nome da instituição</Label>
                    </FormInputGroupEdit>
                    <FormInputGroupEdit>
                      <LabelSelect htmlFor="institutionType">Tipo de Instituição</LabelSelect>
                      <Select
                        name="institution.type"
                        defaultValue={graduateInfo?.institution?.type}
                        {...register('institution.type')}>
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
                        defaultValue={graduateInfo?.position}
                        title="O campo deve possuir apenas letras."
                        {...register('position')}
                      />
                      <Label>Cargo</Label>
                    </FormInputGroupEdit>
                  </SectionEdit>
                </Fragment>
              )}
            </div>

            <div>
              <Subtitle>Informações acadêmicas</Subtitle>
            </div>
            <Section>
              <Checkbox
                type="checkbox"
                id="hasFinishedPosDoc"
                checked={hasPostDoctorate}
                defaultChecked={!!(graduateInfo?.postDoctorate)}
                onChange={() => setHasPostDoctorate(!hasPostDoctorate)}
              />
              <CheckboxLabel htmlFor="hasFinishedPosDoc">
                Tem pós-doutorado?
              </CheckboxLabel>
            </Section>
            {hasPostDoctorate && (
              <Fragment>
                <SectionEdit>
                  <FormInputGroupEdit>
                    <InputEditar
                      placeholder="Nome da instituição"
                      defaultValue={graduateInfo?.postDoctorate?.name}
                      name="postDoctorate.name"
                      {...register('postDoctorate.name')}
                    />
                    <Label htmlFor="postDoctorate.name">Nome da instituição</Label>
                  </FormInputGroupEdit>
                  <FormInputGroupEdit>
                    <LabelSelect htmlFor="postDoctorate.type">Tipo de Instituição</LabelSelect>
                    <Select
                      name="postDoctorate.type"
                      defaultValue={graduateInfo?.postDoctorate?.type}
                      {...register('postDoctorate.type')}>
                      {institutionTypes.map((institutionType: any) => (
                        <option key={institutionType.id} value={institutionType.id}>
                          {institutionType.name}
                        </option>
                      ))}
                    </Select>
                  </FormInputGroupEdit>
                </SectionEdit>
              </Fragment>
            )}
            <Section>
              <Checkbox
                type="checkbox"
                id="hasCNPQScholarship"
                defaultChecked={!!(graduateInfo?.cnpqLevelId)}
                checked={hasCNPQScholarship}
                onChange={() => setHasCNPQScholarship(!hasCNPQScholarship)}
              />
              <CheckboxLabel htmlFor="hasCNPQScholarship">Possui Bolsa CNPQ?</CheckboxLabel>
            </Section>
            {hasCNPQScholarship && (
              <Fragment>
                <SectionEdit>
                  <FormInputGroupEdit>
                    <LabelSelect htmlFor="cnpqLevelId">Bolsa CNPQ</LabelSelect>
                    <Select
                      name="cnpqLevelId"
                      defaultValue={graduateInfo?.cnpqLevelId}
                      {...register('cnpqLevelId')}>
                      {cnpqLevels.map((level: any) =>
                        <option key={level.id} value={level.id}>
                          {level.level}
                        </option>
                      )}
                    </Select>
                  </FormInputGroupEdit>
                </SectionEdit>
              </Fragment>
            )}
            <Section>
              <Checkbox
                type="checkbox"
                id="hasFinishedDoctorateOnUFF"
                name="hasFinishedDoctorateOnUFF"
                defaultChecked={!!(graduateInfo?.hasFinishedDoctorateOnUFF)}
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
                defaultChecked={!!(graduateInfo?.hasFinishedMasterDegreeOnUFF)}
                {...register('hasFinishedMasterDegreeOnUFF')}
              />
              <CheckboxLabel htmlFor="hasFinishedMasterDegreeOnUFF">
                Concluiu o mestrado no PGC ou CAA - UFF ?
              </CheckboxLabel>
            </Section>
            <FormInputGroup>
              <ButtonSecondary onClick={handleSubmit(onSaveDraft)}>
                Salvar Rascunho
              </ButtonSecondary>
              <Button type="submit">
                Enviar
              </Button>
              <ToastContainer position="bottom-center"/>
            </FormInputGroup>
          </Form>
        </form>
      </MainWrapper>
    </>
  )
}

export default WorkHistory
