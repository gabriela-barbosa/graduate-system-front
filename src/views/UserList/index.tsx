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
  TBody,
  TD,
  TR,
} from '@components'
import { RoleTranslation, Theme } from '@utils/enums'
import { Fields, PageWrapper, Subtitle, Title } from '@styles/index.style'
import { Grid, Pagination } from '@mui/material'
import { PaginationType } from '@views/GraduatesList/types'
import EditAddUserModal from '@views/UserList/EditAddUserModal'
import { showErrorToast } from '@components/Toast'
import { User } from '@context/authContext'

interface Email {
  id?: string
  title: string
  name: string
  content: string
  buttonText: string
  buttonURL: string
  isGraduateEmail: boolean
  active: boolean
}

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const pageSize = 10

const EmailConfig = () => {
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationType>({ page: 0, size: 0, total: 0 })
  const [previousUser, setPreviousUser] = useState<Email>({
    buttonText: '',
    buttonURL: '',
    content: '',
    id: '',
    isGraduateEmail: false,
    name: '',
    title: '',
    active: false,
  })
  const [currentUser, setCurrentUser] = useState<Email>({
    buttonText: '',
    buttonURL: '',
    content: '',
    id: '',
    isGraduateEmail: false,
    name: '',
    title: '',
    active: false,
  })
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { id } = currentUser

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
    setCurrentUser({
      active: false,
      buttonText: '',
      buttonURL: '',
      content: '',
      isGraduateEmail: false,
      name: '',
      title: '',
      id: null,
    })
  }

  const handleSaveEmail = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(currentUser),
    }
    const result = await fetch(`${GRADUATE_API}/v1/email`, myInit as RequestInit)
    if (result) {
      await getUsers(1)
      showSavedToast()
      setShow(false)
      setCurrentUserEmpty()
    }
  }

  const handleUpdateInstitution = async () => {
    const myInit = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(currentUser),
    }
    const result = await fetch(`${GRADUATE_API}/v1/email/${id}`, myInit as RequestInit)
    if (result) {
      await getUsers(1)
      showSavedToast()
      setShow(false)
      setCurrentUserEmpty()
    }
  }

  const handlerOpenEdit = current => {
    setShow(true)
    setCurrentUser(current)
    setPreviousUser(current)
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
              <Title>Atualizar Informações do Usuário</Title>
            </Grid>
            <Grid item xs={12} minHeight={510}>
              <Table>
                <TableHeader>
                  <TR>
                    <TD>
                      <Fields>Nome</Fields>
                    </TD>
                    <TD>
                      <Fields>Email</Fields>
                    </TD>
                    <TD>
                      <Fields>Tipo</Fields>
                    </TD>
                    <td>
                      <Fields></Fields>
                    </td>
                  </TR>
                </TableHeader>
                <TBody>
                  {users?.map(user => (
                    <TR key={user.id}>
                      <TD>
                        <Subtitle>{user.name}</Subtitle>
                      </TD>
                      <TD>
                        <Subtitle>{user.email}</Subtitle>
                      </TD>
                      <TD>
                        <Fields>
                          {user.roles.length < 1
                            ? RoleTranslation[user.roles.length - 1]
                            : RoleTranslation.multiple}
                        </Fields>
                      </TD>
                      <TD>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() => handlerOpenEdit(user)}
                            icon={faPencilAlt}
                          />
                        </ActionIcon>
                      </TD>
                    </TR>
                  ))}
                </TBody>
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
