import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { ActionIcon, Button, MainWrapper, showSavedToast, ToastContainer } from '@components'
import { RoleTranslation, Theme, USER_TOKEN_NAME } from '@utils/enums'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import { Grid, Pagination } from '@mui/material'
import { showErrorToast } from '@components/Toast'
import { User } from '@context/AuthContext'
import { PaginationType } from '@modules/Commons/types'
import EditAddUserModal from '@modules/UserList/EditAddUserModal'
import { CustomTable } from '@components/Table'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { getUsers } from '@modules/UserList/api'
import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'

const pageSize = 10

interface Props {
  users: User[]
  meta: PaginationType
}
const UserList = ({ users, meta }: Props) => {
  const apiClient = getAPIClient()
  const [usersList, setUsersList] = useState<User[]>(users)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [currentUser, setCurrentUser] = useState<User>({} as User)
  const [show, setShow] = useState(false)
  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  useEffect(() => {
    setUsersList(users)
    setPagination(meta)
  }, [users, meta])

  const handleGetUsers = async (page: number) => {
    try {
      const { meta, data } = await getUsers(apiClient, page, pageSize)
      setUsersList(data)
      setPagination(meta)
    } catch (e) {
      showErrorToast('Erro ao buscar usuários.')
    }
  }

  const onSuccess = async () => {
    await handleGetUsers(1)
    showSavedToast()
    setShow(false)
  }

  const onFail = () => {
    showErrorToast('Erro ao cadastrar/atualizar usuário')
  }
  const onChangePagination = async (event, value) => {
    await handleGetUsers(value)
  }

  const setCurrentUserEmpty = () => {
    setCurrentUser({} as User)
  }

  const handleClickEdit = (id: string) => {
    router.push(`usuarios/${id}`)
  }

  const columns = [
    {
      name: 'Nome',
    },
    {
      name: 'Email',
    },
    {
      name: 'Papel do Usuário',
    },
    {
      name: 'Ações',
    },
  ]

  const rows = usersList?.map(user => [
    { body: user.name },
    { body: user.email },
    {
      body: (
        <Fields>
          {user.roles.length === 1 ? RoleTranslation[user.roles[0]] : RoleTranslation.multiple}
        </Fields>
      ),
    },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handleClickEdit(user.id)}>
            <EditRoundedIcon />
          </ActionIcon>
        </section>
      ),
    },
  ])
  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Informações de Usuário</Title>
            </Grid>
            <Grid item xs={12} minHeight={510}>
              <CustomTable columns={columns} rows={rows} />
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
  const { data, meta } = await getUsers(apiClient)
  return {
    props: {
      users: data ?? [],
      meta,
    },
  }
}

export default UserList
