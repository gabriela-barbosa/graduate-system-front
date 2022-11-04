import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { Modal } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { Button, Input, MainWrapper } from '@components'
import { Theme } from '@utils/enums'
import { Fields, PageWrapper, Subtitle, Title } from '@styles/index.style'
import { Icon } from '@mui/material'

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const EmailConfig: React.FC = () => {
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
      <MainWrapper themeName={Theme.white}>
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
            <Button onClick={onClickBack}>Voltar</Button>
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
            name={''}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={currentEditId === '' ? handleSaveCnpq : handleUpdateCnpq}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EmailConfig
