import React, { useEffect, useState } from 'react'
import {
  MainWrapper,
  Input,
  Select,
  Button,
  Table,
  TableHeader,
  TR,
  TD,
  TBody,
  ActionIcon,
} from '@components'
import { Theme } from '@utils/enums'

import { FormControl, Grid, Pagination } from '@mui/material'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { ListGraduatesFilters, PaginationType } from './types'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../../api/AuthProvider'

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
  const defaultInstitutionType = { id: 0, label: 'Nenhum tipo de instituição selecionado' }
  const router = useRouter()
  const { user } = useAuth()

  console.warn(user)

  const formContext = useForm()
  const { getValues, reset } = formContext

  const isValid = (value?: string) => value && value !== ''

  const getFilledFilters = (filters?: ListGraduatesFilters) => {
    const { name, institutionType, institutionName } = filters ?? {}
    const arrayFilter = []
    if (isValid(name)) arrayFilter.push(['name', name])
    // eslint-disable-next-line eqeqeq
    if (institutionType && institutionType !== '0')
      arrayFilter.push(['institutionType', institutionType])
    if (isValid(institutionName)) arrayFilter.push(['institutionName', institutionName])
    return arrayFilter
  }
  const getGraduates = async (page: number, filters?: ListGraduatesFilters) => {
    const filledFilters = getFilledFilters(filters)
    filledFilters.push(
      ['page', `${page - 1}`],
      ['pageSize', `${pageSize}`],
      ['currentRole', user?.currentRole]
    )
    const response = await fetch(
      `${GRADUATE_API}/v1/graduates?` + new URLSearchParams(filledFilters),
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

    if (response.status >= 400 && response.status < 600) {
      toast.error('Erro ao buscar tipos de insituição')
      return
    }
    const result = await response.json()

    setInstitutionTypes(result.map(({ name, id }) => ({ id, label: name })))
  }

  const onSend = async (data: ListGraduatesFilters) => {
    getGraduates(1, data)
  }
  useEffect(() => {
    getInstitutionTypes()
    getGraduates(1, null)
  }, [])

  const onClickEdit = graduate => {
    router.push(`/historico/${graduate.id}${graduate.workPlace ? '/' + graduate.workPlace.id : ''}`)
  }

  const onChangePagination = async (event, value) => {
    const filters = getValues() as ListGraduatesFilters
    await getGraduates(value, filters)
  }

  const onClickClean = async () => {
    reset()
    await getGraduates(1, null)
  }

  return (
    <MainWrapper themeName={Theme.white}>
      <PageWrapper
        spacing={2}
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Title>Listagem de Egressos</Title>
            </Grid>
            <Grid item>
              <FormContainer formContext={formContext} onSuccess={onSend}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Input label="Nome da instituição" name="institutionName" />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Select
                        name={'institutionType'}
                        label={'Tipo da instituição'}
                        options={[defaultInstitutionType, ...institutionTypes]}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Input label="Nome do egresso" name="name" />
                    </FormControl>
                  </Grid>
                  <Grid item alignSelf={'center'}>
                    <Button size={'large'} variant="contained" type="submit">
                      Buscar
                    </Button>
                  </Grid>
                  <Grid item alignSelf={'center'}>
                    <Button size={'large'} variant="outlined" onClick={onClickClean}>
                      Limpar
                    </Button>
                  </Grid>
                </Grid>
              </FormContainer>
            </Grid>
            <Grid item height={510}>
              <Table>
                <TableHeader>
                  <TR>
                    <TD>
                      <Fields>Nome</Fields>
                    </TD>
                    <TD>
                      <Fields>Status</Fields>
                    </TD>
                    <TD>
                      <Fields>Local de Trabalho</Fields>
                    </TD>
                    <TD>
                      <Fields>Tipo de Instituição</Fields>
                    </TD>
                    <TD>
                      <Fields>Cargo</Fields>
                    </TD>
                    <TD>
                      <Fields>Editar</Fields>
                    </TD>
                  </TR>
                </TableHeader>

                <TBody>
                  {graduates?.map(graduate => (
                    <TR key={graduate.id}>
                      <TD>
                        <Fields>{graduate.name}</Fields>
                      </TD>
                      <TD>
                        <Fields status={graduate.status}>{status[graduate.status]}</Fields>
                      </TD>
                      <TD>
                        <Fields>{graduate.workPlace?.name ?? '-'}</Fields>
                      </TD>
                      <TD>
                        <Fields>{graduate.workPlace?.type ?? '-'}</Fields>
                      </TD>
                      <TD>
                        <Fields>{graduate.position ?? '-'}</Fields>
                      </TD>
                      <TD>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() => onClickEdit(graduate)}
                            icon={faPencilAlt}
                          />
                        </ActionIcon>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </Grid>
          </Grid>
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
