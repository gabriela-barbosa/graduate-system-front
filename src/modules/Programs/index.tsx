import React, { useEffect, useState } from 'react'
import { Theme } from '@utils/enums'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/router'
import {
  Button,
  ToastContainer,
  ActionIcon,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  MainWrapper,
  toast,
} from '@components'
import { Fields, PageWrapper, Subtitle, Title } from '@styles/index.style'
import { FormControl, Grid, TextField } from '@mui/material'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Programs: React.FC = () => {
  const [currentProgram, setCurrenProgram] = useState({ id: null, value: '' })
  const [programs, setPrograms] = useState([])
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const router = useRouter()
  const { id, value } = currentProgram

  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const savedToast = () => toast('Salvo com sucesso!')
  const deletedToast = () => toast('Deletado com sucesso!')

  const getPrograms = async () => {
    const response = await fetch(`${GRADUATE_API}/v1/ciprograms`, {
      credentials: 'include',
    })
    const result = await response.json()
    setPrograms(result)
  }

  const deleteProgram = async (id: string) => {
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/ciprogram/${id}`, myInit as RequestInit)
    if (response.status < 400) {
      await getPrograms()
      deletedToast()
    }
  }

  const handleSaveProgram = async () => {
    const myInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ initials: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram`, myInit as RequestInit)
    if (result) {
      await getPrograms()
      savedToast()
      setShow(false)
      setCurrenProgram({ id: null, value: '' })
    }
  }

  const handleUpdateProgram = async () => {
    const myInit = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ initials: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram/${id}`, myInit as RequestInit)
    if (result) {
      savedToast()
      setShow(false)
      setCurrenProgram({ id: null, value: '' })
      await getPrograms()
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrenProgram({ id, value })
  }

  useEffect(() => {
    ;(async () => {
      await getPrograms()
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent hasHeader>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Programas</Title>
            </Grid>
            <Grid item xs={12} height={510}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>
                      <Fields>Nome do Programa </Fields>
                    </TableCell>
                    <TableCell>
                      <Fields />
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs?.map(program => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <Subtitle>{program.initials}</Subtitle>
                      </TableCell>
                      <TableCell>
                        <ActionIcon>
                          <FontAwesomeIcon
                            onClick={() => handlerOpenEdit(program.id, program.initials)}
                            icon={faPencilAlt}
                          />
                          <FontAwesomeIcon
                            onClick={() => deleteProgram(program.id)}
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
            <Grid item xs={12}>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      setCurrenProgram({ id: null, value: '' })
                      handleShow()
                    }}
                  >
                    Adicionar Programa
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
          <Fields>{id ? 'Editar' : 'Adicionar'} Programa</Fields>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            <TextField
              value={value}
              required
              name={'program'}
              label={'Programa'}
              onChange={({ target }) =>
                setCurrenProgram({ ...currentProgram, value: target.value })
              }
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={'large'}
            variant={'contained'}
            onClick={id ? handleUpdateProgram : handleSaveProgram}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Programs
