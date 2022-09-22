import React, { useEffect, useState } from 'react'
import MainWrapper from '../../components/MainWrapper'
import { Theme } from '../../utils/enums'
import { Fields, Icon, PageWrapper, Title } from './index.style'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import { Button } from '../Secretary/index.style'
import { Grid, Pagination } from '@mui/material'
import { PaginationType } from './types'

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
  const getGraduates = async (page: number) => {
    const response = await fetch(
      `${GRADUATE_API}/v1/graduates?` +
        new URLSearchParams({
          page: `${page - 1}`,
          pageSize: `${pageSize}`,
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
  useEffect(() => {
    getGraduates(1)
  }, [])

  const router = useRouter()
  const onClickEdit = (graduate: any) => {
    router.push(`/historico/${graduate.id}${graduate.workPlace ? '/' + graduate.workPlace.id : ''}`)
  }

  const onChangePagination = (event, value) => {
    getGraduates(value)
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

        <Button onClick={select}>Gerenciar Opções</Button>
      </PageWrapper>
    </MainWrapper>
  )
}

export default GraduateList
