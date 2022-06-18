import React, { Fragment, useEffect, useState } from 'react'
import MainWrapper from '../../src/components/MainWrapper'
import { Theme } from '../../src/utils/enums'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  Background,
  Content,
  Button,
  Title,
  Checkbox,
  LabelCheckbox,
  FormInputGroupEdit,
  Select,
  Subtitle,
  LabelSelect,
} from './index.style'
import MainHeader from '../../src/components/MainHeader'
import { useAuth } from '../api/AuthProvider'
import { useRouter } from 'next/router'
import {
  FormInputGroup,
  Form,
  Input,
  CheckboxLabel,
  Section,
  Row,
  Label,
} from '../../src/styles/index.style'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Editar: React.FC = () => {
  const notify = () => toast.success('Alteração salva com sucesso!')
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState(false)
  const [hasPostDoctorate, setHasPostDoctorate] = useState(false)
  const [institutionTypes, setInstitutionTypes] = useState([])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const getInstitutionTypes = async () => {
      const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
        credentials: 'include',
      })
      const result = await response.json()
      setInstitutionTypes(result)
    }
    getInstitutionTypes()
  }, [])

  const onSubmit = data => {
    fetch(`${GRADUATE_API}`)
  }
  const { user } = useAuth()
  const router = useRouter()

  return (
    <>
      <MainWrapper themeName={Theme.gray} hasContent={false}>
        <Background>
          <MainHeader />
          <Content>
            <Title>Registro de Histórico do Egresso</Title>
            <Form position="left">
              <form className="formEditar" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Subtitle>Informações pessoais</Subtitle>
                  <Section width={50}>
                    <FormInputGroup>
                      <Input
                        defaultValue={user?.email}
                        placeholder="E-mail"
                        type="email"
                        title="Digite um e-mail válido."
                        pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
                        required
                        {...register('email', { required: true })}
                      />
                      <Label htmlFor="email">E-mail</Label>
                    </FormInputGroup>
                  </Section>
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
                  {hasInstitutionalLink && (
                    <Fragment>
                      <div style={{ display: 'flex' }}>
                        <Section>
                          <FormInputGroup>
                            <LabelSelect htmlFor="institutionType">Tipo de Instituição</LabelSelect>
                            <Select id="institutionType" name="institutionType">
                              {institutionTypes.map((institutionType: any) => (
                                <option key={institutionType.id} value={institutionType.id}>
                                  {institutionType.name}
                                </option>
                              ))}
                            </Select>
                          </FormInputGroup>
                        </Section>
                        <Section>
                          <FormInputGroupEdit>
                            <Input
                              placeholder="Local de Trabalho"
                              defaultValue={user?.institution?.name}
                              required
                              {...register('institutionName', { required: true })}
                            />
                            <Label htmlFor="institutionName">Local de Trabalho</Label>
                          </FormInputGroupEdit>
                        </Section>
                        <Section>
                          <FormInputGroupEdit>
                            <Input
                              placeholder="Cargo"
                              defaultValue={user?.position}
                              pattern="[^0-9]*"
                              title="O campo deve possuir apenas letras."
                              required
                              {...register('position', { required: true })}
                            />
                            <Label>Cargo</Label>
                          </FormInputGroupEdit>
                        </Section>
                      </div>
                    </Fragment>
                  )}
                </div>
                <Section>
                  <Checkbox
                    type="checkbox"
                    id="hasCNPQScholarship"
                    {...register('hasCNPQScholarship')}
                  />
                  <CheckboxLabel htmlFor="hasCNPQScholarship">Possui Bolsa CNPQ</CheckboxLabel>
                </Section>
                <Section>
                  <Checkbox
                    type="checkbox"
                    id="hasFinishedDoctorateOnUFF"
                    {...register('hasFinishedDoctorateOnUFF')}
                  />
                  <CheckboxLabel htmlFor="hasFinishedDoctorateOnUFF">
                    Concluiu o doutorado da PGC/UFF?
                  </CheckboxLabel>
                </Section>
                <Section>
                  <Checkbox
                    type="checkbox"
                    id="hasFinishedMasterDegreeOnUFF"
                    {...register('hasFinishedMasterDegreeOnUFF')}
                  />
                  <CheckboxLabel htmlFor="hasFinishedMasterDegreeOnUFF">
                    Concluiu o mestrado da PGC ou CAA - UFF ?
                  </CheckboxLabel>
                </Section>
                <Section>
                  <Checkbox
                    type="checkbox"
                    id="hasFinishedMasterDegreeOnUFF"
                    checked={hasPostDoctorate}
                    onChange={() => setHasPostDoctorate(!hasPostDoctorate)}
                  />
                  <CheckboxLabel htmlFor="hasFinishedMasterDegreeOnUFF">
                    Tem pós-doutorado?
                  </CheckboxLabel>
                  {hasPostDoctorate && (
                    <Fragment>
                      <Row>
                        <LabelCheckbox htmlFor="institutionType">Tipo de Instituição</LabelCheckbox>
                        <Select id="postDoctorate.type" name="postDoctorate.type">
                          {institutionTypes.map((institutionType: any) => (
                            <option key={institutionType.id} value={institutionType.id}>
                              {institutionType.name}
                            </option>
                          ))}
                        </Select>
                      </Row>
                      <FormInputGroupEdit>
                        <Input
                          placeholder="Local de Trabalho"
                          defaultValue={user?.institution?.name}
                          required
                          {...register('postDoctorate.name', { required: true })}
                        />
                        <Label htmlFor="postDoctorate.name">Local de Trabalho</Label>
                      </FormInputGroupEdit>
                      <FormInputGroupEdit>
                        <Input
                          placeholder="Cargo"
                          defaultValue={user?.position}
                          pattern="[^0-9]*"
                          title="O campo deve possuir apenas letras."
                          required
                          {...register('position', { required: true })}
                        />
                        <Label>Cargo</Label>
                      </FormInputGroupEdit>
                    </Fragment>
                  )}
                </Section>
                <FormInputGroup>
                  <Button onClick={notify} type="submit">
                    Salvar Alterações
                  </Button>
                  <ToastContainer position="top-center" />
                </FormInputGroup>
              </form>
            </Form>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Editar
