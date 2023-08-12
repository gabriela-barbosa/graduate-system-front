import React, { useState } from 'react'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import { Modal } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { Fields, PageWrapper, Title } from '@styles/index.style'
import {
  ActionIcon,
  Button,
  MainWrapper,
  showDeletedToast,
  showSavedToast,
  ToastContainer,
} from '@components'
import { FormControl, Grid, TextField } from '@mui/material'
import GraduatesTable from '@modules/Egressos/GraduatesTable'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import { parseCookies } from 'nookies'
import { getCNPQLevels } from '@modules/Levels/api'
import { CNPQLevelInfo } from '@modules/WorkHistoryEdit'
import { getAPIClient } from '../../../services/axios'

const GRADUATE_API = process.env.GRADUATE_API

interface Props {
  cnpqLevels: CNPQLevelInfo[]
}

const Levels: React.FC = ({ cnpqLevels }: Props) => {
  const [currentLevel, setCurrentLevel] = useState<{
    id: null | string
    value: string
  }>({ id: null, value: '' })
  const [show, setShow] = useState(false)
  const router = useRouter()

  const { id, value } = currentLevel

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  // const getCnpqLevels = async () => {
  //   const response = await fetch(`${GRADUATE_API}/v1/cnpq_levels`, {
  //     credentials: 'include',
  //   })
  //   const result = await response.json()
  //   setCnpqLevels(result)
  // }

  const deleteCnpqLevel = async (id: string) => {
    const myInit = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
    const response = await fetch(`${GRADUATE_API}/v1/cnpq_level/${id}`, myInit as RequestInit)
    if (response.status < 300) {
      showDeletedToast()
      router.replace(router.asPath)
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
      body: JSON.stringify({ name: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpq_level`, myInit as RequestInit)
    if (result) {
      showSavedToast()
      setShow(false)
      setCurrentLevel({ id: null, value: '' })
      router.replace(router.asPath)
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
      body: JSON.stringify({ name: value }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpq_level/${id}`, myInit as RequestInit)
    if (result) {
      showSavedToast()
      setShow(false)
      setCurrentLevel({ id: null, value: '' })
      router.replace(router.asPath)
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrentLevel({ id, value })
  }

  const columns = [
    {
      name: 'Nível CNPQ',
    },
    {
      name: 'Ações',
    },
  ]

  const rows = cnpqLevels?.map(level => [
    { body: level.name },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(level.id, level.name)}>
            <EditRoundedIcon />
          </ActionIcon>
          <ActionIcon onClick={() => deleteCnpqLevel(level.id)}>
            <DeleteForeverRoundedIcon />
          </ActionIcon>
        </section>
      ),
    },
  ])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Title>Atualizar Níveis CNPQ</Title>
            </Grid>
            <ToastContainer />
            <Grid item xs={12}>
              <GraduatesTable columns={columns} rows={rows} />
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
  const levels = await getCNPQLevels(apiClient)

  return {
    props: {
      cnpqLevels: levels ?? [],
    },
  }
}

export default Levels
