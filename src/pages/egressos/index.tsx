import React, { useEffect, useState } from 'react'
import { MainWrapper, Input, Select, Button, ActionIcon } from '@components'
import { Role, Theme, USER_TOKEN_NAME } from '@utils/enums'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import { FormControl, Grid, Pagination } from '@mui/material'

import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '@context/AuthProvider'
import { ListGraduatesFilters, PaginationType } from '@modules/Egressos/types'
import GraduatesTable from '@modules/Egressos/GraduatesTable'
import { parseCookies } from 'nookies'
import { api } from '../../services/api'
import { getAPIClient } from '../../services/axios'
import { AxiosInstance } from 'axios'

const pageSize = 10

const GRADUATE_API = process.env.GRADUATE_API

const status = {
  PENDING: 'Pendente',
  UPDATED: 'Atualizado',
  UPDATED_PARTIALLY: 'Atualizado parcialmente',
  UNKNOWN: 'Desconhecido',
}

const GraduateList = ({ meta, graduates, institutionTypes }) => {
  const [graduatesOld, setGraduates] = useState([])
  const [pagination, setPagination] = useState<PaginationType>()
  const defaultInstitutionType = { id: 0, label: 'Nenhum tipo de instituição selecionado' }
  const router = useRouter()
  const { user } = useAuth()

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

  const onSend = async (data: ListGraduatesFilters) => {
    getGraduates(1, data)
  }
  useEffect(() => {
    getGraduates(1, null)
  }, [])

  const onClickEdit = graduate => {
    router.push(`/egressos/${graduate.userId}`)
  }

  const onChangePagination = async (event, value) => {
    const filters = getValues() as ListGraduatesFilters
    await getGraduates(value, filters)
  }

  const onClickClean = async () => {
    reset()
    await getGraduates(1, null)
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Status' },
    { name: 'Último Local de Trabalho' },
    { name: 'Tipo de Instituição' },
    { name: 'Último Cargo' },
    { name: 'Editar', width: '10%' },
  ]

  const rows = graduates.map(graduate => {
    return [
      {
        body: graduate.name,
      },
      {
        body: <Fields status={graduate.status}>{status[graduate.status]}</Fields>,
      },
      {
        body: graduate.workPlace?.name ?? '-',
      },
      {
        body: graduate.workPlace?.type ?? '-',
      },
      {
        body: graduate.position ?? '-',
      },
      {
        body: (
          <ActionIcon onClick={() => onClickEdit(graduate)}>
            <EditRoundedIcon />
          </ActionIcon>
        ),
        width: '10%',
      },
    ]
  })

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
            <Grid item sx={{ paddingBottom: '20px' }}>
              <FormContainer formContext={formContext} onSuccess={onSend}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Input
                        variant="standard"
                        label="Nome da instituição"
                        name="institutionName"
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        name={'institutionType'}
                        label={'Tipo da instituição'}
                        options={[defaultInstitutionType, ...institutionTypes]}
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Input variant="standard" label="Nome do egresso" name="name" />
                    </FormControl>
                  </Grid>
                  <Grid item alignSelf={'center'}>
                    <Button size={'large'} variant="contained" type="submit">
                      <SearchRoundedIcon />
                    </Button>
                  </Grid>
                  <Grid item alignSelf={'center'}>
                    <Button size={'large'} variant="outlined" onClick={onClickClean}>
                      <ClearRoundedIcon />
                    </Button>
                  </Grid>
                </Grid>
              </FormContainer>
            </Grid>
            <Grid item>
              {rows?.length !== 0 ? (
                <GraduatesTable columns={columns} rows={rows} />
              ) : (
                <Fields>Nenhum resultado encontrado.</Fields>
              )}
            </Grid>
          </Grid>
        </Grid>
        {pagination && rows?.length !== 0 && (
          <Grid item>
            <Pagination
              count={Math.ceil(pagination.total / pageSize)}
              page={pagination.page + 1}
              onChange={onChangePagination}
            />
          </Grid>
        )}
      </PageWrapper>
    </MainWrapper>
  )
}

const getInstitutionTypes = async (apiClient: AxiosInstance) => {
  const { data, status } = await apiClient.get(`/v1/institution/type`)

  if (status >= 400 && status < 600) {
    toast.error('Erro ao buscar tipos de insituição')
    return
  }

  return data.map(({ name, id }) => ({ id, label: name }))
}

const getGraduates = async (apiClient: AxiosInstance) => {
  const { data, status } = await apiClient.get(
    '/v1/graduates?' +
      new URLSearchParams({
        page: '0',
        pageSize: `${pageSize}`,
      })
  )
  if (status === 200) {
    const { data: graduates, meta } = data
    return {
      graduates,
      meta,
    }
  }

  return {
    graduates: {},
    meta: {},
  }
}

export async function getServerSideProps(ctx) {
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

  const promisses = [getGraduates(apiClient), getInstitutionTypes(apiClient)]

  const [{ graduates, meta }, institutionTypes] = await Promise.all(promisses)

  return {
    props: {
      graduates,
      meta,
      institutionTypes,
    },
  }
}

export default GraduateList
