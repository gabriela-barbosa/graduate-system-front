import React, { useEffect, useState } from 'react'
import { Theme } from '../../utils/enums'
import 'react-toastify/dist/ReactToastify.css'
import { Icon } from '../GraduatesList/index.style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import MainWrapper from '../../components/MainWrapper'
import {
  Button,
  ButtonSecondary,
  Fields,
  Input,
  PageWrapper,
  Subtitle,
  Title,
} from '../../styles/index.style'
import { toast, ToastContainer } from '../../components/Toast'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Institutions: React.FC = () => {
  const [institutionTypes, setInstitutionTypes] = React.useState([])
  const [newInstitutionType, setNewInstitutionType] = React.useState('')
  const [currentEditId, setCurrentEditId] = React.useState('')
  const [show2, setShow2] = useState(false)
  const handleClose2 = () => setShow2(false)
  const handleShow2 = () => setShow2(true)

  const savedToast = () => toast('Salvo com sucesso!')
  const deletedToast = () => toast('Deletado com sucesso!')
  const router = useRouter()
  const onClickBack = () => {
    router.push('/select')
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
      deletedToast()
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
      body: JSON.stringify({ name: newInstitutionType }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/institution/type`, myInit as RequestInit)
    if (result) {
      await getInstitutionTypes()
      savedToast()
      setShow2(false)
      setNewInstitutionType('')
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
      body: JSON.stringify({ name: newInstitutionType }),
    }
    const result = await fetch(
      `${GRADUATE_API}/v1/institution/type/${currentEditId}`,
      myInit as RequestInit
    )
    if (result) {
      setCurrentEditId('')
      await getInstitutionTypes()
      savedToast()
      setShow2(false)
      setNewInstitutionType('')
    }
  }

  const handlerOpenEdit2 = (id: string, value: string) => {
    setShow2(true)
    setCurrentEditId(id)
    setNewInstitutionType(value)
  }

  useEffect(() => {
    ;(async () => {
      await getInstitutionTypes()
    })()
  }, [])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper>
          <Title>Atualizar Tipo de Instituição</Title>
          <ToastContainer />
          <table className="tables">
            <thead>
              <tr className="table-header">
                <td>
                  <Fields>Tipo de Instituição </Fields>
                </td>
                <td>
                  <Fields></Fields>
                </td>
              </tr>
            </thead>
            {institutionTypes?.map(institutionType => (
              <tr key={institutionType.id}>
                <td>
                  <Subtitle>{institutionType.name}</Subtitle>
                </td>
                <td>
                  <Icon>
                    <FontAwesomeIcon
                      onClick={() => handlerOpenEdit2(institutionType.id, institutionType.name)}
                      icon={faPencilAlt}
                    />
                    <FontAwesomeIcon
                      onClick={() => deleteInstitutionType(institutionType.id)}
                      className="trash-icon"
                      icon={faTrashAlt}
                    />
                  </Icon>
                </td>
              </tr>
            ))}
          </table>
          <br></br>
          <Button onClick={handleShow2}>Adicionar Instituição</Button>
          <ButtonSecondary onClick={onClickBack}>Voltar</ButtonSecondary>
        </PageWrapper>
      </MainWrapper>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Fields>{currentEditId === '' ? 'Adicionar' : 'Editar'} Instituição</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input
            type="text"
            onChange={event => setNewInstitutionType(event.target.value)}
            placeholder="Nova Instituição"
            required
          ></Input>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            onClick={currentEditId === '' ? handleSaveInstitution : handleUpdateInstitution}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Institutions
