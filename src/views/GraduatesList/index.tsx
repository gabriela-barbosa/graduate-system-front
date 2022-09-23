import React, { useEffect, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Theme } from '../../utils/enums'
import { Fields, Icon, PageWrapper, Title } from './index.style'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { Grid, Pagination } from '@mui/material'
import { ListGraduatesFilters, PaginationType } from './types'
import {
  Button,
  FormInputGroupEdit,
  InputEditar,
  LabelSelect,
  Select,
} from '../WorkHistoryEdit/index.style'
import { Label } from '../../styles/index.style'
import { useForm } from 'react-hook-form'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const pageSize = 10

const status = {
  PENDING: 'Pendente',
  UPDATED: 'Atualizado',
  UPDATED_PARTIALLY: 'Atualizado parcialmente',
  UNKNOWN: 'Desconhecido',
}

const GraduateList: React.FC = () => {
  const [graduates, setGraduates] = useState([])
  const [pagination, setPagination] = useState<PaginationType>()
  const [institutionTypes, setInstitutionTypes] = useState([])

  const router = useRouter()
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm()

  const isValid = (value?: string) => value !== ''

  const getFilledFilters = (filters?: ListGraduatesFilters) => {
    const { name, institutionType, institutionName } = filters ?? {}
    const filter = {}
    if (isValid(name)) filter.name = name
    if (institutionType && institutionType != 0) filter.institutionType = institutionType
    if (isValid(institutionName)) filter.institutionName = institutionName
    return filter
  }
  const getGraduates = async (page: number, filters?: ListGraduatesFilters) => {
    const response = await fetch(
      `${GRADUATE_API}/v1/graduates?` +
        new URLSearchParams({
          page: `${page - 1}`,
          pageSize: `${pageSize}`,
          ...getFilledFilters(filters),
        }),
      {
        credentials: 'include',
      }
    )
    if (response.status === 200) {
      const result = await response.json()
      setGraduates(result.data)
      setPagination(result.meta)
    }
  }
  const getInstitutionTypes = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
      credentials: 'include',
    })
    const result = await response.json()
    setInstitutionTypes(result)
  }

  const onSend = async (data: ListGraduatesFilters) => {
    console.warn(data)
    getGraduates(1, data)
  }
  useEffect(() => {
    getInstitutionTypes()
    getGraduates(1, null)
  }, [])

  const onClickEdit = (graduate: any) => {
    router.push(`/historico/${graduate.id}${graduate.workPlace ? '/' + graduate.workPlace.id : ''}`)
  }

  const onChangePagination = (event, value) => {
    const filters = getValues() as ListGraduatesFilters
    getGraduates(value, filters)
  }

  const select = () => {
    router.push('/select')
  }

  return (
    <MainWrapper themeName={Theme.white} hasContent={true}>
      {/* <div className="contentSelect"> */}
      <PageWrapper
        spacing={2}
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item>
          <Title>Listagem de Egressos</Title>

          <div>
            <form onSubmit={handleSubmit(onSend)}>
              <Grid container>
                <Grid item xs={4}>
                  <FormInputGroupEdit>
                    <InputEditar
                      placeholder="Nome da instituição"
                      {...register('institutionName')}
                    />
                    <Label htmlFor="institutionName">Nome da instituição</Label>
                  </FormInputGroupEdit>
                </Grid>
                <Grid item xs={6}>
                  <FormInputGroupEdit>
                    <LabelSelect htmlFor="institutionType">Tipo de Instituição</LabelSelect>
                    <Select {...register('institutionType')}>
                      <option key={0} value={0}>
                        Nenhum tipo de instituição selecionado
                      </option>
                      {institutionTypes.map((institutionType: any) => (
                        <option key={institutionType.id} value={institutionType.id}>
                          {institutionType.name}
                        </option>
                      ))}
                    </Select>
                  </FormInputGroupEdit>
                </Grid>
                <Grid item xs={4}>
                  <FormInputGroupEdit>
                    <InputEditar placeholder="Nome do egresso" {...register('name')} />
                    <Label htmlFor="name">Nome do egresso</Label>
                  </FormInputGroupEdit>
                </Grid>
                <Grid item xs={2}>
                  <Button type="submit">Buscar</Button>
                </Grid>
              </Grid>
            </form>
          </div>
          <div style={{ height: 500 }}>
            <table>
              <thead>
                <tr className="table-header">
                  <td>
                    <Fields>Nome</Fields>
                  </td>
                  <td>
                    <Fields>Status</Fields>
                  </td>
                  <td>
                    <Fields>Local de Trabalho</Fields>
                  </td>
                  <td>
                    <Fields>Cargo</Fields>
                  </td>
                  <td>
                    <Fields>Editar</Fields>
                  </td>
                </tr>
              </thead>

              <tbody>
                {graduates?.map((graduate: any) => (
                  <tr key={graduate.id}>
                    <td>
                      <Fields>{graduate.name}</Fields>
                    </td>
                    <td>
                      <Fields status={graduate.status}>{status[graduate.status]}</Fields>
                    </td>
                    <td>
                      <Fields>{graduate.workPlace ? graduate.workPlace.name : '-'}</Fields>
                    </td>
                    <td>
                      <Fields>{graduate.position ?? '-'}</Fields>
                    </td>
                    <td>
                      <Icon>
                        <FontAwesomeIcon onClick={() => onClickEdit(graduate)} icon={faPencilAlt} />
                      </Icon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Grid>
        <Grid item>
          {pagination && (
            <Pagination
              count={Math.ceil(pagination.total / pageSize)}
              page={pagination.page + 1}
              onChange={onChangePagination}
            />
          )}
        </Grid>
      </PageWrapper>
    </MainWrapper>
  )
}

export default GraduateList
