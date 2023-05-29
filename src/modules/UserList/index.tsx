import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

import {
  ActionIcon,
  Button,
  MainWrapper,
  showSavedToast,
  Table,
  TableHeader,
  ToastContainer,
  TableBody,
  TableCell,
  TableRow,
} from '@components'
import { RoleTranslation, Theme } from '@utils/enums'
import { Fields, PageWrapper, Subtitle, Title } from '@styles/index.style'
import { Grid, Pagination } from '@mui/material'
import { PaginationType } from '../Egressos/types'
import EditAddUserModal from '../UserList/EditAddUserModal'
import { showErrorToast } from '@components/Toast'
import { User } from '@context/authContext'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const pageSize = 10

const EmailConfig = () => {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationType>({ page: 0, size: 0, total: 0 })
  const [currentUser, setCurrentUser] = useState<User>({} as User)
  const [show, setShow] = useState(false)
  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const getUsers = async page => {
    const response = await fetch(
      `${GRADUATE_API}/v1/users?` +
        new URLSearchParams({ page: (page - 1).toString(), pageSize: pageSize.toString() }),
      { credentials: 'include' } as RequestInit
    )
    if (response.status < 400) {
      const { data, meta } = await response.json()
      setUsers(data)
      setPagination(meta)
    }
  }

  const onSuccess = async () => {
    await getUsers(1)
    showSavedToast()
    setShow(false)
  }

  const onFail = () => {
    showErrorToast('Erro ao cadastrar/atualizar usuário')
  }
  const onChangePagination = async (event, value) => {
    await getUsers(value)
  }

  const setCurrentUserEmpty = () => {
    setCurrentUser({} as User)
  }

  const onClickEdit = (id: string) => {
    router.push(`usuarios/${id}`)
  }

  useEffect(() => {
    ;(async () => {
      await getUsers(1)
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Informações de Usuário</Title>
            </Grid>
            <Grid item xs={12} minHeight={510}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>
                      <Fields>Nome</Fields>
                    </TableCell>
                    <TableCell>
                      <Fields>Email</Fields>
                    </TableCell>
                    <TableCell>
                      <Fields>Papel do Usuário</Fields>
                    </TableCell>
                    <td>
                      <Fields></Fields>
                    </td>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Subtitle>{user.name}</Subtitle>
                      </TableCell>
                      <TableCell>
                        <Subtitle>{user.email}</Subtitle>
                      </TableCell>
                      <TableCell>
                        <Fields>
                          {user.roles.length === 1
                            ? RoleTranslation[user.roles[0]]
                            : RoleTranslation.multiple}
                        </Fields>
                      </TableCell>
                      <TableCell>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() => onClickEdit(user.id)}
                            icon={faPencilAlt}
                          />
                        </ActionIcon>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12}>
              {pagination && (
                <Pagination
                  count={Math.ceil(pagination.total / pageSize)}
                  page={pagination.page + 1}
                  onChange={onChangePagination}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      setCurrentUserEmpty()
                      handleShow()
                    }}
                  >
                    Criar Usuário
                  </Button>
                </Grid>
                <Grid item>
                  <Button size={'large'} variant={'outlined'} onClick={onClickBack}>
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <ToastContainer />
          </Grid>
        </PageWrapper>
      </MainWrapper>
      <EditAddUserModal
        onFail={onFail}
        onSuccess={onSuccess}
        currentUser={currentUser}
        show={show}
        handleClose={handleClose}
      />
    </>
  )
}

export default EmailConfig
