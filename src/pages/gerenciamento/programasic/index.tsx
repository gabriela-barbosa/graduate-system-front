import React, { useState } from 'react'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import { Modal } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'

import { useRouter } from 'next/router'
import {
  Button,
  ToastContainer,
  ActionIcon,
  MainWrapper,
  showSavedToast,
  showDeletedToast,
} from '@components'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'

import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import GraduatesTable from '@components/Table/CustomTable'
import { getAPIClient } from '@services/axios'
import { showEditedToast, showErrorToast } from '@components/Toast'
import { deleteProgram, getPrograms, saveProgram, updateProgram } from '@modules/Programs/api'
import { parseCookies } from 'nookies'
import { CIProgramInfo } from '@modules/Programs/types'

interface Props {
  programs: CIProgramInfo[]
}
const Programs = ({ programs }: Props) => {
  const [currentProgram, setCurrenProgram] = useState<{
    id: null | string
    value: string
  }>({ id: null, value: '' })
  const apiClient = getAPIClient()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const router = useRouter()
  const { id, value } = currentProgram

  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const handleDeleteProgram = async (id: string) => {
    try {
      await deleteProgram(apiClient, id)
      showDeletedToast()
      await router.replace(router.asPath)
    } catch (e) {
      showErrorToast('Não foi possível excluir o programa. Tente novamente.')
    }
  }

  const handleSaveProgram = async () => {
    try {
      await saveProgram(apiClient, value)
      showSavedToast()
      setShow(false)
      setCurrenProgram({ id: null, value: '' })
      await router.replace(router.asPath)
    } catch (e) {
      showErrorToast('Não foi possível salvar o programa. Tente novamente.')
    }
  }

  const handleUpdateProgram = async () => {
    try {
      id && (await updateProgram(apiClient, id, value))
      showEditedToast()
      setShow(false)
      setCurrenProgram({ id: null, value: '' })
      await router.replace(router.asPath)
    } catch (e) {
      showErrorToast('Não foi possível atualizar o programa. Tente novamente.')
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrenProgram({ id, value })
  }

  const columns = [
    {
      name: 'Nome do Programa',
    },
    {
      name: 'Ações',
    },
  ]

  const rows = programs?.map(program => [
    { body: program.initials },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(program.id, program.initials)}>
            <EditRoundedIcon />
          </ActionIcon>
          <ActionIcon onClick={() => handleDeleteProgram(program.id)}>
            <DeleteForeverRoundedIcon />
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
              <Title>Atualizar Programas</Title>
            </Grid>
            <Grid item xs={12} height={510}>
              <GraduatesTable columns={columns} rows={rows} />
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
  try {
    const programs = await getPrograms(apiClient)
    return {
      props: {
        programs: programs ?? [],
      },
    }
  } catch (e) {
    return {
      props: {
        programs: [],
      },
    }
  }
}

export default Programs
