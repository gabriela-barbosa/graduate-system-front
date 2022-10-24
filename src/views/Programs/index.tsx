import React, { useEffect, useState } from 'react'
import { Theme } from '../../utils/enums'
import { toast, ToastContainer } from 'react-toastify'
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

const GRADUATE_API = process.env.NEXT_PUBLIC_GRADUATE_API

const Programs: React.FC = () => {
  const [programs, setPrograms] = React.useState([])
  const [newProgram, setNewProgram] = React.useState('')
  const [currentEditId, setCurrentEditId] = React.useState('')
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const router = useRouter()
  const onClickBack = () => {
    router.push('/select')
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
      body: JSON.stringify({ initials: newProgram }),
    }
    const result = await fetch(`${GRADUATE_API}/v1/ciprogram`, myInit as RequestInit)
    if (result) {
      await getPrograms()
      savedToast()
      setShow(false)
      setNewProgram('')
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
      body: JSON.stringify({ initials: newProgram }),
    }
    const result = await fetch(
      `${GRADUATE_API}/v1/ciprogram/${currentEditId}`,
      myInit as RequestInit
    )
    if (result) {
      setCurrentEditId('')
      await getPrograms()
      savedToast()
      setShow(false)
      setNewProgram('')
    }
  }

  const handlerOpenEdit = (id: string, value: string) => {
    setShow(true)
    setCurrentEditId(id)
    setNewProgram(value)
  }

  useEffect(() => {
    ;(async () => {
      await getPrograms()
    })()
  }, [newProgram])

  return (
    <>
      <MainWrapper themeName={Theme.white} hasContent={true} hasHeader={true}>
        <PageWrapper>
          <Title>Atualizar Programas</Title>
          <table className="tables">
            <thead>
              <tr className="table-header">
                <td>
                  <Fields>Nome do Programa </Fields>
                </td>
                <td>
                  <Fields />
                </td>
              </tr>
            </thead>
            <tbody>
              {programs?.map(program => (
                <tr key={program.id}>
                  <td>
                    <Subtitle>{program.initials}</Subtitle>
                  </td>
                  <td>
                    <Icon>
                      <FontAwesomeIcon
                        onClick={() => handlerOpenEdit(program.id, program.initials)}
                        icon={faPencilAlt}
                      />
                      <FontAwesomeIcon
                        onClick={() => deleteProgram(program.id)}
                        className="trash-icon"
                        icon={faTrashAlt}
                      />
                    </Icon>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <br></br>
          <Button onClick={handleShow}>Adicionar Programa</Button>
          <ButtonSecondary onClick={onClickBack}>Voltar</ButtonSecondary>
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
        </PageWrapper>
      </MainWrapper>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Fields>{currentEditId === '' ? 'Adicionar' : 'Editar'} Programa</Fields>
        </Modal.Header>
        <Modal.Body>
          <Input
            type="text"
            onChange={event => setNewProgram(event.target.value)}
            value={newProgram}
            placeholder="Novo Programa"
            required
          ></Input>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            onClick={currentEditId === '' ? handleSaveProgram : handleUpdateProgram}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Programs
