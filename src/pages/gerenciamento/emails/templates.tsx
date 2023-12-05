import React, { useState } from 'react'
import { useRouter } from 'next/router'

import {
  ActionIcon,
  Breadcrumbs,
  Button,
  CustomTable,
  DeleteForeverRoundedIcon,
  DeleteItem,
  DeleteModal,
  EditRoundedIcon,
  Grid,
  MainWrapper,
  Pagination,
  SendRoundedIcon,
  showDeletedToast,
  showErrorToast,
  showSavedToast,
  ToastContainer,
  Tooltip,
} from '@components'
import { Role, Routes, USER_TOKEN_NAME } from '@utils/enums'
import { PageWrapper, Title } from '@styles/index.style'
import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'
import { deleteEmail, getEmails, saveEmail, updateEmail } from '@modules/Emails/api'
import { Email } from '@modules/Emails/types'
import { PaginationType } from '@modules/Commons/types'
import EditModal from '@modules/Emails/EditModal'
import SendEmailModal from '@modules/Emails/SendEmailModal'

const pageSize = 10

interface Props {
  emails: Email[]
  meta: PaginationType
}

const EmailConfig = ({ emails, meta }: Props) => {
  const apiClient = getAPIClient()
  const [emailsList, setEmailsList] = useState<Email[]>(emails)
  const [pagination, setPagination] = useState<PaginationType>(meta)
  const [previousEmail, setPreviousEmail] = useState<Email>({
    buttonText: '',
    buttonURL: '',
    content: '',
    id: '',
    isGraduateEmail: false,
    name: '',
    title: '',
    active: false,
  })
  const [currentEmail, setCurrentEmail] = useState<Email>({
    buttonText: '',
    buttonURL: '',
    content: '',
    id: '',
    isGraduateEmail: false,
    name: '',
    title: '',
    active: false,
  })
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>({ id: undefined, value: undefined })
  const router = useRouter()

  const handleCloseEditModal = () => setIsEditModalOpen(false)
  const handleCloseSendModal = () => setIsSendModalOpen(false)
  const handleShowEdit = () => setIsEditModalOpen(true)
  const handleClickBack = () => {
    router.push('/gerenciamento')
  }

  const cleanEmailFields = () => {
    setCurrentEmail({
      active: false,
      buttonText: '',
      buttonURL: '',
      content: '',
      isGraduateEmail: false,
      name: '',
      title: '',
      id: undefined,
    })
  }

  const handleChangePagination = async (page: number) => {
    try {
      const { data, meta } = await getEmails(apiClient, pageSize, page)
      setEmailsList(data)
      setPagination(meta)
    } catch (error) {
      showErrorToast('Erro ao trocar de página')
    }
  }

  const handleDeleteEmail = async (id: string) => {
    try {
      await deleteEmail(apiClient, id)
      showDeletedToast()
      await router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema na deleção!')
    }
  }

  const handleSaveEmail = async (email: Email) => {
    try {
      await saveEmail(apiClient, email)
      showSavedToast()
      setIsEditModalOpen(false)
      cleanEmailFields()
      await router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema ao salvar.')
    }
  }

  const handleUpdateEmail = async (email: Email) => {
    try {
      await updateEmail(apiClient, email)
      showSavedToast()
      setIsEditModalOpen(false)
      cleanEmailFields()
      await router.replace(router.asPath)
    } catch (error) {
      showErrorToast('Ocorreu um problema ao atualizar email.')
    }
  }

  const handleOpenEdit = (current: Email) => {
    setCurrentEmail(current)
    setPreviousEmail(current)
    setIsEditModalOpen(true)
  }

  const handleOpenSendEmail = (current: Email) => {
    setCurrentEmail(current)
    setIsSendModalOpen(true)
  }

  const onClickDelete = (id: string | undefined, value: string) => {
    setDeleteItem({ id, value })
    setIsDeleteModalOpen(true)
  }

  const columns = [
    { name: 'Nome' },
    { name: 'Tipo do Email' },
    { name: 'Status' },
    { name: 'Ações' },
  ]

  const rows = emailsList?.map(email => {
    return [
      {
        body: email.name,
      },
      {
        body: email.isGraduateEmail ? 'Egresso' : 'Orientador',
      },
      {
        body: email.active ? 'Ativo' : 'Inativo',
      },
      {
        body: (
          <section>
            <Tooltip title="Enviar email">
              <ActionIcon onClick={() => handleOpenSendEmail(email)}>
                <SendRoundedIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip title="Editar template">
              <ActionIcon onClick={() => handleOpenEdit(email)}>
                <EditRoundedIcon />
              </ActionIcon>
            </Tooltip>
            {email.id && (
              <Tooltip title="Excluir template">
                <ActionIcon onClick={() => onClickDelete(email.id, email.name)}>
                  <DeleteForeverRoundedIcon />
                </ActionIcon>
              </Tooltip>
            )}
          </section>
        ),
      },
    ]
  })

  return (
    <MainWrapper>
      <PageWrapper container rowSpacing={2}>
        <Grid item>
          <Breadcrumbs
            breadcrumbs={[
              { name: 'Listagem de Egressos', href: Routes.GRADUATES },
              { name: 'Gerenciamento', href: Routes.MANAGEMENT },
              { name: 'Informações de Conteúdo de Emails' },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Title>Atualizar Informações de Conteúdo de Emails</Title>
        </Grid>
        <Grid item xs={12}>
          <CustomTable columns={columns} rows={rows} />
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="right">
            {pagination && (
              <Grid item position="absolute" left="50%" xs={12}>
                <Pagination
                  count={Math.ceil(pagination.total / pageSize)}
                  page={pagination.page + 1}
                  onChange={event => handleChangePagination(event.target as unknown as number)}
                />
              </Grid>
            )}
            <Grid item xs>
              <Grid container columnSpacing={2} justifyContent="right">
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      cleanEmailFields()
                      handleShowEdit()
                    }}
                  >
                    Adicionar Novo Conteúdo
                  </Button>
                </Grid>
                <Grid item justifyContent="center">
                  <Button size={'large'} variant={'outlined'} onClick={handleClickBack}>
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <ToastContainer />
      </PageWrapper>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        handleDelete={handleDeleteEmail}
        id={deleteItem.id}
        value={deleteItem.value}
      />
      <EditModal
        handleClose={handleCloseEditModal}
        isShowing={isEditModalOpen}
        currentEmail={currentEmail}
        previousEmail={previousEmail}
        handleUpdate={handleUpdateEmail}
        handleSave={handleSaveEmail}
        setCurrentEmail={setCurrentEmail}
      />
      <SendEmailModal
        handleClose={handleCloseSendModal}
        isShowing={isSendModalOpen}
        role={currentEmail.isGraduateEmail ? Role.GRADUATE : Role.PROFESSOR}
        currentEmail={currentEmail}
      />
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
  const { data, meta } = await getEmails(apiClient, pageSize)

  return {
    props: {
      emails: data ?? [],
      meta: meta ?? {},
    },
  }
}

export default EmailConfig
