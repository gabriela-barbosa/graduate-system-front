import React, { useEffect, useState } from 'react'
import {
  MainWrapper,
  Input,
  Select,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  ActionIcon,
} from '@components'
import { Theme } from '@utils/enums'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import Paper from '@mui/material/Paper'

import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import { FormControl, Grid, Pagination } from '@mui/material'

import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { FormContainer } from 'react-hook-form-mui'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '@api/AuthProvider'
import TableContainer from '@mui/material/TableContainer'
import { ListGraduatesFilters, PaginationType } from '../../src/modules/Egressos/types'

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
              <TableContainer component={Paper}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell align="left">
                        <Fields>Nome</Fields>
                      </TableCell>
                      <TableCell align="left">
                        <Fields>Status</Fields>
                      </TableCell>
                      <TableCell align="left">
                        <Fields>Local de Trabalho</Fields>
                      </TableCell>
                      <TableCell align="left">
                        <Fields>Tipo de Instituição</Fields>
                      </TableCell>
                      <TableCell align="left">
                        <Fields>Cargo</Fields>
                      </TableCell>
                      <TableCell align="left">
                        <Fields>Editar</Fields>
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {graduates?.map(graduate => (
                      <TableRow key={graduate.id}>
                        <TableCell align="left">
                          <Fields>{graduate.name}</Fields>
                        </TableCell>
                        <TableCell align="left">
                          <Fields status={graduate.status}>{status[graduate.status]}</Fields>
                        </TableCell>
                        <TableCell align="left">
                          <Fields>{graduate.workPlace?.name ?? '-'}</Fields>
                        </TableCell>
                        <TableCell align="left">
                          <Fields>{graduate.workPlace?.type ?? '-'}</Fields>
                        </TableCell>
                        <TableCell align="left">
                          <Fields>{graduate.position ?? '-'}</Fields>
                        </TableCell>
                        <TableCell width="10%" align="left">
                          <ActionIcon onClick={() => onClickEdit(graduate)}>
                            <EditRoundedIcon />
                          </ActionIcon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
