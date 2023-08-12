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
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import GraduatesTable from '@modules/Egressos/GraduatesTable'

const GRADUATE_API = process.env.GRADUATE_API

const Institutions: React.FC = () => {
  const [institutionTypes, setInstitutionTypes] = useState<{ id: string; name: string }[]>([])
  const [currentInstitution, setCurrentInstitution] = useState<{
    id: null | string
    value: string
  }>({
    id: null,
    value: '',
  })
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

  const columns = [
    {
      name: 'Tipo de Instituição',
    },
    {
      name: 'Ações',
    },
  ]

  const rows = institutionTypes?.map(program => [
    { body: program.name },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(program.id, program.name)}>
            <EditRoundedIcon />
          </ActionIcon>
          <ActionIcon onClick={() => deleteInstitutionType(program.id)}>
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
              <Title>Atualizar Tipo de Instituição</Title>
            </Grid>
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
