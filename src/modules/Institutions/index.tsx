import React, { useEffect, useState } from 'react'
import { Theme } from '@utils/enums'
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Fields, PageWrapper, Subtitle, Title } from '@styles/index.style'
import {
  ActionIcon,
  Button,
  MainWrapper,
  showDeletedToast,
  showSavedToast,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  ToastContainer,
  TableRow,
} from '@components'
import { FormControl, Grid, TextField } from '@mui/material'

const GRADUATE_API = process.env.GRADUATE_API

const Institutions: React.FC = () => {
  const [institutionTypes, setInstitutionTypes] = useState([])
  const [currentInstitution, setCurrentInstitution] = useState({ id: null, value: '' })
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { id, value } = currentInstitution

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const getInstitutionTypes = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/institution/type`, {
      credentials: 'include',
    } as RequestInit)
    const result = await response.json()
    setInstitutionTypes(result)
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
    const response = await fetch(`${GRADUATE_API}/v1/institution/type/${id}`, myInit as RequestInit)
    if (response.status < 400) {
      await getInstitutionTypes()
      showDeletedToast()
    }
  }

  const handleSaveInstitution = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/institution/type`, myInit as RequestInit)
    if (result) {
      await getInstitutionTypes()
      showSavedToast()
      setShow(false)
      setCurrentInstitution({ id: null, value: '' })
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
      body: JSON.stringify({ name: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/institution/type/${id}`, myInit as RequestInit)
    if (result) {
      await getInstitutionTypes()
      showSavedToast()
      setShow(false)
      setCurrentInstitution({ id: null, value: '' })
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrentInstitution({ id, value })
  }

  useEffect(() => {
    ;(async () => {
      await getInstitutionTypes()
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Tipo de Instituição</Title>
            </Grid>
            <Grid item xs={12} height={510}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>
                      <Fields>Tipo de Instituição </Fields>
                    </TableCell>
                    <td>
                      <Fields></Fields>
                    </td>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {institutionTypes?.map(institutionType => (
                    <TableRow key={institutionType.id}>
                      <TableCell>
                        <Subtitle>{institutionType.name}</Subtitle>
                      </TableCell>
                      <TableCell>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() =>
                              handlerOpenEdit(institutionType.id, institutionType.name)
                            }
                            icon={faPencilAlt}
                          />
                          <FontAwesomeIcon
                            onClick={() => deleteInstitutionType(institutionType.id)}
                            className="trash-icon"
                            icon={faTrashAlt}
                          />
                        </ActionIcon>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      setCurrentInstitution({ id: null, value: '' })
                      handleShow()
                    }}
                  >
                    Adicionar Instituição
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
          <Fields>{id ? 'Editar' : 'Adicionar'} Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            <TextField
              value={value}
              required
              name={'institution'}
              label={'Instituição'}
              onChange={({ target }) =>
                setCurrentInstitution({ ...currentInstitution, value: target.value })
              }
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={'large'}
            variant={'contained'}
            onClick={id ? handleUpdateInstitution : handleSaveInstitution}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Institutions
