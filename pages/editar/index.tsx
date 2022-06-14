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
  FormEditar,
  Label2,
  Checkbox,
  LabelCheckbox,
  FormInputGroupEdit,
  Select,
} from './index.style'
import MainHeader from '../../src/components/MainHeader'
import { useAuth } from '../api/AuthProvider'
import { useRouter } from 'next/router'
import {
  Column,
  FormInputGroup,
  FormLogin,
  Input,
  Label,
  CheckboxLabel,
  Section,
  Row,
} from '../../src/styles/index.style'
const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Editar: React.FC = () => {
  const notify = () => toast.success('Alteração salva com sucesso!')
  const [hasInstitutionalLink, setHasInstitutionalLink] = useState(false)
  const [possuiVinculo, setPossuiVinculo] = useState('')
  const [bolsistaCNPQ, setBolsistaCNPQ] = useState('')
  const [concluiuMestrado, setConcluiuMestrado] = useState('')
  const [concluiuDoutorado, setConcluiuDoutorado] = useState('')
  const [concluiuPosDoutorado, setConcluiuPosDoutorado] = useState('')
  const [institutionTypes, setInstitutionTypes] = useState([])
  const ehDoutor = true
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
            <Title>Edite seus Dados</Title>
            <FormLogin>
              <form className="formEditar" onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <Column>
                    <Section>
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
                    </Section>
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
                      {hasInstitutionalLink && (
                        <Fragment>
                          <Row>
                            <LabelCheckbox htmlFor="institutionType">
                              Tipo de Instituição
                            </LabelCheckbox>
                            <Select id="institutionType" name="institutionType">
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
                              {...register('institutionName', { required: true })}
                            />
                            <Label htmlFor="institutionName">Local de Trabalho</Label>
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
                  </Column>
                  <Column>
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
                        id="hasCNPQScholarship"
                        {...register('hasCNPQScholarship')}
                      />
                      <CheckboxLabel htmlFor="hasCNPQScholarship">
                        Concluiu o doutorado da PGC/UFF?
                      </CheckboxLabel>

                      <input
                        className="radioInput2"
                        type="radio"
                        id="concluiu"
                        name="fav_language3"
                        value="Concluiu doutorado"
                        onChange={e => setConcluiuDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="concluiu">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="naoConcluiu"
                        name="fav_language3"
                        value="Nao concluiu doutorado"
                        onChange={e => setConcluiuDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="naoConcluiu">
                        Não{' '}
                      </label>
                      <Label2 style={!ehDoutor ? { display: 'block' } : { display: 'none' }}>
                        Concluiu o doutorado da PGC/UFF ?
                      </Label2>
                      <Label2 style={ehDoutor ? { display: 'block' } : { display: 'none' }}>
                        Concluiu o mestrado da PGC ou CAA - UFF ?
                      </Label2>
                    </Section>
                    <FormInputGroup>
                      <input
                        className="radioInput2"
                        type="radio"
                        id="posdoc"
                        name="fav_language4"
                        value="Concluiu doutorado"
                        onChange={e => setConcluiuPosDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="posdoc">
                        Sim
                      </label>
                      <input
                        className="radioInput"
                        type="radio"
                        id="naoposdoc"
                        name="fav_language4"
                        value="Nao concluiu doutorado"
                        onChange={e => setConcluiuPosDoutorado(e.target.value)}
                        required
                      />
                      <label className="radioLabel" htmlFor="naoposdoc">
                        Não{' '}
                      </label>
                      <Label2>Tem pós-doutorado ?</Label2>
                    </FormInputGroup>
                  </Column>
                </div>
                <FormInputGroup>
                  <Button onClick={notify} type="submit">
                    Salvar Alterações
                  </Button>
                  <ToastContainer position="top-center" />
                </FormInputGroup>
              </form>
            </FormLogin>
          </Content>
        </Background>
      </MainWrapper>
    </>
  )
}

export default Editar
