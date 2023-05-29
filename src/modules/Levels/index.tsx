import React, { useEffect, useState } from 'react'
import { Theme } from '@utils/enums'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
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

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Levels: React.FC = () => {
  const [cnpqLevels, setCnpqLevels] = useState([])
  const [currentLevel, setCurrentLevel] = useState({ id: null, value: '' })
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { id, value } = currentLevel

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const getCnpqLevels = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevels`, {
      credentials: 'include',
    })
    const result = await response.json()
    setCnpqLevels(result)
  }

  const deleteCnpqLevel = async (id: string) => {
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/cnpqlevel/${id}`, myInit as RequestInit)
    if (response.status < 400) {
      await getCnpqLevels()
      showDeletedToast()
    }
  }

  const handleSaveCnpq = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ level: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevel`, myInit as RequestInit)
    if (result) {
      await getCnpqLevels()
      showSavedToast()
      setShow(false)
      setCurrentLevel({ id: null, value: '' })
    }
  }

  const handleUpdateCnpq = async () => {
    const myInit = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ level: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevel/${id}`, myInit as RequestInit)
    if (result) {
      await getCnpqLevels()
      showSavedToast()
      setShow(false)
      setCurrentLevel({ id: null, value: '' })
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrentLevel({ id, value })
  }

  useEffect(() => {
    ;(async () => {
      await getCnpqLevels()
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Níveis CNPQ</Title>
            </Grid>
            <ToastContainer />
            <Grid item xs={12} height={510}>
              <Table>
                <TableHeader>
                  <TableRow className="table-header">
                    <TableCell>
                      <Fields>Nível CNPQ </Fields>
                    </TableCell>
                    <TableCell>
                      <Fields></Fields>
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cnpqLevels?.map(level => (
                    <TableRow key={level.id}>
                      <TableCell>
                        <Subtitle>{level.level}</Subtitle>
                      </TableCell>
                      <TableCell>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() => handlerOpenEdit(level.id, level.level)}
                            icon={faPencilAlt}
                          />
                          <FontAwesomeIcon
                            onClick={() => deleteCnpqLevel(level.id)}
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
                      setCurrentLevel({ id: null, value: '' })
                      handleShow()
                    }}
                  >
                    Adicionar Nível
                  </Button>
                </Grid>
                <Grid item>
                  <Button size={'large'} variant={'outlined'} onClick={onClickBack}>
                    Voltar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </PageWrapper>
      </MainWrapper>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{id ? 'Editar' : 'Adicionar'} Nível CNPQ</Fields>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            <TextField
              value={value}
              required
              name={'cnpqLevel'}
              label={'Nível CNPQ'}
              onChange={({ target }) => setCurrentLevel({ ...currentLevel, value: target.value })}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={id ? handleUpdateCnpq : handleSaveCnpq}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Levels
