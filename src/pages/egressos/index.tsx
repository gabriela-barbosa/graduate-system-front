import React, { useEffect, useState } from 'react'
import {
  ActionIcon,
  Button,
  Input,
  MainWrapper,
  Select,
  Grid,
  FormControl,
  Pagination,
  CustomTable as GraduatesTable,
  showErrorToast,
  EditRoundedIcon,
  SearchRoundedIcon,
  ClearRoundedIcon,
} from '@components'
import { Role, Theme, USER_TOKEN_NAME } from '@utils/enums'

import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title, TypographyTableCell } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { Graduate, HISTORY_STATUS, ListGraduatesFilters } from '@modules/Egressos/types'
import { parseCookies } from 'nookies'
import { getAPIClient } from '@services/axios'
import { getCNPQLevels } from '@modules/WorkHistoryEdit'
import { DEFAULT_PAGE_SIZE, PaginationType } from '@modules/Commons/types'
import { getGraduates } from '@modules/GraduatesList/api'
import { GraduatesListDetails } from '@modules/GraduatesList/types'
import { SelectItem } from '@utils/types'
import { useAuth } from '@context/AuthProvider'
import { getInstitutionTypesOptions } from '@modules/Commons/api'

const status = {
  [HISTORY_STATUS.PENDING]: 'Pendente',
  [HISTORY_STATUS.UPDATED]: 'Atualizado',
  [HISTORY_STATUS.UPDATED_PARTIALLY]: 'Atualizado parcialmente',
}

interface Props {
  graduates: Graduate[]
  institutionTypes: SelectItem[]
  meta: PaginationType
  cnpqLevels: SelectItem[]
}

const GraduateList = ({ meta, graduates, institutionTypes, cnpqLevels }: Props) => {
  const apiClient = getAPIClient()
  const [graduatesList, setGraduatesList] = useState<Graduate[]>(graduates)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const router = useRouter()
  const { currentRole } = useAuth()
  const isUserAdmin = currentRole === Role.ADMIN

  const formContext = useForm()
  const { getValues, reset } = formContext

  useEffect(() => {
    setGraduatesList(graduates)
    setPagination(meta)
  }, [graduates, meta])

  const onSend = async (data: ListGraduatesFilters) => {
    try {
      const { graduates: graduatesSend, meta: metaSend } = await getGraduates(apiClient, 1, data)
      setGraduatesList(graduatesSend)
      setPagination(metaSend)
    } catch (e) {
      showErrorToast('Erro ao buscar egressos.')
    }
  }

  const onClickEdit = graduate => {
    router.push(`/egressos/${graduate.userId}`)
  }

  const onChangePagination = async (event, value) => {
    const filters = getValues() as ListGraduatesFilters
    try {
      const { graduates: graduatesPagination, meta: metaPagination } = await getGraduates(
        apiClient,
        value,
        filters
      )
      setGraduatesList(graduatesPagination)
      setPagination(metaPagination)
    } catch (e) {
      showErrorToast('Erro ao buscar egressos.')
    }
  }

  const onClickClean = async () => {
    reset()
    try {
      const { graduates: graduatesClean, meta: metaClean } = await getGraduates(apiClient, 1)
      setGraduatesList(graduatesClean)
      setPagination(metaClean)
    } catch (e) {
      showErrorToast('Erro ao buscar egressos.')
    }
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Status' },
    { name: 'Último Local de Trabalho' },
    ...(!isUserAdmin ? [{ name: 'Tipo de Instituição' }] : []),
    { name: 'Último Cargo' },
    ...(isUserAdmin ? [{ name: 'Nome do orientador' }] : []),
    { name: 'Editar', width: '10%' },
  ]

  const rows = graduatesList?.map(graduate => {
    return [
      {
        body: graduate.name,
      },
      {
        body: (
          <TypographyTableCell status={graduate.status}>
            {status[graduate.status]}
          </TypographyTableCell>
        ),
      },
      {
        body: graduate.workPlace?.name ?? '-',
      },
      ...(!isUserAdmin ? [{ body: graduate.workPlace?.type ?? '-' }] : []),
      {
        body: graduate.position ?? '-',
      },
      ...(isUserAdmin ? [{ body: graduate.advisors.join(', ') ?? '-' }] : []),
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
      <PageWrapper container alignItems="center" justifyContent="center" direction="column">
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
                      <Input variant="standard" label="Nome do egresso" name="name" />
                    </FormControl>
                  </Grid>
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
                        options={institutionTypes}
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
                      <Input variant="standard" label="Cargo atual" name="position" />
                    </FormControl>
                  </Grid>
                  {isUserAdmin && (
                    <Grid
                      item
                      sx={{
                        width: '350px',
                      }}
                    >
                      <FormControl fullWidth>
                        <Input variant="standard" label="Nome do orientador" name="advisorName" />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid
                    item
                    sx={{
                      width: '350px',
                    }}
                  >
                    <FormControl fullWidth>
                      <Select
                        variant="standard"
                        name={'cnpqLevel'}
                        label={'Nível da bolsa CNPQ'}
                        options={cnpqLevels}
                      />
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
          <Grid item pt={2}>
            <Pagination
              count={Math.ceil(pagination.total / DEFAULT_PAGE_SIZE)}
              page={pagination.page + 1}
              onChange={onChangePagination}
            />
          </Grid>
        )}
      </PageWrapper>
    </MainWrapper>
  )
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

  const promises = [
    getGraduates(apiClient),
    getInstitutionTypesOptions(apiClient),
    getCNPQLevels(apiClient),
  ]
  const responses = await Promise.all(promises)
  const someResult = responses.some(item => 'response' in item && item.response?.status === 403)
  if (someResult)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const [graduatesResponse, institutionTypes, cnpqLevels] = responses

  const { graduates, meta } = graduatesResponse as GraduatesListDetails

  return {
    props: {
      graduates: graduates ?? [],
      meta,
      institutionTypes: institutionTypes ?? [],
      cnpqLevels: cnpqLevels ?? [],
    },
  }
}

export default GraduateList
