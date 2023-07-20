import React, { useState } from 'react'
import { MainWrapper, Input, Select, Button, ActionIcon } from '@components'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import { FormControl, Grid, Pagination } from '@mui/material'

import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { ListGraduatesFilters, PaginationType } from '@modules/Egressos/types'
import GraduatesTable from '@modules/Egressos/GraduatesTable'
import { parseCookies } from 'nookies'
import { getAPIClient } from '../../services/axios'
import { AxiosInstance } from 'axios'
import { getInstitutionTypes } from '@modules/WorkHistoryEdit'

const pageSize = 10

const status = {
  PENDING: 'Pendente',
  UPDATED: 'Atualizado',
  UPDATED_PARTIALLY: 'Atualizado parcialmente',
  UNKNOWN: 'Desconhecido',
}

const isValid = (value?: string) => value && value !== ''

const getFilledFilters = (filters?: ListGraduatesFilters) => {
  const { name, institutionType, institutionName } = filters ?? {}
  const arrayFilter: string[][] = []
  if (isValid(name)) arrayFilter.push(['name', name as string])
  // eslint-disable-next-line eqeqeq
  if (institutionType && institutionType !== '0')
    arrayFilter.push(['institutionType', institutionType])
  if (isValid(institutionName)) arrayFilter.push(['institutionName', institutionName as string])
  return arrayFilter
}

interface GraduatesListDetails {
  graduates: any[]
  meta: PaginationType
}

const getGraduates = async (
  apiClient: AxiosInstance,
  page = 1,
  filters?: ListGraduatesFilters
): Promise<GraduatesListDetails> => {
  try {
    const filledFilters = getFilledFilters(filters)
    filledFilters.push(['page', `${page - 1}`], ['pageSize', `${pageSize}`])
    const { data } = await apiClient.get('/v1/graduates?' + new URLSearchParams(filledFilters))

    const { data: graduates, meta } = data
    return {
      graduates,
      meta,
    }
  } catch (error) {
    toast.error('Erro ao buscar egressos.')
    return {
      graduates: [],
      meta: {} as PaginationType,
    }
  }
}

interface Props {
  graduates: any[]
  institutionTypes: any[]
  meta: any
}

const GraduateList = ({ meta, graduates = [], institutionTypes = [] }: Props) => {
  console.log('crlhhhhhhhhhhh')
  const apiClient = getAPIClient()

  const [graduatesList, setGraduatesList] = useState(graduates)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const defaultInstitutionType = { id: 0, label: 'Nenhum tipo de instituição selecionado' }
  const router = useRouter()

  const formContext = useForm()
  const { getValues, reset } = formContext

  // const getGraduates = async (page: number, filters?: ListGraduatesFilters) => {
  //   const filledFilters = getFilledFilters(filters)
  //   filledFilters.push(['page', `${page - 1}`], ['pageSize', `${pageSize}`])
  //   const response = await fetch(
  //     `${GRADUATE_API}/v1/graduates?` + new URLSearchParams(filledFilters),
  //     {
  //       credentials: 'include',
  //     }
  //   )
  //   if (response.status === 200) {
  //     const result = await response.json()
  //     setGraduates(result.data)
  //     setPagination(result.meta)
  //   }
  // }

  const onSend = async (data: ListGraduatesFilters) => {
    const { graduates: graduatesSend, meta: metaSend } = await getGraduates(apiClient, 1, data)
    setGraduatesList(graduatesSend)
    setPagination(metaSend)
  }

  const onClickEdit = graduate => {
    router.push(`/egressos/${graduate.userId}`)
  }

  const onChangePagination = async (event, value) => {
    const filters = getValues() as ListGraduatesFilters
    const { graduates: graduatesPagination, meta: metaPagination } = await getGraduates(
      apiClient,
      value,
      filters
    )
    setGraduatesList(graduatesPagination)
    setPagination(metaPagination)
  }

  const onClickClean = async () => {
    reset()
    const { graduates: graduatesClean, meta: metaClean } = await getGraduates(apiClient, 1)
    setGraduatesList(graduatesClean)
    setPagination(metaClean)
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Status' },
    { name: 'Último Local de Trabalho' },
    { name: 'Tipo de Instituição' },
    { name: 'Último Cargo' },
    { name: 'Editar', width: '10%' },
  ]

  const rows = graduatesList?.map(graduate => {
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

// export async function getServerSideProps(ctx) {
//   console.log('entrei no server side')
//
//   const apiClient = getAPIClient(ctx)
//
//   const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)
//   console.log('token', token)
//   if (!token) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }
//
//   const promises = [getGraduates(apiClient), getInstitutionTypes(apiClient)]
//
//   console.log('criei promises')
//
//   const responses = await Promise.all(promises)
//
//   console.log('retornei promises')
//
//   const someResult = responses.some(item => 'response' in item && item.response?.status === 403)
//   if (someResult)
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//
//   const [graduatesResponse, institutionTypes] = responses
//
//   const { graduates, meta } = graduatesResponse as GraduatesListDetails
//
//   console.log(graduates)
//   return {
//     props: {
//       graduates: graduates ?? [],
//       meta,
//       institutionTypes,
//     },
//   }
// }

export default GraduateList
