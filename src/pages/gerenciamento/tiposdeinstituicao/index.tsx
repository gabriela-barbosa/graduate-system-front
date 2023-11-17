import React, { useState } from 'react'
import { Theme, USER_TOKEN_NAME } from '@utils/enums'
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from 'react-bootstrap'
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
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import { getAPIClient } from '@services/axios'
import { parseCookies } from 'nookies'
import {
  deleteInstitutionType,
  getInstitutionTypes,
  saveInstitutionType,
  updateInstitutionType,
} from '@modules/InstitutionTypes/api'
import { showErrorToast } from '@components/Toast'
import { InstitutionType } from '@modules/InstitutionTypes/types'
import { CustomTable } from '@components/Table'
import { DeleteItem, DeleteModal } from '@components/DeleteModal'

interface Props {
  institutionTypes: InstitutionType[]
}

const Institutions = ({ institutionTypes }: Props) => {
  const apiClient = getAPIClient()
  const [currentInstitution, setCurrentInstitution] = useState<InstitutionType>({
    name: '',
  })
  const [show, setShow] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>({ id: undefined, value: undefined })

  const router = useRouter()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const onClickBack = () => {
    router.push('/gerenciamento')
  }

  const handleDeleteInstitutionType = async (id: string) => {
    try {
      await deleteInstitutionType(apiClient, id)
      await router.replace(router.asPath)
      showDeletedToast()
    } catch (error) {
      showErrorToast('Ocorreu um erro ao deletar tipo de instituição.')
    }
  }

  const handleSaveInstitution = async (institutionType: InstitutionType) => {
    try {
      await saveInstitutionType(apiClient, institutionType)
      await router.replace(router.asPath)
      showSavedToast()
      setShow(false)
      setCurrentInstitution({ id: undefined, name: '' })
    } catch (error) {
      showErrorToast('Ocorreu um erro ao salvar tipo de instituição.')
    }
  }

  const handleUpdateInstitution = async (institutionType: InstitutionType) => {
    try {
      await updateInstitutionType(apiClient, institutionType)
      await router.replace(router.asPath)
      showSavedToast()
      setShow(false)
      setCurrentInstitution({ id: undefined, name: '' })
    } catch (error) {
      showErrorToast('Ocorreu um erro ao atualizar tipo de instituição.')
    }
  }

  const handlerOpenEdit = (id: string, name: string) => {
    setShow(true)
    setCurrentInstitution({ id, name })
  }

  const columns = [
    {
      name: 'Tipo de Instituição',
    },
    {
      name: 'Ações',
    },
  ]

  const onClickDelete = (id: string | undefined, value: string) => {
    setDeleteItem({ id, value })
    setIsDeleteModalOpen(true)
  }

  const rows = institutionTypes?.map(({ id, name }) => [
    { body: name },
    {
      body: (
        <section>
          <ActionIcon onClick={() => handlerOpenEdit(id as string, name)}>
            <EditRoundedIcon />
          </ActionIcon>
          <ActionIcon onClick={() => onClickDelete(id, name)}>
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
              <CustomTable columns={columns} rows={rows} />
            </Grid>
            <Grid item>
              <Grid container columnSpacing={2}>
                <Grid item>
                  <Button
                    size={'large'}
                    variant={'contained'}
                    onClick={() => {
                      setCurrentInstitution({ id: undefined, name: '' })
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

      <DeleteModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        handleDelete={handleDeleteInstitutionType}
        id={deleteItem.id}
        value={deleteItem.value}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{currentInstitution.id ? 'Editar' : 'Adicionar'} Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <FormControl fullWidth>
            <TextField
              value={currentInstitution.name}
              required
              name={'institution'}
              label={'Instituição'}
              onChange={({ target }) =>
                setCurrentInstitution({ ...currentInstitution, name: target.value })
              }
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button
            size={'large'}
            variant={'contained'}
            onClick={() =>
              currentInstitution.id
                ? handleUpdateInstitution(currentInstitution)
                : handleSaveInstitution(currentInstitution)
            }
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
  const types = await getInstitutionTypes(apiClient)

  return {
    props: {
      institutionTypes: types ?? [],
    },
  }
}

export default Institutions
