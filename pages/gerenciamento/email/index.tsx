import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import 'react-toastify/dist/ReactToastify.css'

import {
  ActionIcon,
  Button,
  MainWrapper,
  showDeletedToast,
  showSavedToast,
  Table,
  TableHeader,
  ToastContainer,
  TBody,
  TD,
  TR,
} from '@components'
import { Theme } from '@utils/enums'
import { Fields, PageWrapper, Subtitle, Title } from '@styles/index.style'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Pagination,
  TextField,
} from '@mui/material'
import { PaginationType } from '@views/GraduatesList/types'
import { toast } from 'react-toastify'

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
  const [emails, setEmails] = useState([])
  const [pagination, setPagination] = useState<PaginationType>({ page: 0, size: 0, total: 0 })

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
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { id } = currentEmail

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }
  const getEmails = async page => {
    const response = await fetch(
      `${GRADUATE_API}/v1/emails?` +
        new URLSearchParams({ page: (page - 1).toString(), pageSize: pageSize.toString() }),
      { credentials: 'include' } as RequestInit
    )
    if (response.status < 400) {
      const { data, meta } = await response.json()
      setEmails(data)
      setPagination(meta)
    }
  }
  const onChangePagination = async (event, value) => {
    await getEmails(value)
  }

  const deleteInstitutionType = async (id: string) => {
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/email/${id}`, myInit as RequestInit)
    if (response.status < 400) {
      await getEmails(1)
      showDeletedToast()
      return
    }
    toast('Ocorreu um problema na deleção!')
  }

  const setCurrentEmailEmpty = () => {
    setCurrentEmail({
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
      body: JSON.stringify(currentEmail),
    }
    const result = await fetch(`${GRADUATE_API}/v1/email`, myInit as RequestInit)
    if (result) {
      await getEmails(1)
      showSavedToast()
      setShow(false)
      setCurrentEmailEmpty()
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
      body: JSON.stringify(currentEmail),
    }
    const result = await fetch(`${GRADUATE_API}/v1/email/${id}`, myInit as RequestInit)
    if (result) {
      await getEmails(1)
      showSavedToast()
      setShow(false)
      setCurrentEmailEmpty()
    }
  }

  const handlerOpenEdit = current => {
    setShow(true)
    setCurrentEmail(current)
  }

  useEffect(() => {
    ;(async () => {
      await getEmails(1)
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Informações do Email</Title>
            </Grid>
            <Grid item xs={12} height={510}>
              <Table>
                <TableHeader>
                  <TR>
                    <TD>
                      <Fields>Nome</Fields>
                    </TD>
                    <TD>
                      <Fields>Email para egresso?</Fields>
                    </TD>
                    <TD>
                      <Fields>Status</Fields>
                    </TD>
                    <td>
                      <Fields></Fields>
                    </td>
                  </TR>
                </TableHeader>
                <TBody>
                  {emails?.map(email => (
                    <TR key={email.id}>
                      <TD>
                        <Subtitle>{email.name}</Subtitle>
                      </TD>
                      <TD>
                        <Subtitle>{email.isGraduateEmail ? 'Sim' : 'Não'}</Subtitle>
                      </TD>
                      <TD>
                        <Fields>{email.active ? 'Ativo' : 'Inativo'}</Fields>
                      </TD>
                      <TD>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() => handlerOpenEdit(email)}
                            icon={faPencilAlt}
                          />
                          <FontAwesomeIcon
                            onClick={() => deleteInstitutionType(email.id)}
                            className="trash-icon"
                            icon={faTrashAlt}
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
                      setCurrentEmailEmpty()
                      handleShow()
                    }}
                  >
                    Adicionar Novo Email
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{id ? 'Editar' : 'Adicionar'} Email</Fields>
        </Modal.Header>
        <Modal.Body>
          <Grid container rowSpacing={4}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.name}
                  disabled={!!id}
                  required
                  name={'name'}
                  label={'Nome do email'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, name: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.title}
                  required
                  name={'title'}
                  label={'Título'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, title: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.content}
                  required
                  name={'content'}
                  label={'Conteúdo'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, content: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.buttonText}
                  required
                  name={'buttonText'}
                  label={'Texto do Botão'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, buttonText: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  value={currentEmail.buttonURL}
                  required
                  name={'buttonURL'}
                  label={'URL do botão'}
                  onChange={({ target }) =>
                    setCurrentEmail({ ...currentEmail, buttonURL: target.value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={'active'}
                      disabled={currentEmail.active}
                      checked={currentEmail.active}
                      onChange={() =>
                        setCurrentEmail({
                          ...currentEmail,
                          active: !currentEmail.active,
                        })
                      }
                    />
                  }
                  label="Email ativo?"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={'isGraduateEmail'}
                      checked={currentEmail.isGraduateEmail}
                      disabled={!!id}
                      onChange={() =>
                        setCurrentEmail({
                          ...currentEmail,
                          isGraduateEmail: !currentEmail.isGraduateEmail,
                        })
                      }
                    />
                  }
                  label="Email para egresso?"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={'large'}
            variant={'contained'}
            onClick={id ? handleUpdateInstitution : handleSaveEmail}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EmailConfig
