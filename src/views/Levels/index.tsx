import React, { useEffect, useState } from 'react'
import { Theme } from '../../utils/enums'
import { toast, ToastContainer } from 'react-toastify'
import { Icon } from '../GraduatesList/index.style'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import MainWrapper from '../../components/MainWrapper'
import {
  ButtonLogin,
  Button,
  Fields,
  Input,
  PageWrapper,
  Subtitle,
  Title,
  ButtonSecondary,
} from '../../styles/index.style'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Levels: React.FC = () => {
  const [cnpqLevels, setCnpqLevels] = React.useState([])
  const [newCnpqLevel, setNewCnpqLevel] = React.useState('')
  const [currentEditId, setCurrentEditId] = React.useState('')
  const [show3, setShow3] = useState(false)
  const handleClose3 = () => setShow3(false)
  const handleShow3 = () => setShow3(true)

  const savedToast = () => toast('Salvo com sucesso!')
  const deletedToast = () => toast('Deletado com sucesso!')
  const router = useRouter()
  const onClickBack = () => {
    router.push('/select')
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
      deletedToast()
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
      body: JSON.stringify({ level: newCnpqLevel }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/cnpqlevel`, myInit as RequestInit)
    if (result) {
      await getCnpqLevels()
      savedToast()
      setShow3(false)
      setNewCnpqLevel('')
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
      body: JSON.stringify({ level: newCnpqLevel }),
    }
    const result = await fetch(
      `${GRADUATE_API}/v1/cnpqlevel/${currentEditId}`,
      myInit as RequestInit
    )
    if (result) {
      setCurrentEditId('')
      await getCnpqLevels()
      savedToast()
      setShow3(false)
      setNewCnpqLevel('')
    }
  }

  const handlerOpenEdit3 = (id: string, value: string) => {
    setShow3(true)
    setCurrentEditId(id)
    setNewCnpqLevel(value)
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
          <Title>Atualizar Níveis CNPQ</Title>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <table className="tables">
            <thead>
              <tr className="table-header">
                <td>
                  <Fields>Nível CNPQ </Fields>
                </td>
                <td>
                  <Fields></Fields>
                </td>
              </tr>
            </thead>
            <tbody>
              {cnpqLevels?.map(level => (
                <tr key={level.id}>
                  <td>
                    <Subtitle>{level.level}</Subtitle>
                  </td>
                  <td>
                    <Icon>
                      <FontAwesomeIcon
                        onClick={() => handlerOpenEdit3(level.id, level.level)}
                        icon={faPencilAlt}
                      />
                      <FontAwesomeIcon
                        onClick={() => deleteCnpqLevel(level.id)}
                        className="trash-icon"
                        icon={faTrashAlt}
                      />
                    </Icon>
                  </td>
                </tr>
              ))}
            </tbody>
            <br></br>
            <Button onClick={handleShow3}>Adicionar Nível</Button>
            <ButtonSecondary onClick={onClickBack}>Voltar</ButtonSecondary>
          </table>
        </PageWrapper>
      </MainWrapper>

      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Fields>{currentEditId === '' ? 'Adicionar' : 'Editar'} Nível CNPQ</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input
            type="text"
            onChange={event => setNewCnpqLevel(event.target.value)}
            placeholder="Novo Nível"
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonLogin
            type="submit"
            onClick={currentEditId === '' ? handleSaveCnpq : handleUpdateCnpq}
          >
            Salvar
          </ButtonLogin>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Levels
