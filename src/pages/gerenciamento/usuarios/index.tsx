import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { ActionIcon, Button, Input, MainWrapper, showSavedToast, ToastContainer } from '@components'
import { RoleTranslation, Routes, Theme, USER_TOKEN_NAME } from '@utils/enums'
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
import FormControl from '@mui/material/FormControl'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import { useForm } from 'react-hook-form'
import { FormContainer } from 'react-hook-form-mui'
import { toast } from 'react-toastify'
import { Breadcrumbs } from '@components/Breadcrumbs'

const pageSize = 10

interface Props {
  users: User[]
  meta: PaginationType
}

interface FormInfo {
  name?: string
  email?: string
}

const UserList = ({ users, meta }: Props) => {
  const apiClient = getAPIClient()
  const [usersList, setUsersList] = useState<User[]>(users)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [currentUser, setCurrentUser] = useState<User>({} as User)
  const [show, setShow] = useState(false)
  const router = useRouter()
  const formContext = useForm()
  const { getValues, reset } = formContext

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  useEffect(() => {
    setUsersList(users)
    setPagination(meta)
  }, [users, meta])

  const handleGetUsers = async (page: number, formInfo?: FormInfo) => {
    try {
      const { meta, data } = await getUsers(apiClient, page, pageSize, formInfo)
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
  const onChangePagination = async (event: any, value: number) => {
    const form = getValues()
    await handleGetUsers(value, form)
  }

  const setCurrentUserEmpty = () => setCurrentUser({} as User)

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

  const onSend = async (form: FormInfo) => {
    try {
      await handleGetUsers(1, form)
    } catch (e) {
      toast.error('Erro ao buscar usuários.')
    }
  }

  const onClean = async () => {
    reset()
    await handleGetUsers(1)
  }
  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper spacing={2} container direction="column">
          <Grid item>
            <Breadcrumbs
              breadcrumbs={[
                { name: 'Listagem de Egressos', href: Routes.GRADUATES },
                { name: 'Gerenciamento', href: Routes.MANAGEMENT },
                { name: 'Usuários' },
              ]}
            />
          </Grid>
          <Grid item xs={12}>
            <Title>Atualizar Informações de Usuário</Title>
          </Grid>
          <Grid item xs={12} minHeight={510}>
            <FormContainer formContext={formContext} onSuccess={onSend}>
              <Grid container spacing={3}>
                <Grid item sx={{ width: '350px' }}>
                  <FormControl fullWidth>
                    <Input variant="standard" label="Nome" name="name" />
                  </FormControl>
                </Grid>
                <Grid item sx={{ width: '350px' }}>
                  <FormControl fullWidth>
                    <Input variant="standard" label="Email" name="email" />
                  </FormControl>
                </Grid>
                <Grid item alignSelf={'center'}>
                  <Button size={'large'} variant="contained" type="submit">
                    <SearchRoundedIcon />
                  </Button>
                </Grid>
                <Grid item alignSelf={'center'}>
                  <Button size={'large'} variant="outlined" onClick={onClean}>
                    <ClearRoundedIcon />
                  </Button>
                </Grid>
                <Grid item>
                  {rows?.length !== 0 ? (
                    <CustomTable columns={columns} rows={rows} />
                  ) : (
                    <Fields>Nenhum resultado encontrado.</Fields>
                  )}
                </Grid>
              </Grid>
            </FormContainer>
          </Grid>
          <Grid item xs={12}>
            {pagination && rows?.length !== 0 && (
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
